/* config.js — constantes & coordonnées (modifiables ici, à un seul endroit) */

// URL du backend Apps Script (/exec). Vide = mode démo (données locales).
const CONFIG = { BACKEND_URL: "" };

// Coordonnées d'Arnaud, utilisées par la landing café (rdv.html)
const ME = {
  nom: "Arnaud Przybylski",
  role: "Fondateur de Greatly · Verlinghem",
  email: "arnaudprz@gmail.com",
  tel: "06 51 15 63 44",
  linkedin: "https://www.linkedin.com/in/przybylski-arnaud/",
  photo: "https://greatly.club/greatly-equipe-arnaud-przybylski-fondateur.jpg",
  agenda: "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2Tuvjlnb80nm25RucpLC6G2cYwT6oTRYL0GFjJA4Ese6IQpW9hXRvCdk2KJl6I6IbA-hQDH3pL"
};

// Colonnes du rail de tri
const LANES = [
  { id: "mail_a_envoyer", label: "Mail à envoyer",             color: "var(--l1)" },
  { id: "mail_envoye",    label: "Mail envoyé",                color: "var(--l2)" },
  { id: "linkedin_envoye",label: "Message LinkedIn envoyé",    color: "var(--l7)" },
  { id: "a_repondu",      label: "A répondu / à relancer",     color: "var(--l3)" },
  { id: "rdv_pris",       label: "Café calé",                  color: "var(--l4)" },
  { id: "client",         label: "Client",                     color: "var(--l5)" },
  { id: "perdu",          label: "Perdu / pas intéressé",      color: "var(--l6)" }
];

const STORE_KEY = "greatly_prospection_v3";

/* Scénarios de landing : chaque clé = une URL (?s=cle) avec sa propre accroche */
const SCENARIOS = {
  voisins: {
    name: "Voisins",
    band: "Verlinghem · à quelques minutes de chez vous",
    sub: "on ne se connaît pas encore, mais on est presque voisins.",
    title: 'Et si on prenait un café, <span class="amp">entre voisins</span> ?',
    lead: function (e) {
      return e
        ? "Vous dirigez " + e + ", je dirige Greatly, à quelques rues l'un de l'autre. Deux dirigeants du même coin qui gagneraient sûrement à se connaître."
        : "Vous et moi dirigeons chacun notre entreprise, à quelques rues l'un de l'autre. Deux dirigeants du même coin qui gagneraient sûrement à se connaître.";
    }
  },
  linkedin: {
    name: "LinkedIn",
    band: "Greatly · Verlinghem",
    sub: "nos chemins se sont croisés sur LinkedIn.",
    title: 'Et si on transformait LinkedIn en <span class="amp">vrai café</span> ?',
    lead: function (e) {
      return e
        ? "On peut continuer à échanger derrière un écran, mais un vrai café vaut mille messages. Vous dirigez " + e + ", je dirige Greatly, juste à côté."
        : "On peut continuer à échanger derrière un écran, mais un vrai café vaut mille messages. Je dirige Greatly, juste à côté.";
    }
  },
  relation: {
    name: "Mise en relation",
    band: "Greatly · Verlinghem",
    sub: "on nous a mis en relation, et l'idée me plaît beaucoup.",
    title: 'Et si on prenait un café, <span class="amp">pour faire connaissance</span> ?',
    lead: function (e) {
      return e
        ? "On nous a mis en relation, et je m'en réjouis. Vous dirigez " + e + ", je dirige Greatly. Prenons le temps d'un café pour découvrir nos univers."
        : "On nous a mis en relation, et je m'en réjouis. Je dirige Greatly. Prenons le temps d'un café pour découvrir nos univers.";
    }
  },
  recommande: {
    name: "On m'a parlé de vous",
    band: "Greatly · Verlinghem",
    sub: "on m'a parlé de vous, en très bons termes.",
    title: 'On m\'a parlé de vous. <span class="amp">Un café</span> ?',
    lead: function (e) {
      return e
        ? "Plusieurs personnes m'ont parlé de vous et de " + e + " avec beaucoup d'enthousiasme. Je dirige Greatly, juste à côté, et j'aimerais beaucoup vous rencontrer."
        : "Plusieurs personnes m'ont parlé de vous avec beaucoup d'enthousiasme. Je dirige Greatly, juste à côté, et j'aimerais beaucoup vous rencontrer.";
    }
  }
};
