const renderMainBeforeCombat=renderMain;
renderMain=function(){
  renderMainBeforeCombat();
  const c=current(),root=document.querySelector('#main');
  if(!c||!root)return;
  const header=root.querySelector('.char-header');
  if(!header)return;
  const maxHP=Math.max(0,Number(c.hpMax)||0);
  if((c.hp===''||c.hp==null)&&maxHP){c.hp=maxHP;save()}
  const currentHP=Math.max(0,Number(c.hp)||0);
  const tempHP=Math.max(0,Number(c.tempHp)||0);
  const percent=maxHP?Math.max(0,Math.min(100,currentHP/maxHP*100)):0;
  const panel=document.createElement('section');
  panel.className='combat-panel';
  panel.innerHTML=`<div class="combat-title"><h3>⚔ Combate</h3><span>Pontos de vida</span></div><div class="hp-control"><button class="hp-buttons" data-hp="-" aria-label="Reduzir pontos de vida">−</button><div class="hp-count"><div class="hp-label">Vida atual</div><strong>${currentHP}</strong> <small>${maxHP?'/ '+maxHP+' PV':''}</small></div><button class="hp-buttons" data-hp="+" aria-label="Aumentar pontos de vida">+</button></div>${maxHP?`<div class="hp-meter"><div class="hp-meter-fill" style="width:${percent}%"></div></div>`:''}<div class="hp-adjust">Alterar PV por clique <input id="hpStep" type="number" min="1" max="999" value="1" aria-label="Quantidade de pontos de vida"></div><div class="temp-hp-row"><div><div class="hp-label">Vida extra · PV temporários</div><div class="temp-hp-value"><strong>${tempHP}</strong> PV temporários</div></div><div class="temp-hp-actions"><input id="tempHpAmount" type="number" min="1" max="999" placeholder="Quantidade" aria-label="Quantidade de PV temporários"><button class="btn" id="addTempHp">Adicionar</button>${tempHP?'<button class="btn danger" id="clearTempHp">Remover</button>':''}</div></div><div class="temp-hp-note">PV temporários são separados da vida normal. Um novo valor substitui o atual.</div>`;
  header.after(panel);
  panel.querySelectorAll('[data-hp]').forEach(button=>button.onclick=()=>{
    const step=Math.max(1,Math.min(999,Number(panel.querySelector('#hpStep').value)||1));
    const next=Number(c.hp||0)+(button.dataset.hp==='+'?step:-step);
    if(button.dataset.hp==='-'){
      const absorbed=Math.min(Number(c.tempHp)||0,step);
      c.tempHp=Math.max(0,(Number(c.tempHp)||0)-absorbed);
      c.hp=Math.max(0,Number(c.hp||0)-(step-absorbed));
    }else c.hp=Math.max(0,maxHP?Math.min(maxHP,next):next);
    save();renderMain();
  });
  panel.querySelector('#addTempHp').onclick=()=>{const amount=Math.max(0,Math.min(999,Number(panel.querySelector('#tempHpAmount').value)||0));if(!amount)return; c.tempHp=amount;save();renderMain()};
  panel.querySelector('#clearTempHp')?.addEventListener('click',()=>{c.tempHp=0;save();renderMain()});
};
renderMain();
