/* board.js — vue Pipeline : liste pleine largeur, recherche + tri + filtres, raccourcis */

function effNum(s) { return parseInt((s || "").replace("≥", "")) || 0; }
function incomplete(c) { return !c.dirigeant; }

// Barre d'outils (rendue une seule fois pour préserver le focus de la recherche)
function renderTools() {
  const tools = document.getElementById("ptools");
  if (!tools) return;
  tools.innerHTML = `
    <div class="psearch-wrap">${ICONS.search}
      <input class="psearch" type="search" value="${SEARCH}"
        placeholder="Rechercher une entreprise, un dirigeant, une commune…" oninput="setSearch(this.value)">
    </div>
    <select class="psort" onchange="setSort(this.value)" aria-label="Trier">
      <option value="">Trier par…</option>
      <option value="entreprise" ${SORT === "entreprise" ? "selected" : ""}>Entreprise (A→Z)</option>
      <option value="commune" ${SORT === "commune" ? "selected" : ""}>Commune</option>
      <option value="effectif" ${SORT === "effectif" ? "selected" : ""}>Effectif (décroissant)</option>
    </select>`;
}

function render() {
  const counts = {};
  LANES.forEach(l => counts[l.id] = 0);
  DATA.forEach(c => counts[c.statut] = (counts[c.statut] || 0) + 1);

  let list = DATA.filter(c => FILTER === "_incomplet" ? incomplete(c) : (!FILTER || c.statut === FILTER));
  if (SEARCH) {
    const q = SEARCH.toLowerCase();
    list = list.filter(c => ((c.entreprise || "") + " " + (c.dirigeant || "") + " " + (c.commune || "") + " " + (c.secteur || "")).toLowerCase().includes(q));
  }
  if (SORT === "entreprise") list = list.slice().sort((a, b) => a.entreprise.localeCompare(b.entreprise, "fr"));
  else if (SORT === "commune") list = list.slice().sort((a, b) => (a.commune || "").localeCompare(b.commune || "", "fr"));
  else if (SORT === "effectif") list = list.slice().sort((a, b) => effNum(b.effectif) - effNum(a.effectif));

  const board = document.getElementById("board");
  board.innerHTML = `
    <div class="plist">
      <div class="lhead">
        <div class="lh-main">Entreprise · dirigeant</div>
        <div class="lh-meta">Localisation · secteur</div>
        <div class="lh-stage">Étape</div>
        <div class="lh-acts">Raccourcis</div>
      </div>
      ${list.length
        ? list.map(rowHtml).join("")
        : `<div class="lempty">${SEARCH || FILTER ? "Aucun prospect ne correspond." : "Aucun prospect."}</div>`}
    </div>`;

  renderFilters(counts);
  if (typeof renderHome === "function") renderHome();
}

function rowHtml(c) {
  const lane = LANES.find(l => l.id === c.statut);
  const opts = LANES.map(l =>
    `<option value="${l.id}" ${l.id === c.statut ? "selected" : ""}>${l.label}</option>`).join("");
  const li = c.linkedin ||
    ("https://www.linkedin.com/search/results/people/?keywords=" +
      encodeURIComponent((c.dirigeant || "") + " " + c.entreprise));
  const dir = c.dirigeant
    ? `<span class="ldir">${c.dirigeant}</span>`
    : `<span class="ldir no-dir">${ICONS.alert}Dirigeant à identifier</span>`;
  const mail = c.email
    ? `<a class="ic" href="mailto:${c.email}" title="Écrire à ${c.email}" onclick="event.stopPropagation()">Mail</a>`
    : `<span class="ic off" title="Email à enrichir">Mail</span>`;

  return `
    <div class="lrow" style="border-left-color:${lane.color}" tabindex="0" role="button" aria-label="${c.entreprise}"
      onclick="openDetail('${c.id}')"
      onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openDetail('${c.id}')}">
      <div class="lmain"><span class="lco">${c.entreprise}</span>${dir}</div>
      <div class="lmeta">${c.commune} · ${c.secteur}</div>
      <div class="lh-stage">
        <span class="lstage" style="background:color-mix(in srgb, ${lane.color} 14%, #fff);border-color:color-mix(in srgb, ${lane.color} 32%, #fff)">
          <span class="sdot" style="background:${lane.color}"></span>
          <select onclick="event.stopPropagation()" onchange="event.stopPropagation();changeStatus('${c.id}',this.value)">${opts}</select>
        </span>
      </div>
      <div class="lacts" onclick="event.stopPropagation()">
        <a class="ic" href="${li}" target="_blank" rel="noopener" title="Profil / recherche LinkedIn">in</a>
        ${mail}
        <button class="ic" onclick="openLanding('${c.id}','voisins')" title="Ouvrir la landing">Landing</button>
        <button class="ic ic-sq" onclick="copyLanding('${c.id}','voisins')" title="Copier le lien de la landing">${ICONS.copy}</button>
      </div>
    </div>`;
}

function renderFilters(counts) {
  let html = `<button class="fchip ${FILTER === null ? "active" : ""}" onclick="setFilter(null)">Tous <b>${DATA.length}</b></button>`;
  LANES.forEach(l => {
    html += `<button class="fchip ${FILTER === l.id ? "active" : ""}" onclick="setFilter('${l.id}')">` +
      `<span class="fdot" style="background:${l.color}"></span>${l.label} <b>${counts[l.id] || 0}</b></button>`;
  });
  const todo = DATA.filter(incomplete).length;
  html += `<button class="fchip todo ${FILTER === "_incomplet" ? "active" : ""}" onclick="setFilter('_incomplet')">` +
    `${ICONS.alert}À compléter <b>${todo}</b></button>`;
  document.getElementById("stats").innerHTML = html;
}
