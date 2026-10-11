import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createAdminClient } from '@/lib/supabase/admin';
import { INITIAL_GALLERY_IMAGES, GalleryImage } from '@/lib/gallery-data';

const DATA_DIR = path.join(process.cwd(), 'data');
const GALLERY_JSON_PATH = path.join(DATA_DIR, 'gallery.json');

async function readPersistentGallery(): Promise<GalleryImage[]> {
  try {
    if (fs.existsSync(GALLERY_JSON_PATH)) {
      const content = await fs.promises.readFile(GALLERY_JSON_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading data/gallery.json:', err);
  }

  // If file doesn't exist yet, seed with initial images
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    await fs.promises.writeFile(GALLERY_JSON_PATH, JSON.stringify(INITIAL_GALLERY_IMAGES, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error creating data/gallery.json:', err);
  }

  return [...INITIAL_GALLERY_IMAGES];
}

async function writePersistentGallery(images: GalleryImage[]): Promise<void> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    await fs.promises.writeFile(GALLERY_JSON_PATH, JSON.stringify(images, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to data/gallery.json:', err);
  }
}

export async function GET() {
  // 1. Try Supabase first if available
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
    // Fall through to filesystem persistent storage
  }

  // 2. Read from persistent file on disk
  const images = await readPersistentGallery();
  return NextResponse.json({ images });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, image_url, category = 'campus', date, featured } = body;

    if (!title || !image_url) {
      return NextResponse.json({ error: 'Title and image are required' }, { status: 400 });
    }

    const newImage: GalleryImage = {
      id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: title.trim(),
      description: (description || '').trim(),
      image_url: image_url.trim(),
      category: category || 'campus',
      date: date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      featured: Boolean(featured),
    };

    // 1. Try Supabase
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
        newImage.id = data.id || newImage.id;
      }
    } catch {
      // Supabase not configured or table missing
    }

    // 2. Persist to disk JSON storage
    const currentImages = await readPersistentGallery();
    const updatedImages = [newImage, ...currentImages.filter((img) => img.id !== newImage.id)];
    await writePersistentGallery(updatedImages);

    return NextResponse.json({ success: true, image: newImage });
  } catch (err: any) {
    console.error('Gallery POST error:', err);
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

    // 1. Try Supabase
    try {
      const supabase = createAdminClient();
      await supabase.from('gallery').delete().eq('id', id);
    } catch {
      // Fall through
    }

    // 2. Persist deletion to disk JSON storage
    const currentImages = await readPersistentGallery();
    const filteredImages = currentImages.filter((img) => img.id !== id);
    await writePersistentGallery(filteredImages);

    return NextResponse.json({ success: true, remaining: filteredImages.length });
  } catch (err: any) {
    console.error('Gallery DELETE error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to delete image' }, { status: 500 });
  }
}
