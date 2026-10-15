function renderBagPanel(c){
  c.bag=c.bag||[];
  return `<section id="bagStandalone" class="card bag-panel"><div class="bag-heading"><div><h3>🎒 Bolsa</h3><div class="sub">Itens e quantidades do personagem.</div></div><button class="btn gold" id="addBagItem">＋ Item</button></div>${c.bag.length?`<div class="bag-list">${c.bag.map(item=>`<div class="bag-item" data-bag-row="${item.id}"><div><div class="bag-item-name">${esc(item.name)}</div>${item.notes?`<div class="bag-item-note">${esc(item.notes)}</div>`:''}</div><div class="bag-controls"><button class="bag-step" data-qty="-1" aria-label="Remover uma unidade de ${esc(item.name)}" ${item.qty<=0?'disabled':''}>−</button><span class="bag-qty">${item.qty}</span><button class="bag-step" data-qty="1" aria-label="Adicionar uma unidade de ${esc(item.name)}">+</button></div><div class="bag-item-actions"><button class="icon-btn" title="Editar item" aria-label="Editar ${esc(item.name)}" data-edit-bag="${item.id}">✎</button><button class="icon-btn danger-icon" title="Remover item" aria-label="Remover ${esc(item.name)} da bolsa" data-delete-bag="${item.id}">×</button></div></div>`).join('')}</div>`:`<div class="bag-empty">A bolsa está vazia. Adicione poções, ferramentas, munição e outros itens.</div>`}</section>`;
}

const spellPaneBeforeBag=spellPane;
spellPane=function(c){return spellPaneBeforeBag(c)};
const renderMainBeforeBag=renderMain;
renderMain=function(){
  renderMainBeforeBag();
  const c=current(),root=document.querySelector('#main');
  if(!c||!root)return;
  c.bag=c.bag||[];
  const holder=document.createElement('div');holder.innerHTML=renderBagPanel(c);
  const bag=holder.firstElementChild;
  const ordered=['.char-header','.stats','.combat-panel','.weapons-panel','.sheet-card','#bagStandalone','.rest-row','.tabs','#spellsPane','#featuresPane','#catalogPane'];
  for(const selector of ordered){const element=root.querySelector(selector);if(element){if(selector==='#bagStandalone')continue;root.appendChild(element);}}
  const sheet=root.querySelector('.sheet-card');
  if(sheet)sheet.after(bag);else root.appendChild(bag);
  bag.querySelector('#addBagItem').onclick=()=>openBagItem();
  bag.querySelectorAll('[data-qty]').forEach(button=>button.onclick=()=>{const item=c.bag.find(x=>x.id===button.closest('[data-bag-row]').dataset.bagRow);if(!item)return;item.qty=Math.max(0,Math.min(9999,Number(item.qty||0)+Number(button.dataset.qty)));save();const row=button.closest('[data-bag-row]');row.querySelector('.bag-qty').textContent=item.qty;row.querySelector('[data-qty="-1"]').disabled=item.qty===0});
  bag.querySelectorAll('[data-edit-bag]').forEach(button=>button.onclick=()=>openBagItem(button.dataset.editBag));
  bag.querySelectorAll('[data-delete-bag]').forEach(button=>button.onclick=()=>deleteBagItem(button.dataset.deleteBag));
};

function openBagItem(itemId=null){
  const c=current();c.bag=c.bag||[];const old=itemId?c.bag.find(x=>x.id===itemId):null;
  openModal(`<h2>${old?'Editar item':'Adicionar item à bolsa'}</h2><div class="modal-desc">Registre o que o personagem carrega e a quantidade disponível.</div><form id="bagItemForm"><div class="field"><label>Nome do item *</label><input name="name" required maxlength="70" value="${esc(old?.name||'')}" placeholder="Poção de cura"></div><div class="form-row"><div class="field"><label>Quantidade</label><input name="qty" type="number" min="0" max="9999" value="${old?.qty??1}"></div><div class="field"><label>Notas (opcional)</label><input name="notes" maxlength="100" value="${esc(old?.notes||'')}" placeholder="2d4 + 2 PV"></div></div><div class="modal-actions"><button type="button" class="btn" data-cancel>Cancelar</button><button class="btn gold">Salvar item</button></div></form>`);
  document.querySelector('[data-cancel]').onclick=closeModal;
  document.querySelector('#bagItemForm').onsubmit=e=>{e.preventDefault();const d=new FormData(e.target),item={...old,id:old?.id||id(),name:d.get('name').trim(),qty:Math.max(0,Math.min(9999,+d.get('qty')||0)),notes:d.get('notes').trim()};if(old)Object.assign(old,item);else c.bag.push(item);save();closeModal();renderMain();showToast(old?'Item atualizado':'Item adicionado à bolsa')};
}
function deleteBagItem(itemId){
  const c=current(),item=c.bag.find(x=>x.id===itemId);if(!item)return;
  openModal(`<h2>Remover ${esc(item.name)}?</h2><div class="modal-desc">Este item será removido da bolsa.</div><div class="modal-actions"><button class="btn" data-cancel>Cancelar</button><button class="btn danger" id="confirmDeleteBag">Remover item</button></div>`);
  document.querySelector('[data-cancel]').onclick=closeModal;
  document.querySelector('#confirmDeleteBag').onclick=()=>{c.bag=c.bag.filter(x=>x.id!==itemId);save();closeModal();renderMain();showToast('Item removido da bolsa')};
}
renderMain();
