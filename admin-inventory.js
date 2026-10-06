const SKU_PATTERN = /^[A-Z0-9][A-Z0-9._-]{2,63}$/;
const STYLE_CODE_PATTERN = /^[A-Z0-9][A-Z0-9._-]{1,39}$/;

function text(value) {
  return String(value ?? '').trim();
}

function normalizedIdentifier(value) {
  return text(value).toUpperCase();
}

export function inventoryRowsForColors(product = {}) {
  const variants = Array.isArray(product.variants) ? product.variants : [];
  const byColor = new Map(variants.map(variant => [text(variant?.color), variant]));

  return (Array.isArray(product.colors) ? product.colors : []).map(colorValue => {
    const color = text(colorValue);
    const saved = byColor.get(color);
    return {
      color,
      sku: saved ? text(saved.sku) : '',
      stock: saved && saved.stock !== null && saved.stock !== undefined ? saved.stock : ''
    };
  });
}

export function productMatchesAdminSearch(product, query) {
  const needle = text(query).toLocaleLowerCase('ko-KR');
  if (!needle) return true;
  const variants = Array.isArray(product?.variants) ? product.variants : [];
  const searchable = [
    product?.name,
    product?.id,
    product?.styleCode,
    ...variants.flatMap(variant => [variant?.sku, variant?.color])
  ].map(value => text(value).toLocaleLowerCase('ko-KR'));
  return searchable.some(value => value.includes(needle));
}

export function validateInventoryProduct(product, loadedProducts = []) {
  const id = text(product?.id);
  const name = text(product?.name);
  const styleCode = normalizedIdentifier(product?.styleCode);
  const colors = (Array.isArray(product?.colors) ? product.colors : []).map(text);

  if (new Set(colors).size !== colors.length) {
    throw new Error('색상 이름은 서로 달라야 해요.');
  }
  if (styleCode && !STYLE_CODE_PATTERN.test(styleCode)) {
    throw new Error('품번은 영문, 숫자, 마침표, 밑줄, 하이픈으로 2~40자 입력해 주세요.');
  }
  if (styleCode && name.toUpperCase().includes(styleCode)) {
    throw new Error('상품명에서는 품번을 빼고 품번 입력란에만 적어 주세요.');
  }

  const variants = inventoryRowsForColors({...product, colors}).map(row => {
    const sku = normalizedIdentifier(row.sku);
    const stock = typeof row.stock === 'string' && row.stock.trim() === '' ? NaN : Number(row.stock);
    if (!sku) throw new Error(`${row.color} 색상의 SKU를 입력해 주세요.`);
    if (!SKU_PATTERN.test(sku)) {
      throw new Error(`${row.color} 색상의 SKU는 영문, 숫자, 마침표, 밑줄, 하이픈으로 3~64자 입력해 주세요.`);
    }
    if (!Number.isInteger(stock) || stock < 0 || stock > 100000) {
      throw new Error(`${row.color} 색상의 재고는 0 이상의 정수로 입력해 주세요.`);
    }
    return {color: row.color, sku, stock};
  });

  const ownSkus = variants.map(variant => variant.sku);
  if (new Set(ownSkus).size !== ownSkus.length) {
    throw new Error('SKU는 색상마다 달라야 해요. 중복된 SKU를 확인해 주세요.');
  }

  const otherProducts = (Array.isArray(loadedProducts) ? loadedProducts : [])
    .filter(other => text(other?.id) !== id);
  const usedSkus = new Map();
  for (const other of otherProducts) {
    for (const variant of Array.isArray(other?.variants) ? other.variants : []) {
      const sku = normalizedIdentifier(variant?.sku);
      if (sku) usedSkus.set(sku, other?.name || other?.id || '다른 상품');
    }
  }
  for (const sku of ownSkus) {
    if (usedSkus.has(sku)) {
      throw new Error(`${sku} SKU는 다른 상품에서 사용 중이에요 (${usedSkus.get(sku)}).`);
    }
  }

  if (styleCode) {
    const duplicateStyle = otherProducts.find(other => normalizedIdentifier(other?.styleCode) === styleCode);
    if (duplicateStyle) {
      throw new Error(`${styleCode} 품번은 ${duplicateStyle.name || duplicateStyle.id}에서 사용 중이에요.`);
    }
  }

  return {
    ...product,
    name,
    styleCode,
    colors,
    variants,
    stock: variants.reduce((total, variant) => total + variant.stock, 0)
  };
}
