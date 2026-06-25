# Prospection · Greatly

Outil de prospection « entre voisins entrepreneurs » : rail de tri (kanban), fiches
prospects détaillées, invitations mail et landing café personnalisée connectée à l'agenda.

Stack alignée sur l'existant Greatly : **front statique (GitHub Pages) + backend Google
Apps Script + base Google Sheet**. Aux couleurs Greatly. Code **partitionné** pour être
facile à maintenir.

## Structure
```
index.html              app admin (rail de tri + fiches)
rdv.html                landing café personnalisée
css/
  theme.css             charte Greatly + base partagée
  app.css               styles de l'app admin
  landing.css           styles de la landing
js/
  config.js             constantes + coordonnées (ME)
  data.js               liste des prospects
  store.js              chargement / persistance
  ui.js                 utilitaires (toast)
  board.js              rail de tri (kanban + drag & drop)
  drawer.js             fiche prospect détaillée
  app.js                point d'entrée
  landing.js            logique de la landing
apps-script/            backend (un fichier par responsabilité)
  Config.gs WebApp.gs Contacts.gs Mail.gs Calendar.gs AI.gs Setup.gs
```

## Voir en démo
Ouvrir `index.html` : le rail s'affiche avec les ~75 prospects, drag & drop entre
colonnes, fiche détaillée au clic, notes/étapes sauvegardées en local. Aucun backend requis.

## Déployer

### Front (GitHub Pages)
Déjà publié via GitHub Pages (branche `main`). Les modifs poussées sont en ligne automatiquement.

### Backend (Apps Script) — dans le compte Google d'Arnaud
1. Créer un projet Apps Script, y coller les fichiers de `apps-script/`.
2. `Propriétés du script` : `SHEET_ID` (ID d'un Google Sheet vide) et `CLAUDE_API_KEY`.
3. Lancer `setup()` → `importContacts()` → `installTriggers()`.
4. `Déployer > Application Web` : *exécuter en tant que moi*, *accès : tout le monde*.
5. Copier l'URL `/exec` dans `js/config.js` → `CONFIG.BACKEND_URL`.

> L'app tourne sous le compte Google d'Arnaud : Gmail, Agenda et Sheets sont natifs,
> aucun OAuth à gérer.

## Coordonnées (js/config.js → ME)
Nom, email, téléphone, LinkedIn, photo et lien de prise de RDV agenda. Modifiables à un
seul endroit.

## À enrichir
- SIREN / adresse via l'API recherche-entreprises (data.gouv).
- Emails des dirigeants via Dropcontact.
- RGPD : lien de désinscription + mention de provenance dans les mails.
