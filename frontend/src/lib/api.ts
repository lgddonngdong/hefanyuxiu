const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface Plant {
  id: number;
  name_cn: string;
  name_latin: string;
  family: string;
  genus: string;
  image_url: string;
  description: string;
  wikipedia_url: string;
  is_native: boolean;
  life_form: string;
  habitat: string;
  location: string;
  survey_date: string;
  created_at: string;
}

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

async function fetchAPI(endpoint: string, options?: RequestInit) {
  const url = `${API_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
}

export const api = {
  // Stats
  getStats: (): Promise<{ data: Stats }> =>
    fetchAPI('/api/stats').then(r => ({ data: r })),

  // Plants
  getPlants: (page = 1, limit = 20, filters?: Record<string, string>): Promise<PaginatedResponse<Plant>> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => params.set(key, value));
    }
    return fetchAPI(`/api/plants?${params}`);
  },

  getPlant: (id: number): Promise<{ data: Plant }> =>
    fetchAPI(`/api/plants/${id}`),

  getRecentPlants: (limit = 6): Promise<{ data: Plant[] }> =>
    fetchAPI(`/api/plants/recent?limit=${limit}`),

  searchPlants: (q: string, type?: string): Promise<{ data: Plant[] }> =>
    fetchAPI(`/api/plants/search?q=${encodeURIComponent(q)}${type ? `&type=${type}` : ''}`),

  getFamilies: (): Promise<{ data: Array<{ family: string; count: number; genus_count: number }> }> =>
    fetchAPI('/api/plants/families'),

  // Create
  createPlant: (plant: Partial<Plant>): Promise<{ data: Plant }> =>
    fetchAPI('/api/plants', {
      method: 'POST',
      body: JSON.stringify(plant),
    }),

  // Update
  updatePlant: (id: number, updates: Partial<Plant>): Promise<{ data: Plant }> =>
    fetchAPI(`/api/plants/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    }),

  // Delete
  deletePlant: (id: number): Promise<{ message: string }> =>
    fetchAPI(`/api/plants/${id}`, { method: 'DELETE' }),
};
