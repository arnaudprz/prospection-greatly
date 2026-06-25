/* ui.js — utilitaires d'interface : toast + bascule de vues */

const VIEWS = ["homeView", "boardView", "detailView", "formView"];
function showView(id) {
  VIEWS.forEach(v => {
    const el = document.getElementById(v);
    if (el) el.classList.toggle("hidden", v !== id);
  });
  window.scrollTo(0, 0);
}
function setNav(active) {
  const h = document.getElementById("navHome"), b = document.getElementById("navBoard");
  if (h) h.classList.toggle("active", active === "home");
  if (b) b.classList.toggle("active", active === "board");
}
let FILTER = null;                         // étape filtrée dans le Pipeline (null = toutes)
function setFilter(id) { FILTER = id; render(); }

function goHome() { renderHome(); showView("homeView"); setNav("home"); }
function goBoard(lane) { FILTER = lane || null; render(); showView("boardView"); setNav("board"); }
function backToBoard() { render(); showView("boardView"); setNav("board"); }

let _toastT;
function stub(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(_toastT);
  _toastT = setTimeout(() => t.classList.remove("show"), 2600);
}
