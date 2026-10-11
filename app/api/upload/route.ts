import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'announcements';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const MAX_SIZE = 15 * 1024 * 1024; // 15MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 15MB limit' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop() || 'png';
    const rawName = file.name.substring(0, file.name.lastIndexOf('.')) || 'file';
    const sanitizedName = rawName.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40);
    const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${sanitizedName}.${fileExt}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    let publicUrl = '';

    // 1. Primary: Upload to Supabase Storage (persists globally across all devices/Vercel/production)
    try {
      const supabaseAdmin = createAdminClient();
      const { error: uploadError } = await supabaseAdmin.storage
        .from(bucket)
        .upload(uniqueFileName, buffer, {
          contentType: file.type || 'image/jpeg',
          upsert: true,
        });

      if (!uploadError) {
        const {
          data: { publicUrl: url },
        } = supabaseAdmin.storage.from(bucket).getPublicUrl(uniqueFileName);
        if (url) {
          publicUrl = url;
        }
      } else {
        console.warn('Supabase storage upload returned error:', uploadError.message);
      }
    } catch (sbErr: any) {
      console.warn('Supabase client error during upload:', sbErr?.message);
    }

    // 2. Secondary: If in local development with writable disk, cache to public/uploads
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const localFilePath = path.join(uploadsDir, uniqueFileName);
      await fs.promises.writeFile(localFilePath, buffer);
      if (!publicUrl) {
        publicUrl = `/uploads/${uniqueFileName}`;
      }
    } catch {
      // Read-only filesystem (e.g. Vercel deployment), safely ignored
    }

    if (!publicUrl) {
      return NextResponse.json(
        { error: 'Storage service temporarily unavailable. Please try again.' },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: file.name,
      path: uniqueFileName,
      size: file.size,
    });
  } catch (error: any) {
    console.error('Server upload handler error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process file upload' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { path: filePath, bucket = 'announcements' } = await request.json();

    if (!filePath) {
      return NextResponse.json({ error: 'No file path provided' }, { status: 400 });
    }

    // 1. Try Supabase storage remove
    try {
      const supabaseAdmin = createAdminClient();
      await supabaseAdmin.storage.from(bucket).remove([filePath]);
    } catch {
      // Ignore
    }

    // 2. Try local disk remove if exists
    try {
      const filename = path.basename(filePath);
      const localFile = path.join(process.cwd(), 'public', 'uploads', filename);
      if (fs.existsSync(localFile)) {
        await fs.promises.unlink(localFile);
      }
    } catch {
      // Ignore
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Failed to delete file' }, { status: 500 });
  }
}
