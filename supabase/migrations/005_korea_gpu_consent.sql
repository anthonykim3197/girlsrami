begin;
alter table public.photo_consents drop constraint photo_consents_version_check;
alter table public.photo_consents add constraint photo_consents_version_check
 check(version in ('2026-10-01-v1','2026-10-01-v2'));

update public.worker_state set enabled=false,last_seen=null where id=true;
update public.fitting_jobs set status='cancelled',lease=null
 where status in ('queued','running') and consent_version<>'2026-10-01-v2';

drop policy fitting_image_owner_upload on storage.objects;
create policy fitting_image_owner_upload on storage.objects for insert to authenticated
 with check(bucket_id='fitting-private' and (storage.foldername(name))[1]=auth.uid()::text
  and exists(select 1 from public.photo_consents where owner_id=auth.uid() and version='2026-10-01-v2'));

create or replace function public.create_fit_job(request_key uuid,product_id text,selected_color text,input_path text,consent_version text)returns uuid language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid();p jsonb;photo jsonb;key uuid;n integer;
begin
 if u is null then raise exception 'LOGIN_REQUIRED';end if;
 perform pg_advisory_xact_lock(hashtextextended(u::text,0));
 perform pg_advisory_xact_lock(932917);
 if consent_version is distinct from '2026-10-01-v2'
  or not exists(select 1 from public.photo_consents c where c.owner_id=u and c.version=consent_version)
  then raise exception 'PHOTO_CONSENT_REQUIRED';end if;
 select id into key from public.fitting_jobs j where j.owner_id=u and j.request_key=create_fit_job.request_key;
 if key is not null then return key;end if;
 if not (public.fitting_status()->>'available')::boolean then raise exception 'ENGINE_UNAVAILABLE';end if;
 select count(*)into n from public.fitting_usage where owner_id=u and created_at>now()-interval '24 hours';
 if n>=3 then raise exception 'DAILY_LIMIT';end if;
 if exists(select 1 from public.fitting_jobs where owner_id=u and status in ('queued','running'))then raise exception 'JOB_ALREADY_ACTIVE';end if;
 if (select count(*)from public.fitting_usage where created_at>now()-interval '24 hours')>=40 then raise exception 'SERVICE_DAILY_LIMIT';end if;
 select payload into p from public.products where id=product_id;
 photo:=p->'colorPhotos'->selected_color;
 if p is null or p->>'status'='hidden' or not p->'colors' ? selected_color
  or photo->>'verified' is distinct from 'true' then raise exception 'PRODUCT_PHOTO_PENDING';end if;
 if split_part(input_path,'/',1)<>u::text or not exists(select 1 from storage.objects o where o.bucket_id='fitting-private' and o.name=create_fit_job.input_path)then raise exception 'PHOTO_NOT_OWNED';end if;
 insert into public.fitting_jobs(owner_id,request_key,product_id,color,input_path,product_image,consent_version)values(u,request_key,product_id,selected_color,input_path,photo->>'image',consent_version)returning id into key;
 insert into public.fitting_usage(owner_id,request_key)values(u,request_key);
 return key;
end
$$;

create or replace function public.worker_claim()returns setof public.fitting_jobs language plpgsql security definer set search_path='' as $$
declare key uuid;
begin
 update public.worker_state set last_seen=now() where id=true;
 delete from public.fitting_usage where created_at<now()-interval '24 hours';
 if not (select enabled from public.worker_state where id=true)then return;end if;
 update public.fitting_jobs j set status='cancelled',lease=null where status in('queued','running')
  and (j.consent_version<>'2026-10-01-v2'
   or not exists(select 1 from public.photo_consents c where c.owner_id=j.owner_id and c.version=j.consent_version));
 update public.fitting_jobs set status='failed',error_code='ENGINE_TIMEOUT',lease=null where status='running'and started_at<now()-interval '5 minutes';
 select id into key from public.fitting_jobs where status='queued'and expires_at>now()order by created_at limit 1 for update skip locked;
 return query update public.fitting_jobs set status='running',lease=gen_random_uuid(),started_at=now()where id=key returning *;
end
$$;

create or replace function public.worker_finish(job_id uuid,lease_key uuid,result_path text,failure text default null)returns boolean language plpgsql security definer set search_path='' as $$
begin
 update public.fitting_jobs set status=case when failure is null then 'completed'else 'failed'end,output_path=case when failure is null then result_path else null end,error_code=failure,lease=null
 where id=job_id and lease=lease_key and status='running'and expires_at>now()
  and consent_version='2026-10-01-v2'
  and exists(select 1 from public.photo_consents c where c.owner_id=fitting_jobs.owner_id and c.version=fitting_jobs.consent_version);
 return found;
end
$$;
commit;
