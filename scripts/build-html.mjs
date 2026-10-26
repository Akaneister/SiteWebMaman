import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { watch } from 'node:fs';
import posthtml from 'posthtml';
import expressions from 'posthtml-expressions';
import include from 'posthtml-include';
import { minify } from 'html-minifier-terser';

const PAGES = [
  {
    src: 'src/pages/index.html',
    out: 'dist/index.html',
    locals: {
      title: "Dog sitting à Brest et alentours – Garde de chien - Promenades | ADOG",
      description: 'Service de dog-sitting professionnel à Brest et alentours. Promenades, garde en journée et médiation animale.',
      ogTitle: 'ADOG – Dog sitting à Brest et alentours',
      ogDescription: 'Service de dog sitting à Brest et alentours : garde de chien à domicile, promenades et soins personnalisés.',
      ogUrl: 'https://adogpetsitting.fr/',
      homePrefix: '',
      navActive: 'accueil',
    },
  },
  {
    src: 'src/pages/mediation.html',
    out: 'dist/mediation.html',
    locals: {
      title: 'Médiation Animale à Brest – ADOG',
      description: "Médiation animale à Brest et alentours. Animation et thérapie assistées par l'animal (AAA / TAA) avec ADOG pour enfants, adultes et personnes âgées.",
      ogTitle: 'Médiation Animale – ADOG Brest',
      ogDescription: "Médiation animale à Brest : accompagnement émotionnel et thérapeutique avec l'animal.",
      ogUrl: 'https://adogpetsitting.fr/mediation.html',
      homePrefix: 'index.html',
      navActive: 'mediation',
    },
  },
  {
    src: 'src/pages/prevention-morsures.html',
    out: 'dist/prevention-morsures.html',
    locals: {
      title: 'Ateliers de prévention des morsures de chien à Brest – ADOG',
      description: "Ateliers de prévention des morsures de chien pour les écoles et collèges de Brest (CE1 à 5e) : comprendre le chien, reconnaître ses signaux et adopter les bons gestes.",
      ogTitle: 'Prévention des morsures de chien – Ateliers scolaires ADOG',
      ogDescription: 'Ateliers ludiques pour apprendre aux enfants les bons réflexes face aux chiens. Écoles et collèges de Brest et alentours.',
      ogUrl: 'https://adogpetsitting.fr/prevention-morsures.html',
      homePrefix: 'index.html',
      navActive: 'prevention',
    },
  },
];

const MINIFY_OPTIONS = {
  collapseWhitespace: true,
  removeComments: true,
  minifyCSS: true,
  minifyJS: true,
};

const GOOGLE_REVIEW_URL = 'https://g.page/r/CRDfPTUbB-PgEBM/review';

// Avis Google (voir scripts/fetch-reviews.mjs), préformatés pour le template
async function loadReviews() {
  const data = JSON.parse(await readFile('src/data/reviews.json', 'utf8'));
  const stars = (n) => '★'.repeat(Math.round(n));
  const emptyStars = (n) => '★'.repeat(5 - Math.round(n));
  return {
    writeUrl: GOOGLE_REVIEW_URL,
    count: data.count,
    rating: data.rating ? data.rating.toFixed(1).replace('.', ',') : '',
    ratingStars: data.rating ? stars(data.rating) : '',
    ratingEmptyStars: data.rating ? emptyStars(data.rating) : '',
    reviews: data.reviews.map((r) => ({
      ...r,
      initial: r.author.charAt(0).toUpperCase(),
      stars: stars(r.rating),
      emptyStars: emptyStars(r.rating),
    })),
  };
}

async function buildPage({ src, out, locals }, googleReviews) {
  const html = await readFile(src, 'utf8');

  const result = await posthtml([
    include({ root: 'src', encoding: 'utf8' }),
    expressions({ locals: { ...locals, googleReviews } }),
  ]).process(html);

  const finalHtml = await minify(result.html, MINIFY_OPTIONS);

  await writeFile(out, finalHtml, 'utf8');
  console.log(`Built ${out}`);
}

async function buildAll() {
  await mkdir('dist', { recursive: true });
  const googleReviews = await loadReviews();
  for (const page of PAGES) {
    await buildPage(page, googleReviews);
  }
}

await buildAll();

if (process.argv.includes('--watch')) {
  console.log('Watching src/pages and src/partials for changes...');
  const rebuild = () => buildAll().catch((err) => console.error(err));
  watch('src/pages', { recursive: true }, rebuild);
  watch('src/partials', { recursive: true }, rebuild);
  watch('src/data', { recursive: true }, rebuild);
}
