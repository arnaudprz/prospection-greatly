/** Calendar.gs — créneaux libres & réservation (Google Agenda) */

// Créneaux proposés : mar/jeu 9h-12h sur 3 semaines, 30 min, hors occupés
function getSlots(token){
  const cal = CalendarApp.getCalendarById(CALENDAR_ID);
  const slots = []; const now = new Date();
  for(let d=1; d<=21 && slots.length<12; d++){
    const day = new Date(now.getTime() + d*864e5);
    const wd = day.getDay();
    if(wd !== 2 && wd !== 4) continue;            // mardi(2) ou jeudi(4)
    [9,10,11].forEach(function(h){
      const s = new Date(day); s.setHours(h,0,0,0);
      const e = new Date(s.getTime() + 30*60000);
      if(s > now && cal.getEvents(s,e).length === 0)
        slots.push({ iso:s.toISOString(), label:Utilities.formatDate(s,TZ,"EEE d MMM · HH:mm") });
    });
  }
  return slots.slice(0,9);
}

function bookSlot(token, iso){
  const c = rows_('Contacts').filter(function(x){ return x.token == token; })[0];
  if(!c) return { error:'lien invalide' };
  const start = new Date(iso); const end = new Date(start.getTime() + 30*60000);
  const ev = CalendarApp.getCalendarById(CALENDAR_ID).createEvent(
    'Café Greatly × ' + c.entreprise, start, end,
    { guests:c.email, sendInvites:true,
      description:'Échange entre voisins entrepreneurs — ' + (c.dirigeant||'') + ' / Arnaud (Greatly)' });
  ss_().getSheetByName('RDV').appendRow([Utilities.getUuid(), c.id, ev.getId(), start, end, '', 'confirme']);
  updateStatus_(c.id, 'rdv_pris');
  logActivity_(c.id, 'rdv', 'Café calé le ' + Utilities.formatDate(start,TZ,"d MMM HH:mm"));
  return { ok:true, label:Utilities.formatDate(start,TZ,"EEEE d MMMM 'à' HH:mm") };
}
