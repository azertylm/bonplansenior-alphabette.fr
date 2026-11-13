import { AppShell } from '@alphabette/shell';
import '@alphabette/shell/style.css';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { APP } from './alphabette.app';
import './senior.css';
import { CAT_COLORS, DEFAULT_CATS, DEFAULT_TIPS, SEMIS_VERSION } from './senior-data';
import type { Conseil, Rubrique } from './senior-data';

/**
 * SENIOR BON PLAN — Conseils pour bien vivre.
 *
 * La base commune (deux barres, thème jour/nuit, densité, plein écran, panneaux)
 * est fournie par <AppShell>. Le contenu ci-dessous reprend l'esprit de la
 * version d'origine : 10 rubriques seniors, conseils votés par la communauté,
 * partage d'astuces, signalements et un mode modération discret.
 *
 * Tout vit dans le navigateur (localStorage) : sans pub, sans compte, sans
 * données transmises ailleurs.
 */

// Les clés intègrent la version du semis : si le semis de départ évolue,
// augmenter SEMIS_VERSION dans senior-data.ts recharge la nouvelle base de contenu.
const CLE_CATS = `sp-cats-v${SEMIS_VERSION}`;
const CLE_TIPS = `sp-tips-v${SEMIS_VERSION}`;

/** Lit / écrit les données initiales, en conservant les contributions locales. */
function lire<Cle extends string>(cle: Cle, defaut: unknown): object {
  try {
    const brut = localStorage.getItem(cle);
    if (brut) return JSON.parse(brut) as object;
  } catch {
    /* données corrompues ou indisponibles : on repart du semis */
  }
  localStorage.setItem(cle, JSON.stringify(defaut));
  return defaut as object;
}

type Filtre = 'top' | 'new';

/**
 * Rend les numéros de téléphone du texte cliquables (lien « tel: ») : un
 * simple appui sur le téléphone lance l'appel. On ne touche qu'aux numéros
 * courts connus (15, 17, 18, 112, 3114, 3133, 3237, 3635, 3960, 3977).
 */
const NUMERO = /((?:\b(?:le|au|du|numéro)\s))(15|17|18|112|3114|3133|3237|3635|3960|3977)\b(?!\.fr|\s*(?:h\b|heures|minutes|%|€|mars|mai|juin))/gi;
function avecNumerosCliquables(texte: string) {
  const morceaux: React.ReactNode[] = [];
  let dernier = 0;
  for (const m of texte.matchAll(NUMERO)) {
    const debut = (m.index ?? 0) + m[1].length;
    morceaux.push(texte.slice(dernier, debut));
    morceaux.push(
      <a key={debut} className="sbp-tel" href={`tel:${m[2]}`} aria-label={`Appeler le ${m[2].split('').join(' ')}`}>
        {m[2]}
      </a>,
    );
    dernier = debut + m[2].length;
  }
  morceaux.push(texte.slice(dernier));
  return morceaux.map((x, i) => <Fragment key={i}>{x}</Fragment>);
}

export function App() {
  return (
    <AppShell app={APP}>
      <EspaceSenior />
    </AppShell>
  );
}

function EspaceSenior() {
  const [cats, setCats] = useState<Rubrique[]>(() =>
    (lire(CLE_CATS, DEFAULT_CATS) as unknown as Rubrique[]) ?? DEFAULT_CATS,
  );
  const [tips, setTips] = useState<{ [id: number]: Conseil[] }>(() =>
    (lire(CLE_TIPS, DEFAULT_TIPS) as unknown as { [id: number]: Conseil[] }) ?? DEFAULT_TIPS,
  );
  const [recherche, setRecherche] = useState('');
  const [rubriqueOuverte, setRubriqueOuverte] = useState<Rubrique | null>(null);
  const [filtre, setFiltre] = useState<Filtre>('top');
  const [modo, setModo] = useState(false);
  const [notif, setNotif] = useState('');
  const minuterieNotif = useRef<number | undefined>(undefined);

  /** Sauvegarde locale : la base écrit, l'écran suit. */
  const enregistrer = (prochainsCats: Rubrique[], prochainsTips: { [id: number]: Conseil[] }) => {
    localStorage.setItem(CLE_CATS, JSON.stringify(prochainsCats));
    localStorage.setItem(CLE_TIPS, JSON.stringify(prochainsTips));
  };

  const prevenir = (message: string) => {
    setNotif(message);
    window.clearTimeout(minuterieNotif.current);
    minuterieNotif.current = window.setTimeout(() => setNotif(''), 3500);
  };

  useEffect(() => {
    return () => window.clearTimeout(minuterieNotif.current);
  }, []);

  // Quand on change de page, le lecteur d'écran et le clavier repartent du titre.
  const premierRendu = useRef(true);
  useEffect(() => {
    if (premierRendu.current) {
      premierRendu.current = false;
      return;
    }
    document.getElementById('sbp-titre')?.focus({ preventScroll: true });
    document.title = rubriqueOuverte
      ? `${rubriqueOuverte.label} — Senior Bon Plan`
      : 'Senior Bon Plan — Conseils pour bien vivre';
  }, [rubriqueOuverte]);

  const stats = useMemo(() => {
    const tout: Conseil[] = Object.values(tips).flat();
    return {
      conseils: tout.length,
      votes: tout.reduce((somme, c) => somme + Math.max(0, c.score), 0),
      rubriques: cats.length,
    };
  }, [cats, tips]);

  /** Retour à l'accueil : vide la recherche, repart du semis affiché. */
  const retourHome = () => {
    setRecherche('');
    setRubriqueOuverte(null);
  };

  const ouvrirRubrique = (rubrique: Rubrique) => {
    const avecRubrique: { [id: number]: Conseil[] } = {
      ...tips,
      [rubrique.id]: tips[rubrique.id] ?? [],
    };
    if (!tips[rubrique.id]) {
      setTips(avecRubrique);
      enregistrer(cats, avecRubrique);
    }
    setFiltre('top');
    setRubriqueOuverte(rubrique);
    window.scrollTo(0, 0);
  };

  /** Vote : +1 utile / -1 pas utile, clic répété = annulation. */
  const voter = (rubriqueId: number, conseilId: number, direction: 1 | -1) => {
    const prochainsTips = { ...tips, [rubriqueId]: [...(tips[rubriqueId] ?? [])] };
    const conseil = prochainsTips[rubriqueId].find((c) => c.id === conseilId);
    if (!conseil) return;
    const precedent = conseil.votes['me'] ?? 0;
    const prochain = precedent === direction ? 0 : direction;
    conseil.score = conseil.score - precedent + prochain;
    conseil.votes = { ...conseil.votes, me: prochain };
    prochainsTips[rubriqueId] = prochainsTips[rubriqueId].map((c) => (c.id === conseil.id ? conseil : c));
    setTips(prochainsTips);
    enregistrer(cats, prochainsTips);
  };

  const signaler = (rubriqueId: number, conseilId: number) => {
    const prochainsTips = { ...tips, [rubriqueId]: [...(tips[rubriqueId] ?? [])] };
    prochainsTips[rubriqueId] = prochainsTips[rubriqueId].map((c) =>
      c.id === conseilId ? { ...c, flags: c.flags + 1 } : c,
    );
    setTips(prochainsTips);
    enregistrer(cats, prochainsTips);
    prevenir('🚩 Merci, le signalement a été enregistré.');
  };

  const supprimer = (rubriqueId: number, conseilId: number) => {
    if (!window.confirm('Supprimer ce conseil définitivement ?')) return;
    const prochainsTips = { ...tips, [rubriqueId]: [...(tips[rubriqueId] ?? [])] };
    prochainsTips[rubriqueId] = prochainsTips[rubriqueId].filter((c) => c.id !== conseilId);
    setTips(prochainsTips);
    enregistrer(cats, prochainsTips);
    prevenir('🗑️ Conseil supprimé.');
  };

  const basculerModo = () => {
    setModo((actif) => !actif);
    prevenir(modo ? 'Mode modération désactivé' : '🛡️ Mode modération activé');
  };

  const publier = (rubriqueId: number, conseil: Omit<Conseil, 'id' | 'score' | 'flags' | 'votes'>) => {
    const nouveau: Conseil = {
      ...conseil,
      id: Date.now(),
      score: 1,
      flags: 0,
      votes: { me: 1 },
    };
    const prochainsTips = { ...tips, [rubriqueId]: [...(tips[rubriqueId] ?? [])] };
    prochainsTips[rubriqueId].unshift(nouveau);
    setTips(prochainsTips);
    enregistrer(cats, prochainsTips);
    setFiltre('new');
    prevenir('✅ Votre conseil a été publié. Merci !');
  };

  const rubriquesFiltrees = useMemo(() => {
    const mots = recherche.trim().toLowerCase();
    return mots ? cats.filter((c) => c.label.toLowerCase().includes(mots)) : cats;
  }, [cats, recherche]);

  if (rubriqueOuverte) {
    return (
      <PageRubrique
        rubrique={rubriqueOuverte}
        conseils={tips[rubriqueOuverte.id] ?? []}
        filtre={filtre}
        modo={modo}
        notif={notif}
        onFiltre={setFiltre}
        onRetour={retourHome}
        onVote={(id, direction) => voter(rubriqueOuverte.id, id, direction)}
        onSignaler={(id) => signaler(rubriqueOuverte.id, id)}
        onSupprimer={(id) => supprimer(rubriqueOuverte.id, id)}
        onPublier={(conseil) => publier(rubriqueOuverte.id, conseil)}
        onBasculerModo={basculerModo}
      />
    );
  }

  return (
    <EspaceAccueil
      rubriques={rubriquesFiltrees}
      tips={tips}
      stats={stats}
      recherche={recherche}
      modo={modo}
      notif={notif}
      onRecherche={setRecherche}
      onOuvrir={ouvrirRubrique}
      onBasculerModo={basculerModo}
    />
  );
}

/* ─────────────────────────── Accueil ─────────────────────────── */

interface EspaceAccueilProps {
  rubriques: Rubrique[];
  tips: { [id: number]: Conseil[] };
  stats: { conseils: number; votes: number; rubriques: number };
  recherche: string;
  modo: boolean;
  notif: string;
  onRecherche: (valeur: string) => void;
  onOuvrir: (rubrique: Rubrique) => void;
  onBasculerModo: () => void;
}

function EspaceAccueil({ rubriques, tips, stats, recherche, modo, notif, onRecherche, onOuvrir, onBasculerModo }: EspaceAccueilProps) {
  return (
    <main className="sbp">
      {modo && (
        <div className="sbp-admin-bar">
          <span aria-hidden>🛡️</span> Modération activée : vous pouvez supprimer les contenus inappropriés
        </div>
      )}

      <section className="sbp-hero">
        <div className="sbp-hero-tag">🌟 Gratuit · Sans publicité · Pour vous</div>
        <h1 id="sbp-titre" tabIndex={-1} className="sbp-titre-focus">
          Des conseils utiles
          <br />
          pour <em>bien vivre</em> au quotidien
        </h1>
        <p>
          Des astuces, droits et bonnes adresses sélectionnés par l'équipe
          Senior Bon Plan. Votez pour ceux qui vous aident, ajoutez les vôtres.
          Vos votes et vos conseils restent sur cet appareil.
        </p>
        <div className="sbp-recherche">
          <span aria-hidden className="sbp-recherche-icone">🔍</span>
          <input
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            value={recherche}
            onChange={(evenement) => onRecherche(evenement.target.value)}
            placeholder="Chercher une rubrique…"
            aria-label="Rechercher une rubrique"
          />
        </div>
        <div className="sbp-modo-ligne">
          <button type="button" className="sbp-modo" onClick={onBasculerModo} aria-pressed={modo}>
            <span aria-hidden>🛡️</span> Modération (équipe)
          </button>
        </div>
      </section>

      <section className="sbp-stats" aria-label="En chiffres">
        <div className="sbp-stat">
          <div className="sbp-stat-icone" aria-hidden>💡</div>
          <div className="sbp-stat-n">{stats.conseils}</div>
          <div className="sbp-stat-libelle">Conseils</div>
        </div>
        <div className="sbp-stat">
          <div className="sbp-stat-icone" aria-hidden>👍</div>
          <div className="sbp-stat-n">{stats.votes.toLocaleString('fr-FR')}</div>
          <div className="sbp-stat-libelle">Vos votes</div>
        </div>
        <div className="sbp-stat">
          <div className="sbp-stat-icone" aria-hidden>📂</div>
          <div className="sbp-stat-n">{stats.rubriques}</div>
          <div className="sbp-stat-libelle">Rubriques</div>
        </div>
      </section>

      <h2 className="sbp-section-titre">
        {recherche ? `Résultats pour « ${recherche} »` : 'Toutes les rubriques'}
      </h2>

      {rubriques.length === 0 ? (
        <div className="sbp-vide">
          <div className="sbp-vide-grande">🔍</div>
          <h3>Aucune rubrique trouvée</h3>
          <p>Essayez un autre mot : santé, retraite, loisirs…</p>
        </div>
      ) : (
        <div className="sbp-grille">
          {rubriques.map((rubrique) => {
            const nombre = (tips[rubrique.id] ?? []).length;
            const couleur = CAT_COLORS[rubrique.id];
            return (
              <button
                type="button"
                key={rubrique.id}
                className="sbp-rubrique"
                style={{ ['--cat-color' as string]: couleur.color, ['--cat-bg' as string]: couleur.bg }}
                onClick={() => onOuvrir(rubrique)}
              >
                <span className="sbp-rubrique-icone" style={{ background: couleur.bg }} aria-hidden>
                  {rubrique.emoji}
                </span>
                <span className="sbp-rubrique-libelle">{rubrique.label}</span>
                <span className="sbp-rubrique-desc">{rubrique.desc}</span>
                {nombre > 0 && (
                  <span className="sbp-rubrique-compte">
                    <span aria-hidden>💡</span> {nombre} conseil{nombre > 1 ? 's' : ''}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <Notification message={notif} />
    </main>
  );
}

/* ─────────────────────────── Rubrique ─────────────────────────── */

interface PageRubriqueProps {
  rubrique: Rubrique;
  conseils: Conseil[];
  filtre: Filtre;
  modo: boolean;
  notif: string;
  onFiltre: (filtre: Filtre) => void;
  onRetour: () => void;
  onVote: (conseilId: number, direction: 1 | -1) => void;
  onSignaler: (conseilId: number) => void;
  onSupprimer: (conseilId: number) => void;
  onPublier: (conseil: Omit<Conseil, 'id' | 'score' | 'flags' | 'votes'>) => void;
  onBasculerModo: () => void;
}

function PageRubrique({
  rubrique,
  conseils,
  filtre,
  modo,
  notif,
  onFiltre,
  onRetour,
  onVote,
  onSignaler,
  onSupprimer,
  onPublier,
}: PageRubriqueProps) {
  const [formulaireOuvert, setFormulaireOuvert] = useState(false);
  const couleur = CAT_COLORS[rubrique.id];
  const visible = modo ? conseils : conseils.filter((c) => c.flags < 5);
  const tries = [...visible].sort((a, b) =>
    filtre === 'top' ? b.score - a.score : b.id - a.id,
  );

  return (
    <main className="sbp">
      <div className="sbp-retour-collant">
        <button type="button" className="sbp-retour" onClick={onRetour}>
          <span className="sbp-retour-fleche" aria-hidden>←</span>
          Retour aux rubriques
        </button>
      </div>

      <div className="sbp-entete-rubrique">
        <span className="sbp-rubrique-grande" style={{ background: couleur.bg }} aria-hidden>
          {rubrique.emoji}
        </span>
        <div>
          <h1 id="sbp-titre" tabIndex={-1} className="sbp-titre-focus">{rubrique.label}</h1>
          <p>{tries.length} conseil{tries.length > 1 ? 's' : ''} partagé{tries.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="sbp-outils">
        <div className="sbp-onglets" role="group" aria-label="Ordre des conseils">
          <button
            type="button"
            aria-pressed={filtre === 'top'}
            className={filtre === 'top' ? 'sbp-onglet actif' : 'sbp-onglet'}
            onClick={() => onFiltre('top')}
          >
            <span aria-hidden>🏆</span> Les meilleurs
          </button>
          <button
            type="button"
            aria-pressed={filtre === 'new'}
            className={filtre === 'new' ? 'sbp-onglet actif' : 'sbp-onglet'}
            onClick={() => onFiltre('new')}
          >
            <span aria-hidden>✨</span> Les récents
          </button>
        </div>
      </div>

      <div className="sbp-conseils">
        <button
          type="button"
          className="sbp-proposer-bouton"
          aria-expanded={formulaireOuvert}
          onClick={() => setFormulaireOuvert((ouvert) => !ouvert)}
        >
          <span className="sbp-proposer-plus" aria-hidden>＋</span>
          <span>Ajouter un conseil<br /><small>Il restera sur cet appareil</small></span>
        </button>

        {formulaireOuvert && (
          <FormulaireConseil
            rubriqueLabel={rubrique.label}
            onFermer={() => setFormulaireOuvert(false)}
            onPublier={(conseil) => {
              onPublier(conseil);
              setFormulaireOuvert(false);
            }}
          />
        )}

        {tries.length === 0 ? (
          <div className="sbp-vide">
            <div className="sbp-vide-grande">🌱</div>
            <h2>Soyez le premier !</h2>
            <p>
              Il n'y a pas encore de conseil dans cette rubrique.
              <br />
              Appuyez sur le bouton ci-dessus pour partager le vôtre.
            </p>
          </div>
        ) : (
          <ul className="sbp-liste">
            {tries.map((conseil, index) => (
              <CarteConseil
                key={conseil.id}
                conseil={conseil}
                premier={index === 0 && filtre === 'top' && conseil.score > 10}
                modo={modo}
                onVote={onVote}
                onSignaler={onSignaler}
                onSupprimer={onSupprimer}
                style={{ animationDelay: `${index * 0.07}s` }}
              />
            ))}
          </ul>
        )}
      </div>

      <div className="sbp-retour-bas">
        <button type="button" className="sbp-retour" onClick={onRetour}>
          <span className="sbp-retour-fleche" aria-hidden>←</span>
          Retour aux rubriques
        </button>
      </div>

      <Notification message={notif} />
    </main>
  );
}

function FormulaireConseil({
  rubriqueLabel,
  onFermer,
  onPublier,
}: {
  rubriqueLabel: string;
  onFermer: () => void;
  onPublier: (conseil: Omit<Conseil, 'id' | 'score' | 'flags' | 'votes'>) => void;
}) {
  const [titre, setTitre] = useState('');
  const [auteur, setAuteur] = useState('');
  const [url, setUrl] = useState('');
  const [resume, setResume] = useState('');
  const [erreur, setErreur] = useState('');
  const refTitre = useRef<HTMLInputElement>(null);
  const refAuteur = useRef<HTMLInputElement>(null);
  const refUrl = useRef<HTMLInputElement>(null);
  const refResume = useRef<HTMLTextAreaElement>(null);

  const envoyer = () => {
    if (!titre.trim() || !auteur.trim() || !resume.trim()) {
      setErreur('Il manque une information. Merci de remplir le titre, votre prénom et votre conseil.');
      (!titre.trim() ? refTitre : !auteur.trim() ? refAuteur : refResume).current?.focus();
      return;
    }
    if (url.trim() && !url.trim().startsWith('http')) {
      setErreur('Le lien internet doit commencer par https://');
      refUrl.current?.focus();
      return;
    }
    setErreur('');
    onPublier({
      title: titre.trim(),
      author: auteur.trim(),
      url: url.trim(),
      summary: resume.trim(),
      date: "à l'instant",
    });
  };

  return (
    <form
      className="sbp-formulaire"
      noValidate
      onSubmit={(evenement) => {
        evenement.preventDefault();
        envoyer();
      }}
    >
      <h2><span aria-hidden>💡</span> Partager un conseil</h2>
      <p>
        Vous connaissez une bonne adresse ou une astuce utile dans « {rubriqueLabel} » ?
        Partagez-la ici !
      </p>
      <p className="sbp-aide">Les champs marqués d'une étoile (*) sont à remplir.</p>
      {erreur && (
        <p className="sbp-erreur" role="alert" id="sbp-erreur">
          {erreur}
        </p>
      )}
      <div className="sbp-deux-colonnes">
        <label className={`sbp-champ${erreur && !titre.trim() ? ' sbp-champ-invalide' : ''}`}>
          Titre du conseil (obligatoire) *
          <input ref={refTitre} required aria-required="true" aria-invalid={Boolean(erreur) && !titre.trim()} aria-describedby={erreur ? 'sbp-erreur' : undefined} value={titre} onChange={(e) => setTitre(e.target.value)} placeholder="Ex : Mon médecin préféré…" />
        </label>
        <label className={`sbp-champ${erreur && !auteur.trim() ? ' sbp-champ-invalide' : ''}`}>
          Votre prénom (obligatoire) *
          <input ref={refAuteur} required aria-required="true" aria-invalid={Boolean(erreur) && !auteur.trim()} aria-describedby={erreur ? 'sbp-erreur' : undefined} autoComplete="given-name" value={auteur} onChange={(e) => setAuteur(e.target.value)} placeholder="Ex : Michèle" />
        </label>
      </div>
      <label className="sbp-champ">
        Lien internet (si vous en avez un)
        <input ref={refUrl} type="url" inputMode="url" aria-describedby={erreur ? 'sbp-erreur' : undefined} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
      </label>
      <label className={`sbp-champ${erreur && !resume.trim() ? ' sbp-champ-invalide' : ''}`}>
        Votre conseil en quelques mots (obligatoire) *
        <textarea
          ref={refResume}
          required
          aria-required="true"
          aria-invalid={Boolean(erreur) && !resume.trim()}
          aria-describedby={erreur ? 'sbp-erreur' : undefined}
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          placeholder="Pourquoi recommandez-vous ce conseil ? Qu'y trouve-t-on ?"
        />
      </label>
      <div className="sbp-form-boutons">
        <button type="submit" className="sbp-bouton-envoyer"><span aria-hidden>✓</span> Publier mon conseil</button>
        <button type="button" className="sbp-bouton-annuler" onClick={onFermer}>Annuler</button>
      </div>
    </form>
  );
}

interface CarteConseilProps {
  conseil: Conseil;
  premier: boolean;
  modo: boolean;
  onVote: (id: number, direction: 1 | -1) => void;
  onSignaler: (id: number) => void;
  onSupprimer: (id: number) => void;
  style?: React.CSSProperties;
}

function CarteConseil({ conseil, premier, modo, onVote, onSignaler, onSupprimer, style }: CarteConseilProps) {
  const monVote = conseil.votes['me'] ?? 0;
  const classeScore = conseil.score > 0 ? 'positif' : conseil.score < 0 ? 'negatif' : 'neutre';
  const lienValide = conseil.url.startsWith('http');

  return (
    <li className={`sbp-carte${premier ? ' est-top' : ''}`} style={style}>
      <div className="sbp-vote-colonne">
        <button
          type="button"
          className={`sbp-vote monter${monVote === 1 ? ' actif' : ''}`}
          onClick={() => onVote(conseil.id, 1)}
          aria-pressed={monVote === 1}
          aria-label="Ce conseil est utile"
        >
          <span className="sbp-vote-pouce" aria-hidden>👍</span> Utile
        </button>
        <div className="sbp-vote-scores" role="group" aria-label={`Note du conseil : ${conseil.score} vote${Math.abs(conseil.score) > 1 ? 's' : ''}`}>
          <div className={`sbp-score ${classeScore}`} aria-hidden>{conseil.score}</div>
          <div className="sbp-score-libelle" aria-hidden>vote{Math.abs(conseil.score) > 1 ? 's' : ''}</div>
        </div>
        <button
          type="button"
          className={`sbp-vote baisser${monVote === -1 ? ' actif' : ''}`}
          onClick={() => onVote(conseil.id, -1)}
          aria-pressed={monVote === -1}
          aria-label="Ce conseil n'est pas utile"
        >
          <span className="sbp-vote-pouce" aria-hidden>👎</span> Pas utile
        </button>
        {premier && <span className="sbp-badge top"><span aria-hidden>👑</span> Meilleur conseil</span>}
        {modo && conseil.flags >= 3 && <span className="sbp-badge signale"><span aria-hidden>⚠️</span> Signalé</span>}
      </div>

      <div className="sbp-carte-corps">
        <h2 className="sbp-carte-titre">{conseil.title}</h2>
        <div className="sbp-carte-meta">
          {conseil.date ? (
            <>
              Ajouté par <strong>{conseil.author}</strong> · {conseil.date}
            </>
          ) : (
            <>
              Sélection de l'<strong>{conseil.author}</strong>
            </>
          )}
        </div>
        <p className="sbp-carte-resume">{avecNumerosCliquables(conseil.summary)}</p>
        {lienValide && (
          <a className="sbp-carte-lien" href={conseil.url} target="_blank" rel="noopener noreferrer">
            <span aria-hidden>🌐</span> Voir le site <small>(s'ouvre dans un autre onglet)</small>
          </a>
        )}
        <div className="sbp-carte-actions">
          <button type="button" className="sbp-acte signaler" onClick={() => onSignaler(conseil.id)}>
            <span aria-hidden>🚩</span> Signaler ce conseil{conseil.flags > 0 ? ` (${conseil.flags})` : ''}
          </button>
          {modo && (
            <button type="button" className="sbp-acte supprimer" onClick={() => onSupprimer(conseil.id)}>
              <span aria-hidden>🗑️</span> Supprimer
            </button>
          )}
        </div>
      </div>
    </li>
  );
}

function Notification({ message }: { message: string }) {
  return (
    <div id="sbp-notif" className={message ? 'visible' : ''} role="status" aria-live="polite">
      {message}
    </div>
  );
}
