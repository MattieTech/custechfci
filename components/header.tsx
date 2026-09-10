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
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-brand-950/95 border-b border-brand-200 dark:border-brand-800 transition-colors shadow-xs">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 rounded-lg py-1 px-1.5 hover:bg-brand-100/50 dark:hover:bg-brand-900/50 transition-colors shrink-0"
        >
          <div className="relative h-9 sm:h-10 w-32 sm:w-44 shrink-0">
            <Image
              src="/images/school-logo.png"
              alt="CUSTECH Logo"
              fill
              className="object-contain object-left"
              sizes="(max-width: 640px) 128px, 176px"
              priority
            />
          </div>
          <div className="flex flex-col border-l border-brand-300 dark:border-brand-700 pl-2.5 ml-0.5">
            <span className="font-heading font-bold text-sm sm:text-base text-brand-950 dark:text-brand-50 leading-tight">
              FCI Portal
            </span>
            <span className="text-[10px] text-brand-600 dark:text-brand-400 font-medium leading-none hidden sm:block">
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
                      'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                      isChildActive
                        ? 'bg-brand-100/80 dark:bg-brand-900/80 text-brand-900 dark:text-brand-100 font-semibold'
                        : isOpen
                        ? 'bg-brand-50 dark:bg-brand-900/40 text-brand-900 dark:text-brand-100'
                        : 'text-brand-700 dark:text-brand-300 hover:bg-brand-100/50 dark:hover:bg-brand-800/40 hover:text-brand-950 dark:hover:text-brand-50'
                    )}
                  >
                    <span>{item.label}</span>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 transition-transform duration-200 text-brand-500 dark:text-brand-400',
                        isOpen && 'rotate-180 text-brand-700 dark:text-brand-200'
                      )}
                    />
                  </button>

                  {/* Dropdown Menu Panel */}
                  {isOpen && (
                    <div
                      className="absolute left-0 mt-1 w-80 sm:w-88 rounded-2xl bg-white/98 dark:bg-brand-950/98 backdrop-blur-xl border border-brand-200/90 dark:border-brand-800 p-2 shadow-2xl animate-fade-in z-50"
                      role="menu"
                    >
                      <div className="text-[11px] font-bold uppercase tracking-wider text-brand-500 dark:text-brand-400 px-3 py-1.5 border-b border-brand-100 dark:border-brand-800/80 mb-1">
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
                                  ? 'bg-brand-100/80 dark:bg-brand-900/80'
                                  : 'hover:bg-brand-50 dark:hover:bg-brand-900/40'
                              )}
                              role="menuitem"
                            >
                              <div
                                className={cn(
                                  'p-2 rounded-lg shrink-0 transition-colors',
                                  isItemActive
                                    ? 'bg-brand-600 text-white'
                                    : 'bg-brand-100/70 dark:bg-brand-800/60 text-brand-700 dark:text-brand-300 group-hover:bg-brand-600 group-hover:text-white'
                                )}
                              >
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-1.5">
                                  <span
                                    className={cn(
                                      'text-sm font-semibold truncate',
                                      isItemActive
                                        ? 'text-brand-950 dark:text-white'
                                        : 'text-brand-900 dark:text-brand-100 group-hover:text-brand-600 dark:group-hover:text-brand-400'
                                    )}
                                  >
                                    {child.label}
                                  </span>
                                  {child.badge && (
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-brand-200/60 dark:bg-brand-800/70 text-brand-800 dark:text-brand-300 shrink-0">
                                      {child.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-brand-600 dark:text-brand-400 line-clamp-1 mt-0.5">
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
                  'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                  isActive
                    ? 'bg-brand-100 dark:bg-brand-900/70 text-brand-900 dark:text-brand-100 font-semibold'
                    : 'text-brand-700 dark:text-brand-300 hover:bg-brand-100/50 dark:hover:bg-brand-800/40 hover:text-brand-950 dark:hover:text-brand-50'
                )}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand-200/70 dark:bg-brand-800 text-brand-800 dark:text-brand-300 ml-0.5">
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
            className="flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-lg text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-800/60 border border-transparent hover:border-brand-200 dark:hover:border-brand-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            aria-label="Search site"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
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

          {/* Mobile / Tablet Menu Hamburger (Visible below lg: 1024px) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg text-brand-800 dark:text-brand-200 hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
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
