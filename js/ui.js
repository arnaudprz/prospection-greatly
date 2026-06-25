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
function goHome() { renderHome(); showView("homeView"); setNav("home"); }
function goBoard() { render(); showView("boardView"); setNav("board"); }
function backToBoard() { goBoard(); }

let _toastT;
function stub(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(_toastT);
  _toastT = setTimeout(() => t.classList.remove("show"), 2600);
}
