/* home.js — page d'accueil : funnel du pipeline (inspiré ChartMogul, couleurs Greatly).
   N'utilise QUE les données existantes : compteurs par étape du rail. */

function renderHome() {
  const host = document.getElementById("homeView");
  if (!host) return;

  const counts = {};
  LANES.forEach(l => counts[l.id] = 0);
  DATA.forEach(c => counts[c.statut] = (counts[c.statut] || 0) + 1);

  const total = DATA.length || 1;
  const max = Math.max(1, ...LANES.map(l => counts[l.id] || 0));
  const cafes = counts.rdv_pris || 0;

  const rows = LANES.map(l => {
    const n = counts[l.id] || 0;
    const w = Math.round((n / max) * 100);
    const pct = Math.round((n / total) * 100);
    return `
      <div class="funnel-row" onclick="goBoard()">
        <div class="fbar" style="border-left:4px solid ${l.color}">
          <div class="ffill" style="width:${w}%;background:color-mix(in srgb, ${l.color} 20%, #fff)"></div>
          <span class="flabel">${l.label}</span>
        </div>
        <div class="fcount">${n}</div>
        <div class="fpct">${pct}% du total</div>
      </div>`;
  }).join("");

  host.innerHTML = `
    <div class="page">
      <div class="home-head">
        <h1>Pipeline de prospection</h1>
        <div class="sub">${DATA.length} prospects suivis · ${cafes} café(s) calé(s)</div>
      </div>
      <div class="funnel">${rows}</div>
      <p class="hint">Cliquez sur une étape pour ouvrir le rail de tri.</p>
    </div>`;
}
