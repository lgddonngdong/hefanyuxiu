/**
 * Client-side data layer using built-in mock data.
 * All 241 plant records are embedded in the app.
 * Wikipedia images are fetched client-side with CORS support.
 */

import { mockPlants, mockStats, mockFamilies, type PlantRecord } from './mock-data';

export interface Plant extends PlantRecord {}

export interface Stats {
  total_records: number;
  total_families: number;
  total_genera: number;
  native_species: number;
  exotic_species: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// In-memory store for plants added at runtime (demonstration only)
const plantStore: Plant[] = [...mockPlants];

// Wikipedia image cache
const imageCache = new Map<string, { imageUrl: string; description: string; wikiUrl: string }>();

async function fetchWikipediaImage(latinName: string): Promise<{ imageUrl: string; description: string; wikiUrl: string }> {
  if (!latinName) return { imageUrl: '', description: '', wikiUrl: '' };
  if (imageCache.has(latinName)) return imageCache.get(latinName)!;

  let result = { imageUrl: '', description: '', wikiUrl: '' };

  try {
    const encoded = encodeURIComponent(latinName);
    // Use MediaWiki API with CORS support
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages|extracts&titles=${encoded}&pithumbsize=400&exintro=true&origin=*`;

    const resp = await fetch(url, {
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
    // Fallback: try REST API
    try {
      const encoded = encodeURIComponent(latinName);
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`;
      const resp = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (resp.ok) {
        const data = await resp.json();
        if (data.thumbnail?.source) result.imageUrl = data.thumbnail.source;
        else if (data.originalimage?.source) result.imageUrl = data.originalimage.source;
        result.description = data.extract || '';
        result.wikiUrl = data.content_urls?.desktop?.page || '';
      }
    } catch {
      // Both methods failed
    }
  }

  imageCache.set(latinName, result);
  return result;
}

async function enrichWithImages(plants: Plant[]): Promise<Plant[]> {
  return Promise.all(
    plants.map(async (plant) => {
      if (plant.image_url) return plant;
      const wiki = await fetchWikipediaImage(plant.name_latin);
      return {
        ...plant,
        image_url: wiki.imageUrl || plant.image_url,
        description: plant.description || wiki.description,
        wikipedia_url: wiki.wikiUrl || plant.wikipedia_url,
      };
    })
  );
}

async function enrichSingle(plant: Plant): Promise<Plant> {
  if (plant.image_url) return plant;
  const wiki = await fetchWikipediaImage(plant.name_latin);
  return {
    ...plant,
    image_url: wiki.imageUrl || plant.image_url,
    description: plant.description || wiki.description,
    wikipedia_url: wiki.wikiUrl || plant.wikipedia_url,
  };
}

function paginate(arr: Plant[], page: number, limit: number): PaginatedResponse<Plant> {
  const offset = (page - 1) * limit;
  return {
    data: arr.slice(offset, offset + limit),
    pagination: {
      page,
      limit,
      total: arr.length,
      total_pages: Math.ceil(arr.length / limit),
    },
  };
}

function filterPlants(plants: Plant[], filters: Record<string, string>): Plant[] {
  let result = [...plants];
  if (filters.family) result = result.filter(p => p.family === filters.family);
  if (filters.genus) result = result.filter(p => p.genus === filters.genus);
  if (filters.is_native !== undefined) result = result.filter(p => p.is_native === (filters.is_native === 'true'));
  if (filters.life_form) result = result.filter(p => p.life_form === filters.life_form);
  return result;
}

function searchPlants(plants: Plant[], q: string, type: string): Plant[] {
  if (!q) return plants;
  const lower = q.toLowerCase();
  return plants.filter(p => {
    if (type === 'name_cn') return p.name_cn.toLowerCase().includes(lower);
    if (type === 'name_latin') return p.name_latin.toLowerCase().includes(lower);
    if (type === 'family') return p.family.toLowerCase().includes(lower);
    if (type === 'genus') return p.genus.toLowerCase().includes(lower);
    return p.name_cn.toLowerCase().includes(lower) ||
           p.name_latin.toLowerCase().includes(lower) ||
           p.family.toLowerCase().includes(lower) ||
           p.genus.toLowerCase().includes(lower);
  });
}

export const api = {
  // Stats
  getStats: (): Promise<{ data: Stats }> =>
    Promise.resolve({ data: mockStats }),

  // Plants
  getPlants: async (page = 1, limit = 20, filters?: Record<string, string>): Promise<PaginatedResponse<Plant>> => {
    let plants = [...plantStore];
    if (filters) plants = filterPlants(plants, filters);
    const result = paginate(plants, page, limit);
    result.data = await enrichWithImages(result.data);
    return result;
  },

  getPlant: async (id: number): Promise<{ data: Plant }> => {
    const plant = plantStore.find(p => p.id === id);
    if (!plant) throw new Error('Plant not found');
    return { data: await enrichSingle(plant) };
  },

  getRecentPlants: async (limit = 6): Promise<{ data: Plant[] }> => {
    const recent = [...plantStore].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, limit);
    return { data: await enrichWithImages(recent) };
  },

  searchPlants: async (q: string, type?: string): Promise<{ data: Plant[] }> => {
    const results = searchPlants(plantStore, q, type || 'all');
    return { data: await enrichWithImages(results.slice(0, 100)) };
  },

  getFamilies: (): Promise<{ data: Array<{ family: string; count: number; genus_count: number }> }> =>
    Promise.resolve({ data: mockFamilies }),

  // Create (demonstration only - data is in-memory)
  createPlant: async (plant: Partial<Plant>): Promise<{ data: Plant }> => {
    const newPlant: Plant = {
      id: Math.max(...plantStore.map(p => p.id)) + 1,
      name_cn: plant.name_cn || '',
      name_latin: plant.name_latin || '',
      family: plant.family || '',
      genus: plant.genus || '',
      image_url: plant.image_url || '',
      description: plant.description || '',
      wikipedia_url: plant.wikipedia_url || '',
      is_native: plant.is_native !== undefined ? plant.is_native : true,
      life_form: plant.life_form || '草本',
      habitat: plant.habitat || '',
      location: plant.location || '',
      survey_date: plant.survey_date || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    };
    plantStore.push(newPlant);
    return { data: newPlant };
  },

  // Update (demonstration only)
  updatePlant: async (id: number, updates: Partial<Plant>): Promise<{ data: Plant }> => {
    const idx = plantStore.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Plant not found');
    plantStore[idx] = { ...plantStore[idx], ...updates, id };
    return { data: plantStore[idx] };
  },

  // Delete (demonstration only)
  deletePlant: async (id: number): Promise<{ message: string }> => {
    const idx = plantStore.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Plant not found');
    plantStore.splice(idx, 1);
    return { message: 'Plant deleted successfully' };
  },
};
