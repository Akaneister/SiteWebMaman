import { cp, mkdir } from 'node:fs/promises';

async function run() {
  await mkdir('dist', { recursive: true });
  await cp('src/assets', 'dist/assets', { recursive: true });
  await cp('src/scripts/main.js', 'dist/main.js');
  await cp('CNAME', 'dist/CNAME');
  console.log('Assets copied to dist/');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
