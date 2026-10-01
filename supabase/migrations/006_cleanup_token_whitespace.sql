begin;
create or replace function public.install_fitting_cleanup() returns bigint
language plpgsql security definer set search_path='' as $function$
declare endpoint text; credential text; job bigint;
begin
  select decrypted_secret into endpoint from vault.decrypted_secrets where name='girlsrami_fitting_endpoint';
  select btrim(decrypted_secret,E' \t\n\r') into credential from vault.decrypted_secrets where name='girlsrami_fitting_token';
  if endpoint is null or endpoint !~ '^https://[a-z0-9]+\.supabase\.co/functions/v1/fitting-worker$'
    or credential is null or length(credential)<32 then
    raise exception 'CLEANUP_VAULT_CONFIGURATION_REQUIRED';
  end if;
  select jobid into job from cron.job where jobname='girlsrami-private-photo-cleanup';
  if job is not null then perform cron.unschedule(job);end if;
  return cron.schedule('girlsrami-private-photo-cleanup','* * * * *',$command$
    select net.http_post(
      url:=(select decrypted_secret from vault.decrypted_secrets where name='girlsrami_fitting_endpoint'),
      headers:=jsonb_build_object('Content-Type','application/json','Authorization',
        'Bearer '||(select btrim(decrypted_secret,E' \t\n\r') from vault.decrypted_secrets where name='girlsrami_fitting_token')),
      body:='{"action":"cleanup"}'::jsonb,
      timeout_milliseconds:=5000
    );
  $command$);
end
$function$;
revoke all on function public.install_fitting_cleanup() from public,anon,authenticated;
commit;
