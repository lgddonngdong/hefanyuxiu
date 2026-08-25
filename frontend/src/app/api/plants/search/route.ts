import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase-server';
import { enrichWithImages } from '@/lib/wikipedia';
import { mockPlants } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function searchPlants(plants: any[], q: string, type: string) {
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all';

  if (!isSupabaseConfigured) {
    const results = searchPlants(mockPlants, q, type);
    const enrichedData = await enrichWithImages(results);
    return NextResponse.json({ data: enrichedData });
  }

  try {
    if (!q) return NextResponse.json({ data: [] });

    let query = supabase.from('plants').select('*');

    if (type === 'name_cn') query = query.ilike('name_cn', `%${q}%`);
    else if (type === 'name_latin') query = query.ilike('name_latin', `%${q}%`);
    else if (type === 'family') query = query.ilike('family', `%${q}%`);
    else if (type === 'genus') query = query.ilike('genus', `%${q}%`);
    else query = query.or(`name_cn.ilike.%${q}%,name_latin.ilike.%${q}%,family.ilike.%${q}%,genus.ilike.%${q}%`);

    const { data, error } = await query.order('name_cn', { ascending: true }).limit(100);
    if (error) throw error;

    const enrichedData = await enrichWithImages(data || []);
    return NextResponse.json({ data: enrichedData });
  } catch (error: any) {
    console.error('Search plants error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
