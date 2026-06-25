/* ui.js — utilitaires d'interface : toast + bascule de vues */

const VIEWS = ["boardView", "detailView", "formView"];
function showView(id) {
  VIEWS.forEach(v => {
    const el = document.getElementById(v);
    if (el) el.classList.toggle("hidden", v !== id);
  });
  window.scrollTo(0, 0);
}
function backToBoard() {
  render();
  showView("boardView");
}

let _toastT;
function stub(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(_toastT);
  _toastT = setTimeout(() => t.classList.remove("show"), 2600);
}
