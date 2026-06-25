/* form.js — ajout d'un prospect en pleine page */

function openForm() {
  const laneOpts = LANES.map(l => `<option value="${l.id}">${l.label}</option>`).join("");
  document.getElementById("formView").innerHTML = `
    <div class="page">
      <button class="back-btn" onclick="showView('boardView')">← Annuler</button>
      <div class="page-head"><h1>Ajouter un prospect</h1>
        <div class="sub">Seul le nom de l'entreprise est obligatoire.</div></div>

      <div class="detail-grid">
        <div class="section">
          <div class="stitle">Entreprise</div>
          <label class="fl">Raison sociale *</label><input id="f_entreprise" placeholder="Ex. Boulangerie Dupont">
          <label class="fl">Commune</label><input id="f_commune" placeholder="Ex. Verlinghem">
          <label class="fl">Secteur</label><input id="f_secteur" placeholder="Ex. Boulangerie">
          <label class="fl">Effectif</label><input id="f_effectif" placeholder="Ex. 10-19">
          <label class="fl">Forme juridique</label><input id="f_forme" placeholder="Ex. SARL">
          <label class="fl">Activité (NAF)</label><input id="f_naf" placeholder="Ex. 10.71C">
        </div>
        <div class="section">
          <div class="stitle">Dirigeant & contact</div>
          <label class="fl">Dirigeant</label><input id="f_dirigeant" placeholder="Ex. Marie Dupont">
          <label class="fl">Email</label><input id="f_email" placeholder="prenom@entreprise.fr">
          <label class="fl">Téléphone</label><input id="f_telephone" placeholder="06 …">
          <label class="fl">LinkedIn</label><input id="f_linkedin" placeholder="https://www.linkedin.com/in/…">
          <label class="fl">Étape de départ</label><select id="f_statut">${laneOpts}</select>
        </div>
      </div>

      <div class="section">
        <div class="stitle">Notes</div>
        <textarea id="f_note" placeholder="Contexte, comment vous vous connaissez…"></textarea>
      </div>

      <div class="actions actions-row">
        <button class="btn btn-primary" onclick="saveProspect()">+ Ajouter le prospect</button>
        <button class="btn btn-ghost" onclick="showView('boardView')">Annuler</button>
      </div>
    </div>`;
  showView("formView");
}

function saveProspect() {
  const get = id => (document.getElementById(id).value || "").trim();
  const entreprise = get("f_entreprise");
  if (!entreprise) { stub("Le nom de l'entreprise est obligatoire"); return; }
  DATA.unshift({
    id: "u" + Date.now(),
    entreprise: entreprise,
    commune: get("f_commune"),
    dirigeant: get("f_dirigeant"),
    secteur: get("f_secteur") || "—",
    effectif: get("f_effectif") || "—",
    forme: get("f_forme"),
    naf: get("f_naf"),
    email: get("f_email"),
    telephone: get("f_telephone"),
    linkedin: get("f_linkedin"),
    siren: "", adresse: "",
    statut: document.getElementById("f_statut").value,
    note: get("f_note")
  });
  persist();
  backToBoard();
  stub("Prospect ajouté ✅");
}
