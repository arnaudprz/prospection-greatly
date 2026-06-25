/** Mail.gs — envoi d'invitations & détection des réponses (Gmail) */

function sendInvite_(id, subject, html){
  const c = rows_('Contacts').filter(function(x){ return x.id == id; })[0];
  if(!c || !c.email) return json_({ error:'pas d email' });
  GmailApp.sendEmail(c.email, subject, '', { htmlBody: html, name: 'Arnaud — Greatly' });
  updateStatus_(id, 'mail_envoye');
  logActivity_(id, 'mail', 'Invitation envoyée');
  return json_({ ok:true });
}

// Déclencheur périodique : une réponse d'un prospect -> carte en "a_repondu"
function syncReplies(){
  rows_('Contacts').forEach(function(c){
    if(!c.email || c.statut !== 'mail_envoye') return;
    if(GmailApp.search('from:' + c.email + ' newer_than:30d').length){
      updateStatus_(c.id, 'a_repondu');
      logActivity_(c.id, 'reponse', 'Réponse détectée');
    }
  });
}
