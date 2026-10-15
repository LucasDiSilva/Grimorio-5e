function renderSpecialItems(c){
  c.specialItems=c.specialItems||[];
  return `<section id="specialItemsPanel" class="special-items-panel"><div class="special-items-head"><div><h3>✦ Itens especiais</h3><p>Armas encantadas, trajes e equipamentos com habilidades próprias.</p></div><button class="btn gold" id="addSpecialItem">＋ Item especial</button></div>${c.specialItems.length?`<div class="special-items-list">${c.specialItems.map(item=>`<article class="special-item"><header class="special-item-head"><div><div class="special-item-title">${esc(item.name)}</div><div class="special-item-category">${esc(item.category||'Item especial')}</div></div><div class="special-item-actions"><button class="icon-btn" title="Editar item" aria-label="Editar ${esc(item.name)}" data-edit-special="${item.id}">✎</button><button class="icon-btn danger-icon" title="Remover item" aria-label="Remover ${esc(item.name)}" data-delete-special="${item.id}">×</button></div></header><div class="special-item-description">${esc(item.description||'Sem descrição.')}</div></article>`).join('')}</div>`:`<div class="special-items-empty">Nenhum item especial cadastrado. Adicione um para guardar sua descrição e habilidades.</div>`}</section>`;
}
const renderMainBeforeSpecialItems=renderMain;
renderMain=function(){
  renderMainBeforeSpecialItems();
  const c=current(),root=document.querySelector('#main'),bag=root?.querySelector('#bagStandalone');
  if(!c||!root||!bag)return;
  const holder=document.createElement('div');holder.innerHTML=renderSpecialItems(c);
  const panel=holder.firstElementChild;bag.before(panel);
  panel.querySelector('#addSpecialItem').onclick=()=>openSpecialItem();
  panel.querySelectorAll('[data-edit-special]').forEach(button=>button.onclick=()=>openSpecialItem(button.dataset.editSpecial));
  panel.querySelectorAll('[data-delete-special]').forEach(button=>button.onclick=()=>deleteSpecialItem(button.dataset.deleteSpecial));
};
function openSpecialItem(itemId=null){
  const c=current();c.specialItems=c.specialItems||[];const old=itemId?c.specialItems.find(x=>x.id===itemId):null;
  openModal(`<h2>${old?'Editar item especial':'Novo item especial'}</h2><div class="modal-desc">Use a descrição para registrar propriedades, poderes, requisitos e efeitos do item.</div><form id="specialItemForm"><div class="field"><label>Nome *</label><input name="name" required maxlength="80" value="${esc(old?.name||'')}" placeholder="Manto das Sombras"></div><div class="field"><label>Categoria</label><select name="category"><option ${!old?.category||old.category==='Arma encantada'?'selected':''}>Arma encantada</option><option ${old?.category==='Traje'?'selected':''}>Traje</option><option ${old?.category==='Armadura'?'selected':''}>Armadura</option><option ${old?.category==='Acessório'?'selected':''}>Acessório</option><option ${old?.category==='Outro'?'selected':''}>Outro</option></select></div><div class="field"><label>Descrição e habilidades</label><textarea class="special-description" name="description" maxlength="5000" placeholder="Descreva as propriedades e habilidades especiais do item...">${esc(old?.description||'')}</textarea></div><div class="modal-actions"><button type="button" class="btn" data-cancel>Cancelar</button><button class="btn gold">Salvar item</button></div></form>`);
  document.querySelector('[data-cancel]').onclick=closeModal;
  document.querySelector('#specialItemForm').onsubmit=e=>{e.preventDefault();const d=new FormData(e.target),item={...old,id:old?.id||id(),name:d.get('name').trim(),category:d.get('category'),description:d.get('description').trim()};if(old)Object.assign(old,item);else c.specialItems.push(item);save();closeModal();renderMain();showToast(old?'Item atualizado':'Item especial adicionado')};
}
function deleteSpecialItem(itemId){
  const c=current(),item=c.specialItems.find(x=>x.id===itemId);if(!item)return;
  openModal(`<h2>Remover ${esc(item.name)}?</h2><div class="modal-desc">Este item especial será removido da ficha.</div><div class="modal-actions"><button class="btn" data-cancel>Cancelar</button><button class="btn danger" id="confirmDeleteSpecial">Remover item</button></div>`);
  document.querySelector('[data-cancel]').onclick=closeModal;
  document.querySelector('#confirmDeleteSpecial').onclick=()=>{c.specialItems=c.specialItems.filter(x=>x.id!==itemId);save();closeModal();renderMain();showToast('Item especial removido')};
}
renderMain();
