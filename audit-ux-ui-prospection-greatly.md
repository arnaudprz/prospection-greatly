# Audit UX / UI — Prospection Greatly

État audité : front live sur GitHub Pages (mode démo), le 2026-06-25.
Périmètre : Accueil (funnel), Pipeline (liste), Fiche prospect, Landing café.
Échelle de priorité : **P1** (fort impact / faible effort), **P2** (à planifier), **P3** (finition).

---

## 1. Vue d'ensemble
Points forts :
- Identité visuelle Greatly cohérente (vert #6B7D5C, crème, Fraunces + Inter).
- Mobile-first appliqué partout.
- Parcours clair : Accueil → Pipeline → Fiche → Landing.
- Ton éditorial maîtrisé (chaleureux, sans emoji ni tirets).

Faiblesse transverse :
- En **mode démo**, certaines zones « attendent le backend » et paraissent vides (fil d'échanges), ce qui donne une impression d'inachevé. À cadrer visuellement tant que le backend n'est pas branché.

---

## 2. Accueil — Funnel
**Constats**
- Barres proportionnelles lisibles, couleurs par étape cohérentes avec le rail.
- Les lignes sont cliquables (→ Pipeline filtré) mais l'**affordance est faible** : rien n'indique clairement qu'on peut cliquer.
- Les étapes à 0 affichent une barre vide + « 0% du total » : correct mais visuellement plat.

**Recommandations**
- **P1** Ajouter un indice d'interaction au survol (curseur, légère mise en avant + libellé « Filtrer cette étape »).
- **P2** Une ligne de synthèse en haut (ex. « 74 prospects · 0 RDV ») existe via la sous-ligne ; on pourrait la renforcer (taux de réponse une fois le backend là).

---

## 3. Pipeline — Liste
**Constats**
- Liste pleine largeur dense et efficace ; filtres par étape clairs.
- **Pas de recherche** : retrouver une entreprise parmi ~74 lignes oblige à scroller.
- Raccourci **« in »** peu explicite (sait-on que c'est LinkedIn ? tooltip présent mais discret).
- Beaucoup de contrôles par ligne (select d'étape + 4 raccourcis) → densité élevée, risque de surcharge visuelle.
- **Pas de tri** (commune, effectif, étape).
- Lignes cliquables = `div` avec `onclick` → **non accessibles au clavier**.

**Recommandations**
- **P1** Ajouter un **champ de recherche** (entreprise / dirigeant / commune) en haut de la liste.
- **P1** Rendre les lignes focusables (`role="button"`, `tabindex`, `:focus-visible`).
- **P2** Remplacer « in » par une **icône LinkedIn** (cohérence avec la landing) + libellés au survol.
- **P2** Ajouter un **tri** simple (par étape, commune, effectif).
- **P3** Option d'affichage compact / confortable.

---

## 4. Fiche prospect
**Constats**
- Mise en page façon CRM (échanges au centre, détails à droite, composer Email/WhatsApp) : bonne direction.
- **Déséquilibre en démo** : la colonne « Échanges » (large, 1.7fr) est quasi vide → la fiche paraît inachevée tant que le backend n'envoie pas de vrais échanges.
- Sections en cartes blanches : **hiérarchie nette** (bonne correction récente).
- **Crayon d'édition** par section : utile mais **peu visible** (gris discret) → découvrabilité faible.
- Bloc « Page perso (landing) » sous Identité : clair (Ouvrir / Copier par scénario).
- Champ « Relation LinkedIn » (select) : pertinent, sans risque.

**Recommandations**
- **P1** Tant que le backend n'est pas là : soit **remplir le fil** d'événements qu'on a déjà (ajout du prospect, changements d'étape, envois), soit **réduire la prééminence** de la colonne échanges (ratio 1:1) pour éviter le vide.
- **P1** Renforcer le **crayon** (couleur verte au survol déjà, mais ajouter un libellé « Modifier » au survol / contraste).
- **P2** État vide du fil plus soigné (illustration légère + phrase d'amorce).
- **P2** Bouton **« Enrichir cette fiche »** (API entreprises + Dropcontact via backend) pour combler « à récupérer / à enrichir ».

---

## 5. Landing café (rdv.html)
**Constats**
- Très bon niveau : bandeau, photo Greatly House, accroche personnalisée, chips, CTA agenda, signature à icônes, bandeau adresse + itinéraires, footer + désinscription.
- 4 scénarios = 4 URLs avec **aperçus de partage (Open Graph) dédiés** : excellent pour la prospection.
- **Longueur** : 3 paragraphes (accroche scénario + présentation Greatly + « l'idée tient en une phrase ») → un peu dense sur mobile.
- Photo : recadrage `object-position` à surveiller selon les écrans (la maison doit rester visible).

**Recommandations**
- **P2** Condenser légèrement : fusionner « présentation » et « l'idée tient en une phrase », ou raccourcir.
- **P3** Vérifier le contraste du texte crème/vert (accessibilité AA).
- **P3** Ajouter `alt` descriptifs et `aria-label` sur les liens à icône.

---

## 6. Cohérence & design system
**Constats**
- **Iconographie incohérente** : la landing utilise de jolies icônes SVG ; la liste Pipeline utilise du texte (« in / Mail / Landing / Copier »).
- Couleurs de silos bien réutilisées (funnel, filtres, bordures de cartes).
- Boutons : `.btn` (app) vs `.cta` (landing) — deux systèmes, cohérents chacun de leur côté.

**Recommandations**
- **P2** Unifier l'iconographie (réutiliser les SVG de la landing dans les raccourcis de la liste).
- **P3** Documenter un mini design-system (couleurs, tailles, composants) dans le repo.

---

## 7. Accessibilité (a11y)
- Éléments cliquables en `div`/`onclick` (lignes, funnel, cartes) → **non navigables au clavier**.
- Icônes SVG sans `aria-label` (certaines ont `title`).
- Pas de styles de focus explicites.
- Indication d'étape par pastille de couleur **+ libellé** : OK (pas seulement la couleur).

**Recommandations**
- **P1** Rendre les zones cliquables accessibles (rôle, focus visible).
- **P3** Passe a11y globale (contrastes, aria, navigation clavier).

---

## 8. Synthèse priorisée
**À faire en priorité (P1)**
1. Champ de **recherche** dans le Pipeline.
2. Accessibilité clavier des lignes/cartes cliquables.
3. Rééquilibrer la **fiche** en démo (fil d'échanges vide).
4. Affordance des éléments cliquables (funnel, crayon d'édition).

**Ensuite (P2)**
5. Unifier l'iconographie (icônes dans la liste).
6. Tri + densité de la liste.
7. Condenser la copie de la landing.
8. Bouton « Enrichir la fiche » (préparé pour le backend).

**Finition (P3)**
9. États vides soignés, mini design-system, passe a11y/contrastes.

---

*Note : plusieurs limites (fil d'échanges vide, enrichissement, créneaux réels) se lèvent automatiquement une fois le backend Apps Script branché.*
