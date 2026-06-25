/* app.js — point d'entrée de l'app admin */
renderTools();       // barre recherche + tri (rendue une fois)
loadData();          // construit DATA + rend le board + le funnel d'accueil
goHome();            // accueil par défaut
document.getElementById("addBtn").addEventListener("click", openForm);
