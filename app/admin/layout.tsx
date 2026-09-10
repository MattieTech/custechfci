'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  LayoutDashboard,
  FileText,
  Megaphone,
  CalendarDays,
  Users,
  LogOut,
  Menu,
  X,
  GraduationCap,
  ChevronRight,
  UserCheck,
  Radio,
  Inbox,
  PackageSearch,
} from 'lucide-react';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Onboard Reps & Staff', icon: UserCheck },
  { href: '/admin/broadcast', label: 'Social Broadcast Hub', icon: Radio },
  { href: '/admin/grievances', label: 'Student Grievances', icon: Inbox },
  { href: '/admin/lost-and-found', label: 'Lost & Found Desk', icon: PackageSearch },
  { href: '/admin/materials', label: 'Materials', icon: FileText },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/admin/timetable', label: 'Timetable', icon: CalendarDays },
  { href: '/admin/contacts', label: 'Contacts & Groups', icon: Users },
];


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserEmail(user.email || '');
      }
    });
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  // Don't show admin layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-brand-50 dark:bg-brand-950">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-brand-900 border-r border-brand-200 dark:border-brand-800 transform transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-brand-200 dark:border-brand-800">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-heading font-bold text-sm text-brand-900 dark:text-brand-100">
                FCI Admin
              </div>
              <div className="text-[10px] text-brand-500 dark:text-brand-400 uppercase tracking-wider">
                Dashboard
              </div>
            </div>
          </Link>
          <button
            className="lg:hidden p-1 text-brand-500 hover:text-brand-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-100 dark:bg-brand-800 text-brand-900 dark:text-brand-100'
                    : 'text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-800/50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-brand-200 dark:border-brand-800">
          <div className="px-3 py-2 mb-2">
            <div className="text-xs text-brand-500 dark:text-brand-400 truncate">
              {userEmail}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <Link
            href="/"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-800/50 transition-colors mt-1"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-brand-900/80 backdrop-blur-sm border-b border-brand-200 dark:border-brand-800">
          <div className="flex items-center justify-between px-4 py-3 lg:px-6">
            <button
              className="lg:hidden p-2 text-brand-600 hover:bg-brand-100 dark:hover:bg-brand-800 rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-sm font-medium text-brand-600 dark:text-brand-400">
              {adminNavItems.find((item) => item.href === pathname)?.label ||
                'Admin'}
            </div>
            <div className="w-8 h-8 rounded-full bg-brand-200 dark:bg-brand-700 flex items-center justify-center text-xs font-bold text-brand-700 dark:text-brand-300">
              {userEmail.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
