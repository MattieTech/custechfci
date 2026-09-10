'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { 
  Search, 
  Sun, 
  Moon, 
  Menu, 
  ChevronDown,
  Zap,
  Calculator,
  Bot,
  Calendar,
  Clock,
  Inbox,
  Newspaper,
  Mail,
  Info,
  BookOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { HEADER_NAV_ITEMS, NavDropdownItem } from '@/lib/constants';
import { SearchDialog } from './search-dialog';
import { MobileNav } from './mobile-nav';
import { NotificationBell } from './notification-bell';

const DROPDOWN_ICONS: Record<string, React.ElementType> = {
  zap: Zap,
  calculator: Calculator,
  bot: Bot,
  calendar: Calendar,
  clock: Clock,
  inbox: Inbox,
  search: Search,
  newspaper: Newspaper,
  mail: Mail,
  info: Info,
  book: BookOpen,
};

export function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => setMounted(true), []);

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdown(null);
  }, [pathname]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpenDropdown(null);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 transition-colors shadow-xs">
      <div className="container mx-auto px-2.5 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg py-1 px-1.5 hover:bg-slate-100/80 dark:hover:bg-zinc-900 transition-colors shrink-0"
        >
          <div className="relative h-8 sm:h-10 w-24 sm:w-44 shrink-0">
            <Image
              src="/images/school-logo.png"
              alt="CUSTECH Logo"
              fill
              className="object-contain object-left"
              sizes="(max-width: 640px) 128px, 176px"
              priority
            />
          </div>
          <div className="flex flex-col border-l border-slate-300 dark:border-zinc-700 pl-2.5 ml-0.5">
            <span className="font-heading font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
              FCI Portal
            </span>
            <span className="text-[11px] text-brand-700 dark:text-brand-300 font-semibold leading-none hidden sm:block">
              Student Guide
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Visible on lg: 1024px and wider) */}
        <nav ref={navRef} className="hidden lg:flex items-center gap-1 xl:gap-2">
          {HEADER_NAV_ITEMS.map((item) => {
            if (item.children) {
              const isChildActive = item.children.some(
                (child) => pathname === child.href || (child.href !== '/' && pathname.startsWith(child.href))
              );
              const isOpen = openDropdown === item.label;

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                    aria-expanded={isOpen}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                      isChildActive
                        ? 'bg-brand-100 dark:bg-brand-900/70 text-brand-900 dark:text-brand-100 font-bold'
                        : isOpen
                        ? 'bg-slate-100 dark:bg-zinc-800 text-slate-950 dark:text-white'
                        : 'text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-950 dark:hover:text-white'
                    )}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 transition-transform duration-200 text-slate-500 dark:text-zinc-400',
                        isOpen && 'rotate-180 text-brand-600 dark:text-brand-400'
                      )}
                    />
                  </button>

                  {/* Dropdown Menu Panel - 100% Solid opaque background & high-contrast text */}
                  {isOpen && (
                    <div
                      className="absolute left-0 mt-2 w-84 sm:w-96 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700/80 p-2.5 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 z-50 animate-fade-in"
                      role="menu"
                    >
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 px-3 py-1.5 border-b border-slate-100 dark:border-zinc-800 mb-1.5">
                        {item.label}
                      </div>
                      <div className="space-y-1">
                        {item.children.map((child: NavDropdownItem) => {
                          const isItemActive = pathname === child.href || (child.href !== '/' && pathname.startsWith(child.href));
                          const IconComponent = DROPDOWN_ICONS[child.iconName] || BookOpen;

                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setOpenDropdown(null)}
                              className={cn(
                                'flex items-start gap-3 p-2.5 rounded-xl transition-all group',
                                isItemActive
                                  ? 'bg-brand-50 dark:bg-zinc-800 border-l-2 border-brand-600'
                                  : 'hover:bg-slate-100/90 dark:hover:bg-zinc-800/70'
                              )}
                              role="menuitem"
                            >
                              <div
                                className={cn(
                                  'p-2 rounded-lg shrink-0 transition-colors',
                                  isItemActive
                                    ? 'bg-brand-600 text-white shadow-xs'
                                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 group-hover:bg-brand-600 group-hover:text-white'
                                )}
                              >
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1.5">
                                  <span
                                    className={cn(
                                      'text-sm font-bold truncate',
                                      isItemActive
                                        ? 'text-brand-950 dark:text-white'
                                        : 'text-slate-900 dark:text-zinc-100 group-hover:text-brand-600 dark:group-hover:text-brand-400'
                                    )}
                                  >
                                    {child.label}
                                  </span>
                                  {child.badge && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 shrink-0">
                                      {child.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-600 dark:text-zinc-400 group-hover:text-slate-800 dark:group-hover:text-zinc-300 line-clamp-1 mt-0.5 font-medium">
                                  {child.description}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            // Direct Top-Level Link
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href!}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                  isActive
                    ? 'bg-brand-100 dark:bg-brand-900/70 text-brand-900 dark:text-brand-100 font-bold'
                    : 'text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:text-slate-950 dark:hover:text-white'
                )}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-600 text-white shadow-xs ml-0.5">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Global Search Button */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-lg text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 font-medium"
            aria-label="Search site"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-zinc-400" />
            <span className="hidden xl:inline text-xs text-slate-500 dark:text-zinc-400">Quick search (Ctrl+K)</span>
          </button>

          {/* Notification Bell */}
          <NotificationBell />

          {/* Theme Switcher Toggle (Desktop) */}
          {mounted && (
            <button
              type="button"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-transparent hover:border-slate-200 dark:hover:border-zinc-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 hidden sm:flex items-center justify-center"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
          )}

          {/* Mobile / Tablet Menu Hamburger (Visible below lg: 1024px) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
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
