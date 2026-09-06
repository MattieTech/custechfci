'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  X,
  Sun,
  Moon,
  Home,
  Building2,
  BookOpen,
  Calendar,
  Newspaper,
  Info,
  Phone,
  ShieldCheck,
  Calculator,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_LINKS } from '@/lib/constants';

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LINK_ICONS: Record<string, React.ReactNode> = {
  '/': <Home className="w-5 h-5 text-brand-500" />,
  '/departments': <Building2 className="w-5 h-5 text-brand-500" />,
  '/resources': <BookOpen className="w-5 h-5 text-brand-500" />,
  '/timetable': <Calendar className="w-5 h-5 text-brand-500" />,
  '/news': <Newspaper className="w-5 h-5 text-brand-500" />,
  '/about': <Info className="w-5 h-5 text-brand-500" />,
  '/contacts': <Phone className="w-5 h-5 text-brand-500" />,
};

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Handle Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onOpenChange]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] md:hidden" role="dialog" aria-modal="true" aria-label="Mobile Navigation Drawer">
      {/* Full Viewport Dark Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Slide-out Drawer Panel with Fixed Full Height */}
      <div
        className="fixed right-0 top-0 bottom-0 z-10 w-[85%] max-w-[320px] sm:max-w-[360px] h-[100dvh] bg-white dark:bg-brand-950 border-l border-brand-200 dark:border-brand-800 shadow-2xl flex flex-col overflow-hidden animate-slide-up"
      >
        {/* Drawer Header */}
        <div className="h-16 flex-shrink-0 flex items-center justify-between px-4 border-b border-brand-200 dark:border-brand-800 bg-brand-50/80 dark:bg-brand-900/40">
          <div className="flex items-center gap-2.5">
            <div className="relative h-8 w-36 flex-shrink-0">
              <Image
                src="/images/school-logo.png"
                alt="CUSTECH Logo"
                fill
                className="object-contain object-left"
                sizes="144px"
              />
            </div>
            <div className="border-l border-brand-300 dark:border-brand-700 pl-2">
              <span className="font-heading font-bold text-xs text-brand-950 dark:text-brand-50 block leading-tight">
                FCI Portal
              </span>
              <span className="text-[10px] text-brand-600 dark:text-brand-400 font-medium block leading-tight">
                Student Guide
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="p-2.5 rounded-xl text-brand-700 dark:text-brand-300 hover:bg-brand-200/60 dark:hover:bg-brand-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {/* Main Navigation Links */}
          <div>
            <div className="text-[11px] font-bold tracking-wider text-brand-500 dark:text-brand-400 uppercase px-3 mb-2">
              Main Menu
            </div>
            <div className="space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => onOpenChange(false)}
                    className={cn(
                      'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px]',
                      isActive
                        ? 'bg-brand-600 text-white shadow-md'
                        : 'text-brand-800 dark:text-brand-200 hover:bg-brand-100/80 dark:hover:bg-brand-900/60'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? 'text-white' : ''}>
                        {LINK_ICONS[link.href] || <Home className="w-5 h-5 text-brand-500" />}
                      </span>
                      <span>{link.label}</span>
                    </div>
                    <ChevronRight
                      className={cn(
                        'w-4 h-4 transition-transform',
                        isActive ? 'text-white translate-x-0.5' : 'text-brand-400'
                      )}
                    />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Academic Tools */}
          <div>
            <div className="text-[11px] font-bold tracking-wider text-brand-500 dark:text-brand-400 uppercase px-3 mb-2">
              Quick Tools
            </div>
            <div className="space-y-1">
              <Link
                href="/resources?tab=cgpa"
                onClick={() => onOpenChange(false)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-brand-800 dark:text-brand-200 hover:bg-brand-100/80 dark:hover:bg-brand-900/60 transition-all min-h-[44px]"
              >
                <div className="flex items-center gap-3">
                  <Calculator className="w-5 h-5 text-brand-500" />
                  <span>CGPA Calculator</span>
                </div>
                <ChevronRight className="w-4 h-4 text-brand-400" />
              </Link>
              <Link
                href="/resources?tab=materials"
                onClick={() => onOpenChange(false)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-brand-800 dark:text-brand-200 hover:bg-brand-100/80 dark:hover:bg-brand-900/60 transition-all min-h-[44px]"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-brand-500" />
                  <span>Study Materials</span>
                </div>
                <ChevronRight className="w-4 h-4 text-brand-400" />
              </Link>
            </div>
          </div>

          {/* Administration Access */}
          <div>
            <div className="text-[11px] font-bold tracking-wider text-brand-500 dark:text-brand-400 uppercase px-3 mb-2">
              Staff &amp; Admin
            </div>
            <Link
              href="/admin/login"
              onClick={() => onOpenChange(false)}
              className={cn(
                'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px]',
                pathname.startsWith('/admin')
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-brand-800 dark:text-brand-200 hover:bg-brand-100/80 dark:hover:bg-brand-900/60'
              )}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-500" />
                <span>Admin Portal</span>
              </div>
              <ChevronRight className="w-4 h-4 text-brand-400" />
            </Link>
          </div>
        </div>

        {/* Drawer Footer with Theme Toggle */}
        <div className="flex-shrink-0 p-4 border-t border-brand-200 dark:border-brand-800 bg-brand-50/60 dark:bg-brand-900/30 space-y-3">
          <button
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-900 text-brand-900 dark:text-brand-100 text-sm font-semibold shadow-sm hover:bg-brand-100/60 dark:hover:bg-brand-800/60 transition-colors min-h-[44px]"
          >
            <div className="flex items-center gap-2.5">
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-brand-600" />
              )}
              <span>{theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
            </div>
            <span className="text-xs text-brand-500 uppercase font-mono tracking-wider font-bold">
              {theme || 'light'}
            </span>
          </button>
          <div className="text-center text-[10px] text-brand-500 dark:text-brand-400 font-medium">
            Confluence University of Science &amp; Technology, Osara
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
