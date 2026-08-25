/**
 * Data layer using Supabase as the primary data source.
 * Falls back to built-in mock data when Supabase is not configured.
 * Wikipedia images are fetched client-side as a supplement.
 */

import { supabase, isSupabaseConfigured } from './supabase';
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

// Wikipedia image cache
const imageCache = new Map<string, { imageUrl: string; description: string; wikiUrl: string }>();

async function fetchWikipediaImage(latinName: string): Promise<{ imageUrl: string; description: string; wikiUrl: string }> {
  if (!latinName) return { imageUrl: '', description: '', wikiUrl: '' };
  if (imageCache.has(latinName)) return imageCache.get(latinName)!;

  let result = { imageUrl: '', description: '', wikiUrl: '' };

  try {
    const encoded = encodeURIComponent(latinName);
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

// --- Supabase helpers ---

function buildSupabaseFilters(query: any, filters: Record<string, string>) {
  if (filters.family) query = query.eq('family', filters.family);
  if (filters.genus) query = query.eq('genus', filters.genus);
  if (filters.is_native !== undefined) query = query.eq('is_native', filters.is_native === 'true');
  if (filters.life_form) query = query.eq('life_form', filters.life_form);
  return query;
}

// --- Mock data helpers (fallback) ---

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

// --- API ---

export const api = {
  // Stats
  getStats: async (): Promise<{ data: Stats }> => {
    if (isSupabaseConfigured && supabase) {
      const { count: total } = await supabase.from('plants').select('*', { count: 'exact', head: true });
      const { count: nativeCount } = await supabase.from('plants').select('*', { count: 'exact', head: true }).eq('is_native', true);

      const { data: familiesData } = await supabase.from('plants').select('family');
      const families = new Set((familiesData || []).map(r => r.family));

      const { data: generaData } = await supabase.from('plants').select('genus');
      const genera = new Set((generaData || []).map(r => r.genus));

      return {
        data: {
          total_records: total || 0,
          total_families: families.size,
          total_genera: genera.size,
          native_species: nativeCount || 0,
          exotic_species: (total || 0) - (nativeCount || 0),
        },
      };
    }
    return Promise.resolve({ data: mockStats });
  },

  // Plants
  getPlants: async (page = 1, limit = 20, filters?: Record<string, string>): Promise<PaginatedResponse<Plant>> => {
    if (isSupabaseConfigured && supabase) {
      const offset = (page - 1) * limit;
      let query = supabase.from('plants').select('*', { count: 'exact' });
      if (filters) query = buildSupabaseFilters(query, filters);
      query = query.order('id').range(offset, offset + limit - 1);

      const { data, error, count } = await query;
      if (error) throw new Error(error.message);

      const plants = (data || []) as Plant[];
      const total = count || 0;
      const enriched = await enrichWithImages(plants);

      return {
        data: enriched,
        pagination: {
          page,
          limit,
          total,
          total_pages: Math.ceil(total / limit),
        },
      };
    }

    // Fallback to mock data
    let plants = [...mockPlants];
    if (filters) plants = filterPlants(plants, filters);
    const result = paginate(plants, page, limit);
    result.data = await enrichWithImages(result.data);
    return result;
  },

  getPlant: async (id: number): Promise<{ data: Plant }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('plants').select('*').eq('id', id).single();
      if (error) throw new Error(error.message);
      return { data: await enrichSingle(data as Plant) };
    }

    const plant = mockPlants.find(p => p.id === id);
    if (!plant) throw new Error('Plant not found');
    return { data: await enrichSingle(plant) };
  },

  getRecentPlants: async (limit = 6): Promise<{ data: Plant[] }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);
      if (error) throw new Error(error.message);
      return { data: await enrichWithImages((data || []) as Plant[]) };
    }

    const recent = [...mockPlants].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, limit);
    return { data: await enrichWithImages(recent) };
  },

  searchPlants: async (q: string, type?: string): Promise<{ data: Plant[] }> => {
    if (isSupabaseConfigured && supabase) {
      const searchType = type || 'all';
      let query = supabase.from('plants').select('*');

      if (searchType === 'name_cn') {
        query = query.ilike('name_cn', `%${q}%`);
      } else if (searchType === 'name_latin') {
        query = query.ilike('name_latin', `%${q}%`);
      } else if (searchType === 'family') {
        query = query.ilike('family', `%${q}%`);
      } else if (searchType === 'genus') {
        query = query.ilike('genus', `%${q}%`);
      } else {
        query = query.or(`name_cn.ilike.%${q}%,name_latin.ilike.%${q}%,family.ilike.%${q}%,genus.ilike.%${q}%`);
      }

      query = query.limit(100);
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return { data: await enrichWithImages((data || []) as Plant[]) };
    }

    const results = searchPlants(mockPlants, q, type || 'all');
    return { data: await enrichWithImages(results.slice(0, 100)) };
  },

  getFamilies: async (): Promise<{ data: Array<{ family: string; count: number; genus_count: number }> }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('plants').select('family, genus');
      if (error) throw new Error(error.message);

      const familyMap: Record<string, { family: string; count: number; genera: Set<string> }> = {};
      (data || []).forEach((row: any) => {
        if (!familyMap[row.family]) {
          familyMap[row.family] = { family: row.family, count: 0, genera: new Set() };
        }
        familyMap[row.family].count++;
        familyMap[row.family].genera.add(row.genus);
      });

      return {
        data: Object.values(familyMap)
          .map(f => ({ family: f.family, count: f.count, genus_count: f.genera.size }))
          .sort((a, b) => b.count - a.count),
      };
    }

    return Promise.resolve({ data: mockFamilies });
  },

  // Create
  createPlant: async (plant: Partial<Plant>): Promise<{ data: Plant }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('plants').insert([plant]).select().single();
      if (error) throw new Error(error.message);
      return { data: data as Plant };
    }

    // Fallback: in-memory store
    const newPlant: Plant = {
      id: Math.max(...mockPlants.map(p => p.id)) + 1,
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
    mockPlants.push(newPlant);
    return { data: newPlant };
  },

  // Update
  updatePlant: async (id: number, updates: Partial<Plant>): Promise<{ data: Plant }> => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('plants').update(updates).eq('id', id).select().single();
      if (error) throw new Error(error.message);
      return { data: data as Plant };
    }

    const idx = mockPlants.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Plant not found');
    mockPlants[idx] = { ...mockPlants[idx], ...updates, id };
    return { data: mockPlants[idx] };
  },

  // Delete
  deletePlant: async (id: number): Promise<{ message: string }> => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from('plants').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return { message: 'Plant deleted successfully' };
    }

    const idx = mockPlants.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Plant not found');
    mockPlants.splice(idx, 1);
    return { message: 'Plant deleted successfully' };
  },
};
