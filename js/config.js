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
  { id: "a_repondu",      label: "A répondu / à relancer",     color: "var(--l3)" },
  { id: "rdv_pris",       label: "Café calé",                  color: "var(--l4)" },
  { id: "client",         label: "Client",                     color: "var(--l5)" },
  { id: "perdu",          label: "Perdu / pas intéressé",      color: "var(--l6)" }
];

const STORE_KEY = "greatly_prospection_v3";
