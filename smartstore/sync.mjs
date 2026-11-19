import { createHmac } from 'node:crypto';
import { collect } from './collect.mjs';

try {
  const secret = process.env.SMARTSTORE_SYNC_SECRET;
  if (!secret) throw new Error('SMARTSTORE_SYNC_SECRET 설정이 필요합니다.');
  const snapshot = await collect({
    clientId: process.env.NAVER_COMMERCE_CLIENT_ID,
    clientSecret: process.env.NAVER_COMMERCE_CLIENT_SECRET,
    date: process.argv[2]
  });
  const body = JSON.stringify(snapshot);
  const signature = createHmac('sha256', secret).update(body).digest('hex');
  const response = await fetch('https://girlslami.com/api/smartstore-summary', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-gr-signature': signature },
    body,
    redirect: 'error',
    signal: AbortSignal.timeout(10000)
  });
  if (response.status !== 204) throw new Error(`Cloudflare 집계 전송 실패 · HTTP ${response.status}`);
  console.log(`스마트스토어 집계 전송 완료 · ${snapshot.date} · ${snapshot.collectedAt}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
