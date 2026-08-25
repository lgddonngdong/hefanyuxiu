import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase-server';
import { enrichWithImages } from '@/lib/wikipedia';
import { mockPlants } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

// GET /api/plants/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  if (!isSupabaseConfigured) {
    const plant = mockPlants.find(p => p.id === id);
    if (!plant) return NextResponse.json({ error: 'Plant not found' }, { status: 404 });
    const enrichedData = await enrichWithImages(plant);
    return NextResponse.json({ data: enrichedData });
  }

  try {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return NextResponse.json({ error: 'Plant not found' }, { status: 404 });
      throw error;
    }

    const enrichedData = await enrichWithImages(data);
    return NextResponse.json({ data: enrichedData });
  } catch (error: any) {
    console.error('Get plant error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT /api/plants/:id
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const body = await request.json();

  if (!isSupabaseConfigured) {
    const idx = mockPlants.findIndex(p => p.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Plant not found' }, { status: 404 });
    mockPlants[idx] = { ...mockPlants[idx], ...body, id };
    return NextResponse.json({ data: mockPlants[idx] });
  }

  try {
    const updates = { ...body };
    delete updates.id;
    delete updates.created_at;

    const { data, error } = await supabase
      .from('plants')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) return NextResponse.json({ error: 'Plant not found' }, { status: 404 });

    return NextResponse.json({ data: data[0] });
  } catch (error: any) {
    console.error('Update plant error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/plants/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  if (!isSupabaseConfigured) {
    const idx = mockPlants.findIndex(p => p.id === id);
    if (idx === -1) return NextResponse.json({ error: 'Plant not found' }, { status: 404 });
    mockPlants.splice(idx, 1);
    return NextResponse.json({ message: 'Plant deleted successfully' });
  }

  try {
    const { error } = await supabase.from('plants').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ message: 'Plant deleted successfully' });
  } catch (error: any) {
    console.error('Delete plant error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
