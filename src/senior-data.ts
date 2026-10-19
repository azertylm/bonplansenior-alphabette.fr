/**
 * senior-data.ts
 *
 * Contenu initial de Senior Bon Plan : les 10 rubriques seniors et leurs
 * conseils partagés par la communauté. Ces données servent de semis : chaque
 * visiteur peut ensuite voter, signaler ou publier son propre conseil ; ses
 * contributions vivent dans son navigateur (localStorage), jamais ailleurs.
 */

export interface Rubrique {
  id: number;
  emoji: string;
  label: string;
  desc: string;
}

export interface Conseil {
  id: number;
  title: string;
  author: string;
  date: string;
  url: string;
  summary: string;
  score: number;
  flags: number;
  votes: Record<string, number>;
}

/** Un thème de couleur par rubrique (données de contenu, pas d'interface). */
export interface RubriqueCouleur {
  [id: number]: { color: string; bg: string };
}

export const DEFAULT_CATS: Rubrique[] = [
  { id: 1, emoji: '❤️‍🩹', label: 'Santé & Médecins', desc: 'Soins, médicaments, droits' },
  { id: 2, emoji: '💊', label: 'Médicaments & Pharmacie', desc: 'Ordonnances, génériques, prix' },
  { id: 3, emoji: '🏡', label: 'Aides à Domicile', desc: 'Services, auxiliaires, EHPAD' },
  { id: 4, emoji: '💰', label: 'Retraite & Aides', desc: 'Pension, allocations, droits' },
  { id: 5, emoji: '📱', label: 'Numérique Facile', desc: 'Smartphone, internet, applis' },
  { id: 6, emoji: '🚌', label: 'Transports & Sorties', desc: 'Réductions, accessibilité' },
  { id: 7, emoji: '🍲', label: 'Bien Manger', desc: 'Nutrition, repas, équilibre' },
  { id: 8, emoji: '🎭', label: 'Loisirs & Culture', desc: 'Sorties, clubs, bénévolat' },
  { id: 9, emoji: '🛡️', label: 'Sécurité & Arnaques', desc: 'Escroqueries, protection' },
  { id: 10, emoji: '😊', label: 'Bien-Être & Moral', desc: 'Solitude, activités, enthousiasme' },
];

/** Couleurs par rubrique : la variété visuelle vient du contenu, la cohérence de la palette vient de la base (--ab-*). */
export const CAT_COLORS: RubriqueCouleur = {
  1: { color: '#C0392B', bg: 'rgba(192,57,43,0.10)' },
  2: { color: '#8E44AD', bg: 'rgba(142,68,173,0.10)' },
  3: { color: '#2980B9', bg: 'rgba(41,128,185,0.10)' },
  4: { color: '#B7860B', bg: 'rgba(184,134,11,0.10)' },
  5: { color: '#16A085', bg: 'rgba(22,160,133,0.10)' },
  6: { color: '#27AE60', bg: 'rgba(39,174,96,0.10)' },
  7: { color: '#E67E22', bg: 'rgba(230,126,34,0.10)' },
  8: { color: '#2C5F70', bg: 'rgba(44,95,112,0.10)' },
  9: { color: '#E74C3C', bg: 'rgba(231,76,60,0.10)' },
  10: { color: '#F39C12', bg: 'rgba(243,156,18,0.10)' },
};

export const DEFAULT_TIPS: { [id: number]: Conseil[] } = {
  1: [
    { id: 101, title: 'Doctolib : prendre rendez-vous sans téléphone', author: 'Michèle', date: 'il y a 2j', url: 'https://www.doctolib.fr/', summary: 'Sur Doctolib, vous pouvez prendre rendez-vous avec votre médecin, spécialiste ou kinésithérapeute directement sur internet, sans attendre au téléphone. Un enfant ou petit-enfant peut vous aider à créer votre compte la première fois.', score: 342, flags: 0, votes: {} },
    { id: 102, title: 'Le 100% Santé : lunettes, dentier et audition sans reste à charge', author: 'Bernard', date: 'il y a 3j', url: 'https://www.ameli.fr/assure/sante/examen-et-soins/100-sante', summary: "Depuis 2021, vous pouvez obtenir des lunettes, des prothèses dentaires et des appareils auditifs sans payer rien de votre poche. Demandez à votre médecin ou dentiste les soins « panier 100% santé ».", score: 289, flags: 0, votes: {} },
    { id: 103, title: 'Mon espace santé : accéder à tout son dossier médical', author: 'Françoise', date: 'il y a 1sem', url: 'https://www.monespacesante.fr/', summary: "Le gouvernement a créé « Mon espace santé » pour rassembler toutes vos ordonnances, analyses et comptes-rendus médicaux en un seul endroit. Votre médecin y accède aussi si besoin.", score: 213, flags: 0, votes: {} },
    { id: 104, title: 'Téléconsultation médicale : voir un médecin en vidéo', author: 'Gérard', date: 'il y a 2sem', url: 'https://www.doctolib.fr/', summary: 'Si vous avez du mal à vous déplacer, la téléconsultation vous permet de voir un médecin en vidéo depuis chez vous. Disponible sur Doctolib. Votre mutuelle rembourse souvent cette prestation.', score: 178, flags: 0, votes: {} },
    { id: 105, title: 'Urgences médicales : savoir quand appeler le 15', author: 'Monique', date: 'il y a 1 mois', url: 'https://www.samu-de-france.fr/', summary: 'Le 15 (SAMU), le 17 (police), le 18 (pompiers) ou le 112 (numéro européen) : un aide-mémoire simple à coller près du téléphone. En cas de doute, appelez toujours le 15.', score: 456, flags: 0, votes: {} },
  ],
  2: [
    { id: 201, title: 'Les médicaments génériques : aussi efficaces, moins chers', author: 'Pierre', date: 'il y a 1j', url: 'https://www.ameli.fr/assure/sante/medicaments/medicaments-generiques', summary: 'Les médicaments génériques contiennent exactement le même principe actif que les médicaments de marque. Ils sont souvent 30 à 60% moins chers. Demandez à votre pharmacien.', score: 312, flags: 0, votes: {} },
    { id: 202, title: 'Ordonnances : les renouveler en ligne', author: 'Yvette', date: 'il y a 3j', url: 'https://www.doctolib.fr/', summary: 'Pour les médicaments chroniques, certains médecins acceptent de renouveler l\'ordonnance par téléconsultation. Évitez un déplacement inutile quand votre état de santé est stable.', score: 234, flags: 0, votes: {} },
    { id: 203, title: 'Pré-préparer ses médicaments avec un pilulier', author: 'Suzanne', date: 'il y a 1sem', url: 'https://www.pharmaciengiphar.fr/', summary: 'Un pilulier hebdomadaire (moins de 10€ en pharmacie) vous aide à ne pas oublier vos médicaments. Remplissez-le chaque dimanche pour la semaine suivante.', score: 189, flags: 0, votes: {} },
    { id: 204, title: 'Interactions médicamenteuses : vérifiez avant de mélanger', author: 'Jean-Claude', date: 'il y a 2sem', url: 'https://www.vidal.fr/', summary: 'Certains médicaments ne doivent pas être pris ensemble. Le site Vidal.fr vous permet de vérifier gratuitement les interactions entre vos médicaments. Montrez aussi la liste à votre pharmacien.', score: 267, flags: 0, votes: {} },
    { id: 205, title: 'Livraison de médicaments à domicile', author: 'Hélène', date: 'il y a 1 mois', url: 'https://www.pharmavie.fr/', summary: "De nombreuses pharmacies proposent la livraison de médicaments à domicile, parfois gratuitement. Renseignez-vous auprès de votre pharmacie habituelle ou cherchez sur internet « pharmacie livraison à domicile » suivi de votre ville.", score: 145, flags: 0, votes: {} },
  ],
  3: [
    { id: 301, title: "L'APA : l'Allocation Personnalisée d'Autonomie", author: 'Jacqueline', date: 'il y a 1j', url: 'https://www.pour-les-personnes-agees.gouv.fr/aides-et-aides-financieres/aides-au-maintien-a-domicile/lapa-allocation-personnalisee-dautonomie', summary: "Si vous avez des difficultés à faire certains gestes du quotidien, l'APA vous aide à payer des services à domicile (aide-ménagère, repas…). Elle est attribuée par le Conseil Départemental. Renseignez-vous en mairie.", score: 423, flags: 0, votes: {} },
    { id: 302, title: 'Senior Compagnie : aide et compagnie à domicile', author: 'Renée', date: 'il y a 4j', url: 'https://www.seniorcompagnie.fr/', summary: 'Senior Compagnie propose des auxiliaires de vie à domicile : aide à la toilette, aux repas, aux courses, mais aussi de la compagnie et des activités. Des aides financières existent pour couvrir une partie du coût.', score: 198, flags: 0, votes: {} },
    { id: 303, title: 'Téléassistance : un bouton pour être secouru', author: 'Marcel', date: 'il y a 1sem', url: 'https://www.assurance-retraite.fr/portail-info/articles/les-services-de-teleassistance', summary: 'Un bracelet ou médaillon à porter sur soi, avec un bouton à presser en cas de chute ou de malaise. Des opérateurs répondent 24h/24. Coût : environ 25 à 40€ par mois. Souvent aidé par la CAF ou la Mairie.', score: 356, flags: 0, votes: {} },
    { id: 304, title: 'Les portages de repas à domicile', author: 'Colette', date: 'il y a 2sem', url: 'https://www.mairie.fr/', summary: "Beaucoup de mairies et associations proposent la livraison de repas chauds à domicile pour les personnes âgées. Renseignez-vous auprès de votre mairie ou du CCAS (Centre Communal d'Action Sociale).", score: 267, flags: 0, votes: {} },
    { id: 305, title: "Le crédit d'impôt pour les services à domicile", author: 'Simone', date: 'il y a 1 mois', url: 'https://www.impots.gouv.fr/portail/particulier/emploi-domicile', summary: "Si vous employez quelqu'un à domicile (femme de ménage, aide-soignant, jardinage…), vous récupérez 50% des dépenses sous forme de crédit d'impôt. Même si vous ne payez pas d'impôts !", score: 389, flags: 0, votes: {} },
  ],
  4: [
    { id: 401, title: 'Vérifier et corriger sa retraite sur Info-retraite.fr', author: 'Roger', date: 'il y a 2j', url: 'https://www.info-retraite.fr/', summary: 'Le site officiel Info-Retraite vous montre tous vos droits à la retraite, tous régimes confondus. Vérifiez que toutes vos années de travail sont bien comptabilisées.', score: 467, flags: 0, votes: {} },
    { id: 402, title: 'Le minimum vieillesse (ASPA) : plus de 900€/mois', author: 'Germaine', date: 'il y a 3j', url: 'https://www.service-public.fr/particuliers/vosdroits/F16871', summary: "L'Allocation de Solidarité aux Personnes Agées (ASPA) garantit un minimum de revenu pour les retraités. C'est environ 1 000€ par mois pour une personne seule. Beaucoup de personnes n'en font pas la demande par méconnaissance.", score: 534, flags: 0, votes: {} },
    { id: 403, title: 'La carte Améthyste : transports gratuits ou réduits', author: 'Thérèse', date: 'il y a 5j', url: 'https://www.caf.fr/', summary: "Selon votre département, les personnes âgées à faibles ressources peuvent obtenir des transports en commun gratuits ou très réduits. Renseignez-vous auprès de votre mairie ou Conseil Régional.", score: 312, flags: 0, votes: {} },
    { id: 404, title: 'Action Logement : aides pour adapter son logement', author: 'André', date: 'il y a 2sem', url: 'https://www.actionlogement.fr/', summary: "Des subventions existent pour adapter votre logement au vieillissement : barres d'appui, douche à l'italienne, monte-escalier. Contactez votre mairie ou l'ANAH (Agence Nationale de l'Habitat).", score: 278, flags: 0, votes: {} },
    { id: 405, title: 'Les aides de votre caisse de retraite complémentaire', author: 'Louisette', date: 'il y a 1 mois', url: 'https://www.agirc-arrco.fr/', summary: "Votre caisse de retraite complémentaire (Agirc-Arrco pour les salariés du privé) propose souvent des aides financières discrètes : aide-ménagère, téléassistance, portage de repas. Appelez-les et demandez.", score: 345, flags: 0, votes: {} },
  ],
  5: [
    { id: 501, title: 'Les Ateliers Numériques de La Poste : formations gratuites', author: 'Paulette', date: 'il y a 1j', url: 'https://www.laposte.fr/assistance/numerique', summary: 'La Poste propose des ateliers numériques gratuits pour apprendre à utiliser internet, un smartphone ou les démarches en ligne. Renseignez-vous dans votre bureau de poste local.', score: 389, flags: 0, votes: {} },
    { id: 502, title: 'Agrandissez le texte sur votre téléphone', author: 'Henri', date: 'il y a 3j', url: 'https://support.google.com/accessibility/android/', summary: 'Sur Android : Paramètres → Accessibilité → Taille de police. Sur iPhone : Réglages → Accessibilité → Taille du texte. Agrandissez au maximum sans gêne. Votre écran sera beaucoup plus facile à lire.', score: 312, flags: 0, votes: {} },
    { id: 503, title: 'Passer des appels vidéo avec ses proches facilement', author: 'Odette', date: 'il y a 1sem', url: 'https://www.whatsapp.com/', summary: "WhatsApp (gratuit) permet de voir ses enfants et petits-enfants en vidéo. FaceTime sur iPhone est encore plus simple. Demandez à un proche de vous installer l'application et de faire le premier appel ensemble.", score: 456, flags: 0, votes: {} },
    { id: 504, title: 'Reconnaître les faux messages et arnaques par SMS', author: 'Gaston', date: 'il y a 2sem', url: 'https://www.cybermalveillance.gouv.fr/', summary: "Un message qui vous demande de cliquer sur un lien pour vérifier votre carte vitale, votre colis ou votre compte bancaire est presque toujours une arnaque. Ne cliquez jamais. Appelez directement l'organisme officiel.", score: 523, flags: 0, votes: {} },
    { id: 505, title: 'Croix-Rouge Numérique : aide aux démarches en ligne', author: 'Marguerite', date: 'il y a 1 mois', url: 'https://www.croix-rouge.fr/', summary: 'La Croix-Rouge propose bénévolement d\'aider les personnes âgées à faire leurs démarches administratives en ligne (CAF, impôts, Ameli). Renseignez-vous auprès de votre antenne locale.', score: 234, flags: 0, votes: {} },
  ],
  6: [
    { id: 601, title: 'La carte Senior SNCF : -50% sur les trains', author: 'Emile', date: 'il y a 1j', url: 'https://www.sncf-connect.com/train/cartes-et-abonnements/carte-avantage-senior', summary: 'La carte Avantage Senior SNCF (environ 49€/an) donne droit à -30% à -50% sur tous vos billets de train. Elle se rembourse dès le premier voyage. Commandez-la en gare ou sur le site SNCF.', score: 512, flags: 0, votes: {} },
    { id: 602, title: 'Mobilités RATP : tarif réduit pour les plus de 65 ans', author: 'Arlette', date: 'il y a 4j', url: 'https://www.ratp.fr/informer/prise-en-charge-sante-et-social', summary: 'Si vous habitez en Île-de-France et avez plus de 65 ans, vous pouvez bénéficier du pass Navigo à tarif réduit ou même gratuit selon vos revenus.', score: 389, flags: 0, votes: {} },
    { id: 603, title: 'Transport adapté porte à porte : renseignez-vous en mairie', author: 'Alphonse', date: 'il y a 1sem', url: 'https://www.mairie.fr/', summary: "De nombreuses communes disposent d'un transport adapté pour les seniors qui ne peuvent plus conduire : minibus avec chauffeur qui vient vous chercher à domicile. Renseignez-vous en mairie.", score: 267, flags: 0, votes: {} },
    { id: 604, title: 'BlaBlaCar : covoiturer avec des voisins', author: 'Yvonne', date: 'il y a 2sem', url: 'https://www.blablacar.fr/', summary: 'BlaBlaCar vous met en relation avec des conducteurs qui font le même trajet que vous. Moins cher que le taxi, plus souple que le bus. Votre famille peut vous aider à réserver.', score: 178, flags: 0, votes: {} },
    { id: 605, title: 'Musées nationaux : entrée gratuite les dimanches', author: 'Madeleine', date: 'il y a 1 mois', url: 'https://www.culture.gouv.fr/Thematiques/Musees/Les-musees-en-France/Les-musees-et-leurs-publics/Acces-aux-musees-nationaux', summary: "Les musées nationaux (Louvre, Orsay, Versailles…) sont gratuits le premier dimanche du mois pour tous. Et les plus de 65 ans ont des tarifs réduits toute l'année.", score: 345, flags: 0, votes: {} },
  ],
  7: [
    { id: 701, title: 'Manger équilibré après 65 ans : le guide officiel', author: 'Élisabeth', date: 'il y a 2j', url: 'https://www.mangerbouger.fr/65-et-plus', summary: 'Le site Manger Bouger du gouvernement explique les besoins nutritionnels spécifiques des personnes âgées. Protéines, calcium, hydratation : des conseils simples et gratuits.', score: 312, flags: 0, votes: {} },
    { id: 702, title: "Bien s'hydrater : l'ennemi silencieux des seniors", author: 'Claudine', date: 'il y a 4j', url: 'https://www.sante.fr/', summary: "Après 65 ans, la sensation de soif diminue mais les besoins en eau restent les mêmes. Buvez 1,5 litre d'eau par jour même sans soif. Ayez toujours une carafe d'eau visible.", score: 289, flags: 0, votes: {} },
    { id: 703, title: 'Les protéines pour préserver ses muscles', author: 'Fernand', date: 'il y a 1sem', url: 'https://www.inrae.fr/', summary: "Après 70 ans, les muscles s'affaiblissent plus vite. Manger des protéines (viande, poisson, œufs, légumineuses) à chaque repas aide à garder la force et l'équilibre. Votre médecin peut vous conseiller.", score: 234, flags: 0, votes: {} },
    { id: 704, title: 'Les restaurants du cœur : repas pour les plus démunis', author: 'Georgette', date: 'il y a 2sem', url: 'https://www.restosducoeur.org/', summary: 'Si vos fins de mois sont difficiles, les Restos du Cœur offrent des repas chauds et des colis alimentaires. Aucune honte : ce service existe pour aider. Cherchez votre antenne locale sur le site.', score: 456, flags: 0, votes: {} },
    { id: 705, title: 'La vitamine D : indispensable pour les seniors', author: 'Josette', date: 'il y a 1 mois', url: 'https://www.ameli.fr/assure/sante/themes/vitamine-d', summary: 'La majorité des personnes âgées manquent de vitamine D, ce qui fragilise les os et augmente le risque de chute. Demandez à votre médecin de vérifier votre taux et de vous prescrire un complément si besoin.', score: 378, flags: 0, votes: {} },
  ],
  8: [
    { id: 801, title: "L'UNIV3âge : cours et activités pour seniors", author: 'Lucienne', date: 'il y a 2j', url: 'https://www.univ3age.fr/', summary: "Les Universités du Troisième Âge proposent des cours de langue, d'histoire, d'informatique, de sport doux… à des tarifs très accessibles, dans toute la France.", score: 423, flags: 0, votes: {} },
    { id: 802, title: 'France Bénévolat : donner de son temps', author: 'Robert', date: 'il y a 3j', url: 'https://www.francebenevolat.org/', summary: "Le bénévolat est excellent pour le moral et l'estime de soi. France Bénévolat met en relation les bénévoles avec les associations. Un moyen formidable de rester actif et utile.", score: 356, flags: 0, votes: {} },
    { id: 803, title: 'Arte.tv : films et documentaires culturels gratuits', author: 'Andrée', date: 'il y a 1sem', url: 'https://www.arte.tv/fr/', summary: 'La chaîne Arte propose des centaines de documentaires, films et concerts à regarder gratuitement sur internet ou à la télé. Une excellente alternative aux émissions ordinaires.', score: 289, flags: 0, votes: {} },
    { id: 804, title: 'Les clubs de marche seniors : sortir et se faire des amis', author: 'Camille', date: 'il y a 2sem', url: 'https://www.ffrandonnee.fr/', summary: 'La Fédération Française de Randonnée organise des sorties adaptées à tous les niveaux, y compris pour les débutants. Cherchez un club près de chez vous sur leur site.', score: 312, flags: 0, votes: {} },
    { id: 805, title: 'Deezer : écouter de la musique gratuitement', author: 'Jeannine', date: 'il y a 1 mois', url: 'https://www.deezer.com/fr/', summary: 'Deezer propose des millions de chansons gratuitement. Retrouvez vos artistes préférés, créez des playlists et écoutez la radio. Très facile à utiliser sur un smartphone ou une tablette.', score: 234, flags: 0, votes: {} },
  ],
  9: [
    { id: 901, title: 'Les 5 arnaques les plus fréquentes visant les seniors', author: 'Georges', date: 'il y a 1j', url: 'https://www.cybermalveillance.gouv.fr/', summary: "Faux techniciens, fausse carte vitale, faux petits-enfants en danger, loteries fictives, démarchages à domicile abusifs. Connaître ces arnaques est la meilleure façon de s'en protéger. Le site Cybermalveillance.gouv.fr les explique toutes.", score: 623, flags: 0, votes: {} },
    { id: 902, title: 'Ne jamais donner ses codes bancaires par téléphone', author: 'Victoire', date: 'il y a 3j', url: 'https://www.banque-france.fr/', summary: 'Votre banque, la CAF, les impôts ou la Sécurité sociale ne vous demanderont JAMAIS vos codes bancaires ou votre mot de passe par téléphone. Si cela arrive, raccrochez immédiatement et appelez votre banque.', score: 712, flags: 0, votes: {} },
    { id: 903, title: 'Bloctel : stop au démarchage téléphonique', author: 'Augustine', date: 'il y a 1sem', url: 'https://www.bloctel.gouv.fr/', summary: "Inscrivez votre numéro de téléphone sur Bloctel (gratuit) pour ne plus être sollicité par les démarcheurs téléphoniques. L'inscription est simple et dure 3 ans.", score: 534, flags: 0, votes: {} },
    { id: 904, title: "En cas de doute, appelez un proche avant d'agir", author: 'Maurice', date: 'il y a 2sem', url: 'https://www.service-public.fr/particuliers/actualites/A15079', summary: "Règle d'or contre les arnaques : si quelqu'un vous presse à agir vite (payer, signer, cliquer), c'est suspect. Raccrochez et appelez votre enfant ou un voisin de confiance.", score: 489, flags: 0, votes: {} },
    { id: 905, title: 'Numéro national contre les maltraitances : 39 77', author: 'Henriette', date: 'il y a 1 mois', url: 'https://www.3977.fr/', summary: "Le 3977 est le numéro national de lutte contre la maltraitance des personnes âgées. Gratuit, confidentiel, disponible du lundi au vendredi. N'hésitez pas à appeler si vous êtes témoin ou victime.", score: 567, flags: 0, votes: {} },
  ],
  10: [
    { id: 1001, title: "Solitud'Actif : briser la solitude des seniors", author: 'Albertine', date: 'il y a 1j', url: 'https://www.solitud-actif.fr/', summary: 'Des milliers de seniors souffrent de solitude. Des associations organisent des appels téléphoniques réguliers, des visites à domicile et des activités collectives. Renseignez-vous auprès de votre mairie.', score: 534, flags: 0, votes: {} },
    { id: 1002, title: 'La gym douce : rester souple sans se blesser', author: 'Denise', date: 'il y a 3j', url: 'https://www.youtube.com/results?search_query=gym+douce+seniors', summary: "Des dizaines de vidéos de gym douce pour seniors sont disponibles gratuitement sur YouTube. 10 à 15 minutes par jour suffisent pour améliorer l'équilibre et la souplesse. Cherchez « gym douce seniors » sur YouTube.", score: 423, flags: 0, votes: {} },
    { id: 1003, title: 'Le jardinage : une activité physique et apaisante', author: 'Gustave', date: 'il y a 1sem', url: 'https://www.tff.fr/', summary: "Le jardinage, même sur un balcon avec des pots, est excellent pour la santé physique et mentale. Des jardins partagés existent dans beaucoup de villes pour ceux qui n'ont pas de jardin.", score: 389, flags: 0, votes: {} },
    { id: 1004, title: '3114 : numéro national de prévention du suicide', author: 'Marcelle', date: 'il y a 2sem', url: 'https://www.3114.fr/', summary: "Si vous traversez une période difficile ou si vous pensez à vous faire du mal, le 3114 est là pour vous écouter, 24h/24 et 7j/7. Gratuit depuis tous les téléphones. Vous n'êtes pas seul(e).", score: 678, flags: 0, votes: {} },
    { id: 1005, title: 'Les jeux de société et puzzles pour garder la mémoire', author: 'Berthe', date: 'il y a 1 mois', url: 'https://www.alzheimer-europe.org/fr', summary: "Mots croisés, sudoku, scrabble, puzzles : ces activités stimulent la mémoire et la concentration. Jouez seul, avec votre famille ou dans un club. C'est aussi l'occasion de socialiser.", score: 345, flags: 0, votes: {} },
  ],
};
