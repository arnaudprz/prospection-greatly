/* board.js — vue Pipeline : liste pleine largeur (raccourcis LinkedIn / Mail / Landing) */

function render() {
  const counts = {};
  LANES.forEach(l => counts[l.id] = 0);
  DATA.forEach(c => counts[c.statut] = (counts[c.statut] || 0) + 1);

  const board = document.getElementById("board");
  board.innerHTML = `
    <div class="plist">
      <div class="lhead">
        <div class="lh-main">Entreprise · dirigeant</div>
        <div class="lh-meta">Localisation · secteur</div>
        <div class="lh-stage">Étape</div>
        <div class="lh-acts">Raccourcis</div>
      </div>
      ${DATA.map(rowHtml).join("")}
    </div>`;

  renderStats(counts);
  if (typeof renderHome === "function") renderHome();
}

function rowHtml(c) {
  const opts = LANES.map(l =>
    `<option value="${l.id}" ${l.id === c.statut ? "selected" : ""}>${l.label}</option>`).join("");
  const li = c.linkedin ||
    ("https://www.linkedin.com/search/results/people/?keywords=" +
      encodeURIComponent((c.dirigeant || "") + " " + c.entreprise));
  const dir = c.dirigeant
    ? `<span class="ldir">${c.dirigeant}</span>`
    : `<span class="ldir no-dir">Dirigeant à identifier</span>`;
  const mail = c.email
    ? `<a class="ic" href="mailto:${c.email}" title="Écrire à ${c.email}" onclick="event.stopPropagation()">Mail</a>`
    : `<span class="ic off" title="Email à enrichir">Mail</span>`;

  return `
    <div class="lrow" onclick="openDetail('${c.id}')">
      <div class="lmain"><span class="lco">${c.entreprise}</span>${dir}</div>
      <div class="lmeta">${c.commune} · ${c.secteur} · ${c.effectif} sal.</div>
      <div class="lstage">
        <select onclick="event.stopPropagation()" onchange="event.stopPropagation();changeStatus('${c.id}',this.value)">${opts}</select>
      </div>
      <div class="lacts" onclick="event.stopPropagation()">
        <a class="ic" href="${li}" target="_blank" rel="noopener" title="Profil / recherche LinkedIn">in</a>
        ${mail}
        <button class="ic" onclick="openLanding('${c.id}','voisins')" title="Ouvrir la landing">Landing</button>
        <button class="ic" onclick="copyLanding('${c.id}','voisins')" title="Copier le lien de la landing">Copier</button>
      </div>
    </div>`;
}

function renderStats(counts) {
  const items = [
    ["À envoyer", counts.mail_a_envoyer || 0],
    ["En attente", counts.mail_envoye || 0],
    ["À relancer / répondu", counts.a_repondu || 0],
    ["Cafés calés", counts.rdv_pris || 0],
    ["Clients", counts.client || 0]
  ];
  document.getElementById("stats").innerHTML = items.map(i =>
    `<div class="stat"><div class="n">${i[1]}</div><div class="k">${i[0]}</div></div>`).join("");
}
