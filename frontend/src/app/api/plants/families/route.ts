import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase-server';
import { mockFamilies } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isSupabaseConfigured) {
    return NextResponse.json({ data: mockFamilies });
  }

  try {
    const { data, error } = await supabase.from('plants').select('family, genus');
    if (error) throw error;

    const familyMap: Record<string, { family: string; count: number; genera: Set<string> }> = {};
    (data || []).forEach(p => {
      if (!familyMap[p.family]) familyMap[p.family] = { family: p.family, count: 0, genera: new Set() };
      familyMap[p.family].count++;
      if (p.genus) familyMap[p.family].genera.add(p.genus);
    });

    const families = Object.values(familyMap)
      .map(f => ({ family: f.family, count: f.count, genus_count: f.genera.size }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({ data: families });
  } catch (error: any) {
    console.error('Get families error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
