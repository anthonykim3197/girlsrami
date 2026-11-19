import { hash } from 'bcryptjs';
import { pathToFileURL } from 'node:url';

const baseUrl = 'https://api.commerce.naver.com/external';
const zone = 'Asia/Seoul';
const dayFormat = new Intl.DateTimeFormat('sv-SE', { timeZone: zone });
const openClaims = new Set([
  'CANCEL_REQUEST', 'CANCELING', 'ADMIN_CANCELING', 'RETURN_REQUEST',
  'EXCHANGE_REQUEST', 'COLLECTING', 'COLLECT_DONE', 'EXCHANGE_REDELIVERING'
]);

async function requestJson(path, options, fetcher) {
  const response = await fetcher(baseUrl + path, {
    ...options,
    redirect: 'error',
    signal: AbortSignal.timeout(10000)
  });
  if (!response.ok) {
    // The provider response can contain personal data. Do not include its body.
    throw new Error(`네이버 커머스 API ${path.split('?')[0]} · HTTP ${response.status}`);
  }
  try {
    return await response.json();
  } catch {
    throw new Error(`네이버 커머스 API ${path.split('?')[0]} · JSON 응답 오류`);
  }
}

async function getToken(clientId, clientSecret, fetcher) {
  const timestamp = String(Date.now());
  const hashed = await hash(`${clientId}_${timestamp}`, clientSecret);
  const body = new URLSearchParams({
    client_id: clientId,
    timestamp,
    client_secret_sign: Buffer.from(hashed).toString('base64'),
    grant_type: 'client_credentials',
    type: 'SELF'
  });
  const result = await requestJson('/v1/oauth2/token', { method: 'POST', body }, fetcher);
  if (!result.access_token || typeof result.access_token !== 'string') {
    throw new Error('네이버 인증 토큰이 응답에 없습니다.');
  }
  return result.access_token;
}

export async function collect({
  clientId, clientSecret, date = dayFormat.format(new Date()), fetcher = fetch
}) {
  if (!clientId || !clientSecret) {
    throw new Error('NAVER_COMMERCE_CLIENT_ID와 NAVER_COMMERCE_CLIENT_SECRET을 설정해 주세요.');
  }
  const midnight = new Date(date + 'T00:00:00.000Z');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(+midnight) ||
      midnight.toISOString().slice(0, 10) !== date) {
    throw new Error('결제일은 YYYY-MM-DD 형식의 날짜여야 합니다.');
  }

  const token = await getToken(clientId, clientSecret, fetcher);
  const get = (path, query) => requestJson(path + '?' + new URLSearchParams(query), {
    headers: { authorization: `Bearer ${token}` }
  }, fetcher);
  const from = date + 'T00:00:00.000+09:00';
  const to = date + 'T23:59:59.999+09:00';

  const orders = new Set();
  const seen = new Set();
  const sales = { orders: 0, productOrders: 0, initialProductPayment: 0 };
  const orderStatus = { awaitingConfirmation: 0, awaitingShipment: 0, shipping: 0 };
  const claims = { CANCEL: 0, RETURN: 0, EXCHANGE: 0 };
  for (let page = 1; ; page++) {
    const response = await get('/v1/pay-order/seller/product-orders', {
      from, to, rangeType: 'PAYED_DATETIME', pageSize: 300, page
    });
    const data = response.data;
    if (!Array.isArray(data?.contents)) throw new Error('네이버 상품 주문 응답을 확인해 주세요.');
    for (const row of data.contents) {
      const { productOrder, order } = row.content ?? {};
      const id = row.productOrderId;
      const amount = productOrder?.initialPaymentAmount ?? productOrder?.totalPaymentAmount;
      if (!id || !order?.orderId || !productOrder?.productOrderStatus || !Number.isSafeInteger(amount)) {
        throw new Error('네이버 상품 주문 응답에 필수 집계 값이 없습니다.');
      }
      if (seen.has(id)) continue;
      seen.add(id);
      orders.add(order.orderId);
      sales.productOrders++;
      sales.initialProductPayment += amount;
      const { claimStatus, claimType, placeOrderStatus, productOrderStatus } = productOrder;
      if (openClaims.has(claimStatus)) {
        const type = claimType === 'ADMIN_CANCEL' ? 'CANCEL' : claimType;
        if (Object.hasOwn(claims, type)) claims[type]++;
        continue;
      }
      if (productOrderStatus === 'PAYED' && placeOrderStatus === 'OK') orderStatus.awaitingShipment++;
      if (productOrderStatus === 'PAYED' && ['NOT_YET', 'CANCEL'].includes(placeOrderStatus)) {
        orderStatus.awaitingConfirmation++;
      }
      if (productOrderStatus === 'DELIVERING') orderStatus.shipping++;
    }
    const totalPages = data.pagination?.totalPages;
    if (Number.isInteger(totalPages) ? page >= totalPages : data.contents.length < 300) break;
    if (page >= 100) throw new Error('상품 주문 조회가 100페이지를 초과했습니다.');
  }
  sales.orders = orders.size;

  const [inquiries, settlement] = await Promise.all([
    get('/v1/contents/qnas', { fromDate: from, toDate: to, answered: 'false', page: 1, size: 1 }),
    get('/v1/pay-settle/settle/daily', { startDate: date, endDate: date, pageNumber: 1, pageSize: 1000 })
  ]);
  if (!Number.isSafeInteger(inquiries.totalElements) || inquiries.totalElements < 0 ||
      !Array.isArray(settlement.elements) || settlement.pagination?.totalPages > 1) {
    throw new Error('네이버 문의 또는 정산 응답을 확인해 주세요.');
  }
  return {
    date, timezone: zone, collectedAt: new Date().toISOString(),
    sales, orderStatus, claims, unansweredProductInquiries: inquiries.totalElements,
    settlement: settlement.elements.map(row => ({
      expectedDate: row.settleExpectDate ?? null,
      completedDate: row.settleCompleteDate ?? null,
      amount: row.settleAmount ?? null,
      commission: row.commissionSettleAmount ?? null
    }))
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const result = await collect({
      clientId: process.env.NAVER_COMMERCE_CLIENT_ID,
      clientSecret: process.env.NAVER_COMMERCE_CLIENT_SECRET,
      date: process.argv[2]
    });
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
