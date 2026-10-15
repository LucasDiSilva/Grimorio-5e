function spellcastingPanel(c){
  c.spellcasting=c.spellcasting||{};
  const stats=c.spellcasting;
  return `<section class="spellcasting-card"><h3>Conjuração</h3><div class="spellcasting-grid"><div class="spellcasting-field"><label for="spellAbility">Atributo de conjuração</label><select id="spellAbility" data-spellcasting="ability"><option value="">Selecione</option>${[['str','Força (FOR)'],['dex','Destreza (DES)'],['con','Constituição (CON)'],['int','Inteligência (INT)'],['wis','Sabedoria (SAB)'],['cha','Carisma (CAR)']].map(([key,label])=>`<option value="${key}" ${stats.ability===key?'selected':''}>${label}</option>`).join('')}</select></div><div class="spellcasting-field"><label for="spellSaveDC">CD para resistir às magias</label><input id="spellSaveDC" data-spellcasting="saveDC" type="number" min="0" max="40" value="${stats.saveDC??''}" placeholder="Ex.: 14"></div><div class="spellcasting-field"><label for="spellAttackBonus">Modificador de ataque mágico</label><input id="spellAttackBonus" data-spellcasting="attackBonus" type="number" min="-20" max="30" value="${stats.attackBonus??''}" placeholder="Ex.: +5"></div></div><div class="spellcasting-hint">Preencha manualmente conforme sua classe e ficha.</div></section>`;
}
const spellPaneBeforeStats=spellPane;
spellPane=function(c){return spellcastingPanel(c)+spellPaneBeforeStats(c)};
const renderMainBeforeStats=renderMain;
renderMain=function(){
  renderMainBeforeStats();
  const c=current(),pane=document.querySelector('#spellsPane');
  if(!c||!pane)return;
  c.spellcasting=c.spellcasting||{};
  pane.querySelectorAll('[data-spellcasting]').forEach(field=>field.onchange=()=>{const key=field.dataset.spellcasting;if(field.value==='')delete c.spellcasting[key];else c.spellcasting[key]=key==='ability'?field.value:Number(field.value);save()});
};
renderMain();
