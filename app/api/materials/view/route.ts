import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const { materialId } = await request.json();

    if (!materialId) {
      return NextResponse.json({ error: 'Material ID is required' }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // 1. Fetch current download_count
    const { data: current, error: fetchErr } = await supabaseAdmin
      .from('materials')
      .select('download_count')
      .eq('id', materialId)
      .single();

    if (fetchErr) {
      return NextResponse.json({ error: fetchErr.message }, { status: 404 });
    }

    const newCount = (current?.download_count || 0) + 1;

    // 2. Increment download_count
    const { error: updateErr } = await supabaseAdmin
      .from('materials')
      .update({ download_count: newCount })
      .eq('id', materialId);

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: newCount });
  } catch (err: any) {
    console.error('Error incrementing material view:', err);
    return NextResponse.json({ error: err?.message || 'Failed to update view count' }, { status: 500 });
  }
}
