/** Config.gs — constantes & accès à la base */

const CALENDAR_ID = 'primary';
const OWNER_EMAIL = 'arnaudprz@gmail.com';
const CLAUDE_MODEL = 'claude-sonnet-4-6';
const TZ = 'Europe/Paris';

// Structure de la base Google Sheet (un onglet par clé)
const TABS = {
  Contacts: ['id','entreprise','dirigeant','email','telephone','commune','secteur','effectif','forme','naf','siren','adresse','statut','note','token','maj'],
  Messages: ['id','contact_id','thread_id','sens','sujet','extrait','date'],
  RDV:      ['id','contact_id','event_id','debut','fin','meet','statut'],
  Activites:['date','contact_id','type','detail'],
  Settings: ['cle','valeur']
};

function prop_(k){ return PropertiesService.getScriptProperties().getProperty(k); }
function ss_(){ return SpreadsheetApp.openById(prop_('SHEET_ID')); }
