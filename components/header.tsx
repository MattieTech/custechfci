'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Search, Sun, Moon, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_LINKS } from '@/lib/constants';
import { SearchDialog } from './search-dialog';
import { MobileNav } from './mobile-nav';
import { NotificationBell } from './notification-bell';

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-brand-50/90 dark:bg-brand-950/90 border-b border-brand-200 dark:border-brand-800 transition-colors">
      <div className="container mx-auto px-3 sm:px-4 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg py-1 px-1.5 hover:bg-brand-100/50 dark:hover:bg-brand-900/50 transition-colors"
        >
          <div className="relative h-9 sm:h-10 w-36 sm:w-48 flex-shrink-0">
            <Image
              src="/images/school-logo.png"
              alt="CUSTECH Logo"
              fill
              className="object-contain object-left"
              sizes="(max-width: 640px) 144px, 192px"
              priority
            />
          </div>
          <div className="flex flex-col border-l border-brand-300 dark:border-brand-700 pl-2.5 ml-0.5">
            <span className="font-heading font-bold text-sm sm:text-base text-brand-950 dark:text-brand-50 leading-tight">
              FCI Portal
            </span>
            <span className="text-[10px] text-brand-600 dark:text-brand-400 font-medium leading-none hidden xs:block">
              Student Guide
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                  isActive
                    ? 'bg-brand-100 dark:bg-brand-900/70 text-brand-900 dark:text-brand-100 font-semibold'
                    : 'text-brand-700 dark:text-brand-300 hover:bg-brand-100/50 dark:hover:bg-brand-800/40 hover:text-brand-950 dark:hover:text-brand-50'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Global Search Button */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-lg text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-800/60 border border-transparent hover:border-brand-200 dark:hover:border-brand-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label="Search site"
          >
            <Search className="w-5 h-5" />
            <span className="hidden xl:inline text-xs text-brand-500">Quick search (Ctrl+K)</span>
          </button>

          {/* Notification Bell */}
          <NotificationBell />

          {/* Theme Switcher Toggle (Desktop) */}
          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-800/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 hidden sm:flex items-center justify-center"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-lg text-brand-800 dark:text-brand-200 hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label="Open navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Global Modals */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <MobileNav open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />
    </header>
  );
}
