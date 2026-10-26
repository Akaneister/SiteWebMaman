// Récupère les avis Google (API Places New) et les écrit dans src/data/reviews.json.
// Sans GOOGLE_PLACES_API_KEY / GOOGLE_PLACE_ID, le fichier existant est conservé tel quel.
import { writeFile } from 'node:fs/promises';

const OUT = 'src/data/reviews.json';
const { GOOGLE_PLACES_API_KEY: apiKey, GOOGLE_PLACE_ID: placeId } = process.env;

if (!apiKey || !placeId) {
  console.log('fetch-reviews: GOOGLE_PLACES_API_KEY ou GOOGLE_PLACE_ID absent, avis inchangés.');
  process.exit(0);
}

try {
  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}?languageCode=fr`, {
    headers: {
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'rating,userRatingCount,reviews',
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} : ${await res.text()}`);

  const place = await res.json();
  const reviews = (place.reviews ?? [])
    .filter((r) => r.text?.text)
    .map((r) => ({
      author: r.authorAttribution?.displayName ?? 'Client Google',
      photo: r.authorAttribution?.photoUri ?? '',
      rating: r.rating,
      text: r.text.text,
      date: r.relativePublishTimeDescription ?? '',
    }));

  const data = { rating: place.rating ?? null, count: place.userRatingCount ?? 0, reviews };
  await writeFile(OUT, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`fetch-reviews: ${reviews.length} avis enregistrés dans ${OUT}`);
} catch (err) {
  // On ne casse pas le déploiement si Google est indisponible.
  console.warn(`fetch-reviews: échec, avis inchangés (${err.message})`);
}
