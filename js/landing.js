/* landing.js — logique de la page café personnalisée (rdv.html) */

(function () {
  const q = new URLSearchParams(location.search);
  const entreprise = q.get("e") || "";
  const prenom = q.get("p") || "";
  const token = q.get("t") || "";

  // Personnalisation du message
  if (prenom) document.getElementById("hello").textContent = "Bonjour " + prenom + ",";
  document.getElementById("lead").textContent = entreprise
    ? "On est quasi voisins — vous chez " + entreprise + ", moi chez Greatly, à quelques rues l'un de l'autre. Entre dirigeants du même coin, on gagnerait à se connaître."
    : "On est quasi voisins, et entre dirigeants du même coin, on gagnerait à se connaître.";

  // Signature / contact
  document.getElementById("meName").textContent = ME.nom;
  document.getElementById("meRole").textContent = ME.role;
  const av = document.getElementById("avatar");
  av.src = ME.photo;
  av.onerror = function () {
    av.replaceWith(Object.assign(document.createElement("div"), { className: "avatar", textContent: ME.nom[0] }));
  };
  document.getElementById("contacts").innerHTML =
    `<a href="mailto:${ME.email}">✉️ ${ME.email}</a>` +
    `<a href="tel:${ME.tel.replace(/\s/g, '')}">📞 ${ME.tel}</a>` +
    `<a href="${ME.linkedin}" target="_blank" rel="noopener">in LinkedIn</a>`;

  // Bouton mailto
  const subject = encodeURIComponent("Un café entre voisins" + (entreprise ? (" — " + entreprise) : ""));
  const body = encodeURIComponent("Bonjour Arnaud,\n\nAvec plaisir pour un café. Voici mes disponibilités : \n\n");
  document.getElementById("ctaMail").href = `mailto:${ME.email}?subject=${subject}&body=${body}`;

  // Bouton agenda (principal)
  const ctaAgenda = document.getElementById("ctaAgenda");
  if (ME.agenda) ctaAgenda.href = ME.agenda;
  else ctaAgenda.style.display = "none";

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
          `<p class="lead">C'est noté pour <b>${label}</b> ☕ Vous recevrez une confirmation par mail avec le lien visio. À très vite !</p>`;
      });
  };
})();
