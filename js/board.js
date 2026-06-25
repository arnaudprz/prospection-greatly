/* board.js — rendu du rail de tri (kanban) + drag & drop + compteurs */

function render() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  const counts = {};
  LANES.forEach(l => counts[l.id] = 0);
  DATA.forEach(c => counts[c.statut] = (counts[c.statut] || 0) + 1);

  LANES.forEach(lane => {
    const el = document.createElement("div");
    el.className = "lane";
    el.dataset.lane = lane.id;
    el.innerHTML =
      `<div class="lane-head"><span class="dot" style="background:${lane.color}"></span>` +
      `<b>${lane.label}</b><span class="count">${counts[lane.id] || 0}</span></div>` +
      `<div class="lane-body"></div>`;
    const body = el.querySelector(".lane-body");
    DATA.filter(c => c.statut === lane.id).forEach(c => body.appendChild(cardEl(c, lane.color)));
    addDnd(el);
    board.appendChild(el);
  });
  renderStats(counts);
}

function cardEl(c, color) {
  const d = document.createElement("div");
  d.className = "card";
  d.draggable = true;
  d.dataset.id = c.id;
  d.style.borderLeftColor = color;
  const dir = c.dirigeant
    ? `<div class="dir">${c.dirigeant}</div>`
    : `<div class="dir no-dir">Dirigeant à identifier</div>`;
  d.innerHTML =
    `<div class="co">${c.entreprise}</div>${dir}` +
    `<div class="meta"><span class="pill">${c.commune}</span>` +
    `<span class="pill">${c.secteur}</span><span class="pill">${c.effectif} sal.</span></div>`;
  d.addEventListener("dragstart", e => { e.dataTransfer.setData("id", c.id); d.classList.add("dragging"); });
  d.addEventListener("dragend", () => d.classList.remove("dragging"));
  d.addEventListener("click", () => openDrawer(c.id));
  return d;
}

function addDnd(lane) {
  lane.addEventListener("dragover", e => { e.preventDefault(); lane.classList.add("drag-over"); });
  lane.addEventListener("dragleave", () => lane.classList.remove("drag-over"));
  lane.addEventListener("drop", e => {
    e.preventDefault();
    lane.classList.remove("drag-over");
    const c = DATA.find(x => x.id === e.dataTransfer.getData("id"));
    if (c) { c.statut = lane.dataset.lane; persist(); render(); }
  });
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
