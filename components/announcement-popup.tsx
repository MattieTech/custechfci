'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Megaphone, X, Calendar, Bell, ExternalLink } from 'lucide-react';
import Link from 'next/link';

type Announcement = {
  id: string;
  title: string;
  content: string;
  category: string;
  is_important: boolean;
  image_url: string | null;
  created_at: string;
};

export function AnnouncementPopup() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    async function loadLatestAnnouncement() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('announcements')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error || !data) return;

        setAnnouncement(data);

        // Pop up exactly after 10 seconds of entering the website
        timer = setTimeout(() => {
          setIsOpen(true);
        }, 10000);
      } catch {
        // Ignore network errors
      }
    }

    loadLatestAnnouncement();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  if (!isOpen || !announcement || isDismissed) return null;

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-announcement-title"
    >
      <div className="relative w-full max-w-lg bg-white dark:bg-brand-900 rounded-2xl shadow-2xl border border-brand-200 dark:border-brand-800 overflow-hidden transform transition-all animate-slide-up">
        {/* Decorative Top Banner */}
        <div className="h-2 bg-gradient-to-r from-brand-600 via-amber-500 to-sky-500" />

        {/* Close Button */}
        <button
          onClick={() => {
            setIsOpen(false);
            setIsDismissed(true);
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full text-brand-400 hover:text-brand-700 dark:hover:text-brand-200 hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors z-10"
          aria-label="Close Announcement"
        >
          <X size={20} />
        </button>

        <div className="p-6 sm:p-7">
          {/* Badge & Category Header */}
          <div className="flex flex-wrap items-center gap-2 mb-3.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-100 dark:bg-brand-800 text-brand-800 dark:text-brand-200">
              <Megaphone size={13} className="text-brand-600 dark:text-brand-400" />
              <span className="uppercase tracking-wider">Faculty Notice</span>
            </div>

            {announcement.is_important && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 animate-pulse">
                <Bell size={11} />
                <span>Important</span>
              </span>
            )}

            <span className="text-xs text-brand-400 flex items-center gap-1 ml-auto">
              <Calendar size={12} />
              <span>{new Date(announcement.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </span>
          </div>

          {/* Announcement Title */}
          <h2
            id="popup-announcement-title"
            className="text-xl sm:text-2xl font-bold font-heading text-brand-950 dark:text-brand-50 leading-tight mb-3"
          >
            {announcement.title}
          </h2>

          {/* Optional Image */}
          {announcement.image_url && (
            <div className="relative w-full h-44 mb-4 rounded-xl overflow-hidden border border-brand-200 dark:border-brand-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={announcement.image_url}
                alt={announcement.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content Body */}
          <div className="text-sm sm:text-base text-brand-700 dark:text-brand-200 leading-relaxed max-h-56 overflow-y-auto pr-1">
            <p className="whitespace-pre-line">{announcement.content}</p>
          </div>

          {/* Footer Actions */}
          <div className="mt-6 pt-4 border-t border-brand-100 dark:border-brand-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <Link
              href="/news"
              onClick={() => {
                setIsOpen(false);
                setIsDismissed(true);
              }}
              className="text-xs text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-200 font-semibold inline-flex items-center gap-1 transition-colors"
            >
              <span>View All Announcements</span>
              <ExternalLink size={13} />
            </Link>

            <button
              onClick={() => {
                setIsOpen(false);
                setIsDismissed(true);
              }}
              className="w-full sm:w-auto px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
