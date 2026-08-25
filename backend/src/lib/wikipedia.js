/**
 * Wikipedia image fetcher with in-memory cache.
 * Fetches plant images from Wikipedia REST API at runtime.
 * Uses Node.js 18+ built-in fetch.
 */

const imageCache = new Map(); // latin_name -> { imageUrl, description, wikiUrl }

/**
 * Fetch plant image URL from Wikipedia.
 * @param {string} latinName - Scientific name of the plant
 * @returns {Promise<{imageUrl: string, description: string, wikiUrl: string}>}
 */
export async function fetchWikipediaImage(latinName) {
  if (!latinName) return { imageUrl: '', description: '', wikiUrl: '' };

  // Check cache
  if (imageCache.has(latinName)) {
    return imageCache.get(latinName);
  }

  let result = { imageUrl: '', description: '', wikiUrl: '' };

  try {
    // Try Wikipedia REST API summary endpoint
    const encoded = encodeURIComponent(latinName);
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`;

    const resp = await fetch(url, {
      headers: { 'User-Agent': 'PlantDatabaseBot/1.0 (educational project)' },
      signal: AbortSignal.timeout(8000),
    });

    if (resp.ok) {
      const data = await resp.json();

      if (data.thumbnail?.source) {
        result.imageUrl = data.thumbnail.source;
      } else if (data.originalimage?.source) {
        result.imageUrl = data.originalimage.source;
      }

      result.description = data.extract || '';
      result.wikiUrl = data.content_urls?.desktop?.page || '';
    }
  } catch (e) {
    // Try fallback: MediaWiki API with CORS
    try {
      const encoded = encodeURIComponent(latinName);
      const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages|extracts&titles=${encoded}&pithumbsize=400&exintro=true&origin=*`;

      const resp = await fetch(url, {
        headers: { 'User-Agent': 'PlantDatabaseBot/1.0 (educational project)' },
        signal: AbortSignal.timeout(8000),
      });

      if (resp.ok) {
        const data = await resp.json();
        const pages = data?.query?.pages || {};
        for (const pageId of Object.keys(pages)) {
          const page = pages[pageId];
          if (page.thumbnail?.source) {
            result.imageUrl = page.thumbnail.source;
            result.description = page.extract || '';
            result.wikiUrl = `https://en.wikipedia.org/wiki/${encoded}`;
            break;
          }
        }
      }
    } catch (e2) {
      // Both methods failed - return empty
    }
  }

  imageCache.set(latinName, result);
  return result;
}

/**
 * Enrich plant data with Wikipedia images if not already present.
 * Only enriches plants that don't have an image_url.
 * @param {Array|Object} plants - Plant(s) to enrich
 * @returns {Promise<Array|Object>} - Enriched plant(s)
 */
export async function enrichWithImages(plants) {
  if (!plants) return plants;

  const isArray = Array.isArray(plants);
  const plantList = isArray ? plants : [plants];

  const enriched = await Promise.all(
    plantList.map(async (plant) => {
      // Only fetch from Wikipedia if no image URL is stored
      if (plant.image_url) return plant;

      const wikiData = await fetchWikipediaImage(plant.name_latin);
      return {
        ...plant,
        image_url: wikiData.imageUrl || plant.image_url,
        description: plant.description || wikiData.description,
        wikipedia_url: wikiData.wikiUrl || plant.wikipedia_url,
      };
    })
  );

  return isArray ? enriched : enriched[0];
}
