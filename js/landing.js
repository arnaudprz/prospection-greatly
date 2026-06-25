/* landing.js — logique de la page café personnalisée (rdv.html) */

(function () {
  const q = new URLSearchParams(location.search);
  const entreprise = q.get("e") || "";
  const prenom = q.get("p") || "";
  const token = q.get("t") || "";
  const scen = SCENARIOS[q.get("s")] || SCENARIOS.voisins;

  // Accroche selon le scénario (?s=voisins|linkedin|relation|recommande)
  document.getElementById("hello").textContent = prenom ? "Bonjour " + prenom + "," : "Bonjour,";
  document.getElementById("bandRight").textContent = scen.band;
  document.getElementById("subhello").textContent = scen.sub;
  document.getElementById("title").innerHTML = scen.title;
  document.getElementById("lead").textContent = scen.lead(entreprise);

  // Signature
  document.getElementById("meName").textContent = ME.nom;
  document.getElementById("meRole").textContent = ME.role;
  const initials = ME.nom.split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const av = document.getElementById("avatar");
  av.src = ME.photo;
  av.onerror = function () {
    av.replaceWith(Object.assign(document.createElement("div"), { className: "avatar", textContent: initials }));
  };
  const wa = "33" + ME.tel.replace(/\D/g, "").replace(/^0/, "");
  const sv = (p) => `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const IC = {
    mail: sv('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/>'),
    phone: sv('<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>'),
    wa: sv('<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>'),
    in: sv('<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>')
  };
  const sep = '<span class="sep">·</span>';
  document.getElementById("contacts").innerHTML = [
    `<a href="mailto:${ME.email}">${IC.mail}${ME.email}</a>`,
    `<a href="tel:${ME.tel.replace(/\s/g, '')}">${IC.phone}${ME.tel}</a>`,
    `<a href="https://wa.me/${wa}" target="_blank" rel="noopener">${IC.wa}WhatsApp</a>`,
    `<a href="${ME.linkedin}" target="_blank" rel="noopener">${IC.in}LinkedIn</a>`
  ].join(sep);

  // Bouton agenda (principal)
  const ctaAgenda = document.getElementById("ctaAgenda");
  if (ME.agenda) ctaAgenda.href = ME.agenda;
  else ctaAgenda.style.display = "none";

  // Répondre par email
  const subject = encodeURIComponent("Un café entre voisins" + (entreprise ? (" · " + entreprise) : ""));
  const body = encodeURIComponent("Bonjour Arnaud,\n\nAvec plaisir pour un café. Voici mes disponibilités : \n\n");
  document.getElementById("ctaMail").href = `mailto:${ME.email}?subject=${subject}&body=${body}`;

  // Désinscription
  document.getElementById("unsub").href =
    `mailto:${ME.email}?subject=${encodeURIComponent("Désinscription")}&body=${encodeURIComponent("Merci de ne plus me contacter.")}`;

  // Créneaux réels si backend connecté
  if (CONFIG.BACKEND_URL && token) {
    fetch(CONFIG.BACKEND_URL + "?action=slots&token=" + encodeURIComponent(token))
      .then(r => r.json()).then(d => {
        if (d.slots && d.slots.length) {
          ctaAgenda.style.display = "none";
          document.getElementById("ctaMail").style.display = "none";
          document.getElementById("slots").innerHTML = d.slots.map(s =>
            `<button class="slot" onclick="book('${s.iso}','${s.label}')">${s.label}</button>`).join("");
        }
      }).catch(() => {});
  }

  window.book = function (iso, label) {
    fetch(CONFIG.BACKEND_URL, { method: "POST", body: JSON.stringify({ action: "book", token, iso }) })
      .then(r => r.json()).then(() => {
        document.getElementById("booking").innerHTML =
          `<p class="lead">C'est noté pour <b>${label}</b>. Vous recevrez une confirmation par mail, on se voit à la Greatly House. À très vite !</p>`;
      });
  };
})();
