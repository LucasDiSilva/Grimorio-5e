(()=>{
  const root=document.documentElement;
  const button=document.getElementById('themeBtn');
  const menu=document.getElementById('themeMenu');
  if(!button||!menu)return;
  const names={original:'Roxo original',rosa:'Rosa',azul:'Azul','verde-claro':'Verde claro','verde-escuro':'Verde escuro',amarelo:'Amarelo',vermelho:'Vermelho'};
  const allowed=new Set(Object.keys(names));
  const meta=document.querySelector('meta[name="theme-color"]');
  function applyTheme(theme,persist=false){
    if(!allowed.has(theme))theme='original';
    if(theme==='original')delete root.dataset.theme;else root.dataset.theme=theme;
    if(persist)localStorage.setItem('grimorio-theme',theme);
    button.title=`Paleta de cores: ${names[theme]}`;
    button.setAttribute('aria-label',`Paleta de cores. Atual: ${names[theme]}`);
    menu.querySelectorAll('[data-theme-choice]').forEach(option=>option.setAttribute('aria-pressed',String(option.dataset.themeChoice===theme)));
    if(meta)meta.content=getComputedStyle(root).getPropertyValue('--bg').trim()||'#17131f';
  }
  try{applyTheme(localStorage.getItem('grimorio-theme')||'original')}catch{applyTheme('original')}
  button.addEventListener('click',()=>{const opening=menu.hidden;menu.hidden=!opening;button.setAttribute('aria-expanded',String(opening))});
  menu.addEventListener('click',event=>{const option=event.target.closest('[data-theme-choice]');if(!option)return;applyTheme(option.dataset.themeChoice,true);menu.hidden=true;button.setAttribute('aria-expanded','false');button.focus()});
  document.addEventListener('click',event=>{if(!event.target.closest('.theme-picker')){menu.hidden=true;button.setAttribute('aria-expanded','false')}});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!menu.hidden){menu.hidden=true;button.setAttribute('aria-expanded','false');button.focus()}});
})();
