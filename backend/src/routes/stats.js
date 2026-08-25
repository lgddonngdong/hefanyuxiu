import { Router } from 'express';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { mockStats } from '../lib/mockData.js';

const router = Router();

/**
 * GET /api/stats
 * Returns overall database statistics
 */
router.get('/', async (req, res) => {
  // Use mock data if Supabase is not configured
  if (!isSupabaseConfigured) {
    return res.json(mockStats);
  }

  try {
    const { count: totalCount, error: totalError } = await supabase
      .from('plants')
      .select('*', { count: 'exact', head: true });

    if (totalError) throw totalError;

    const { data: familyData, error: familyError } = await supabase
      .from('plants')
      .select('family, genus');

    if (familyError) throw familyError;

    const uniqueFamilies = new Set(familyData?.map(p => p.family) || []).size;
    const uniqueGenera = new Set(familyData?.map(p => p.genus) || []).size;

    const { count: nativeCount, error: nativeError } = await supabase
      .from('plants')
      .select('*', { count: 'exact', head: true })
      .eq('is_native', true);

    if (nativeError) throw nativeError;

    const exoticCount = (totalCount || 0) - (nativeCount || 0);

    res.json({
      total_records: totalCount || 0,
      total_families: uniqueFamilies,
      total_genera: uniqueGenera,
      native_species: nativeCount || 0,
      exotic_species: exoticCount,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
