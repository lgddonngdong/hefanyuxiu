import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase-server';
import { enrichWithImages } from '@/lib/wikipedia';
import { mockPlants, mockFamilies } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function paginate(arr: any[], page: number, limit: number) {
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

function filterPlants(plants: any[], filters: Record<string, string>) {
  let result = [...plants];
  if (filters.family) result = result.filter(p => p.family === filters.family);
  if (filters.genus) result = result.filter(p => p.genus === filters.genus);
  if (filters.is_native !== undefined) result = result.filter(p => p.is_native === (filters.is_native === 'true'));
  if (filters.life_form) result = result.filter(p => p.life_form === filters.life_form);
  return result;
}

// GET /api/plants
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  if (!isSupabaseConfigured) {
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const filters: Record<string, string> = {};
    if (searchParams.get('family')) filters.family = searchParams.get('family')!;
    if (searchParams.get('genus')) filters.genus = searchParams.get('genus')!;
    if (searchParams.get('is_native') !== null) filters.is_native = searchParams.get('is_native')!;
    if (searchParams.get('life_form')) filters.life_form = searchParams.get('life_form')!;

    const filtered = filterPlants(mockPlants, filters);
    const result = paginate(filtered, page, limit);
    const enrichedData = await enrichWithImages(result.data);
    return NextResponse.json({ ...result, data: enrichedData });
  }

  try {
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('plants')
      .select('*', { count: 'exact' })
      .order('id', { ascending: true })
      .range(offset, offset + limit - 1);

    if (searchParams.get('family')) query = query.eq('family', searchParams.get('family'));
    if (searchParams.get('genus')) query = query.eq('genus', searchParams.get('genus'));
    if (searchParams.get('is_native') !== null) query = query.eq('is_native', searchParams.get('is_native') === 'true');
    if (searchParams.get('life_form')) query = query.eq('life_form', searchParams.get('life_form'));

    const { data, error, count } = await query;
    if (error) throw error;

    const enrichedData = await enrichWithImages(data || []);

    return NextResponse.json({
      data: enrichedData,
      pagination: { page, limit, total: count || 0, total_pages: Math.ceil((count || 0) / limit) },
    });
  } catch (error: any) {
    console.error('Get plants error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/plants
export async function POST(request: NextRequest) {
  const body = await request.json();

  if (!isSupabaseConfigured) {
    const newPlant = {
      id: Math.max(...mockPlants.map(p => p.id)) + 1,
      ...body,
      image_url: body.image_url || '',
      description: body.description || '',
      is_native: body.is_native !== undefined ? body.is_native : true,
      life_form: body.life_form || '草本',
      habitat: body.habitat || '',
      location: body.location || '',
      survey_date: body.survey_date || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    };
    mockPlants.push(newPlant);
    return NextResponse.json({ data: newPlant }, { status: 201 });
  }

  try {
    const { name_cn, name_latin, family, genus, image_url, description, is_native, life_form, habitat, location, survey_date } = body;

    if (!name_cn || !name_latin || !family || !genus) {
      return NextResponse.json({ error: 'Missing required fields: name_cn, name_latin, family, genus' }, { status: 400 });
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
    return NextResponse.json({ data: data[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Create plant error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
