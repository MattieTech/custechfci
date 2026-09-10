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
  Clock,
  Bot,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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
    <div className="fixed inset-0 z-[100] lg:hidden" role="dialog" aria-modal="true" aria-label="Mobile Navigation Drawer">
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
            <div className="relative h-8 w-32 shrink-0">
              <Image
                src="/images/school-logo.png"
                alt="CUSTECH Logo"
                fill
                className="object-contain object-left"
                sizes="128px"
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
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          {/* Section 1: Academics */}
          <div>
            <div className="text-[11px] font-bold tracking-wider text-brand-500 dark:text-brand-400 uppercase px-3 mb-2">
              Academics &amp; Study
            </div>
            <div className="space-y-1">
              <Link
                href="/"
                onClick={() => onOpenChange(false)}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px]',
                  pathname === '/'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-brand-800 dark:text-brand-200 hover:bg-brand-100/80 dark:hover:bg-brand-900/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <Home className={cn("w-5 h-5", pathname === '/' ? "text-white" : "text-brand-500")} />
                  <span>Home</span>
                </div>
                <ChevronRight className={cn('w-4 h-4', pathname === '/' ? 'text-white' : 'text-brand-400')} />
              </Link>

              <Link
                href="/departments"
                onClick={() => onOpenChange(false)}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px]',
                  pathname.startsWith('/departments')
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-brand-800 dark:text-brand-200 hover:bg-brand-100/80 dark:hover:bg-brand-900/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <Building2 className={cn("w-5 h-5", pathname.startsWith('/departments') ? "text-white" : "text-brand-500")} />
                  <span>Departments</span>
                </div>
                <ChevronRight className={cn('w-4 h-4', pathname.startsWith('/departments') ? 'text-white' : 'text-brand-400')} />
              </Link>

              <Link
                href="/resources"
                onClick={() => onOpenChange(false)}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px]',
                  pathname.startsWith('/resources')
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-brand-800 dark:text-brand-200 hover:bg-brand-100/80 dark:hover:bg-brand-900/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className={cn("w-5 h-5", pathname.startsWith('/resources') ? "text-white" : "text-brand-500")} />
                  <span>Materials Vault</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md", pathname.startsWith('/resources') ? "bg-brand-700 text-white" : "bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-300")}>
                    89+ Notes
                  </span>
                  <ChevronRight className={cn('w-4 h-4', pathname.startsWith('/resources') ? 'text-white' : 'text-brand-400')} />
                </div>
              </Link>
            </div>
          </div>

          {/* Section 2: Interactive Academic Tools */}
          <div>
            <div className="text-[11px] font-bold tracking-wider text-brand-500 dark:text-brand-400 uppercase px-3 mb-2">
              Academic Tools &amp; Prep
            </div>
            <div className="space-y-1">
              <Link
                href="/cbt"
                onClick={() => onOpenChange(false)}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px]',
                  pathname === '/cbt'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-brand-800 dark:text-brand-200 hover:bg-brand-100/80 dark:hover:bg-brand-900/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <Clock className={cn("w-5 h-5", pathname === '/cbt' ? "text-white" : "text-emerald-500")} />
                  <span>FCI Drill: CBT Practice</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md", pathname === '/cbt' ? "bg-brand-700 text-white" : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300")}>
                    Practice
                  </span>
                  <ChevronRight className={cn('w-4 h-4', pathname === '/cbt' ? 'text-white' : 'text-brand-400')} />
                </div>
              </Link>

              <Link
                href="/cgpa"
                onClick={() => onOpenChange(false)}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px]',
                  pathname === '/cgpa'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-brand-800 dark:text-brand-200 hover:bg-brand-100/80 dark:hover:bg-brand-900/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <Calculator className={cn("w-5 h-5", pathname === '/cgpa' ? "text-white" : "text-blue-500")} />
                  <span>Smart CGPA &amp; Forecaster</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md", pathname === '/cgpa' ? "bg-brand-700 text-white" : "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300")}>
                    5.0 Scale
                  </span>
                  <ChevronRight className={cn('w-4 h-4', pathname === '/cgpa' ? 'text-white' : 'text-brand-400')} />
                </div>
              </Link>

              <Link
                href="/ai-tutor"
                onClick={() => onOpenChange(false)}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px]',
                  pathname === '/ai-tutor'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-brand-800 dark:text-brand-200 hover:bg-brand-100/80 dark:hover:bg-brand-900/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <Bot className={cn("w-5 h-5", pathname === '/ai-tutor' ? "text-white" : "text-purple-500")} />
                  <span>Ask FCI AI (Tutor)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md", pathname === '/ai-tutor' ? "bg-brand-700 text-white" : "bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300")}>
                    AI Copilot
                  </span>
                  <ChevronRight className={cn('w-4 h-4', pathname === '/ai-tutor' ? 'text-white' : 'text-brand-400')} />
                </div>
              </Link>

              <Link
                href="/timetable"
                onClick={() => onOpenChange(false)}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px]',
                  pathname === '/timetable'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-brand-800 dark:text-brand-200 hover:bg-brand-100/80 dark:hover:bg-brand-900/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <Calendar className={cn("w-5 h-5", pathname === '/timetable' ? "text-white" : "text-brand-500")} />
                  <span>Lecture &amp; Exam Timetable</span>
                </div>
                <ChevronRight className={cn('w-4 h-4', pathname === '/timetable' ? 'text-white' : 'text-brand-400')} />
              </Link>

              <Link
                href="/calendar"
                onClick={() => onOpenChange(false)}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px]',
                  pathname === '/calendar'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-brand-800 dark:text-brand-200 hover:bg-brand-100/80 dark:hover:bg-brand-900/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <Calendar className={cn("w-5 h-5", pathname === '/calendar' ? "text-white" : "text-brand-500")} />
                  <span>Academic Calendar</span>
                </div>
                <ChevronRight className={cn('w-4 h-4', pathname === '/calendar' ? 'text-white' : 'text-brand-400')} />
              </Link>
            </div>
          </div>

          {/* Section 3: Welfare & Campus Life */}
          <div>
            <div className="text-[11px] font-bold tracking-wider text-brand-500 dark:text-brand-400 uppercase px-3 mb-2">
              Welfare &amp; Campus Life
            </div>
            <div className="space-y-1">
              <Link
                href="/grievances"
                onClick={() => onOpenChange(false)}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px]',
                  pathname === '/grievances'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-brand-800 dark:text-brand-200 hover:bg-brand-100/80 dark:hover:bg-brand-900/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <FileText className={cn("w-5 h-5", pathname === '/grievances' ? "text-white" : "text-amber-500")} />
                  <span>Guild Grievance Box</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md", pathname === '/grievances' ? "bg-brand-700 text-white" : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300")}>
                    Anonymous
                  </span>
                  <ChevronRight className={cn('w-4 h-4', pathname === '/grievances' ? 'text-white' : 'text-brand-400')} />
                </div>
              </Link>

              <Link
                href="/lost-and-found"
                onClick={() => onOpenChange(false)}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px]',
                  pathname === '/lost-and-found'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-brand-800 dark:text-brand-200 hover:bg-brand-100/80 dark:hover:bg-brand-900/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <Search className={cn("w-5 h-5", pathname === '/lost-and-found' ? "text-white" : "text-cyan-500")} />
                  <span>Faculty Lost &amp; Found</span>
                </div>
                <ChevronRight className={cn('w-4 h-4', pathname === '/lost-and-found' ? 'text-white' : 'text-brand-400')} />
              </Link>

              <Link
                href="/news"
                onClick={() => onOpenChange(false)}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px]',
                  pathname === '/news'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-brand-800 dark:text-brand-200 hover:bg-brand-100/80 dark:hover:bg-brand-900/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <Newspaper className={cn("w-5 h-5", pathname === '/news' ? "text-white" : "text-brand-500")} />
                  <span>News &amp; Bulletins</span>
                </div>
                <ChevronRight className={cn('w-4 h-4', pathname === '/news' ? 'text-white' : 'text-brand-400')} />
              </Link>

              <Link
                href="/contacts"
                onClick={() => onOpenChange(false)}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px]',
                  pathname.startsWith('/contacts')
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-brand-800 dark:text-brand-200 hover:bg-brand-100/80 dark:hover:bg-brand-900/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <Phone className={cn("w-5 h-5", pathname.startsWith('/contacts') ? "text-white" : "text-brand-500")} />
                  <span>Course Reps &amp; Directory</span>
                </div>
                <ChevronRight className={cn('w-4 h-4', pathname.startsWith('/contacts') ? 'text-white' : 'text-brand-400')} />
              </Link>

              <Link
                href="/about"
                onClick={() => onOpenChange(false)}
                className={cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all min-h-[44px]',
                  pathname === '/about'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-brand-800 dark:text-brand-200 hover:bg-brand-100/80 dark:hover:bg-brand-900/60'
                )}
              >
                <div className="flex items-center gap-3">
                  <Info className={cn("w-5 h-5", pathname === '/about' ? "text-white" : "text-brand-500")} />
                  <span>About Faculty</span>
                </div>
                <ChevronRight className={cn('w-4 h-4', pathname === '/about' ? 'text-white' : 'text-brand-400')} />
              </Link>
            </div>
          </div>

          {/* Section 4: Administration Access */}
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
