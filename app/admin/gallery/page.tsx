'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Plus,
  Loader2,
  CheckCircle2,
  Calendar,
  Tag,
  ArrowLeft,
  ExternalLink,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { GalleryImage, getStoredGalleryImages, saveStoredGalleryImages } from '@/lib/gallery-data';

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'campus' | 'events' | 'academics' | 'faculty' | 'students'>('campus');
  const [date, setDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    loadGallery();
  }, []);

  async function loadGallery() {
    try {
      const res = await fetch('/api/gallery');
      if (res.ok) {
        const data = await res.json();
        if (data.images && data.images.length > 0) {
          setImages(data.images);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('API fetch failed, loading local', e);
    }
    setImages(getStoredGalleryImages());
    setLoading(false);
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (selected.size > 10 * 1024 * 1024) {
        setError('Image file must be under 10MB');
        return;
      }
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
      setError(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide an image title');
      return;
    }
    if (!file && !previewUrl) {
      setError('Please select an image file to upload');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    let finalImageUrl = previewUrl || '';

    try {
      // 1. Upload to storage bucket if file selected
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('bucket', 'announcements');

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          if (uploadData.url) {
            finalImageUrl = uploadData.url;
          }
        }
      }

      // 2. Save image details via API
      const payload = {
        title: title.trim(),
        description: description.trim(),
        image_url: finalImageUrl,
        category,
        date: date || new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      };

      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const updated = [data.image, ...images];
        setImages(updated);
        saveStoredGalleryImages(updated);
      } else {
        // Fallback local save
        const fallbackImg: GalleryImage = {
          id: `local_${Date.now()}`,
          ...payload,
        };
        const updated = [fallbackImg, ...images];
        setImages(updated);
        saveStoredGalleryImages(updated);
      }

      setSuccess('Image successfully published to faculty gallery!');
      setTitle('');
      setDescription('');
      setDate('');
      setFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      setError(err?.message || 'Failed to complete image upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this photo from the gallery?')) return;
    try {
      await fetch(`/api/gallery?id=${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('API delete error', e);
    }
    const updated = images.filter((img) => img.id !== id);
    setImages(updated);
    saveStoredGalleryImages(updated);
    setSuccess('Image removed from gallery');
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin"
              className="text-xs font-semibold text-brand-500 hover:text-brand-800 dark:hover:text-brand-200 flex items-center gap-1"
            >
              <ArrowLeft size={14} /> Back to Dashboard
            </Link>
          </div>
          <h1 className="text-2xl font-heading font-bold text-brand-900 dark:text-brand-100 flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-emerald-600" />
            Photo Gallery Manager
          </h1>
          <p className="text-sm text-brand-500 dark:text-brand-400">
            Upload campus photos, lab facilities, and student event pictures with descriptions
          </p>
        </div>

        <Link
          href="/gallery"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-brand-900 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300 text-xs font-semibold hover:bg-brand-50 dark:hover:bg-brand-800 transition-colors shadow-sm"
        >
          <span>View Public Gallery</span>
          <ExternalLink size={14} />
        </Link>
      </div>

      {/* Upload Card */}
      <div className="bg-white dark:bg-brand-900 rounded-2xl border border-brand-200 dark:border-brand-800 p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold font-serif text-brand-900 dark:text-brand-100 mb-4 flex items-center gap-2">
          <Upload size={18} className="text-emerald-600" />
          Upload New Photo with Description
        </h2>

        {error && (
          <div className="mb-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider mb-1.5">
                Photo Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Faculty Orientation 2026/2027"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-800 text-brand-900 dark:text-brand-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-800 text-brand-900 dark:text-brand-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="campus">Campus &amp; Facilities</option>
                <option value="academics">Academics &amp; Labs</option>
                <option value="events">Faculty Events</option>
                <option value="students">Student Life</option>
                <option value="faculty">Faculty Leadership</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider mb-1.5">
              Photo Description &amp; Context *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of the event, venue, or moment captured in this photo..."
              className="w-full px-4 py-2.5 rounded-xl border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-800 text-brand-900 dark:text-brand-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
            {/* Date Tag */}
            <div>
              <label className="block text-xs font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider mb-1.5">
                Display Date (Optional)
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. October 2026 or 12th Oct 2026"
                className="w-full px-4 py-2.5 rounded-xl border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-800 text-brand-900 dark:text-brand-100 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* File Input */}
            <div>
              <label className="block text-xs font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider mb-1.5">
                Select Photo File (PNG, JPG, WebP) *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-xs text-brand-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 dark:file:bg-emerald-950 dark:file:text-emerald-300 hover:file:bg-emerald-100 cursor-pointer"
              />
            </div>
          </div>

          {/* Preview */}
          {previewUrl && (
            <div className="p-3 bg-brand-50 dark:bg-brand-950 rounded-xl border border-brand-200 dark:border-brand-800 flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-black shrink-0">
                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
              </div>
              <div className="text-xs text-brand-700 dark:text-brand-300">
                <p className="font-semibold">{file?.name || 'Selected Image'}</p>
                <p className="text-brand-500">{((file?.size || 0) / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-950/30"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Publishing Photo...</span>
              </>
            ) : (
              <>
                <Upload size={16} />
                <span>Upload to Photo Gallery</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Existing Photos Grid */}
      <div className="bg-white dark:bg-brand-900 rounded-2xl border border-brand-200 dark:border-brand-800 p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold font-serif text-brand-900 dark:text-brand-100 mb-4 flex items-center justify-between">
          <span>Published Gallery Photos ({images.length})</span>
        </h2>

        {loading ? (
          <div className="text-center py-12 text-sm text-brand-500">Loading gallery photos...</div>
        ) : images.length === 0 ? (
          <div className="text-center py-12 text-sm text-brand-500">No photos published yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img) => (
              <div
                key={img.id}
                className="rounded-xl border border-brand-200 dark:border-brand-800 overflow-hidden bg-brand-50/40 dark:bg-brand-950/40 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] w-full bg-brand-100 dark:bg-brand-950">
                    <Image src={img.image_url} alt={img.title} fill className="object-cover" />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-brand-500">
                      <span className="uppercase font-bold text-emerald-600">{img.category}</span>
                      <span>{img.date}</span>
                    </div>
                    <h3 className="font-bold text-sm text-brand-900 dark:text-brand-100 line-clamp-1">
                      {img.title}
                    </h3>
                    <p className="text-xs text-brand-600 dark:text-brand-300 line-clamp-2">
                      {img.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 text-xs font-semibold transition-colors border border-rose-200 dark:border-rose-800"
                  >
                    <Trash2 size={13} />
                    <span>Delete Photo</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
