// Script ponctuel (a executer manuellement en local, pas en CI) pour generer
// les versions optimisees des images utilisees par le site dans src/assets/.
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const SRC = 'files';
const OUT = 'src/assets';

mkdirSync(OUT, { recursive: true });

async function run() {
  // Hero background (utilise en background-image CSS, un seul format suffit)
  await sharp(`${SRC}/chien_main.png`)
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 78 })
    .toFile(`${OUT}/chien-main.jpg`);

  // Portrait qualifications, affiche dans un cercle de 300x300 -> ~900px suffit
  await sharp(`${SRC}/IMG_7321.jpg`)
    .rotate()
    .resize({ width: 900, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toFile(`${OUT}/qualif-portrait.jpg`);

  await sharp(`${SRC}/IMG_7321.jpg`)
    .rotate()
    .resize({ width: 900, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(`${OUT}/qualif-portrait.webp`);

  // Logo et triade, deja raisonnables : copie telle quelle via sharp pour uniformiser le dossier de sortie
  await sharp(`${SRC}/logo.png`).toFile(`${OUT}/logo.png`);
  await sharp(`${SRC}/triade.png`).toFile(`${OUT}/triade.png`);

  console.log('Images optimisees generees dans src/assets/');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
