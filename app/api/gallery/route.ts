import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { INITIAL_GALLERY_IMAGES, GalleryImage } from '@/lib/gallery-data';

// Helper in-memory store for fallback if Supabase table is not configured
let fallbackStore: GalleryImage[] = [...INITIAL_GALLERY_IMAGES];

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return NextResponse.json({ images: data });
    }
  } catch {
    // If Supabase table isn't present, safely return memory/fallback
  }

  return NextResponse.json({ images: fallbackStore });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, image_url, category = 'campus', date } = body;

    if (!title || !image_url) {
      return NextResponse.json({ error: 'Title and image are required' }, { status: 400 });
    }

    const newImage: GalleryImage = {
      id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title,
      description: description || '',
      image_url,
      category: category || 'campus',
      date: date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      featured: Boolean(body.featured),
    };

    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase.from('gallery').insert([
        {
          id: newImage.id,
          title: newImage.title,
          description: newImage.description,
          image_url: newImage.image_url,
          category: newImage.category,
          date: newImage.date,
          featured: newImage.featured,
        },
      ]).select().single();

      if (!error && data) {
        return NextResponse.json({ success: true, image: data });
      }
    } catch {
      // Fall through to memory
    }

    fallbackStore = [newImage, ...fallbackStore];
    return NextResponse.json({ success: true, image: newImage });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to save image' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Image ID is required' }, { status: 400 });
    }

    try {
      const supabase = createAdminClient();
      await supabase.from('gallery').delete().eq('id', id);
    } catch {
      // Fall through
    }

    fallbackStore = fallbackStore.filter((img) => img.id !== id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to delete image' }, { status: 500 });
  }
}
