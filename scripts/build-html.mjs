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
];

const MINIFY_OPTIONS = {
  collapseWhitespace: true,
  removeComments: true,
  minifyCSS: true,
  minifyJS: true,
};

async function buildPage({ src, out, locals }) {
  const html = await readFile(src, 'utf8');

  const result = await posthtml([
    include({ root: 'src', encoding: 'utf8' }),
    expressions({ locals }),
  ]).process(html);

  const finalHtml = await minify(result.html, MINIFY_OPTIONS);

  await writeFile(out, finalHtml, 'utf8');
  console.log(`Built ${out}`);
}

async function buildAll() {
  await mkdir('dist', { recursive: true });
  for (const page of PAGES) {
    await buildPage(page);
  }
}

await buildAll();

if (process.argv.includes('--watch')) {
  console.log('Watching src/pages and src/partials for changes...');
  const rebuild = () => buildAll().catch((err) => console.error(err));
  watch('src/pages', { recursive: true }, rebuild);
  watch('src/partials', { recursive: true }, rebuild);
}
