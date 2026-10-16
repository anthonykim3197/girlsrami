// Administrative intake dates describe the owner's first work request, not a release.
// Evidence and the distinction from releasedAt: docs/ADMIN-CATALOG-INTAKE.md.
const latestIds = [
  'jo23-oversized-vneck-knit','jo24-oversized-boatneck-knit',
  'jo31-raglan-roundneck-knit','jo32-raglan-vneck-knit',
  'rm542-cable-vneck-vest','rm543-basic-vneck-knit','rm567-round-cap-sleeve-knit',
  'rm576-ribbed-vneck-knit','rm582-front-back-vneck-oversized-knit'
];
const initialIds = ['honey-loop-crop-knit','off-duty-vneck-knit-vest'];
const legacyIds = [
  'boucle-crop-cardigan','cable-vneck-knit','vneck-knit-vest',
  'boucle-round-half-cardigan','fisherman-crop-bustier','boucle-fisher-vneck-vest',
  'alpaca-round-knit','stripe-cable-half','popcorn-vneck-half','recycled-round-sweater'
];
const sampleIds = [
  'wool-cable-regular','cashmere-touch-turtle','alpaca-long-cardigan',
  'ribbed-knit-dress','boucle-long-vest','knit-set-cardigan-top','wool-rib-muffler','halfzip-knit'
];
const testIds = [
  'qa-emerald-cardigan-20261001','qa-studio-ai-beige-vneck',
  'qa-studio-ai-blue-stripe-half','qa-studio-ai-green-cardigan',
  'qa-studio-store-boucle-crop-cardigan','qa-studio-store-cable-vneck-knit',
  'qa-studio-store-vneck-knit-vest','qa-studio-store-alpaca-round-knit',
  'qa-studio-store-stripe-cable-half','qa-studio-store-popcorn-vneck-half',
  'qa-studio-store-recycled-round-sweater'
];
const baseline = new Map([
  ...latestIds.map(id=>[id,{group:'new',intakeDate:'2026-10-13'}]),
  ...initialIds.map(id=>[id,{group:'new',intakeDate:'2026-10-03'}]),
  ...legacyIds.map(id=>[id,{group:'legacy',intakeDate:null}]),
  ...sampleIds.map(id=>[id,{group:'sample',intakeDate:null}]),
  ...testIds.map(id=>[id,{group:'test',intakeDate:null}])
]);
const groupLabels = {new:'신상품',legacy:'기존 스마트스토어',sample:'견본',test:'테스트',unclassified:'미분류'};

function validDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0,10) === value;
}

export function catalogInfo(product = {}) {
  const fallback = baseline.get(product.id) ?? {group:'unclassified',intakeDate:null};
  const group = Object.hasOwn(groupLabels,product.catalogGroup) ? product.catalogGroup : fallback.group;
  const value = Object.hasOwn(product,'intakeDate') ? product.intakeDate : fallback.intakeDate;
  const intakeDate = validDate(value) ? value : null;
  const groupLabel = groupLabels[group];
  return {group,intakeDate,groupLabel,batchLabel:group === 'new' ? `${intakeDate ?? '입고일 미확인'} 신상품` : groupLabel};
}

export function sortAdminProducts(products) {
  return [...products].sort((a,b)=>{
    const dateA = catalogInfo(a).intakeDate ?? '';
    const dateB = catalogInfo(b).intakeDate ?? '';
    return dateB.localeCompare(dateA) || String(a.styleCode || a.name || a.id).localeCompare(String(b.styleCode || b.name || b.id),'ko',{numeric:true}) || String(a.id).localeCompare(String(b.id));
  });
}

export function catalogSummary(products) {
  const groups = {real:[],samples:[],tests:[],unclassified:[],newBatches:[],legacy:[]};
  const batches = new Map();
  for (const product of sortAdminProducts([...new Map(products.map(p=>[p.id,p])).values()])) {
    const info = catalogInfo(product);
    if (info.group === 'new' || info.group === 'legacy') groups.real.push(product);
    if (info.group === 'legacy') groups.legacy.push(product);
    else if (info.group === 'new') {
      if (!batches.has(info.intakeDate)) batches.set(info.intakeDate,[]);
      batches.get(info.intakeDate).push(product);
    } else if (info.group === 'sample') groups.samples.push(product);
    else if (info.group === 'test') groups.tests.push(product);
    else groups.unclassified.push(product);
  }
  groups.newBatches = [...batches].map(([date,products])=>({date,products}));
  return groups;
}

export function serializeCatalogFields(values) {
  const catalogGroup = String(values.catalogGroup ?? 'unclassified');
  if (!Object.hasOwn(groupLabels,catalogGroup)) throw new Error('상품 구분을 확인해 주세요.');
  const intakeDate = String(values.intakeDate ?? '').trim();
  if (intakeDate && !validDate(intakeDate)) throw new Error('입고일은 실제 날짜를 YYYY-MM-DD 형식으로 입력해 주세요.');
  return {catalogGroup,intakeDate:intakeDate || null};
}
