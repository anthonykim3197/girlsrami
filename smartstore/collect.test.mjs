import assert from 'node:assert/strict';
import test from 'node:test';
import { compare } from 'bcryptjs';
import { collect } from './collect.mjs';

const auth = { clientId: 'test-app', clientSecret: '$2a$04$abcdefghijklmnopqrstuu' };
const date = '2026-11-19';

test('signs a SELF token request and reads only aggregate metrics for the Korean date', async () => {
  const makeOrder = (id, status) => ({
    productOrderId: id,
    content: {
      order: { orderId: 'one-order', ordererName: 'private sample' },
      productOrder: { productOrderStatus: 'PAYED', initialPaymentAmount: 12000, ...status }
    }
  });
  const fetcher = async (url, options) => {
    const { pathname, searchParams } = new URL(url);
    if (pathname.endsWith('/token')) {
      assert.equal(options.method, 'POST');
      assert.equal(options.body.get('type'), 'SELF');
      assert.equal(options.body.get('grant_type'), 'client_credentials');
      assert.equal(options.body.has('client_secret'), false);
      const hashed = Buffer.from(options.body.get('client_secret_sign'), 'base64').toString();
      assert.equal(await compare(`test-app_${options.body.get('timestamp')}`, hashed), true);
      return Response.json({ access_token: 'test-token' });
    }
    assert.equal(options.method, undefined);
    assert.equal(options.headers.authorization, 'Bearer test-token');
    if (pathname.endsWith('/product-orders')) {
      assert.equal(searchParams.get('from'), date + 'T00:00:00.000+09:00');
      const row = makeOrder('one-line', { placeOrderStatus: 'NOT_YET' });
      const claim = makeOrder('other-line', { claimStatus: 'RETURN_REQUEST', claimType: 'RETURN' });
      const contents = searchParams.get('page') === '1' ? [row] : [row, claim];
      return Response.json({ data: { contents, pagination: { totalPages: 2 } } });
    }
    if (pathname.endsWith('/qnas')) {
      assert.equal(searchParams.get('answered'), 'false');
      return Response.json({ totalElements: 3, contents: [{ question: 'private sample' }] });
    }
    assert.equal(searchParams.get('startDate'), date);
    return Response.json({ elements: [{ settleAmount: 9800, accountNo: 'private sample' }] });
  };
  const summary = await collect({ ...auth, date, fetcher });
  assert.deepEqual(summary.sales, { orders: 1, productOrders: 2, initialProductPayment: 24000 });
  assert.equal(summary.orderStatus.awaitingConfirmation, 1);
  assert.deepEqual(summary.claims, { CANCEL: 0, RETURN: 1, EXCHANGE: 0 });
  assert.equal(summary.unansweredProductInquiries, 3);
  assert.equal(summary.settlement[0].amount, 9800);
  assert.doesNotMatch(JSON.stringify(summary), /private sample|one-order|test-token/);
});

test('does not return empty sales or disclose raw errors when the IP is denied', async () => {
  const fetcher = async () => Response.json({ message: 'private sample' }, { status: 403 });
  await assert.rejects(collect({ ...auth, date, fetcher }), {
    message: '네이버 커머스 API /v1/oauth2/token · HTTP 403'
  });
});
