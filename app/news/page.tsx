'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  ChevronRight,
  Home,
  Calendar as CalendarIcon,
  Filter,
  BellOff,
  Megaphone,
  Bell,
  Loader2,
} from 'lucide-react';

type Announcement = {
  id: string;
  title: string;
  content: string;
  category: string;
  is_important: boolean;
  is_published: boolean;
  image_url: string | null;
  created_at: string;
};

const CATEGORIES = [
  { id: 'all', label: 'All News' },
  { id: 'general', label: 'Official Notices' },
  { id: 'event', label: 'Events' },
  { id: 'academic', label: 'Academic' },
];

export default function NewsPage() {
  const supabase = createClient();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    async function fetchAnnouncements() {
      setLoading(true);
      try {
        let query = supabase
          .from('announcements')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (selectedCategory !== 'all') {
          query = query.eq('category', selectedCategory);
        }

        const { data, error } = await query;
        if (error) throw error;
        setAnnouncements(data || []);
      } catch {
        setAnnouncements([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAnnouncements();
  }, [selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen bg-brand-50/30 dark:bg-brand-950">
      {/* Page Header */}
      <div className="bg-white dark:bg-brand-900 border-b border-brand-200 dark:border-brand-800 py-8 px-4 md:px-6">
        <div className="container mx-auto max-w-5xl">
          <nav className="flex items-center text-sm font-medium text-brand-500 mb-4">
            <Link href="/" className="hover:text-brand-800 dark:hover:text-brand-300 flex items-center">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-brand-900 dark:text-brand-100">News & Announcements</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-950 dark:text-brand-50 font-heading">
                News & Announcements
              </h1>
              <p className="mt-2 text-brand-600 dark:text-brand-400 max-w-2xl text-sm md:text-base">
                Stay updated with official faculty notices, resumption announcements, and events at FCI CUSTECH Osara.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-5xl px-4 md:px-6 py-8 flex-grow">
        {/* Filters */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          <Filter className="h-4 w-4 text-brand-500 mr-2 shrink-0" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2 text-sm font-medium rounded-full transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-brand-900 dark:bg-brand-100 text-brand-50 dark:text-brand-900'
                  : 'bg-white dark:bg-brand-900 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-800 hover:bg-brand-50 dark:hover:bg-brand-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Announcements List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-brand-600 mb-3" size={32} />
            <p className="text-sm text-brand-500">Loading announcements...</p>
          </div>
        ) : announcements.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-brand-900 rounded-2xl border border-brand-200 dark:border-brand-800 border-dashed text-center px-4">
            <div className="h-16 w-16 bg-brand-100 dark:bg-brand-800 text-brand-500 dark:text-brand-400 rounded-full flex items-center justify-center mb-4">
              <BellOff className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold text-brand-900 dark:text-brand-100 mb-2">No announcements found</h2>
            <p className="text-brand-600 dark:text-brand-400 text-center max-w-md text-sm">
              There are no announcements in this category right now. Check back soon for updates.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {announcements.map((item) => (
              <article
                key={item.id}
                className="bg-white dark:bg-brand-900 rounded-2xl border border-brand-200 dark:border-brand-800 p-6 md:p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start"
              >
                {item.image_url && (
                  <div className="w-full md:w-56 h-48 md:h-36 rounded-xl overflow-hidden shrink-0 border border-brand-200 dark:border-brand-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-grow space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-100 dark:bg-brand-800 text-brand-800 dark:text-brand-200 capitalize">
                      <Megaphone size={12} className="text-brand-600 dark:text-brand-400" />
                      <span>{item.category}</span>
                    </span>

                    {item.is_important && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
                        <Bell size={11} />
                        <span>Important</span>
                      </span>
                    )}

                    <span className="text-xs text-brand-400 flex items-center gap-1 ml-auto">
                      <CalendarIcon size={12} />
                      <span>
                        {new Date(item.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold font-heading text-brand-900 dark:text-brand-100">
                    {item.title}
                  </h2>

                  <p className="text-brand-700 dark:text-brand-300 text-sm md:text-base leading-relaxed whitespace-pre-line">
                    {item.content}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
