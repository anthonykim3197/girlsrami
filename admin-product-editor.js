import {
  inventoryRowsForColors,
  productMatchesAdminSearch,
  validateInventoryProduct
} from './admin-inventory.js';

export function createProductInventoryAdmin(deps) {
  const {getClient,getUser,Q,query,requireUser,escape,priceLabel,input,select,find,runForm,setStatus,formValues,validateProduct} = deps;

  return async function renderProductInventoryAdmin(root, publicProducts) {
    const client = getClient();
    const user = getUser();
    root.innerHTML = '<div class="page-heading"><div class="eyebrow">Girlsrami studio</div><h1>상품 · 재고 관리</h1><p>상품 정보와 색상별 SKU·재고를 초안으로 저장하고, 확인한 버전만 사이트에 게시해요.</p></div>';
    if (!client || !user) {
      root.innerHTML += Q('관리자로 로그인한 후 상품을 편집할 수 있어요.') + '<a class="btn btn-accent" href="account.html">로그인</a>';
      return;
    }
    if (requireUser(), !await query(client.rpc('is_admin'))) {
      root.innerHTML += Q('이 계정에는 상품 관리 권한이 없어요. 관리자 권한은 계정 소유자가 저장소에서 지정해요.');
      return;
    }

    let drafts = await query(client.from('product_drafts').select('*').order('id'));
    let selectedId = null;
    root.innerHTML += '<div class="admin-layout"><section class="panel admin-catalog-panel"><div class="cluster admin-list-heading"><div><h2>상품 목록</h2><p class="help">상품명, 품번, 색상 SKU로 찾을 수 있어요.</p></div><button class="btn btn-light" id="new-product">새 상품 초안</button></div><label class="field admin-search">상품 찾기<input id="admin-search" type="search" placeholder="예: RM382, 허니루프, NVR-RM382-CREAM" autocomplete="off"></label><div id="admin-list" class="admin-product-list"></div></section><section class="panel admin-editor-panel" id="admin-edit"></section></div>';

    const mergedProducts = () => {
      const products = new Map(publicProducts.map(product => [product.id,product]));
      drafts.forEach(draft => products.set(draft.id,draft.payload));
      return [...products.values()];
    };

    function inventorySummary(product) {
      const variants = Array.isArray(product.variants) ? product.variants : [];
      if ((product.colors?.length ?? 0) && variants.length !== product.colors.length) return '색상별 재고 미설정';
      return `총 재고 ${Number.isInteger(product.stock) ? product.stock.toLocaleString('ko-KR') : 0}개`;
    }

    function renderList() {
      const search = find('#admin-search',root).value;
      const products = mergedProducts().filter(product => productMatchesAdminSearch(product,search));
      find('#admin-list',root).innerHTML = products.map(product => `
        <button class="item-row ${selectedId === product.id ? 'selected' : ''}" data-product="${escape(product.id)}">
          <img src="${escape(product.image ?? '')}" alt="">
          <span><b>${escape(product.name)}</b><small>${product.styleCode ? `<strong>${escape(product.styleCode)}</strong> · ` : ''}${escape(inventorySummary(product))}</small><small>${priceLabel(product.price)} · ${escape({active:'판매 중',coming:'입고 예정',hidden:'숨김'}[product.status] ?? product.status)}</small></span>
        </button>`).join('') || '<p class="help">일치하는 상품이 없어요.</p>';
      root.querySelectorAll('[data-product]').forEach(button => {
        button.onclick = () => editProduct(button.dataset.product);
      });
    }

    async function editProduct(requestedId, initialProduct = null) {
      let productId = requestedId;
      selectedId = productId;
      renderList();
      const draft = drafts.find(item => item.id === productId);
      let version = draft?.version ?? 0;
      let product = initialProduct ?? draft?.payload ?? publicProducts.find(item => item.id === productId);
      const editorPanel = find('#admin-edit',root);
      const categoryOptions = [...new Set([...publicProducts.map(item => item.category),product.category].filter(Boolean))];
      editorPanel.innerHTML = `
        <div class="editor-heading"><div><span class="eyebrow">초안 → 게시</span><h2>${escape(product.name || '새 상품')}</h2></div><span class="document-state">${version ? `저장된 초안 · 버전 ${version}` : '새 초안'}</span></div>
        <p class="help">상품 ID ${escape(productId || '저장할 때 확정')} · 품번은 상품명과 분리해 관리해요.</p>
        <form id="editor">
          ${input('productId','상품 ID (영문 소문자·숫자·하이픈)','text',productId,`pattern="[a-z0-9-]{1,80}" required ${initialProduct ? '' : 'readonly'}`)}
          <div class="form-grid">
            ${input('styleCode','품번','text',product.styleCode ?? '','maxlength="40" placeholder="예: RM382"')}
            ${select('line','상품 라인',[['basic','베이직'],['premium','프리미엄']],product.line ?? 'basic')}
            ${select('category','상품 종류',categoryOptions.map(category => [category,category]),product.category ?? '가디건')}
            ${input('price','판매가 (원)','number',product.price,'min="0" max="10000000" step="1" required')}
            ${select('status','공개 상태',[['active','판매 중'],['coming','입고 예정'],['hidden','숨김']],product.status)}
            ${input('colors','색상 (쉼표로 구분)','text',(product.colors ?? []).join(', '),'maxlength="2000"')}
          </div>
          ${input('name','상품명','text',product.name,'maxlength="160" required')}
          <small class="help admin-name-help">상품명에는 RM382 같은 품번을 넣지 마세요. 품번은 위 입력란과 관리 목록에서 따로 표시돼요.</small>
          <section class="inventory-editor" aria-labelledby="inventory-title">
            <div class="inventory-heading"><div><span class="eyebrow">Manual inventory</span><h3 id="inventory-title">색상별 SKU · 재고</h3></div><output id="inventory-total" aria-live="polite">총 재고 0개</output></div>
            <p class="notice">이 재고는 걸스라미 사이트에서 수동으로 관리해요. 스마트스토어 재고와 자동으로 맞춰지지 않으므로, 변경 사항을 양쪽에 각각 반영해 주세요.</p>
            <div data-inventory-rows></div>
          </section>
          <label class="field">상품 설명<textarea name="desc" rows="5" maxlength="5000">${escape(product.desc ?? '')}</textarea></label>
          ${input('image','대표 사진 주소','text',product.image ?? '','required')}
          <label class="field">실제 상품 사진 업로드<input type="file" name="imageFile" accept="image/jpeg,image/png,image/webp"></label>
          <label class="check"><input type="checkbox" name="photoVerified" ${product.photoVerified ? 'checked' : ''}> 이 사진은 판매하는 실제 상품을 촬영한 사진이며 사용 권리를 확인했어요.</label>
          <section class="color-photos"><h3>색상별 실제 상품 사진</h3><p class="help">판매 색상별 실제 사진과 사용 권리를 확인해 주세요.</p><div data-color-photos></div></section>
          ${input('storeUrl','스마트스토어 상품 주소','url',product.storeUrl ?? '')}
          <label class="field">사이즈 실측 (한 줄에 사이즈, 가슴단면, 총장, 검증여부)<textarea name="sizes" rows="4" required>${escape((product.sizes ?? []).map(size => [size.label,size.chestHalf,size.length,size.verified ? '확인' : '미확인'].join(', ')).join('\n'))}</textarea></label>
          <p class="help">예: M, 52, 54, 확인 · cm 기준. 확인된 실제 치수만 사이즈 추천에 사용해요.</p>
          <div class="action-row"><button class="btn btn-ghost" type="submit">초안 저장</button><button class="btn btn-accent" type="button" id="publish" ${version ? '' : 'disabled'}>저장한 초안 게시</button><a class="btn btn-light" href="product.html?id=${escape(productId)}" target="_blank">현재 공개 상품 보기</a></div>
          <p data-status role="status"></p>
        </form>
        <details class="history"><summary>이전 게시 내용 복원</summary><div id="history-list"></div></details>`;

      const form = find('#editor',root);
      const colorsInput = find('[name=colors]',form);
      const inventoryContainer = find('[data-inventory-rows]',form);
      const imageInput = find('[name=image]',form);
      const imageFile = find('[name=imageFile]',form);
      const photoVerified = find('[name=photoVerified]',form);
      const colorPhotoContainer = find('[data-color-photos]',form);
      let dirty = Boolean(initialProduct);
      let busy = false;
      const colors = () => colorsInput.value.split(',').map(color => color.trim()).filter(Boolean);

      function currentVariantRows() {
        return [...inventoryContainer.querySelectorAll('[data-inventory-color]')].map(row => ({
          color: row.dataset.inventoryColor,
          sku: find('[data-variant-sku]',row).value,
          stock: find('[data-variant-stock]',row).value
        }));
      }

      function updateInventoryTotal() {
        const inputs = [...inventoryContainer.querySelectorAll('[data-variant-stock]')];
        const stocks = inputs.map(item => Number(item.value));
        const valid = inputs.every((item,index) => item.value.trim() !== '' && Number.isInteger(stocks[index]) && stocks[index] >= 0);
        find('#inventory-total',form).textContent = valid ? `총 재고 ${stocks.reduce((sum,stock) => sum + stock,0).toLocaleString('ko-KR')}개` : '총 재고 —';
      }

      function renderInventoryRows() {
        const live = new Map(currentVariantRows().map(row => [row.color,row]));
        const saved = new Map(inventoryRowsForColors(product).map(row => [row.color,row]));
        const rows = colors().map(color => live.get(color) ?? saved.get(color) ?? {color,sku:'',stock:''});
        inventoryContainer.innerHTML = rows.map(row => `
          <div class="inventory-row" data-inventory-color="${escape(row.color)}">
            <strong class="inventory-color">${escape(row.color)}</strong>
            <label class="field">색상 SKU<input data-variant-sku type="text" value="${escape(row.sku)}" maxlength="64" placeholder="NVR-${escape(productId || 'product-id')}-…" autocomplete="off" required></label>
            <label class="field inventory-stock">재고 수량<input data-variant-stock type="number" value="${escape(row.stock)}" min="0" max="100000" step="1" inputmode="numeric" required></label>
          </div>`).join('') || '<p class="help">색상을 입력하면 SKU와 재고 입력란이 생겨요.</p>';
        inventoryContainer.querySelectorAll('input').forEach(item => item.addEventListener('input',updateInventoryTotal));
        updateInventoryTotal();
      }

      function renderColorPhotos() {
        const live = new Map([...colorPhotoContainer.querySelectorAll('[data-photo-color]')].map(row => [row.dataset.photoColor,row]));
        const rows = colors().map(color => {
          if (live.has(color)) return live.get(color);
          const saved = Object.hasOwn(product.colorPhotos ?? {},color) ? product.colorPhotos[color] : null;
          const row = document.createElement('fieldset');
          row.dataset.photoColor = color;
          row.innerHTML = `<legend>${escape(color)}</legend><label class="field">${escape(color)} 사진 주소<input data-photo-url type="text" value="${escape(saved?.image ?? '')}"></label><label class="field">${escape(color)} 사진 업로드<input data-photo-file type="file" accept="image/jpeg,image/png,image/webp"></label><label class="check"><input data-photo-proof type="checkbox" ${saved?.verified ? 'checked' : ''}> 이 색상의 실제 상품 사진이며 사용 권리를 확인했어요.</label>`;
          const proof = find('[data-photo-proof]',row);
          find('[data-photo-url]',row).oninput = () => { proof.checked = false; };
          find('[data-photo-file]',row).onchange = () => { proof.checked = false; };
          return row;
        });
        colorPhotoContainer.replaceChildren(...rows);
        if (!rows.length) colorPhotoContainer.innerHTML = '<p class="help">색상을 입력하면 색상별 사진을 등록할 수 있어요.</p>';
      }

      colorsInput.addEventListener('change',() => { renderInventoryRows(); renderColorPhotos(); });
      imageInput.oninput = () => { photoVerified.checked = false; };
      imageFile.onchange = () => { photoVerified.checked = false; imageInput.required = !imageFile.files.length; };
      renderInventoryRows();
      renderColorPhotos();

      async function runBusy(action) {
        if (busy) return;
        busy = true;
        root.inert = true;
        find('#publish',root).disabled = true;
        try {
          await runForm(form,action);
        } finally {
          busy = false;
          root.inert = false;
          find('#publish',root).disabled = dirty || !version;
        }
      }

      form.oninput = () => {
        dirty = true;
        find('#publish',root).disabled = true;
        setStatus(form,'저장하지 않은 변경이 있어요. 초안 저장 후 게시해 주세요.');
      };

      const uploadCatalogImage = async file => {
        if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 7 * 1024 * 1024) throw new Error('7MB 이하 상품 사진을 준비해 주세요.');
        const path = `${crypto.randomUUID()}.${{'image/jpeg':'jpg','image/png':'png','image/webp':'webp'}[file.type]}`;
        await query(client.storage.from('catalog').upload(path,file,{contentType:file.type}));
        return client.storage.from('catalog').getPublicUrl(path).data.publicUrl;
      };

      form.onsubmit = event => {
        event.preventDefault();
        runBusy(async () => {
          const values = formValues(form);
          const nextId = initialProduct && version === 0 ? values.productId : productId;
          const sizes = values.sizes.split('\n').filter(line => line.trim()).map(line => {
            const [label,chestHalf,length,verified] = line.split(',').map(value => value.trim());
            return {label,chestHalf:chestHalf ? Number(chestHalf) : null,length:length ? Number(length) : null,verified:verified === '확인'};
          });
          const inventoryProduct = validateInventoryProduct({
            ...product,id:nextId,name:values.name,desc:values.desc,line:values.line,category:values.category,status:values.status,storeUrl:values.storeUrl,styleCode:values.styleCode,colors:colors(),variants:currentVariantRows(),price:Number(values.price),sizes,photoVerified:values.photoVerified === 'on'
          },mergedProducts());

          const colorPhotos = Object.fromEntries((await Promise.all([...colorPhotoContainer.querySelectorAll('[data-photo-color]')].map(async row => {
            const color = row.dataset.photoColor;
            const file = find('[data-photo-file]',row).files[0];
            const urlInput = find('[data-photo-url]',row);
            const verified = find('[data-photo-proof]',row).checked;
            if (!file && !urlInput.value.trim()) {
              if (verified) throw new Error(`${color}의 실제 사진 주소를 입력하거나 사진을 업로드해 주세요.`);
              return [color,null];
            }
            if (file) {
              urlInput.value = await uploadCatalogImage(file);
              find('[data-photo-file]',row).value = '';
            }
            return [color,{image:urlInput.value.trim(),verified}];
          }))).filter(([,value]) => value));

          if (imageFile.files[0]) {
            imageInput.value = await uploadCatalogImage(imageFile.files[0]);
            imageFile.value = '';
            imageInput.required = true;
          }
          productId = nextId;
          product = validateProduct({...inventoryProduct,image:imageInput.value.trim(),colorPhotos});
          version = await query(client.rpc('save_product_draft',{product_id:productId,product_payload:product,expected_version:version}));
          dirty = false;
          root.dispatchEvent(new Event('gr-product-saved',{bubbles:true}));
          selectedId = productId;
          drafts = await query(client.from('product_drafts').select('*').order('id'));
          renderList();
          find('[name=productId]',form).readOnly = true;
          form.querySelector('a[target="_blank"]').href = `product.html?id=${productId}`;
          find('.document-state',editorPanel).textContent = `저장된 초안 · 버전 ${version}`;
          find('#publish',root).disabled = false;
          setStatus(form,`초안을 서버에 저장했어요. 색상 ${product.variants.length}개 · 총 재고 ${product.stock.toLocaleString('ko-KR')}개. 게시 전까지 사이트에는 반영되지 않아요.`);
        });
      };

      find('#publish',root).onclick = () => runBusy(async () => {
        if (dirty) throw new Error('먼저 초안을 저장해 주세요.');
        await query(client.rpc('publish_product',{product_id:productId,expected_version:version}));
        setStatus(form,'저장한 초안을 사이트에 게시했어요. 공개 상품 페이지를 새로 열어 확인해 주세요.');
      });

      if (!productId) {
        find('#history-list',root).innerHTML = '<p class="help">새 상품은 게시 후 이력이 표시돼요.</p>';
        return;
      }
      const history = await query(client.from('product_history').select('id,version,created_at,payload').eq('product_id',productId).order('version',{ascending:false}).limit(10));
      if (selectedId !== productId) return;
      find('#history-list',root).innerHTML = history.map(item => `<div class="job-row"><span>게시 ${item.version} · ${escape(new Date(item.created_at).toLocaleString('ko-KR'))}</span><button class="text-btn" data-restore="${item.id}">이 내용으로 초안 복원</button></div>`).join('') || '<p class="help">게시 이력이 없어요.</p>';
      editorPanel.querySelectorAll('[data-restore]').forEach(button => {
        button.onclick = () => runBusy(async () => {
          const historic = history.find(item => item.id === button.dataset.restore).payload;
          validateInventoryProduct(historic,mergedProducts());
          version = await query(client.rpc('save_product_draft',{product_id:productId,product_payload:historic,expected_version:version}));
          drafts = await query(client.from('product_drafts').select('*').order('id'));
          await editProduct(productId);
          setStatus(find('#editor',root),'이전 게시 내용을 초안으로 복원했어요. 확인 후 게시할 수 있어요.');
        });
      });
    }

    find('#new-product',root).onclick = () => editProduct('',{
      id:'',name:'',styleCode:'',line:'basic',category:'가디건',price:0,stock:0,status:'hidden',colors:[],variants:[],sizes:[{label:'FREE',chestHalf:null,length:null,verified:false}],image:'',storeUrl:'',photoVerified:false,desc:'',badges:[]
    });
    find('#admin-search',root).oninput = renderList;
    renderList();
    if (publicProducts[0]) await editProduct(publicProducts[0].id);
  };
}
