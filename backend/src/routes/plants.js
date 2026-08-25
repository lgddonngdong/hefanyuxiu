import { Router } from 'express';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { enrichWithImages } from '../lib/wikipedia.js';
import { mockPlants, mockFamilies } from '../lib/mockData.js';

const router = Router();

// Helper: paginate mock data
function paginate(arr, page, limit) {
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

// Helper: filter mock data
function filterPlants(plants, filters) {
  let result = [...plants];
  if (filters.family) result = result.filter(p => p.family === filters.family);
  if (filters.genus) result = result.filter(p => p.genus === filters.genus);
  if (filters.is_native !== undefined) result = result.filter(p => p.is_native === (filters.is_native === 'true'));
  if (filters.life_form) result = result.filter(p => p.life_form === filters.life_form);
  return result;
}

// Helper: search mock data
function searchPlants(plants, q, type) {
  if (!q) return [];
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

/**
 * GET /api/plants
 */
router.get('/', async (req, res) => {
  if (!isSupabaseConfigured) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const filters = {};
    if (req.query.family) filters.family = req.query.family;
    if (req.query.genus) filters.genus = req.query.genus;
    if (req.query.is_native !== undefined) filters.is_native = req.query.is_native;
    if (req.query.life_form) filters.life_form = req.query.life_form;

    const filtered = filterPlants(mockPlants, filters);
    const result = paginate(filtered, page, limit);
    const enrichedData = await enrichWithImages(result.data);
    return res.json({ ...result, data: enrichedData });
  }

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('plants')
      .select('*', { count: 'exact' })
      .order('id', { ascending: true })
      .range(offset, offset + limit - 1);

    if (req.query.family) query = query.eq('family', req.query.family);
    if (req.query.genus) query = query.eq('genus', req.query.genus);
    if (req.query.is_native !== undefined) query = query.eq('is_native', req.query.is_native === 'true');
    if (req.query.life_form) query = query.eq('life_form', req.query.life_form);

    const { data, error, count } = await query;
    if (error) throw error;

    const enrichedData = await enrichWithImages(data || []);

    res.json({
      data: enrichedData,
      pagination: { page, limit, total: count || 0, total_pages: Math.ceil((count || 0) / limit) },
    });
  } catch (error) {
    console.error('Get plants error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/plants/recent
 */
router.get('/recent', async (req, res) => {
  if (!isSupabaseConfigured) {
    const limit = parseInt(req.query.limit) || 6;
    const recent = [...mockPlants].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, limit);
    const enrichedData = await enrichWithImages(recent);
    return res.json({ data: enrichedData });
  }

  try {
    const limit = parseInt(req.query.limit) || 6;
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;

    const enrichedData = await enrichWithImages(data || []);
    res.json({ data: enrichedData });
  } catch (error) {
    console.error('Get recent plants error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/plants/families
 */
router.get('/families', async (req, res) => {
  if (!isSupabaseConfigured) {
    return res.json({ data: mockFamilies });
  }

  try {
    const { data, error } = await supabase.from('plants').select('family, genus');
    if (error) throw error;

    const familyMap = {};
    (data || []).forEach(p => {
      if (!familyMap[p.family]) familyMap[p.family] = { family: p.family, count: 0, genera: new Set() };
      familyMap[p.family].count++;
      if (p.genus) familyMap[p.family].genera.add(p.genus);
    });

    const families = Object.values(familyMap)
      .map(f => ({ family: f.family, count: f.count, genus_count: f.genera.size }))
      .sort((a, b) => b.count - a.count);

    res.json({ data: families });
  } catch (error) {
    console.error('Get families error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/plants/search
 */
router.get('/search', async (req, res) => {
  const q = req.query.q || '';
  const type = req.query.type || 'all';

  if (!isSupabaseConfigured) {
    const results = searchPlants(mockPlants, q, type);
    const enrichedData = await enrichWithImages(results);
    return res.json({ data: enrichedData });
  }

  try {
    if (!q) return res.json({ data: [] });

    let query = supabase.from('plants').select('*');

    if (type === 'name_cn') query = query.ilike('name_cn', `%${q}%`);
    else if (type === 'name_latin') query = query.ilike('name_latin', `%${q}%`);
    else if (type === 'family') query = query.ilike('family', `%${q}%`);
    else if (type === 'genus') query = query.ilike('genus', `%${q}%`);
    else query = query.or(`name_cn.ilike.%${q}%,name_latin.ilike.%${q}%,family.ilike.%${q}%,genus.ilike.%${q}%`);

    const { data, error } = await query.order('name_cn', { ascending: true }).limit(100);
    if (error) throw error;

    const enrichedData = await enrichWithImages(data || []);
    res.json({ data: enrichedData });
  } catch (error) {
    console.error('Search plants error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/plants/:id
 */
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (!isSupabaseConfigured) {
    const plant = mockPlants.find(p => p.id === id);
    if (!plant) return res.status(404).json({ error: 'Plant not found' });
    const enrichedData = await enrichWithImages(plant);
    return res.json({ data: enrichedData });
  }

  try {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return res.status(404).json({ error: 'Plant not found' });
      throw error;
    }

    const enrichedData = await enrichWithImages(data);
    res.json({ data: enrichedData });
  } catch (error) {
    console.error('Get plant error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/plants
 */
router.post('/', async (req, res) => {
  if (!isSupabaseConfigured) {
    const newPlant = {
      id: Math.max(...mockPlants.map(p => p.id)) + 1,
      ...req.body,
      image_url: req.body.image_url || '',
      description: req.body.description || '',
      is_native: req.body.is_native !== undefined ? req.body.is_native : true,
      life_form: req.body.life_form || '草本',
      habitat: req.body.habitat || '',
      location: req.body.location || '',
      survey_date: req.body.survey_date || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    };
    mockPlants.push(newPlant);
    return res.status(201).json({ data: newPlant });
  }

  try {
    const { name_cn, name_latin, family, genus, image_url, description, is_native, life_form, habitat, location, survey_date } = req.body;

    if (!name_cn || !name_latin || !family || !genus) {
      return res.status(400).json({ error: 'Missing required fields: name_cn, name_latin, family, genus' });
    }

    const { data, error } = await supabase
      .from('plants')
      .insert([{
        name_cn, name_latin, family, genus,
        image_url: image_url || '',
        description: description || '',
        is_native: is_native !== undefined ? is_native : true,
        life_form: life_form || '草本',
        habitat: habitat || '',
        location: location || '',
        survey_date: survey_date || new Date().toISOString().split('T')[0],
      }])
      .select();

    if (error) throw error;
    res.status(201).json({ data: data[0] });
  } catch (error) {
    console.error('Create plant error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/plants/:id
 */
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (!isSupabaseConfigured) {
    const idx = mockPlants.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Plant not found' });
    mockPlants[idx] = { ...mockPlants[idx], ...req.body, id };
    return res.json({ data: mockPlants[idx] });
  }

  try {
    const updates = { ...req.body };
    delete updates.id;
    delete updates.created_at;

    const { data, error } = await supabase
      .from('plants')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) return res.status(404).json({ error: 'Plant not found' });

    res.json({ data: data[0] });
  } catch (error) {
    console.error('Update plant error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/plants/:id
 */
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  if (!isSupabaseConfigured) {
    const idx = mockPlants.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Plant not found' });
    mockPlants.splice(idx, 1);
    return res.json({ message: 'Plant deleted successfully' });
  }

  try {
    const { error } = await supabase.from('plants').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Plant deleted successfully' });
  } catch (error) {
    console.error('Delete plant error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
