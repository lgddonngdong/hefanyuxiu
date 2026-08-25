/**
 * Wikipedia image fetcher with in-memory cache.
 * Fetches plant images from Wikipedia REST API at runtime.
 */

interface WikiData {
  imageUrl: string;
  description: string;
  wikiUrl: string;
}

const imageCache = new Map<string, WikiData>();

export async function fetchWikipediaImage(latinName: string): Promise<WikiData> {
  if (!latinName) return { imageUrl: '', description: '', wikiUrl: '' };

  if (imageCache.has(latinName)) {
    return imageCache.get(latinName)!;
  }

  let result: WikiData = { imageUrl: '', description: '', wikiUrl: '' };

  try {
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
  } catch {
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
    } catch {
      // Both methods failed
    }
  }

  imageCache.set(latinName, result);
  return result;
}

export async function enrichWithImages(plants: any): Promise<any> {
  if (!plants) return plants;

  const isArray = Array.isArray(plants);
  const plantList = isArray ? plants : [plants];

  const enriched = await Promise.all(
    plantList.map(async (plant: any) => {
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
