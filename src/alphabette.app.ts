import type { AlphaAppConfig } from '@alphabette/shell';

/**
 * Configuration de l'application.
 * C'est ici que l'on décrit l'identité du site : son nom, son sous-titre, sa
 * couleur, son sous-domaine et ses liens (dons, compte, clés d'API).
 */
export const APP: AlphaAppConfig = {
  key: 'bonplansenior',
  name: 'Senior Bon Plan',
  tagline: 'Conseils pour bien vivre après 60 ans',

  // Couleur d'identité du site : toute la base s'y adapte.
  accent: '#D4622A',

  // Adresses publiques (sous-domaine + chemin sur alphabette.fr).
  subdomain: 'bonplansenior',
  homePath: '/bonplansenior',

  // Liens de l'écosystème.
  donUrl: 'https://alphabette.fr/don',
  accountUrl: 'https://alphabette.fr/compte',
  apiKeysUrl: 'https://alphabette.fr/cles',

  // Compteur de la barre écosystème : calculé automatiquement depuis le
  // registre central (X applications en ligne / Y au total). Pour forcer des
  // valeurs précises (ex. essai en cours), décommenter :
  // counter: { unlocked: 3, total: 16, trialDaysLeft: 7 },

  apiKeyState: 'ok',
  accountState: 'ok',
};
