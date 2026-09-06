'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { NAV_LINKS, DEPARTMENTS } from '@/lib/constants';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SEARCH_DATA = [
  ...NAV_LINKS,
  ...DEPARTMENTS.map(d => ({ label: d.name, href: `/departments/${d.slug}` })),
  { label: 'CGPA Calculator', href: '/resources?tab=cgpa' },
  { label: 'Study Materials', href: '/resources?tab=materials' },
  { label: 'Exam Timetable', href: '/timetable' },
  { label: 'Faculty Rules & Guide', href: '/#guide' },
  { label: '100 Level Contacts', href: '/contacts/100' },
  { label: '200 Level Contacts', href: '/contacts/200' },
  { label: '300 Level Contacts', href: '/contacts/300' },
  { label: '400 Level Contacts', href: '/contacts/400' },
];

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(true);
      }
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [open]);

  if (!open || !mounted) return null;

  const results = query
    ? SEARCH_DATA.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()))
    : [];

  const handleSelect = (href: string) => {
    router.push(href);
    onOpenChange(false);
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 sm:pt-24 bg-black/75 backdrop-blur-sm" onClick={() => onOpenChange(false)}>
      <div 
        className="w-full max-w-xl bg-white dark:bg-brand-900 rounded-2xl shadow-2xl border border-brand-200 dark:border-brand-800 overflow-hidden mx-4 flex flex-col max-h-[80vh] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div className="flex items-center px-4 py-3.5 border-b border-brand-200 dark:border-brand-800 relative bg-brand-50/50 dark:bg-brand-950/40">
          <Search className="w-5 h-5 text-brand-500 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none outline-none text-brand-900 dark:text-brand-50 placeholder:text-brand-400 py-1 text-sm sm:text-base font-medium"
            placeholder="Search resources, departments, timetable..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            onClick={() => onOpenChange(false)}
            className="p-1.5 text-brand-500 hover:bg-brand-200/60 dark:hover:bg-brand-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shrink-0"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {query && (
          <div className="overflow-y-auto p-2 flex-1">
            {results.length > 0 ? (
              <ul role="listbox">
                {results.map((result) => (
                  <li key={result.href} role="option" aria-selected="false">
                    <button
                      onClick={() => handleSelect(result.href)}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-brand-800 dark:text-brand-200 hover:bg-brand-100/80 dark:hover:bg-brand-800 rounded-xl transition-colors focus-visible:bg-brand-100 dark:focus-visible:bg-brand-800 focus-visible:outline-none"
                    >
                      {result.label}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-sm text-brand-500 py-8">No results found for &ldquo;{query}&rdquo;.</p>
            )}
          </div>
        )}

        {!query && (
          <div className="p-4 text-xs text-brand-400 border-t border-brand-100 dark:border-brand-800/60 flex items-center justify-between">
            <span>Tip: Search &ldquo;CS&rdquo;, &ldquo;Timetable&rdquo;, &ldquo;CGPA&rdquo;, or &ldquo;Contacts&rdquo;</span>
            <span className="hidden sm:inline">ESC to close</span>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
