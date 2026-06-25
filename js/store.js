/* store.js — chargement & persistance des données (démo localStorage ou backend) */

let DATA = [];

function loadData() {
  if (CONFIG.BACKEND_URL) return fetchBackend();
  const saved = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
  DATA = SEED.map((r, i) => ({
    id: "p" + i,
    entreprise: r[0], commune: r[1], dirigeant: r[2], secteur: r[3],
    effectif: r[4], forme: r[5], naf: r[6],
    email: "", telephone: "", siren: "", adresse: "",
    linkedin: (saved[i] && saved[i].l) || "",
    statut: (saved[i] && saved[i].s) || "mail_a_envoyer",
    note: (saved[i] && saved[i].n) || ""
  }));
  render();
}

function persist() {
  if (CONFIG.BACKEND_URL) return; // le backend persiste côté Sheet
  const map = {};
  DATA.forEach((c, i) => map[i] = { s: c.statut, n: c.note, l: c.linkedin });
  localStorage.setItem(STORE_KEY, JSON.stringify(map));
}

async function fetchBackend() {
  try {
    const r = await fetch(CONFIG.BACKEND_URL + "?action=list");
    const j = await r.json();
    DATA = j.contacts;
    render();
    const b = document.getElementById("modeBadge");
    if (b) {
      b.textContent = "Connecté · Google Sheet";
      b.style.cssText = "background:#E6F5F0;color:#0D7C5F;border-color:#BfE8DA";
    }
  } catch (e) {
    CONFIG.BACKEND_URL = "";
    loadData();
    stub("Backend injoignable — repli mode démo");
  }
}
