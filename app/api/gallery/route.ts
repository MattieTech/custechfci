import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createAdminClient } from '@/lib/supabase/admin';
import { INITIAL_GALLERY_IMAGES, GalleryImage } from '@/lib/gallery-data';

const DATA_DIR = path.join(process.cwd(), 'data');
const GALLERY_JSON_PATH = path.join(DATA_DIR, 'gallery.json');
const MANIFEST_PATH = 'gallery_manifest.json';
const BUCKET_NAME = 'announcements';

async function fetchRemoteManifest(): Promise<GalleryImage[] | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;

  try {
    const manifestUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/${MANIFEST_PATH}?t=${Date.now()}`;
    const res = await fetch(manifestUrl, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Could not fetch remote gallery manifest:', err);
  }
  return null;
}

async function saveRemoteManifest(images: GalleryImage[]): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    const buffer = Buffer.from(JSON.stringify(images, null, 2), 'utf-8');
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(MANIFEST_PATH, buffer, {
        contentType: 'application/json',
        upsert: true,
      });

    if (!error) {
      return true;
    }
    console.warn('Error saving remote gallery manifest:', error.message);
  } catch (err: any) {
    console.warn('Supabase client error saving manifest:', err?.message);
  }
  return false;
}

async function readLocalManifest(): Promise<GalleryImage[] | null> {
  try {
    if (fs.existsSync(GALLERY_JSON_PATH)) {
      const content = await fs.promises.readFile(GALLERY_JSON_PATH, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Read-only or missing
  }
  return null;
}

async function saveLocalManifest(images: GalleryImage[]): Promise<void> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    await fs.promises.writeFile(GALLERY_JSON_PATH, JSON.stringify(images, null, 2), 'utf-8');
  } catch {
    // Read-only filesystem, safe to ignore
  }
}

async function getGalleryList(): Promise<GalleryImage[]> {
  // 1. Try remote manifest in cloud storage (shared everywhere)
  const remote = await fetchRemoteManifest();
  if (remote !== null) {
    // Sync to local cache if local disk is writable
    saveLocalManifest(remote).catch(() => {});
    return remote;
  }

  // 2. Try local cache file
  const local = await readLocalManifest();
  if (local !== null) {
    return local;
  }

  // 3. Fallback to default verified initial images
  return [...INITIAL_GALLERY_IMAGES];
}

async function persistGalleryList(images: GalleryImage[]): Promise<void> {
  // Always save to cloud storage and local disk in parallel
  await Promise.allSettled([
    saveRemoteManifest(images),
    saveLocalManifest(images),
  ]);
}

export async function GET() {
  try {
    const images = await getGalleryList();
    return NextResponse.json({ images });
  } catch (err: any) {
    console.error('Gallery GET error:', err);
    return NextResponse.json({ images: INITIAL_GALLERY_IMAGES });
  }
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

    const currentImages = await getGalleryList();
    const updatedImages = [newImage, ...currentImages.filter((img) => img.id !== newImage.id)];
    await persistGalleryList(updatedImages);

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

    const currentImages = await getGalleryList();
    const filteredImages = currentImages.filter((img) => img.id !== id);
    await persistGalleryList(filteredImages);

    return NextResponse.json({ success: true, remaining: filteredImages.length });
  } catch (err: any) {
    console.error('Gallery DELETE error:', err);
    return NextResponse.json({ error: err?.message || 'Failed to delete image' }, { status: 500 });
  }
}
