# Unlock Arena — projet prêt à déployer

Ce dossier est le jeu **Unlock Arena** emballé dans un projet React (Vite) complet.
Il est prêt à être mis en ligne **gratuitement sur Vercel**. Aucune ligne de commande nécessaire.

## Ce qu'il y a dans le dossier
- `index.html` — la page (titre, SEO, Open Graph déjà réglés)
- `src/UnlockArena.jsx` — le jeu (ton fichier, intact)
- `src/main.jsx` — le petit bout qui lance le jeu
- `package.json` / `vite.config.js` — la config technique
- `.gitignore` — pour ne pas envoyer les fichiers inutiles

## Mise en ligne (en clics)

### Étape 1 — Mettre le code sur GitHub
Le plus simple avec **GitHub Desktop** (gratuit, interface graphique) :
1. Installe GitHub Desktop et connecte ton compte.
2. Fichier → « Ajouter un dépôt local » → choisis ce dossier `unlock-arena`.
3. Il propose de créer un dépôt ici → accepte.
4. Clique « Publier le dépôt » (Publish repository). Laisse-le en privé ou public, au choix.

### Étape 2 — Déployer sur Vercel
1. Va sur vercel.com, connecte-toi avec GitHub.
2. « Add New… » → « Project ».
3. Importe le dépôt `unlock-arena`.
4. Vercel détecte Vite tout seul. Clique « Deploy ».
5. Au bout d'une minute, tu as une URL en direct. C'est en ligne.

### Étape 3 (plus tard) — Brancher ton domaine
Dans Vercel → Settings → Domains, tu pourras ajouter par ex. `arena.unlockalert.app`
(un sous-domaine, pour ne pas toucher au site principal). On verra ça ensemble.

## Pour tester sur ton Mac avant (optionnel)
Dans un terminal, dans ce dossier : `npm install` puis `npm run dev`.
Mais ce n'est pas obligatoire — Vercel s'occupe de tout.
