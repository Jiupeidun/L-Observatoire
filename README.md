# L'Observatoire

Page d'accueil personnelle (nouvel onglet / page de démarrage du navigateur) : **marchés financiers** et **préparation TCF Canada**, le tout en français.

## Contenu

- **Gauche — Finance / Marchés** : tableau Google Sheets en iframe + lien vers Google Actualités (marchés, finance).
- **Droite — TCF Canada** : aide-mémoire PDF (défilable) + tableau des 4 épreuves avec liens vers vos Google Docs.

## Prérequis

1. **Google Sheets**  
   Pour que le tableau s’affiche dans l’iframe, il doit être **publié sur le Web** :  
   Fichier → Partager → Publier sur le Web → Onglet « Intégrer » → publier, puis l’URL utilisée dans le site correspond à votre feuille (déjà configurée dans `app/config.ts`).

2. **PDF TCF Canada**  
   Placez votre fichier PDF (cheatsheets) ici :  
   `public/tcf-canada-cheatsheets.pdf`  
   Le nom doit être exact pour que l’embed fonctionne.

3. **Liens Google Docs (TCF)**  
   Éditez `app/config.ts` et remplacez les URLs par vos vrais liens Google Docs pour les 4 épreuves (compréhension orale/écrite, expression orale/écrite).

## Prérequis techniques

- **Node.js 18+** (recommandé : 20 LTS). Si vous utilisez nvm : `nvm use 20` ou `nvm install 20`.

## Développement

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Build statique (GitHub Pages)

```bash
npm run build
```

Les fichiers statiques sont générés dans le dossier `out/`.  
Si votre site est hébergé à `https://<username>.github.io/L-Observatoire/`, décommentez dans `next.config.mjs` les options `basePath` et `assetPrefix` avec la valeur `'/L-Observatoire'`, puis refaites un build.

## Déploiement sur GitHub Pages

- Branche : en général `main` ou `gh-pages`.
- Dossier source : choisir le dossier **`out`** (ou configurer l’action pour build Next.js puis déployer le contenu de `out`).

Une fois en ligne, utilisez l’URL du site comme page d’accueil ou page de nouvel onglet dans les paramètres de votre navigateur.
