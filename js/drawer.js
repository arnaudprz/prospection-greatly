/* drawer.js — fiche prospect détaillée (panneau latéral) */

function v(val, placeholder) {
  return val
    ? `<span class="v">${val}</span>`
    : `<span class="v empty">${placeholder || "à enrichir"}</span>`;
}

function linkedinSearch(c) {
  return "https://www.linkedin.com/search/results/people/?keywords=" +
    encodeURIComponent((c.dirigeant || "") + " " + c.entreprise);
}

function openLanding(id) {
  const c = DATA.find(x => x.id === id);
  const prenom = (c.dirigeant || "").split(/[ \/]/)[0];
  const url = "rdv.html?e=" + encodeURIComponent(c.entreprise) + "&p=" + encodeURIComponent(prenom);
  window.open(url, "_blank");
}

function openDrawer(id) {
  const c = DATA.find(x => x.id === id);
  const opts = LANES.map(l =>
    `<option value="${l.id}" ${l.id === c.statut ? "selected" : ""}>${l.label}</option>`).join("");
  const linkedin = c.linkedin
    ? `<a href="${c.linkedin}" target="_blank" rel="noopener" style="color:var(--l2)">Voir le profil ↗</a>`
    : `<a href="${linkedinSearch(c)}" target="_blank" rel="noopener" style="color:var(--l2)">🔍 Rechercher sur LinkedIn</a>`;

  document.getElementById("drawerBody").innerHTML = `
    <h2>${c.entreprise}</h2>
    <div class="sub">${c.commune} · ${c.secteur}</div>

    <div class="statusbox">
      <label>Étape du suivi</label>
      <select onchange="changeStatus('${c.id}',this.value)">${opts}</select>
    </div>

    <div class="section">
      <div class="stitle">Identité</div>
      <div class="row"><span class="k">Raison sociale</span><span class="v">${c.entreprise}</span></div>
      <div class="row"><span class="k">Forme juridique</span>${v(c.forme)}</div>
      <div class="row"><span class="k">Activité (NAF)</span>${v(c.naf)}</div>
      <div class="row"><span class="k">Effectif</span><span class="v">${c.effectif} salariés</span></div>
      <div class="row"><span class="k">SIREN</span>${v(c.siren, "à récupérer (API entreprises)")}</div>
    </div>

    <div class="section">
      <div class="stitle">Dirigeant</div>
      <div class="row"><span class="k">Nom</span>${v(c.dirigeant, "à identifier")}</div>
      <div class="row"><span class="k">Rôle</span><span class="v">Dirigeant</span></div>
      <div class="row"><span class="k">LinkedIn</span><span class="v">${linkedin}</span></div>
      <input style="margin-top:6px" placeholder="Coller l'URL du profil LinkedIn…"
             value="${c.linkedin || ''}" onblur="saveField('${c.id}','linkedin',this.value)">
    </div>

    <div class="section">
      <div class="stitle">Contact</div>
      <div class="row"><span class="k">Email</span>${v(c.email, "à enrichir (Dropcontact)")}</div>
      <div class="row"><span class="k">Téléphone</span>${v(c.telephone)}</div>
    </div>

    <div class="section">
      <div class="stitle">Localisation</div>
      <div class="row"><span class="k">Commune</span><span class="v">${c.commune}</span></div>
      <div class="row"><span class="k">Adresse</span>${v(c.adresse, "à récupérer")}</div>
    </div>

    <div class="section">
      <div class="stitle">Notes</div>
      <textarea placeholder="Tes notes sur ce prospect…"
                onblur="saveField('${c.id}','note',this.value)">${c.note || ""}</textarea>
    </div>

    <div class="actions">
      <button class="btn btn-primary" onclick="stub('Brouillon « café entre voisins » généré par Claude')">✍️ Rédiger l'invitation (IA)</button>
      <button class="btn btn-ghost" onclick="openLanding('${c.id}')">🔗 Ouvrir sa page perso (café)</button>
      <button class="btn btn-ghost" onclick="stub('Ouverture du fil d\\'échange')">✉️ Voir les échanges</button>
    </div>

    <div class="section">
      <div class="stitle">Historique</div>
      <div class="hist"><span>•</span> Importé depuis la liste 5 km · Verlinghem</div>
      <div class="hist"><span>•</span> Étape actuelle : ${LANES.find(l => l.id === c.statut).label}</div>
    </div>

    <p class="hint">Les champs « à enrichir » seront remplis automatiquement par le backend
      (API entreprises + Dropcontact). Actions Gmail / Agenda / IA à brancher sur Apps Script.</p>`;

  document.getElementById("drawer").classList.add("open");
  document.getElementById("drawerBg").classList.add("open");
}

function changeStatus(id, val) {
  const c = DATA.find(x => x.id === id);
  c.statut = val; persist(); render();
}
function saveField(id, field, val) {
  const c = DATA.find(x => x.id === id);
  c[field] = val; persist(); stub("Enregistré");
}
function closeDrawer() {
  document.getElementById("drawer").classList.remove("open");
  document.getElementById("drawerBg").classList.remove("open");
}
