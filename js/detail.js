/* detail.js — fiche prospect en pleine page, chaque section éditable (crayon) */

const PENCIL = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';

const DETAIL_SECTIONS = [
  { key: "identite", title: "Identité", fields: [
    { k: "entreprise", label: "Raison sociale", ph: "—" },
    { k: "forme", label: "Forme juridique" },
    { k: "naf", label: "Activité (NAF)" },
    { k: "effectif", label: "Effectif" },
    { k: "siren", label: "SIREN", ph: "à récupérer" }
  ] },
  { key: "dirigeant", title: "Dirigeant", fields: [
    { k: "dirigeant", label: "Nom", ph: "à identifier" },
    { k: "linkedin", label: "LinkedIn" }
  ] },
  { key: "contact", title: "Contact", fields: [
    { k: "email", label: "Email", ph: "à enrichir" },
    { k: "telephone", label: "Téléphone" }
  ] },
  { key: "localisation", title: "Localisation", fields: [
    { k: "commune", label: "Commune" },
    { k: "adresse", label: "Adresse", ph: "à récupérer" }
  ] }
];
let EDIT_SECTION = null;

function v(val, ph) {
  return val ? `<span class="v">${val}</span>` : `<span class="v empty">${ph || "à renseigner"}</span>`;
}
function esc(s) { return (s || "").replace(/"/g, "&quot;"); }
function linkedinSearch(c) {
  return "https://www.linkedin.com/search/results/people/?keywords=" +
    encodeURIComponent((c.dirigeant || "") + " " + c.entreprise);
}
function landingUrl(c, s) {
  const u = new URL("rdv.html", location.href);
  u.searchParams.set("e", c.entreprise);
  const prenom = (c.dirigeant || "").split(/[ \/]/)[0];
  if (prenom) u.searchParams.set("p", prenom);
  u.searchParams.set("s", s);
  return u.href;
}
function openLanding(id, s) { window.open(landingUrl(DATA.find(x => x.id === id), s), "_blank"); }
function copyLanding(id, s) {
  const url = landingUrl(DATA.find(x => x.id === id), s);
  if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => stub("Lien copié"), () => prompt("Copier le lien :", url));
  else prompt("Copier le lien :", url);
}

function sectionHtml(c, sec) {
  const editing = EDIT_SECTION === sec.key;
  const head = `<div class="stitle stitle-row"><span>${sec.title}</span>` +
    (editing ? "" : `<button class="pen" onclick="editSection('${c.id}','${sec.key}')" title="Modifier">${PENCIL}</button>`) +
    `</div>`;

  if (editing) {
    const inputs = sec.fields.map(f =>
      `<label class="fl">${f.label}</label><input id="fe_${f.k}" value="${esc(c[f.k])}" placeholder="${f.ph || f.label}">`).join("");
    return `<div class="section">${head}${inputs}
      <div class="edit-actions">
        <button class="btn btn-primary mini-btn" onclick="saveSection('${c.id}','${sec.key}')">Enregistrer</button>
        <button class="btn btn-ghost mini-btn" onclick="cancelEdit('${c.id}')">Annuler</button>
      </div></div>`;
  }

  const rows = sec.fields.map(f => {
    if (f.k === "linkedin") {
      const link = c.linkedin
        ? `<a href="${c.linkedin}" target="_blank" rel="noopener" style="color:var(--l2)">Voir le profil ↗</a>`
        : `<a href="${linkedinSearch(c)}" target="_blank" rel="noopener" style="color:var(--l2)">Rechercher sur LinkedIn</a>`;
      return `<div class="row"><span class="k">${f.label}</span><span class="v">${link}</span></div>`;
    }
    return `<div class="row"><span class="k">${f.label}</span>${v(c[f.k], f.ph)}</div>`;
  }).join("");
  return `<div class="section">${head}${rows}</div>`;
}

function renderDetail(c) {
  const opts = LANES.map(l =>
    `<option value="${l.id}" ${l.id === c.statut ? "selected" : ""}>${l.label}</option>`).join("");

  document.getElementById("detailView").innerHTML = `
    <div class="page">
      <button class="back-btn" onclick="backToBoard()">← Retour à la liste</button>

      <div class="page-head">
        <h1>${c.entreprise}</h1>
        <div class="sub">${c.commune} · ${c.secteur} · ${c.effectif} salariés</div>
      </div>

      <div class="statusbox">
        <label>Étape du suivi</label>
        <select onchange="changeStatus('${c.id}',this.value)">${opts}</select>
      </div>

      <div class="detail-grid">
        ${DETAIL_SECTIONS.map(s => sectionHtml(c, s)).join("")}
      </div>

      <div class="section">
        <div class="stitle">Notes</div>
        <textarea placeholder="Tes notes sur ce prospect…" onblur="saveField('${c.id}','note',this.value)">${c.note || ""}</textarea>
      </div>

      <div class="section">
        <div class="stitle">Page perso (landing) · un lien par scénario</div>
        ${Object.keys(SCENARIOS).map(s => `
          <div class="scen-row">
            <span class="scen-name">${SCENARIOS[s].name}</span>
            <span class="scen-acts">
              <button class="mini" onclick="openLanding('${c.id}','${s}')">Ouvrir</button>
              <button class="mini" onclick="copyLanding('${c.id}','${s}')">Copier le lien</button>
            </span>
          </div>`).join("")}
      </div>

      <div class="actions actions-row">
        <button class="btn btn-primary" onclick="stub('Brouillon « café entre voisins » généré par Claude')">Rédiger l'invitation (IA)</button>
        <button class="btn btn-ghost" onclick="stub('Ouverture du fil d\\'échange')">Voir les échanges</button>
      </div>
    </div>`;
}

function openDetail(id) {
  EDIT_SECTION = null;
  renderDetail(DATA.find(x => x.id === id));
  showView("detailView");
}
function editSection(id, key) { EDIT_SECTION = key; renderDetail(DATA.find(x => x.id === id)); }
function cancelEdit(id) { EDIT_SECTION = null; renderDetail(DATA.find(x => x.id === id)); }
function saveSection(id, key) {
  const c = DATA.find(x => x.id === id);
  const sec = DETAIL_SECTIONS.find(s => s.key === key);
  sec.fields.forEach(f => { const el = document.getElementById("fe_" + f.k); if (el) c[f.k] = el.value.trim(); });
  EDIT_SECTION = null;
  persist();
  if (typeof render === "function") render();
  renderDetail(c);
  stub("Enregistré");
}

function changeStatus(id, val) {
  const c = DATA.find(x => x.id === id);
  c.statut = val; persist();
  if (typeof render === "function") render();
  stub("Étape mise à jour");
}
function saveField(id, field, val) {
  const c = DATA.find(x => x.id === id);
  c[field] = val; persist(); stub("Enregistré");
}
