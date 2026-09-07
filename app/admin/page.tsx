'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  FileText,
  Megaphone,
  CalendarDays,
  Users,
  TrendingUp,
  Clock,
  UserCheck,
} from 'lucide-react';
import Link from 'next/link';

interface Stats {
  materials: number;
  announcements: number;
  upcomingExams: number;
  contacts: number;
  admins: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    materials: 0,
    announcements: 0,
    upcomingExams: 0,
    contacts: 0,
    admins: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    const supabase = createClient();

    const [materialsRes, announcementsRes, timetableRes, contactsRes, profilesRes] =
      await Promise.all([
        supabase.from('materials').select('id', { count: 'exact', head: true }),
        supabase
          .from('announcements')
          .select('id', { count: 'exact', head: true }),
        supabase
          .from('exam_timetable')
          .select('id', { count: 'exact', head: true }),
        supabase.from('contacts').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
      ]);

    setStats({
      materials: materialsRes.count || 0,
      announcements: announcementsRes.count || 0,
      upcomingExams: timetableRes.count || 0,
      contacts: contactsRes.count || 0,
      admins: profilesRes.count || 0,
    });
    setLoading(false);
  }

  const statCards = [
    {
      label: 'Portal Admins & Reps',
      value: stats.admins,
      icon: UserCheck,
      href: '/admin/users',
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30',
    },
    {
      label: 'Total Materials',
      value: stats.materials,
      icon: FileText,
      href: '/admin/materials',
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30',
    },
    {
      label: 'Announcements',
      value: stats.announcements,
      icon: Megaphone,
      href: '/admin/announcements',
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30',
    },
    {
      label: 'Timetable Schedules',
      value: stats.upcomingExams,
      icon: CalendarDays,
      href: '/admin/timetable',
      color: 'text-green-600 bg-green-50 dark:bg-green-950/30',
    },
    {
      label: 'Contact Entries',
      value: stats.contacts,
      icon: Users,
      href: '/admin/contacts',
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/30',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-brand-900 dark:text-brand-100">
          Dashboard
        </h1>
        <p className="text-sm text-brand-500 dark:text-brand-400 mt-1">
          Overview of the FCI Student Guide portal
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white dark:bg-brand-900 rounded-xl border border-brand-200 dark:border-brand-800 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-brand-500 dark:text-brand-400">
                  {card.label}
                </p>
                <p className="text-3xl font-heading font-bold text-brand-900 dark:text-brand-100 mt-1">
                  {loading ? (
                    <span className="inline-block w-12 h-8 bg-brand-100 dark:bg-brand-800 rounded animate-pulse" />
                  ) : (
                    card.value
                  )}
                </p>
              </div>
              <div className={`p-2.5 rounded-lg ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-brand-900 rounded-xl border border-brand-200 dark:border-brand-800 p-6">
        <h2 className="text-lg font-heading font-semibold text-brand-900 dark:text-brand-100 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-500" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link
            href="/admin/users"
            className="flex items-center gap-3 p-4 rounded-lg border border-brand-200 dark:border-brand-800 hover:bg-brand-50 dark:hover:bg-brand-800/50 transition-colors bg-brand-50/40 dark:bg-brand-950/40"
          >
            <UserCheck className="w-5 h-5 text-indigo-600" />
            <div>
              <div className="text-sm font-medium text-brand-900 dark:text-brand-100">
                Onboard Reps &amp; Staff
              </div>
              <div className="text-xs text-brand-500 dark:text-brand-400">
                Add reps &amp; lecturers as portal admins
              </div>
            </div>
          </Link>
          <Link
            href="/admin/materials"
            className="flex items-center gap-3 p-4 rounded-lg border border-brand-200 dark:border-brand-800 hover:bg-brand-50 dark:hover:bg-brand-800/50 transition-colors"
          >
            <FileText className="w-5 h-5 text-brand-500" />
            <div>
              <div className="text-sm font-medium text-brand-900 dark:text-brand-100">
                Upload Material
              </div>
              <div className="text-xs text-brand-500 dark:text-brand-400">
                Add past questions or lecture notes
              </div>
            </div>
          </Link>
          <Link
            href="/admin/announcements"
            className="flex items-center gap-3 p-4 rounded-lg border border-brand-200 dark:border-brand-800 hover:bg-brand-50 dark:hover:bg-brand-800/50 transition-colors"
          >
            <Megaphone className="w-5 h-5 text-brand-500" />
            <div>
              <div className="text-sm font-medium text-brand-900 dark:text-brand-100">
                Post Announcement
              </div>
              <div className="text-xs text-brand-500 dark:text-brand-400">
                Share important news with students
              </div>
            </div>
          </Link>
          <Link
            href="/admin/timetable"
            className="flex items-center gap-3 p-4 rounded-lg border border-brand-200 dark:border-brand-800 hover:bg-brand-50 dark:hover:bg-brand-800/50 transition-colors"
          >
            <CalendarDays className="w-5 h-5 text-brand-500" />
            <div>
              <div className="text-sm font-medium text-brand-900 dark:text-brand-100">
                Update Timetable
              </div>
              <div className="text-xs text-brand-500 dark:text-brand-400">
                Add or modify exam schedules
              </div>
            </div>
          </Link>
          <Link
            href="/admin/contacts"
            className="flex items-center gap-3 p-4 rounded-lg border border-brand-200 dark:border-brand-800 hover:bg-brand-50 dark:hover:bg-brand-800/50 transition-colors"
          >
            <Users className="w-5 h-5 text-purple-500" />
            <div>
              <div className="text-sm font-medium text-brand-900 dark:text-brand-100">
                Manage WhatsApp Groups & Reps
              </div>
              <div className="text-xs text-brand-500 dark:text-brand-400">
                Edit departmental links & representatives
              </div>
            </div>
          </Link>
        </div>
      </div>


      {/* Getting Started */}
      <div className="bg-white dark:bg-brand-900 rounded-xl border border-brand-200 dark:border-brand-800 p-6">
        <h2 className="text-lg font-heading font-semibold text-brand-900 dark:text-brand-100 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-brand-500" />
          Getting Started
        </h2>
        <div className="space-y-3 text-sm text-brand-600 dark:text-brand-400">
          <div className="flex items-start gap-3 p-3 bg-brand-50 dark:bg-brand-800/30 rounded-lg">
            <span className="w-6 h-6 rounded-full bg-brand-200 dark:bg-brand-700 flex items-center justify-center text-xs font-bold text-brand-700 dark:text-brand-300 shrink-0">
              1
            </span>
            <p>
              <strong className="text-brand-900 dark:text-brand-100">
                Upload study materials
              </strong>{' '}
              — Go to Materials and upload past questions, lecture notes, and
              study resources for students.
            </p>
          </div>
          <div className="flex items-start gap-3 p-3 bg-brand-50 dark:bg-brand-800/30 rounded-lg">
            <span className="w-6 h-6 rounded-full bg-brand-200 dark:bg-brand-700 flex items-center justify-center text-xs font-bold text-brand-700 dark:text-brand-300 shrink-0">
              2
            </span>
            <p>
              <strong className="text-brand-900 dark:text-brand-100">
                Post announcements
              </strong>{' '}
              — Keep students informed about deadlines, events, and important
              updates.
            </p>
          </div>
          <div className="flex items-start gap-3 p-3 bg-brand-50 dark:bg-brand-800/30 rounded-lg">
            <span className="w-6 h-6 rounded-full bg-brand-200 dark:bg-brand-700 flex items-center justify-center text-xs font-bold text-brand-700 dark:text-brand-300 shrink-0">
              3
            </span>
            <p>
              <strong className="text-brand-900 dark:text-brand-100">
                Manage exam timetable
              </strong>{' '}
              — Add exam schedules so students can easily find their exam dates
              and venues.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
