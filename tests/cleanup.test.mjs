import test from 'node:test';
import assert from 'node:assert/strict';
import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';

test('scheduled cleanup authenticates with a copied token ending in a newline, without changing Vault', async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated;
      create schema vault; create schema cron; create schema net;
      create table vault.decrypted_secrets(name text primary key, decrypted_secret text);
      create table cron.job(jobid bigint generated always as identity, jobname text, schedule text, command text);
      create table net.requests(url text, headers jsonb, body jsonb, timeout_milliseconds integer);
      create function cron.schedule(text,text,text) returns bigint language sql as $$
        insert into cron.job(jobname,schedule,command) values($1,$2,$3) returning jobid $$;
      create function cron.unschedule(bigint) returns boolean language plpgsql as $$
        begin delete from cron.job where jobid=$1; return found; end $$;
      create function net.http_post(url text,headers jsonb,body jsonb,timeout_milliseconds integer) returns bigint language plpgsql as $$
        begin insert into net.requests values(url,headers,body,timeout_milliseconds); return 1; end $$;`);
    const original = await readFile(new URL('../supabase/migrations/003_cleanup.sql', import.meta.url), 'utf8');
    await db.exec(original.replace(/^create extension .*;$/gm, ''));
    const migrationUrl = new URL('../supabase/migrations/006_cleanup_token_whitespace.sql', import.meta.url);
    const migration = await readFile(migrationUrl, 'utf8').catch(error => {
      if (error.code === 'ENOENT') return '';
      throw error;
    });
    if (migration) await db.exec(migration);
    const token = 'a'.repeat(64);
    await db.query('insert into vault.decrypted_secrets values ($1,$2),($3,$4)', [
      'girlsrami_fitting_endpoint', 'https://example.supabase.co/functions/v1/fitting-worker',
      'girlsrami_fitting_token', token + '\n'
    ]);
    await db.query('select public.install_fitting_cleanup()');
    await db.query('select public.install_fitting_cleanup()');
    const jobs = (await db.query('select * from cron.job')).rows;
    assert.equal(jobs.length, 1);
    assert.equal(jobs[0].schedule, '* * * * *');
    await db.exec(jobs[0].command);
    const request = (await db.query('select * from net.requests')).rows[0];
    assert.equal(request.headers.Authorization, 'Bearer ' + token);
    assert.deepEqual(request.body, { action: 'cleanup' });
    assert.equal((await db.query("select decrypted_secret from vault.decrypted_secrets where name='girlsrami_fitting_token'")).rows[0].decrypted_secret, token + '\n');
    assert.equal((await db.query("select has_function_privilege('authenticated','public.install_fitting_cleanup()','execute') as allowed")).rows[0].allowed, false);
  } finally {
    await db.close();
  }
});
