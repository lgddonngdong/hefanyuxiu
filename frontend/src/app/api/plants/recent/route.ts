import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase-server';
import { enrichWithImages } from '@/lib/wikipedia';
import { mockPlants } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '6');

  if (!isSupabaseConfigured) {
    const recent = [...mockPlants].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ).slice(0, limit);
    const enrichedData = await enrichWithImages(recent);
    return NextResponse.json({ data: enrichedData });
  }

  try {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;

    const enrichedData = await enrichWithImages(data || []);
    return NextResponse.json({ data: enrichedData });
  } catch (error: any) {
    console.error('Get recent plants error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
