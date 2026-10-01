begin;
alter table public.fitting_jobs add column is_synthetic_test boolean not null default false;
grant select(is_synthetic_test) on public.fitting_jobs to authenticated;
create table public.fitting_test_sessions(
 owner_id uuid primary key references auth.users on delete cascade,
 product_id text not null references public.products(id),color text not null,input_path text not null,
 enabled boolean not null default true,created_at timestamptz not null default now(),expires_at timestamptz not null,
 check(split_part(input_path,'/',1)=owner_id::text),
 check(expires_at<=created_at+interval '2 hours')
);
alter table public.fitting_test_sessions enable row level security;
create policy test_session_owner on public.fitting_test_sessions for select to authenticated using(owner_id=auth.uid());
revoke all on public.fitting_test_sessions from anon,authenticated;
grant select on public.fitting_test_sessions to authenticated;
grant all on public.fitting_test_sessions to service_role;

create function public.create_fitting_test_job(request_key uuid)returns uuid language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid();s public.fitting_test_sessions;p jsonb;photo jsonb;key uuid;
begin
 if u is null then raise exception 'LOGIN_REQUIRED';end if;
 perform pg_advisory_xact_lock(hashtextextended(u::text,0));
 perform pg_advisory_xact_lock(932917);
 select * into s from public.fitting_test_sessions where owner_id=u and enabled and expires_at>now();
 if s.owner_id is null then raise exception 'TEST_SESSION_UNAVAILABLE';end if;
 select id into key from public.fitting_jobs j where j.owner_id=u and j.request_key=create_fitting_test_job.request_key and is_synthetic_test;
 if key is not null then return key;end if;
 if (select count(*)from public.fitting_usage where owner_id=u and created_at>now()-interval '24 hours')>=3 then raise exception 'DAILY_LIMIT';end if;
 if exists(select 1 from public.fitting_jobs where owner_id=u and status in('queued','running'))then raise exception 'JOB_ALREADY_ACTIVE';end if;
 if (select count(*)from public.fitting_usage where created_at>now()-interval '24 hours')>=40 then raise exception 'SERVICE_DAILY_LIMIT';end if;
 select payload into p from public.products where id=s.product_id;
 photo:=p->'colorPhotos'->s.color;
 if p->>'status' is distinct from 'hidden' or p->>'syntheticTest' is distinct from 'true'
  or p->>'photoVerified' is distinct from 'false' or photo->>'verified' is distinct from 'false'
  or photo->>'image' is null then raise exception 'TEST_FIXTURE_REQUIRED';end if;
 if not exists(select 1 from storage.objects where bucket_id='fitting-private' and name=s.input_path)then raise exception 'PHOTO_NOT_OWNED';end if;
 insert into public.fitting_jobs(owner_id,request_key,product_id,color,input_path,product_image,consent_version,is_synthetic_test,expires_at)
 values(u,request_key,s.product_id,s.color,s.input_path,photo->>'image','synthetic-test-v1',true,s.expires_at)returning id into key;
 insert into public.fitting_usage(owner_id,request_key)values(u,request_key);
 return key;
end
$$;
create function public.worker_test_status()returns jsonb language sql stable security definer set search_path='' as $$
 select jsonb_build_object('enabled',exists(select 1 from public.fitting_test_sessions where enabled and expires_at>now()),
 'photo_intake_enabled',coalesce((select enabled from public.worker_state where id=true),false))
$$;
create function public.worker_test_claim()returns setof public.fitting_jobs language plpgsql security definer set search_path='' as $$
declare key uuid;
begin
 update public.fitting_jobs j set status='cancelled',lease=null where is_synthetic_test and status in('queued','running')
  and not exists(select 1 from public.fitting_test_sessions s where s.owner_id=j.owner_id and s.product_id=j.product_id and s.input_path=j.input_path and s.enabled and s.expires_at>now());
 update public.fitting_jobs set status='failed',error_code='ENGINE_TIMEOUT',lease=null where is_synthetic_test and status='running' and started_at<now()-interval '5 minutes';
 select id into key from public.fitting_jobs where is_synthetic_test and status='queued' and expires_at>now() order by created_at limit 1 for update skip locked;
 return query update public.fitting_jobs set status='running',lease=gen_random_uuid(),started_at=now() where id=key returning *;
end
$$;
create or replace function public.worker_claim()returns setof public.fitting_jobs language plpgsql security definer set search_path='' as $$
declare key uuid;
begin
 update public.worker_state set last_seen=now() where id=true;
 delete from public.fitting_usage where created_at<now()-interval '24 hours';
 if not (select enabled from public.worker_state where id=true)then return;end if;
 update public.fitting_jobs j set status='cancelled',lease=null where not is_synthetic_test and status in('queued','running')
  and (j.consent_version<>'2026-10-01-v2' or not exists(select 1 from public.photo_consents c where c.owner_id=j.owner_id and c.version=j.consent_version));
 update public.fitting_jobs set status='failed',error_code='ENGINE_TIMEOUT',lease=null where not is_synthetic_test and status='running' and started_at<now()-interval '5 minutes';
 select id into key from public.fitting_jobs where not is_synthetic_test and status='queued' and expires_at>now()order by created_at limit 1 for update skip locked;
 return query update public.fitting_jobs set status='running',lease=gen_random_uuid(),started_at=now()where id=key returning *;
end
$$;
create or replace function public.worker_finish(job_id uuid,lease_key uuid,result_path text,failure text default null)returns boolean language plpgsql security definer set search_path='' as $$
begin
 update public.fitting_jobs j set status=case when failure is null then 'completed'else 'failed'end,
 output_path=case when failure is null then result_path else null end,error_code=failure,lease=null
 where id=job_id and lease=lease_key and status='running'and expires_at>now()
  and ((not is_synthetic_test and consent_version='2026-10-01-v2'
    and exists(select 1 from public.photo_consents c where c.owner_id=j.owner_id and c.version=j.consent_version))
   or (is_synthetic_test and consent_version='synthetic-test-v1'
    and exists(select 1 from public.fitting_test_sessions s where s.owner_id=j.owner_id and s.product_id=j.product_id and s.input_path=j.input_path and s.enabled and s.expires_at>now())));
 return found;
end
$$;
create function public.begin_fitting_test_withdrawal()returns text[]language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid();paths text[];
begin
 if u is null then raise exception 'LOGIN_REQUIRED';end if;
 perform pg_advisory_xact_lock(hashtextextended(u::text,0));
 update public.fitting_test_sessions set enabled=false where owner_id=u;
 update public.fitting_jobs set status='cancelled',lease=null where owner_id=u and is_synthetic_test and status in('queued','running');
 select coalesce(array_agg(path),array[]::text[])into paths from(
  select input_path as path from public.fitting_test_sessions where owner_id=u
  union select owner_id::text||'/'||id::text||'/output.jpg' from public.fitting_jobs where owner_id=u and is_synthetic_test
 )images;
 return paths;
end
$$;
create function public.erase_fitting_test_data()returns void language plpgsql security definer set search_path='' as $$
declare u uuid:=auth.uid();
begin
 if u is null then raise exception 'LOGIN_REQUIRED';end if;
 perform pg_advisory_xact_lock(hashtextextended(u::text,0));
 if exists(select 1 from public.fitting_test_sessions where owner_id=u and enabled)then raise exception 'WITHDRAW_TEST_FIRST';end if;
 if exists(select 1 from storage.objects o where bucket_id='fitting-private' and(
  name in(select input_path from public.fitting_test_sessions where owner_id=u)
  or name in(select owner_id::text||'/'||id::text||'/output.jpg' from public.fitting_jobs where owner_id=u and is_synthetic_test)))then raise exception 'REMOVE_IMAGES_FIRST';end if;
 delete from public.fitting_jobs where owner_id=u and is_synthetic_test;
 delete from public.fitting_test_sessions where owner_id=u;
end
$$;
revoke all on function public.create_fitting_test_job(uuid),public.worker_test_status(),public.worker_test_claim(),public.begin_fitting_test_withdrawal(),public.erase_fitting_test_data()from public,anon,authenticated;
grant execute on function public.create_fitting_test_job(uuid),public.begin_fitting_test_withdrawal(),public.erase_fitting_test_data()to authenticated;
grant execute on function public.worker_test_status(),public.worker_test_claim()to service_role;
commit;
