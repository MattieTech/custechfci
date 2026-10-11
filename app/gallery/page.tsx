'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Image as ImageIcon,
  ChevronRight,
  Home,
  Upload,
  Calendar,
  Tag,
  Maximize2,
  X,
  Filter,
  Sparkles,
  Camera,
} from 'lucide-react';
import { GalleryImage, getStoredGalleryImages, saveStoredGalleryImages } from '@/lib/gallery-data';

const CATEGORIES = [
  { id: 'all', label: 'All Photos' },
  { id: 'campus', label: 'Campus & Facilities' },
  { id: 'academics', label: 'Academics & Labs' },
  { id: 'events', label: 'Faculty Events' },
  { id: 'students', label: 'Student Life' },
];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeImage, setActiveImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadImages() {
      try {
        const res = await fetch('/api/gallery');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.images)) {
            setImages(data.images);
            saveStoredGalleryImages(data.images);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error('API load failed, falling back to local', err);
      }
      setImages(getStoredGalleryImages());
      setLoading(false);
    }
    loadImages();
  }, []);

  const filteredImages = images.filter((img) => {
    if (selectedCategory === 'all') return true;
    return img.category === selectedCategory;
  });

  return (
    <div className="flex flex-col min-h-screen bg-brand-50/40 dark:bg-brand-950">
      {/* Header Banner */}
      <div className="bg-brand-900 text-white border-b border-brand-800 py-12 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="container mx-auto relative z-10">
          <nav className="flex items-center text-sm font-medium text-brand-300 mb-4">
            <Link href="/" className="hover:text-white flex items-center transition-colors">
              <Home className="h-4 w-4 mr-1.5" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-brand-400" />
            <span className="text-white">Photo Gallery</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-800/80 border border-brand-700 text-xs font-semibold text-emerald-400 mb-3">
                <Camera size={14} />
                <span>Faculty Life &amp; Highlights</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-extrabold tracking-tight">
                Faculty Photo Gallery
              </h1>
              <p className="text-brand-200 text-sm sm:text-base max-w-2xl mt-2 leading-relaxed">
                Explore campus infrastructure, state-of-the-art computer laboratories, academic milestones, and memorable student moments across the Faculty of Computing &amp; Informatics.
              </p>
            </div>

            <Link
              href="/admin/gallery"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all shadow-md shadow-emerald-950/40 shrink-0 self-start md:self-auto"
            >
              <Upload size={16} />
              <span>Admin Upload</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 md:px-6 py-10 flex-grow space-y-8">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-brand-200 dark:border-brand-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-brand-500 dark:text-brand-400 uppercase tracking-wider mr-2">
            <Filter size={14} />
            <span>Filter:</span>
          </div>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-brand-700 dark:bg-brand-600 text-white shadow-sm'
                    : 'bg-white dark:bg-brand-900 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 hover:bg-brand-100 dark:hover:bg-brand-800/50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-brand-900 rounded-2xl border border-brand-200 dark:border-brand-800 overflow-hidden shadow-sm animate-pulse h-80"
              />
            ))}
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="bg-white dark:bg-brand-900 rounded-2xl border border-brand-200 dark:border-brand-800 p-12 text-center max-w-md mx-auto">
            <ImageIcon className="w-12 h-12 text-brand-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-brand-900 dark:text-brand-100 mb-1">
              No photos in this category yet
            </h3>
            <p className="text-xs text-brand-500 dark:text-brand-400 mb-6">
              Photos uploaded by faculty admins and reps will appear here.
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              View all photos &rarr;
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                onClick={() => setActiveImage(image)}
                className="group cursor-pointer bg-white dark:bg-brand-900 rounded-2xl border border-brand-200 dark:border-brand-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Image Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-brand-100 dark:bg-brand-950">
                  <Image
                    src={image.image_url}
                    alt={image.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4 text-white">
                    <span className="text-xs font-semibold flex items-center gap-1">
                      <Maximize2 size={14} /> Tap to expand
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                      {image.category}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 flex flex-col flex-grow justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-semibold text-brand-500 dark:text-brand-400 mb-1.5">
                      <span className="uppercase tracking-wider flex items-center gap-1">
                        <Tag size={12} /> {image.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {image.date}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-lg text-brand-950 dark:text-brand-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {image.title}
                    </h3>
                    <p className="text-xs text-brand-600 dark:text-brand-300 mt-1.5 line-clamp-2 leading-relaxed">
                      {image.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-brand-100 dark:border-brand-800/80 flex items-center justify-between text-xs font-medium text-brand-500">
                    <span className="group-hover:text-brand-900 dark:group-hover:text-brand-200 transition-colors">
                      View full detail
                    </span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white dark:bg-brand-900 rounded-2xl overflow-hidden shadow-2xl border border-brand-200 dark:border-brand-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black">
              <Image
                src={activeImage.image_url}
                alt={activeImage.title}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>

            <div className="p-6 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  {activeImage.category}
                </span>
                <span className="text-xs text-brand-500 dark:text-brand-400 font-medium flex items-center gap-1.5">
                  <Calendar size={13} /> {activeImage.date}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-brand-950 dark:text-brand-50">
                {activeImage.title}
              </h2>
              <p className="text-sm text-brand-700 dark:text-brand-300 leading-relaxed">
                {activeImage.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
