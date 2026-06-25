/* store.js — chargement & persistance (démo localStorage ou backend) */

let DATA = [];

function seedData() {
  return SEED.map((r, i) => ({
    id: "p" + i,
    entreprise: r[0], commune: r[1], dirigeant: r[2], secteur: r[3],
    effectif: r[4], forme: r[5], naf: r[6],
    email: "", telephone: "", siren: "", adresse: "",
    linkedin: "", relation_linkedin: "", statut: "mail_a_envoyer", note: ""
  }));
}

function loadData() {
  if (CONFIG.BACKEND_URL) return fetchBackend();
  const saved = localStorage.getItem(STORE_KEY);
  if (saved) {
    try { DATA = JSON.parse(saved); } catch (e) { DATA = seedData(); }
  } else {
    DATA = seedData();
  }
  render();
}

// En mode démo on persiste toute la liste (ajouts compris)
function persist() {
  if (CONFIG.BACKEND_URL) return;
  localStorage.setItem(STORE_KEY, JSON.stringify(DATA));
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
