import test from 'node:test';
import assert from 'node:assert/strict';

import {
  inventoryRowsForColors,
  productMatchesAdminSearch,
  validateInventoryProduct
} from '../admin-inventory.js';

test('inventory rows follow the current color order without inventing missing stock', () => {
  const rows = inventoryRowsForColors({
    colors: ['크림', '차콜', '카멜'],
    variants: [
      {color: '차콜', sku: 'NVR-KNIT-CHARCOAL', stock: 7},
      {color: '크림', sku: 'NVR-KNIT-CREAM', stock: 11}
    ]
  });

  assert.deepEqual(rows, [
    {color: '크림', sku: 'NVR-KNIT-CREAM', stock: 11},
    {color: '차콜', sku: 'NVR-KNIT-CHARCOAL', stock: 7},
    {color: '카멜', sku: '', stock: ''}
  ]);
});

test('validated inventory normalizes identifiers and derives total stock', () => {
  const product = validateInventoryProduct({
    id: 'honey-loop-crop-knit',
    name: '허니루프 라운드 니트',
    styleCode: ' rm382 ',
    colors: ['크림', '카멜', '차콜', '스카이'],
    variants: [
      {color: '크림', sku: ' nvr-rm382-cream ', stock: '25'},
      {color: '카멜', sku: 'nvr-rm382-camel', stock: 25},
      {color: '차콜', sku: 'NVR-RM382-CHARCOAL', stock: 25},
      {color: '스카이', sku: 'NVR-RM382-SKY', stock: 25}
    ],
    stock: 999
  }, []);

  assert.equal(product.styleCode, 'RM382');
  assert.equal(product.variants[0].sku, 'NVR-RM382-CREAM');
  assert.equal(product.stock, 100);
});

test('inventory rejects duplicate SKUs in the form and in another loaded product', () => {
  const base = {
    id: 'honey-loop-crop-knit',
    name: '허니루프 라운드 니트',
    styleCode: 'RM382',
    colors: ['크림', '카멜'],
    variants: [
      {color: '크림', sku: 'NVR-RM382-CREAM', stock: 25},
      {color: '카멜', sku: 'NVR-RM382-CREAM', stock: 25}
    ]
  };

  assert.throws(() => validateInventoryProduct(base, []), /SKU는 색상마다 달라야/);
  assert.throws(() => validateInventoryProduct({
    ...base,
    variants: [
      {color: '크림', sku: 'NVR-RM382-CREAM', stock: 25},
      {color: '카멜', sku: 'NVR-RM382-CAMEL', stock: 25}
    ]
  }, [{
    id: 'other-knit',
    variants: [{color: '크림', sku: 'nvr-rm382-cream', stock: 1}]
  }]), /다른 상품에서 사용 중/);
});

test('inventory rejects missing SKU, negative stock and fractional stock', () => {
  const product = {
    id: 'knit',
    name: '니트',
    styleCode: '',
    colors: ['크림'],
    variants: [{color: '크림', sku: '', stock: 0}]
  };

  assert.throws(() => validateInventoryProduct(product, []), /SKU를 입력/);
  assert.throws(() => validateInventoryProduct({
    ...product,
    variants: [{color: '크림', sku: 'NVR-KNIT-CREAM', stock: -1}]
  }, []), /0 이상의 정수/);
  assert.throws(() => validateInventoryProduct({
    ...product,
    variants: [{color: '크림', sku: 'NVR-KNIT-CREAM', stock: 1.5}]
  }, []), /0 이상의 정수/);
});

test('style code stays separate from the customer-facing product name', () => {
  assert.throws(() => validateInventoryProduct({
    id: 'knit',
    name: '허니루프 니트 (RM382)',
    styleCode: 'RM382',
    colors: [],
    variants: []
  }, []), /상품명에서는 품번을 빼고/);
});

test('admin search finds name, style code and color SKU without case sensitivity', () => {
  const product = {
    id: 'honey-loop-crop-knit',
    name: '허니루프 라운드 니트',
    styleCode: 'RM382',
    variants: [{color: '크림', sku: 'NVR-RM382-CREAM', stock: 25}]
  };

  assert.equal(productMatchesAdminSearch(product, '허니루프'), true);
  assert.equal(productMatchesAdminSearch(product, 'rm382'), true);
  assert.equal(productMatchesAdminSearch(product, 'cream'), true);
  assert.equal(productMatchesAdminSearch(product, 'rm495'), false);
});
