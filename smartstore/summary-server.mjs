const snapshotLimit = 32 * 1024;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timezone = 'Asia/Seoul';

function json(data, status = 200) {
  return Response.json(data, { status, headers: { 'cache-control': 'no-store' } });
}

function date(value) {
  if (typeof value !== 'string' || !datePattern.test(value)) return false;
  const parsed = new Date(value);
  return Number.isFinite(+parsed) && parsed.toISOString().slice(0, 10) === value;
}

const count = value => Number.isSafeInteger(value) && value >= 0;
const nullableDate = value => value === null || date(value);
const nullableAmount = value => value === null || (Number.isFinite(value) && Math.abs(value) < Number.MAX_SAFE_INTEGER);
const timestamp = value => {
  if (typeof value !== 'string') return false;
  const parsed = new Date(value);
  return Number.isFinite(+parsed) && parsed.toISOString() === value;
};

function fields(value, validators) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) &&
    Object.keys(value).length === Object.keys(validators).length &&
    Object.entries(validators).every(([key, valid]) => Object.hasOwn(value, key) && valid(value[key]));
}

function isSnapshot(value) {
  return fields(value, {
    date, timezone: value => value === timezone, collectedAt: timestamp,
    sales: value => fields(value, { orders: count, productOrders: count, initialProductPayment: count }),
    orderStatus: value => fields(value, { awaitingConfirmation: count, awaitingShipment: count, shipping: count }),
    claims: value => fields(value, { CANCEL: count, RETURN: count, EXCHANGE: count }),
    unansweredProductInquiries: count,
    settlement: value => Array.isArray(value) && value.every(row => fields(row, {
      expectedDate: nullableDate, completedDate: nullableDate, amount: nullableAmount, commission: nullableAmount
    }))
  });
}

async function readBody(request) {
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();
  const bytes = new Uint8Array(snapshotLimit);
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) return bytes.subarray(0, length);
    if (length + value.byteLength > snapshotLimit) {
      await reader.cancel();
      return null;
    }
    bytes.set(value, length);
    length += value.byteLength;
  }
}

export async function handleSmartstoreSummary(request, env, verifyAdmin) {
  if (request.method === 'GET') {
    const authorization = request.headers.get('authorization') || '';
    if (!/^Bearer [A-Za-z0-9._-]+$/.test(authorization)) return json({ error: 'login_required' }, 401);
    try {
      if (!await verifyAdmin(authorization)) return json({ error: 'admin_required' }, 403);
    } catch {
      return json({ error: 'auth_unavailable' }, 503);
    }
    try {
      const row = await env.ANALYTICS.prepare(
        'SELECT snapshot FROM smartstore_daily_summary ORDER BY day DESC LIMIT 1'
      ).first();
      return json({ snapshot: row ? JSON.parse(row.snapshot) : null });
    } catch {
      return json({ error: 'temporarily_unavailable' }, 503);
    }
  }

  if (request.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
  const signature = request.headers.get('x-gr-signature') || '';
  if (!/^[a-f0-9]{64}$/.test(signature)) return json({ error: 'signature_required' }, 401);
  if (!env.SMARTSTORE_SYNC_SECRET || !env.ANALYTICS) return json({ error: 'sync_unavailable' }, 503);
  try {
    const bytes = await readBody(request);
    if (!bytes) return json({ error: 'payload_too_large' }, 413);
    const key = await crypto.subtle.importKey(
      'raw', new TextEncoder().encode(env.SMARTSTORE_SYNC_SECRET),
      { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    );
    const signatureBytes = Uint8Array.from(signature.match(/../g), pair => parseInt(pair, 16));
    if (!await crypto.subtle.verify('HMAC', key, signatureBytes, bytes)) {
      return json({ error: 'invalid_signature' }, 403);
    }
    const text = new TextDecoder().decode(bytes);
    let snapshot;
    try {
      snapshot = JSON.parse(text);
    } catch {
      return json({ error: 'invalid_snapshot' }, 400);
    }
    if (!isSnapshot(snapshot)) return json({ error: 'invalid_snapshot' }, 400);
    await env.ANALYTICS.prepare(`
      INSERT INTO smartstore_daily_summary(day, collected_at, snapshot) VALUES (?, ?, ?)
      ON CONFLICT(day) DO UPDATE SET
        collected_at = excluded.collected_at, snapshot = excluded.snapshot
      WHERE excluded.collected_at > smartstore_daily_summary.collected_at
    `).bind(snapshot.date, snapshot.collectedAt, JSON.stringify(snapshot)).run();
    return new Response(null, { status: 204, headers: { 'cache-control': 'no-store' } });
  } catch {
    return json({ error: 'temporarily_unavailable' }, 503);
  }
}
