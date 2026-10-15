function renderWeaponTable(c){
  c.weapons=c.weapons||[];
  if(!c.weapons.length)return '<div class="weapons-empty">Nenhuma arma cadastrada. Adicione uma arma para acompanhar os bônus e o dano.</div>';
  return `<table class="weapon-table"><thead><tr><th>Nome</th><th>Bônus ataque</th><th>Dano / tipo</th><th></th></tr></thead><tbody>${c.weapons.map(w=>`<tr><td><span class="weapon-primary">${esc(w.name)}</span>${w.notes?`<span class="weapon-secondary">${esc(w.notes)}</span>`:''}</td><td><span class="weapon-mod">${esc(w.attackBonus||'—')}</span></td><td><span class="weapon-primary">${esc(w.damage||'—')}${w.damageBonus?` ${w.damageBonus>0?'+':''}${esc(w.damageBonus)}`:''}</span><span class="weapon-secondary">${esc(w.damageType||'Tipo não definido')}${w.range?` · ${esc(w.range)}`:''}</span></td><td><div class="weapon-actions"><button class="icon-btn" title="Editar arma" aria-label="Editar ${esc(w.name)}" data-edit-weapon="${w.id}">✎</button><button class="icon-btn danger-icon" title="Apagar arma" aria-label="Apagar ${esc(w.name)}" data-delete-weapon="${w.id}">×</button></div></td></tr>`).join('')}</tbody></table>`;
}

const renderMainBeforeWeapons=renderMain;
renderMain=function(){
  renderMainBeforeWeapons();
  const c=current(),root=document.querySelector('#main'),combat=root?.querySelector('.combat-panel');
  if(!c||!combat)return;
  const panel=document.createElement('section');panel.className='weapons-panel';
  panel.innerHTML=`<div class="weapons-head"><div><h3>Armas</h3><p>Gerencie bônus de ataque, dano e modificadores.</p></div><button class="btn gold" id="addWeapon">＋ Arma</button></div>${renderWeaponTable(c)}`;
  combat.after(panel);
  panel.querySelector('#addWeapon').onclick=()=>openWeaponForm();
  panel.querySelectorAll('[data-edit-weapon]').forEach(button=>button.onclick=()=>openWeaponForm(button.dataset.editWeapon));
  panel.querySelectorAll('[data-delete-weapon]').forEach(button=>button.onclick=()=>deleteWeapon(button.dataset.deleteWeapon));
};

function openWeaponForm(weaponId=null){
  const c=current();c.weapons=c.weapons||[];
  const old=weaponId?c.weapons.find(w=>w.id===weaponId):null;
  openModal(`<h2>${old?'Editar arma':'Adicionar arma'}</h2><div class="modal-desc">Registre os modificadores usados nos ataques deste personagem.</div><form id="weaponForm"><div class="field"><label>Nome da arma *</label><input name="name" required maxlength="60" value="${esc(old?.name||'')}" placeholder="Espada longa"></div><div class="form-row"><div class="field"><label>Bônus de ataque</label><input name="attackBonus" maxlength="12" value="${esc(old?.attackBonus||'')}" placeholder="+5"></div><div class="field"><label>Dano</label><input name="damage" maxlength="24" value="${esc(old?.damage||'')}" placeholder="1d8"></div></div><div class="form-row"><div class="field"><label>Modificador de dano</label><input name="damageBonus" type="number" min="-20" max="30" value="${old?.damageBonus??''}" placeholder="+3"></div><div class="field"><label>Tipo de dano</label><input name="damageType" maxlength="24" value="${esc(old?.damageType||'')}" placeholder="Cortante"></div></div><div class="form-row"><div class="field"><label>Alcance (opcional)</label><input name="range" maxlength="30" value="${esc(old?.range||'')}" placeholder="Corpo a corpo, 6/18 m"></div><div class="field"><label>Notas / modificadores</label><input name="notes" maxlength="90" value="${esc(old?.notes||'')}" placeholder="Versátil, mágica +1"></div></div><div class="modal-actions"><button type="button" class="btn" data-cancel>Cancelar</button><button class="btn gold">Salvar arma</button></div></form>`);
  document.querySelector('[data-cancel]').onclick=closeModal;
  document.querySelector('#weaponForm').onsubmit=e=>{e.preventDefault();const d=new FormData(e.target),weapon={...old,id:old?.id||id(),name:d.get('name').trim(),attackBonus:d.get('attackBonus').trim(),damage:d.get('damage').trim(),damageBonus:d.get('damageBonus')===''?'':Number(d.get('damageBonus')),damageType:d.get('damageType').trim(),range:d.get('range').trim(),notes:d.get('notes').trim()};if(old)Object.assign(old,weapon);else c.weapons.push(weapon);save();closeModal();renderMain();showToast(old?'Arma atualizada':'Arma adicionada')};
}
function deleteWeapon(weaponId){
  const c=current(),weapon=c.weapons.find(w=>w.id===weaponId);if(!weapon)return;
  openModal(`<h2>Remover ${esc(weapon.name)}?</h2><div class="modal-desc">Esta arma será removida da ficha do personagem.</div><div class="modal-actions"><button class="btn" data-cancel>Cancelar</button><button class="btn danger" id="confirmDeleteWeapon">Remover arma</button></div>`);
  document.querySelector('[data-cancel]').onclick=closeModal;
  document.querySelector('#confirmDeleteWeapon').onclick=()=>{c.weapons=c.weapons.filter(w=>w.id!==weaponId);save();closeModal();renderMain();showToast('Arma removida')};
}
renderMain();
