const DND_SKILLS=[
  ['Acrobacia','DES','dex'],['Adestrar Animais','SAB','wis'],['Arcanismo','INT','int'],
  ['Atletismo','FOR','str'],['Atuação','CAR','cha'],['Enganação','CAR','cha'],
  ['Furtividade','DES','dex'],['História','INT','int'],['Intimidação','CAR','cha'],
  ['Intuição','SAB','wis'],['Investigação','INT','int'],['Medicina','SAB','wis'],
  ['Natureza','INT','int'],['Percepção','SAB','wis'],['Persuasão','CAR','cha'],
  ['Prestidigitação','DES','dex'],['Religião','INT','int'],['Sobrevivência','SAB','wis']
];
const renderMainBeforeSkills=renderMain;
renderMain=function(){
  renderMainBeforeSkills();
  const c=current(),sheet=document.querySelector('#main .sheet-card');
  if(!c||!sheet)return;
  c.skills=c.skills||{};
  const section=document.createElement('section');section.className='skills-section';
  section.innerHTML=`<h3 class="skills-heading">Perícias · bônus manual</h3><div class="skills-grid">${DND_SKILLS.map(([name,ability])=>`<label class="skill-row"><span class="skill-name">${name}<span class="skill-ability">${ability}</span></span><span class="skill-input-wrap"><input class="skill-input" data-skill="${name}" type="number" min="-20" max="30" step="1" value="${c.skills[name]??''}" placeholder="—" aria-label="Bônus manual de ${name}"></span></label>`).join('')}</div>`;
  sheet.append(section);
  section.querySelectorAll('[data-skill]').forEach(input=>input.onchange=()=>{const value=input.value.trim();if(value==='')delete c.skills[input.dataset.skill];else c.skills[input.dataset.skill]=Number(value);save()});
};
renderMain();
