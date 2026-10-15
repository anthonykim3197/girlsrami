// Required content is a release condition, not an optional renderer fallback.
export function validateDetailContent(products, details) {
  const errors = [];
  for (const product of products) {
    const d = details[product.id];
    const fail = message => errors.push(`${product.id}: ${message}`);
    if (!d) { fail('missing detail content'); continue; }
    const colors = product.colors || [];
    if (!d.lead?.trim() || !d.storyTitle?.trim() || !d.storyParagraphs?.some(p=>p.trim())) fail('missing editorial introduction');
    if (d.looks?.length !== 4 || new Set(d.looks?.map(l=>l.id)).size !== 4) fail('four distinct styling sets required');
    for (const color of colors) {
      const sources = new Set();
      for (const look of d.looks || []) {
        const src = look.images?.[color];
        if (!src) fail(`${color}: missing ${look.id} photograph`);
        else sources.add(src);
        if (!(look.itemsByColor?.[color] || look.items)?.length) fail(`${color}: missing ${look.id} outfit notes`);
      }
      if (sources.size !== 4) fail(`${color}: styling photographs must be different`);
    }
    if (!d.colorBoard) fail('Color Palette required');
    if (!(d.colorBoardSize?.width > 0 && d.colorBoardSize?.height > 0)) fail('palette dimensions required');
    if (!Array.isArray(d.colorOrder) || d.colorOrder.length !== colors.length || new Set(d.colorOrder).size !== colors.length || d.colorOrder.some(c=>!colors.includes(c))) fail('palette order must contain every sale color exactly once');
    if (!(d.fabric?.length >= 2)) fail('studio overview and fabric detail required');
    for (const f of d.fabric || []) {
      if (!f.src || !f.caption || !(f.width > 0 && f.height > 0)) fail('fabric photograph missing source, caption or dimensions');
      if (!['photo','studio-edit'].includes(f.mediaKind)) fail('fabric photograph provenance required');
      if (f.mediaKind === 'studio-edit' && /실물|촬영 원본/.test(f.caption)) fail('edited fabric photograph cannot be captioned as an original');
    }
    if (d.fabric?.some(f=>f.mediaKind === 'studio-edit') && !d.fabricOriginals?.length) fail('edited fabric requires preserved source photographs');
    for (const f of d.fabricOriginals || []) {
      if (f.mediaKind !== 'photo' || !f.src || !(f.width > 0 && f.height > 0)) fail('invalid source photograph');
    }
    if (!d.measurements?.length || !d.size || /미정|확인/.test(d.size) || d.sizeUnit !== 'cm' || d.measurementVerified !== true) fail('verified size guide required');
  }
  if (errors.length) throw new Error(`Incomplete storefront detail content:\n${errors.join('\n')}`);
  return {products:products.length, colors:products.reduce((n,p)=>n+p.colors.length,0), looks:products.reduce((n,p)=>n+p.colors.length*4,0)};
}
