import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const context = {window:{}};
vm.runInNewContext(readFileSync(new URL('smartstore-reviews.js', root), 'utf8'), context);
const snapshots = context.window.GR_SMARTSTORE_REVIEWS;
const catalog = JSON.parse(readFileSync(new URL('seo-products.json', root), 'utf8')).products;

test('review snapshots belong to the matching sale product and preserve source identity', () => {
  for (const [id, snapshot] of Object.entries(snapshots)) {
    const product = catalog.find(p => p.id === id);
    assert.ok(product, `${id} must be an active catalog product`);
    assert.equal(snapshot.source, 'naver-smartstore');
    assert.equal(snapshot.url.split('#')[0], product.storeUrl);
    assert.equal(new URL(snapshot.url).pathname.split('/').pop(), snapshot.productId);
    assert.match(snapshot.checkedAt, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(snapshot.rating >= 1 && snapshot.rating <= 5);
    assert.ok(snapshot.totalCount >= snapshot.reviews.length);
    const ids = new Set();
    for (const review of snapshot.reviews) {
      assert.ok(!ids.has(review.id), 'review IDs must not be duplicated');
      ids.add(review.id);
      assert.ok(Number.isInteger(review.rating) && review.rating >= 1 && review.rating <= 5);
      assert.match(review.author, /\*/);
      assert.match(review.date, /^\d{4}-\d{2}-\d{2}$/);
      assert.ok(review.date <= snapshot.checkedAt);
      if (review.image) {
        assert.ok(review.image.startsWith(`assets/detail/${id}/reviews/`));
        assert.ok(existsSync(new URL(review.image, root)), review.image);
      }
    }
  }
});

test('RM401 keeps the four observed entries including four-star and follow-up reviews', () => {
  const snapshot = snapshots['stripe-cable-half'];
  assert.equal(snapshot.totalCount, 4);
  assert.equal(snapshot.rating, 4.75);
  assert.deepEqual(Array.from(snapshot.reviews, r => r.rating), [5,4,5,5]);
  assert.equal(snapshot.reviews.filter(r => r.kind === '한달사용').length, 2);
  assert.equal(snapshot.reviews.filter(r => r.image).length, 3);
  assert.equal(snapshot.reviews.filter(r => r.excerpt).length, 1);
});

test('built product page loads the snapshot and ships the review photos', () => {
  const html = readFileSync(new URL('dist/product-stripe-cable-half.html', root), 'utf8');
  assert.match(html, /smartstore-reviews\.js\?v=[a-f0-9]+/);
  assert.ok(html.indexOf('smartstore-reviews.js') < html.indexOf('standard-detail.js'));
  assert.equal(readFileSync(new URL('dist/smartstore-reviews.js', root), 'utf8'), readFileSync(new URL('smartstore-reviews.js', root), 'utf8'));
  for (const review of snapshots['stripe-cable-half'].reviews) {
    if (review.image) assert.deepEqual(readFileSync(new URL(`dist/${review.image}`, root)), readFileSync(new URL(review.image, root)));
  }
});
