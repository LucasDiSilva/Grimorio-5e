(()=>{
  const button=document.getElementById('exportBtn');
  if(!button)return;
  const input=document.createElement('input');
  input.type='file';input.accept='.json,application/json';input.hidden=true;
  document.body.append(input);

  function openBackup(){
    openModal(`<h2>Backup das fichas</h2><p class="backup-intro">Exporte seus personagens para guardar ou transferir para outro celular ou navegador. O arquivo inclui magias, habilidades, equipamentos e contadores.</p><div class="backup-summary">${state.characters.length} ${state.characters.length===1?'personagem salvo':'personagens salvos'} neste dispositivo.</div><div class="backup-actions"><button type="button" class="btn" data-cancel>Fechar</button><button type="button" class="btn" id="chooseBackup">Importar backup</button><button type="button" class="btn gold" id="downloadBackup">Exportar backup</button></div>`);
    document.querySelector('[data-cancel]').onclick=closeModal;
    document.getElementById('downloadBackup').onclick=downloadBackup;
    document.getElementById('chooseBackup').onclick=()=>{closeModal();input.value='';input.click()};
  }

  function downloadBackup(){
    const backup={format:'grimorio-dnd5e-backup',version:1,createdAt:new Date().toISOString(),data:{characters:state.characters,activeId:state.activeId}};
    const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob),a=document.createElement('a');
    a.href=url;a.download=`grimorio-dnd5e-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();
    setTimeout(()=>URL.revokeObjectURL(url),5000);closeModal();showToast('Backup exportado');
  }

  function parseBackup(parsed){
    const data=parsed?.format==='grimorio-dnd5e-backup'?parsed.data:(Array.isArray(parsed?.characters)?parsed:parsed?.data);
    if(!data||!Array.isArray(data.characters))throw new Error('O arquivo não contém uma lista de personagens do Grimório.');
    if(parsed?.format==='grimorio-dnd5e-backup'&&parsed.version!==1)throw new Error('A versão deste backup não é compatível.');
    const ids=new Set();
    for(const character of data.characters){
      if(!character||typeof character!=='object'||Array.isArray(character)||typeof character.id!=='string'||!character.id.trim()||typeof character.name!=='string'||!character.name.trim()||!Array.isArray(character.spells)||!Array.isArray(character.features))throw new Error('Uma das fichas está incompleta ou em formato inválido.');
      if(ids.has(character.id))throw new Error('O backup contém fichas com identificadores repetidos.');
      ids.add(character.id);
    }
    return{characters:data.characters,activeId:ids.has(data.activeId)?data.activeId:(data.characters[0]?.id||null)};
  }

  input.addEventListener('change',async()=>{
    const file=input.files?.[0];if(!file)return;
    if(file.size>10*1024*1024){showToast('O backup é grande demais (limite de 10 MB).');return}
    try{
      const backup=parseBackup(JSON.parse(await file.text()));
      openModal(`<h2>Restaurar backup?</h2><p class="backup-intro">O arquivo contém ${backup.characters.length} ${backup.characters.length===1?'personagem':'personagens'}.</p><div class="backup-summary"><b>Mesclar:</b> adiciona as fichas novas e preserva as atuais; IDs repetidos são ignorados.<br><br><b>Substituir:</b> troca todas as fichas salvas neste dispositivo pelas do arquivo.</div><p class="backup-warning">A opção Substituir não pode ser desfeita. Exporte um backup atual antes, se quiser guardá-lo.</p><div class="backup-actions"><button type="button" class="btn" data-cancel>Cancelar</button><button type="button" class="btn" id="mergeBackup">Mesclar</button><button type="button" class="btn danger" id="replaceBackup">Substituir tudo</button></div>`);
      document.querySelector('[data-cancel]').onclick=closeModal;
      document.getElementById('mergeBackup').onclick=()=>restore(backup,'merge');
      document.getElementById('replaceBackup').onclick=()=>restore(backup,'replace');
    }catch(error){showToast(error instanceof SyntaxError?'Não foi possível ler o arquivo JSON.':error.message||'Falha ao abrir o backup.')}
  });

  function restore(backup,mode){
    const previous=state;
    if(mode==='replace')state={characters:backup.characters,activeId:backup.activeId};
    else{
      const existing=new Set(state.characters.map(character=>character.id));
      const additions=backup.characters.filter(character=>!existing.has(character.id));
      const keptCharacters=[...state.characters,...additions];
      const activeStillExists=state.characters.some(character=>character.id===state.activeId);
      state={characters:keptCharacters,activeId:activeStillExists?state.activeId:(additions.some(character=>character.id===backup.activeId)?backup.activeId:(keptCharacters[0]?.id||null))};
      backup.skipped=backup.characters.length-additions.length;
      backup.added=additions.length;
    }
    try{save()}catch{state=previous;showToast('Não foi possível salvar. Libere espaço no navegador e tente novamente.');return}
    closeModal();render();
    showToast(mode==='replace'?`${backup.characters.length} fichas restauradas`:`${backup.added} adicionadas; ${backup.skipped} já existiam`);
  }

  button.textContent='Backup';button.setAttribute('aria-label','Exportar ou importar backup das fichas');button.onclick=openBackup;
})();
