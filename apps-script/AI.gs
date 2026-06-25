/** AI.gs — brouillons d'invitation rédigés par Claude */

function draftInvitation_(id){
  const c = rows_('Contacts').filter(function(x){ return x.id == id; })[0];
  if(!c) return '';
  const prompt =
    "Tu écris pour Arnaud, dirigeant de Greatly (Verlinghem), un court email d'invitation à un café, " +
    "entre voisins entrepreneurs. Ton chaleureux, local, SANS pitch commercial, sans rien vendre. " +
    "Objectif : découvrir leurs univers respectifs. Destinataire : " + (c.dirigeant || 'le dirigeant') +
    ", entreprise " + c.entreprise + " à " + c.commune + " (secteur " + c.secteur + "). " +
    "Pas de langage inclusif, pas de tirets cadratins. 120 mots max. Termine par une phrase invitant " +
    "à choisir un créneau via un lien. Donne un objet d'email + le corps.";
  return callClaude_(prompt);
}

function callClaude_(prompt){
  const key = prop_('CLAUDE_API_KEY');
  if(!key) return '[CLAUDE_API_KEY manquante dans les propriétés du script]';
  const res = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', {
    method:'post', contentType:'application/json', muteHttpExceptions:true,
    headers:{ 'x-api-key':key, 'anthropic-version':'2023-06-01' },
    payload: JSON.stringify({ model:CLAUDE_MODEL, max_tokens:600, messages:[{ role:'user', content:prompt }] })
  });
  const j = JSON.parse(res.getContentText());
  return (j.content && j.content[0] && j.content[0].text) || ('[erreur Claude] ' + res.getContentText());
}
