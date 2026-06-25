/* ui.js — petits utilitaires d'interface */

let _toastT;
function stub(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(_toastT);
  _toastT = setTimeout(() => t.classList.remove("show"), 2600);
}
