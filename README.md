# Senior Bon Plan

**Conseils pour bien vivre après 60 ans** 🌻

Application de l'écosystème [alphabette.fr](https://alphabette.fr) : les meilleures
astuces, recommandations et bonnes adresses — santé, démarches, numérique,
transports, loisirs — sélectionnées et votées par des seniors, pour des seniors.
Sans pub, sans compte obligatoire, sans données transmises ailleurs.

- 🔗 **Domaine final** : https://www.bonplansenior.alphabette.fr (GitHub Pages +
  domaine personnalisé, défini par `public/CNAME`).
- 🎨 Identité : accent #D4622A, polices Fraunces + Nunito, ergonomie lisée pour
  les seniors (gros outils, cibles larges, densité faible).
- 🧱 Base commune <AppShell> : les deux barres du haut (écosystème +
  application), le thème jour/nuit, la densité (BIG) et le plein écran viennent
  de `@alphabette/shell` embarquée dans `src/shell/`.

## ✨ Fonctionnalités

| | |
|---|---|
| 🗂️ **10 rubriques seniors** | Santé & médecins, médicaments, aides à domicile, retraite, numérique, transports, bien manger, loisirs, sécurité & arnaques, bien-être |
| 🗳️ **Votes utiles** | 👍 / 👎 par conseil, onglets *Meilleurs* / *Récents*, 👑 couronne du meilleur conseil |
| 🔎 **Recherche** | Filtre instantané sur les rubriques depuis le héros |
| ✍️ **Partage** | Publier un conseil (titre, prénom, lien, texte) ; vote automatique pour son propre conseil |
| 🚩 **Modération** | Signalement des contenus inappropriés, masquage à 5 signalements, mode Modo discret avec suppression |
| 🌞 **Thème jour / nuit + BIG** | Portés par la base et appliqués à toute la page via `<html data-ab-theme>` / `data-ab-density` |

Les données initiales sont un **semis** (`src/senior-data.ts`) : votes,
signalements et nouveaux conseils vivent ensuite dans le navigateur du visiteur
(`localStorage`, clés `sp-cats` / `sp-tips`), jamais sur un serveur.

## 🚀 Démarrer

```powershell
bun install
bun run dev      # http://localhost:5173 — les barres de la base fonctionnent tout de suite
bun run lint     # types
bun run build    # compile dans dist/
```

En développement, le registre de l'écosystème est relayé par le proxy Vite
(`/api` → `localhost:3000`). En production, la barre interroge le hub
`https://alphabette.fr/api/apps` et retombe sur sa liste de secours.

## 📁 Structure

```
.github/workflows/deploy.yml  # déploiement automatique GitHub Pages
public/CNAME                  # www.bonplansenior.alphabette.fr (domaine personnalisé)
src/
  main.tsx                    point d'entrée
  App.tsx                     application enveloppée par <AppShell>
  alphabette.app.ts           identité du site (nom, sous-titre, couleur, liens)
  senior-data.ts              semis : 10 rubriques + 50 conseils de départ
  senior.css                  style (palette dérivée de --ab-*)
  shell/                      base commune @alphabette/shell (générée, à ne pas recoder)
```

## ☁️ Déploiement

Le déploiement est entièrement automatisé :

1. Dans **GitHub → Settings → Pages**, choisir **Source : GitHub Actions**
   (à faire une seule fois).
2. Chaque `git push` sur `main` déclenche le workflow
   [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) : `bun install`,
   vérification des types, `bun run build`, publication de `dist/`.
3. Le fichier `public/CNAME` recopié dans `dist/` associe le site au domaine
   personnalisé. Côté DNS, ajouter l'enregistrement :

   ```
   www.bonplansenior.alphabette.fr   CNAME   azertylm.github.io
   ```

   GitHub Pages redirige automatiquement `https://azertylm.github.io/bonplansenior-alphabette.fr/`
   vers https://www.bonplansenior.alphabette.fr dès que le DNS est en place.

4. Quand le site est en ligne, l'activer dans la console du hub
   (alphabette.fr/admin) : elle devient cliquable dans les barres des autres
   applications de l'écosystème.

## 🔧 Évolutions de la base

Ne jamais recoder les barres à la main : toute évolution part du hub puis se
diffuse, depuis le dépôt du hub :

```powershell
bun run sync:shell C:\Users\azert\Documents\bonplansenior.alphabette.fr
```

## 📄 Licence

Voir [`LICENSE`](./LICENSE) (Apache-2.0).
