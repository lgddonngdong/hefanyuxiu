import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase-server';
import { mockStats } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json(mockStats);
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

    return NextResponse.json({
      total_records: totalCount || 0,
      total_families: uniqueFamilies,
      total_genera: uniqueGenera,
      native_species: nativeCount || 0,
      exotic_species: exoticCount,
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
