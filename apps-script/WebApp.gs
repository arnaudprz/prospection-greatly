/** WebApp.gs — routage de l'application web (API JSON pour le front) */

function doGet(e){
  const action = e.parameter.action || '';
  if (action === 'list')  return json_({ contacts: rows_('Contacts') });
  if (action === 'slots') return json_({ slots: getSlots(e.parameter.token) });
  return json_({ ok:true, service:'Prospection Greatly' });
}

function doPost(e){
  const body = JSON.parse(e.postData.contents || '{}');
  switch (body.action){
    case 'updateStatus': return updateStatus_(body.id, body.statut);
    case 'saveNote':     return saveField_(body.id, 'note', body.note);
    case 'draftEmail':   return json_({ draft: draftInvitation_(body.id) });
    case 'sendInvite':   return sendInvite_(body.id, body.subject, body.html);
    case 'book':         return json_(bookSlot(body.token, body.iso));
    default:             return json_({ error:'action inconnue' });
  }
}

function json_(obj){
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
