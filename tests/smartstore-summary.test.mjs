import test from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { handleSmartstoreSummary } from '../smartstore/summary-server.mjs';

const secret = 'test-only-secret';
const url = 'https://girlslami.com/api/smartstore-summary';
const snapshot = {
  date: '2026-11-19', timezone: 'Asia/Seoul', collectedAt: '2026-11-19T01:00:00.000Z',
  sales: { orders: 2, productOrders: 3, initialProductPayment: 40000 },
  orderStatus: { awaitingConfirmation: 1, awaitingShipment: 1, shipping: 1 },
  claims: { CANCEL: 0, RETURN: 1, EXCHANGE: 0 },
  unansweredProductInquiries: 2,
  settlement: [{ expectedDate: null, completedDate: '2026-11-19', amount: 20000, commission: -1200 }]
};

function fixture() {
  const db = new DatabaseSync(':memory:');
  db.exec(readFileSync(new URL('../smartstore/schema.sql', import.meta.url), 'utf8'));
  return {
    ANALYTICS: { prepare(sql) {
      const stmt = db.prepare(sql);
      return { first: () => stmt.get(), bind: (...args) => ({ run: () => stmt.run(...args) }) };
    }},
    SMARTSTORE_SYNC_SECRET: secret
  };
}
function signed(value, signingSecret = secret) {
  const body = JSON.stringify(value);
  const signature = createHmac('sha256', signingSecret).update(body).digest('hex');
  return new Request(url, { method: 'POST', body, headers: { 'x-gr-signature': signature } });
}
const authenticated = () => new Request(url, { headers: { authorization: 'Bearer test' } });

test('only a signed sync can write and only an administrator can read', async () => {
  const env = fixture();
  assert.equal((await handleSmartstoreSummary(signed(snapshot, 'wrong'), env)).status, 403);
  assert.equal((await handleSmartstoreSummary(signed(snapshot), env)).status, 204);
  assert.equal((await handleSmartstoreSummary(new Request(url), env)).status, 401);
  assert.equal((await handleSmartstoreSummary(authenticated(), env, () => false)).status, 403);
  const response = await handleSmartstoreSummary(authenticated(), env, () => true);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.deepEqual((await response.json()).snapshot, snapshot);
});

test('rejects unexpected personal data and preserves the newer snapshot on replay', async () => {
  const env = fixture();
  assert.equal((await handleSmartstoreSummary(signed({ ...snapshot, customerName: 'sample' }), env)).status, 400);
  assert.equal((await handleSmartstoreSummary(signed(snapshot), env)).status, 204);
  const older = { ...snapshot, collectedAt: '2026-11-19T00:00:00.000Z', unansweredProductInquiries: 0 };
  assert.equal((await handleSmartstoreSummary(signed(older), env)).status, 204);
  const response = await handleSmartstoreSummary(authenticated(), env, () => true);
  assert.deepEqual((await response.json()).snapshot, snapshot);
});
