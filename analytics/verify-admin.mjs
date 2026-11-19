import config from '../config.json';

export async function verifyAdmin(authorization) {
  const response = await fetch(`${config.supabaseUrl}/rest/v1/rpc/is_admin`, {
    method: 'POST',
    headers: { authorization, apikey: config.publishableKey, 'content-type': 'application/json' },
    body: '{}',
    signal: AbortSignal.timeout(5000)
  });
  return response.ok && await response.json() === true;
}
