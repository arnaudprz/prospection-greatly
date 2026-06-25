/* landing.js — logique de la page café personnalisée (rdv.html) */

(function () {
  const q = new URLSearchParams(location.search);
  const entreprise = q.get("e") || "";
  const prenom = q.get("p") || "";
  const token = q.get("t") || "";

  // Personnalisation
  document.getElementById("hello").textContent = prenom ? "Bonjour " + prenom + "," : "Bonjour,";
  document.getElementById("lead").textContent = entreprise
    ? "Vous dirigez " + entreprise + ", je dirige Greatly, à quelques rues l'un de l'autre. Deux dirigeants du même coin qui gagneraient sûrement à se connaître."
    : "Vous et moi dirigeons chacun notre entreprise, à quelques rues l'un de l'autre. Deux dirigeants du même coin qui gagneraient sûrement à se connaître.";

  // Signature
  document.getElementById("meName").textContent = ME.nom;
  document.getElementById("meRole").textContent = ME.role;
  const initials = ME.nom.split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const av = document.getElementById("avatar");
  av.src = ME.photo;
  av.onerror = function () {
    av.replaceWith(Object.assign(document.createElement("div"), { className: "avatar", textContent: initials }));
  };
  document.getElementById("contacts").innerHTML =
    `<a href="mailto:${ME.email}">${ME.email}</a>` +
    `<a href="tel:${ME.tel.replace(/\s/g, '')}">${ME.tel}</a>` +
    `<a href="${ME.linkedin}" target="_blank" rel="noopener">LinkedIn</a>`;

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
