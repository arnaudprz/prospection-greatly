/** Contacts.gs — lecture / écriture des contacts dans le Sheet */

function rows_(tab){
  const sh = ss_().getSheetByName(tab);
  const data = sh.getDataRange().getValues();
  const head = data.shift();
  return data.map(function(r){ const o={}; head.forEach(function(h,i){o[h]=r[i];}); return o; });
}

function findRow_(tab, id){
  const sh = ss_().getSheetByName(tab);
  const ids = sh.getRange(2,1,Math.max(sh.getLastRow()-1,1),1).getValues().flat();
  const idx = ids.indexOf(id);
  return idx>=0 ? { sh:sh, row:idx+2 } : null;
}

function saveField_(id, field, value){
  const loc = findRow_('Contacts', id);
  if(!loc) return json_({ error:'introuvable' });
  loc.sh.getRange(loc.row, TABS.Contacts.indexOf(field)+1).setValue(value);
  loc.sh.getRange(loc.row, TABS.Contacts.indexOf('maj')+1).setValue(new Date());
  return json_({ ok:true });
}

function updateStatus_(id, statut){
  saveField_(id, 'statut', statut);
  logActivity_(id, 'statut', '→ ' + statut);
  return json_({ ok:true });
}

function logActivity_(contactId, type, detail){
  ss_().getSheetByName('Activites').appendRow([new Date(), contactId, type, detail || '']);
}
