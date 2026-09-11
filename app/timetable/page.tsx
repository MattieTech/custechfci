'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import {
  ChevronRight,
  Home,
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Printer,
  Search,
  Loader2,
  CalendarDays,
  Download,
  CalendarPlus,
  Filter,
  Check,
  type LucideIcon,
} from 'lucide-react';
import { CountdownWidget } from '@/components/countdown-widget';

type TimetableType = 'lecture' | 'ca_test' | 'exam';

type TimetableEntry = {
  id: string;
  course_code: string;
  course_title: string;
  timetable_type: TimetableType;
  day_of_week: string | null;
  exam_date: string | null;
  start_time: string;
  end_time: string;
  venue: string | null;
  level: number;
  semester: number;
  session: string | null;
  is_published: boolean;
};

const TABS: { id: TimetableType; label: string; icon: LucideIcon; desc: string }[] = [
  { id: 'lecture', label: 'Lecture Schedule', icon: BookOpen, desc: 'Weekly lecture timetable and hall allocations' },
  { id: 'ca_test', label: 'CA Test Timetable', icon: ClipboardCheck, desc: 'Continuous Assessment tests and quiz schedules' },
  { id: 'exam', label: 'Exam Timetable', icon: GraduationCap, desc: 'Official semester examination schedule and venues' },
];

const DEPARTMENTS = [
  { id: 'all', label: 'All Departments' },
  { id: 'cs', label: 'Computer Science', code: 'CSC' },
  { id: 'se', label: 'Software Engineering', code: 'SWE' },
  { id: 'cyb', label: 'Cyber Security', code: 'CYB' },
  { id: 'ict', label: 'Information & Comm. Tech', code: 'IFT' },
  { id: 'lis', label: 'Library & Info Science', code: 'LIS' },
];

const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function buildGoogleCalendarUrl(entry: TimetableEntry) {
  const title = encodeURIComponent(`${entry.course_code}: ${entry.course_title}`);
  const location = encodeURIComponent(entry.venue || 'CUSTECH Osara');
  const details = encodeURIComponent(`${entry.level}L ${entry.timetable_type.toUpperCase()} | Faculty of Computing and Informatics, CUSTECH Osara`);

  let startIso = '';
  let endIso = '';

  if (entry.exam_date) {
    const dStr = entry.exam_date.replace(/-/g, '');
    const sTime = entry.start_time.replace(/:/g, '').slice(0, 4) + '00';
    const eTime = entry.end_time.replace(/:/g, '').slice(0, 4) + '00';
    startIso = `${dStr}T${sTime}`;
    endIso = `${dStr}T${eTime}`;
  } else {
    const targetDay = entry.day_of_week || 'Monday';
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetDayIdx = days.indexOf(targetDay);
    const now = new Date();
    const diff = (targetDayIdx - now.getDay() + 7) % 7;
    const nextDate = new Date();
    nextDate.setDate(now.getDate() + (diff === 0 ? 7 : diff));
    const yyyy = nextDate.getFullYear();
    const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
    const dd = String(nextDate.getDate()).padStart(2, '0');
    const dStr = `${yyyy}${mm}${dd}`;
    const sTime = entry.start_time.replace(/:/g, '').slice(0, 4) + '00';
    const eTime = entry.end_time.replace(/:/g, '').slice(0, 4) + '00';
    startIso = `${dStr}T${sTime}`;
    endIso = `${dStr}T${eTime}`;
  }

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
}

function downloadIcs(entries: TimetableEntry[], filename = 'fci_schedule.ics') {
  if (entries.length === 0) return;

  let icsLines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CUSTECH Osara//FCI Timetable//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  entries.forEach((e) => {
    let startIso = '';
    let endIso = '';
    let rrule = '';

    if (e.exam_date) {
      const dStr = e.exam_date.replace(/-/g, '');
      const sTime = e.start_time.replace(/:/g, '').slice(0, 4) + '00';
      const eTime = e.end_time.replace(/:/g, '').slice(0, 4) + '00';
      startIso = `${dStr}T${sTime}`;
      endIso = `${dStr}T${eTime}`;
    } else {
      const targetDay = e.day_of_week || 'Monday';
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const targetDayIdx = days.indexOf(targetDay);
      const now = new Date();
      const diff = (targetDayIdx - now.getDay() + 7) % 7;
      const nextDate = new Date();
      nextDate.setDate(now.getDate() + (diff === 0 ? 7 : diff));
      const yyyy = nextDate.getFullYear();
      const mm = String(nextDate.getMonth() + 1).padStart(2, '0');
      const dd = String(nextDate.getDate()).padStart(2, '0');
      const dStr = `${yyyy}${mm}${dd}`;
      const sTime = e.start_time.replace(/:/g, '').slice(0, 4) + '00';
      const eTime = e.end_time.replace(/:/g, '').slice(0, 4) + '00';
      startIso = `${dStr}T${sTime}`;
      endIso = `${dStr}T${eTime}`;
      const dayAbbr = targetDay.slice(0, 2).toUpperCase();
      rrule = `RRULE:FREQ=WEEKLY;BYDAY=${dayAbbr}`;
    }

    icsLines.push(
      'BEGIN:VEVENT',
      `UID:${e.id}@custech.edu.ng`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
      `DTSTART:${startIso}`,
      `DTEND:${endIso}`,
      `SUMMARY:${e.course_code}: ${e.course_title}`,
      `DESCRIPTION:${e.level}L ${e.timetable_type.toUpperCase()} | Faculty of Computing and Informatics`,
      `LOCATION:${e.venue || 'CUSTECH Osara'}`,
      ...(rrule ? [rrule] : []),
      'BEGIN:VALARM',
      'TRIGGER:-PT30M',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder: Class in 30 minutes',
      'END:VALARM',
      'END:VEVENT'
    );
  });

  icsLines.push('END:VCALENDAR');

  const blob = new Blob([icsLines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export default function TimetablePage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<TimetableType>('lecture');
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [calendarMenuOpenId, setCalendarMenuOpenId] = useState<string | null>(null);

  useEffect(() => {
    async function loadPublishedTimetable() {
      setLoading(true);
      try {
        let query = supabase
          .from('exam_timetable')
          .select('*')
          .eq('is_published', true);

        if (activeTab === 'exam') {
          query = query.or('timetable_type.eq.exam,timetable_type.is.null');
        } else {
          query = query.eq('timetable_type', activeTab);
        }

        if (selectedLevel) {
          query = query.eq('level', selectedLevel);
        }

        if (activeTab === 'lecture') {
          query = query.order('start_time', { ascending: true });
        } else {
          query = query.order('exam_date', { ascending: true }).order('start_time', { ascending: true });
        }

        const { data, error } = await query;
        if (error) throw error;
        setEntries(data || []);
      } catch {
        setEntries([]);
      } finally {
        setLoading(false);
      }
    }

    loadPublishedTimetable();
  }, [activeTab, selectedLevel]);

  // Department and Search filtering
  const filteredEntries = entries.filter((entry) => {
    // Department filter
    if (selectedDepartment !== 'all') {
      const dept = DEPARTMENTS.find((d) => d.id === selectedDepartment);
      if (dept && dept.code) {
        const matchesCode = entry.course_code.toUpperCase().includes(dept.code);
        if (!matchesCode && !entry.course_title.toLowerCase().includes(dept.label.toLowerCase())) {
          return false;
        }
      }
    }

    // Search query
    const q = searchQuery.toLowerCase();
    return (
      entry.course_code.toLowerCase().includes(q) ||
      entry.course_title.toLowerCase().includes(q) ||
      (entry.venue && entry.venue.toLowerCase().includes(q)) ||
      (entry.day_of_week && entry.day_of_week.toLowerCase().includes(q))
    );
  });

  // Group lectures by day of the week
  const groupedLectures = DAYS_ORDER.map((day) => ({
    day,
    entries: filteredEntries.filter((e) => (e.day_of_week || '').toLowerCase() === day.toLowerCase()),
  })).filter((group) => group.entries.length > 0);

  // Group exams / tests by date
  const groupedDates = filteredEntries.reduce((acc, curr) => {
    const d = curr.exam_date || 'Undated';
    if (!acc[d]) acc[d] = [];
    acc[d].push(curr);
    return acc;
  }, {} as Record<string, TimetableEntry[]>);

  const activeTabMeta = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="flex flex-col min-h-screen bg-brand-50/40 dark:bg-brand-950">
      {/* Page Header */}
      <div className="bg-white dark:bg-brand-900 border-b border-brand-200 dark:border-brand-800 py-8 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <nav className="flex items-center text-sm font-medium text-brand-500 mb-4">
            <Link href="/" className="hover:text-brand-800 dark:hover:text-brand-300 flex items-center">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-brand-900 dark:text-brand-100">Timetable</span>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-brand-600 dark:text-brand-400 font-semibold">{activeTabMeta.label}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-950 dark:text-brand-50 font-heading">
                Academic Timetables
              </h1>
              <p className="mt-2 text-brand-600 dark:text-brand-400 max-w-2xl text-sm md:text-base">
                Official schedules for lectures, continuous assessments, and examinations at CUSTECH Osara.
              </p>
            </div>

            <div className="flex items-center gap-2.5 print:hidden self-start md:self-auto flex-wrap">
              {/* Export All to Calendar */}
              <button
                onClick={() => downloadIcs(filteredEntries, `custech_${activeTab}_schedule.ics`)}
                disabled={filteredEntries.length === 0}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors"
                title="Download .ics calendar to sync all entries to phone with alarms"
              >
                <CalendarPlus size={16} />
                <span>Export My Schedule (.ics)</span>
              </button>

              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-brand-950 border border-brand-200 dark:border-brand-800 hover:bg-brand-50 dark:hover:bg-brand-900 text-brand-800 dark:text-brand-200 text-xs sm:text-sm font-medium rounded-lg shadow-sm transition-colors"
              >
                <Printer size={16} />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Navigation Category Tabs */}
          <div className="flex flex-wrap gap-2 mt-8 border-b border-brand-200 dark:border-brand-800">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-brand-600 text-brand-700 dark:text-brand-300 dark:border-brand-400 font-semibold'
                      : 'border-transparent text-brand-500 hover:text-brand-900 dark:hover:text-brand-100'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto max-w-6xl px-4 md:px-6 py-8 flex-grow">
        {/* Academic Countdown Banner */}
        <CountdownWidget
          key={activeTab}
          variant="banner"
          defaultMilestoneId={activeTab === 'exam' ? 'sem1-exam' : 'sem1-ca'}
          showSelector={false}
          className="mb-6 print:hidden"
        />

        {/* Controls: Department & Level Selector & Search */}
        <div className="bg-white dark:bg-brand-900 rounded-2xl shadow-sm border border-brand-200 dark:border-brand-800 p-4 sm:p-5 mb-8 print:hidden flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Level Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-400 mr-1 shrink-0">Level:</span>
              <button
                onClick={() => setSelectedLevel(null)}
                className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors shrink-0 ${
                  selectedLevel === null
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-brand-50 dark:bg-brand-800/60 text-brand-700 dark:text-brand-300 hover:bg-brand-100'
                }`}
              >
                All Levels
              </button>
              {[100, 200, 300, 400].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors shrink-0 ${
                    selectedLevel === lvl
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-brand-50 dark:bg-brand-800/60 text-brand-700 dark:text-brand-300 hover:bg-brand-100'
                  }`}
                >
                  {lvl}L
                </button>
              ))}
            </div>

            {/* Department Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="text-xs font-semibold uppercase tracking-wider text-brand-400 shrink-0">Department:</span>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full md:w-56 px-3 py-1.5 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-brand-500"
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by course code, title, or hall..."
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Content Render */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="animate-spin text-brand-600 mb-3" size={32} />
            <p className="text-sm text-brand-500">Loading {activeTabMeta.label.toLowerCase()}...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-brand-900 rounded-2xl border border-dashed border-brand-200 dark:border-brand-800 text-center px-6">
            <div className="h-16 w-16 bg-brand-100 dark:bg-brand-800 text-brand-600 dark:text-brand-300 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold font-heading text-brand-900 dark:text-brand-100 mb-2">
              No {activeTabMeta.label} entries match your filters
            </h2>
            <p className="text-sm text-brand-600 dark:text-brand-400 max-w-md mb-6">
              Try selecting &quot;All Departments&quot; or &quot;All Levels&quot;, or check back soon as management publishes new schedules.
            </p>
          </div>
        ) : activeTab === 'lecture' ? (
          /* LECTURE SCHEDULE */
          <div className="space-y-8">
            {groupedLectures.map((group) => (
              <div key={group.day} className="space-y-3">
                <div className="flex items-center gap-2 border-b border-brand-200 dark:border-brand-800 pb-2">
                  <CalendarDays className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  <h2 className="text-lg font-bold font-heading text-brand-900 dark:text-brand-100">
                    {group.day}
                  </h2>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-300 ml-auto">
                    {group.entries.length} {group.entries.length === 1 ? 'Class' : 'Classes'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.entries.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-brand-900 rounded-xl border border-brand-200 dark:border-brand-800 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-extrabold text-base text-brand-900 dark:text-brand-100 tracking-tight">
                            {item.course_code}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded font-medium bg-brand-100 dark:bg-brand-800 text-brand-800 dark:text-brand-200">
                            {item.level}L &bull; S{item.semester}
                          </span>
                        </div>
                        <h3 className="text-sm font-medium text-brand-700 dark:text-brand-300 line-clamp-2">
                          {item.course_title}
                        </h3>
                      </div>

                      <div className="mt-4 pt-4 border-t border-brand-100 dark:border-brand-800 space-y-2 text-xs">
                        <div className="flex items-center text-brand-600 dark:text-brand-400 font-medium">
                          <Clock size={14} className="mr-1.5 text-brand-500 shrink-0" />
                          <span>
                            {item.start_time.substring(0, 5)} - {item.end_time.substring(0, 5)}
                          </span>
                        </div>
                        <div className="flex items-center text-brand-600 dark:text-brand-400">
                          <MapPin size={14} className="mr-1.5 text-brand-500 shrink-0" />
                          <span className="truncate">{item.venue || 'Venue TBA'}</span>
                        </div>

                        {/* Calendar Sync Options */}
                        <div className="pt-2 flex items-center gap-2 print:hidden">
                          <a
                            href={buildGoogleCalendarUrl(item)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-brand-600 dark:text-brand-400 hover:text-brand-800 font-semibold"
                          >
                            <CalendarPlus size={12} />
                            <span>Google Cal</span>
                          </a>
                          <span className="text-brand-300 dark:text-brand-700">&bull;</span>
                          <button
                            onClick={() => downloadIcs([item], `${item.course_code}.ics`)}
                            className="inline-flex items-center gap-1 text-[11px] text-brand-600 dark:text-brand-400 hover:text-brand-800 font-semibold"
                          >
                            <Download size={12} />
                            <span>Apple/iCal</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* CA TEST & EXAM TIMETABLES */
          <div className="space-y-6">
            {Object.entries(groupedDates).map(([dateStr, items]) => {
              const formattedDate =
                dateStr !== 'Undated'
                  ? new Date(dateStr).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'Date to be announced';

              return (
                <div key={dateStr} className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-brand-200 dark:border-brand-800 pb-2">
                    <Calendar className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                    <h2 className="text-base sm:text-lg font-bold font-heading text-brand-900 dark:text-brand-100">
                      {formattedDate}
                    </h2>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-300 ml-auto">
                      {items.length} {items.length === 1 ? 'Paper' : 'Papers'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white dark:bg-brand-900 rounded-xl border border-brand-200 dark:border-brand-800 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="font-extrabold text-base text-brand-900 dark:text-brand-100 tracking-tight">
                              {item.course_code}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded font-medium bg-brand-100 dark:bg-brand-800 text-brand-800 dark:text-brand-200">
                              {item.level}L &bull; S{item.semester}
                            </span>
                          </div>
                          <h3 className="text-sm font-medium text-brand-700 dark:text-brand-300 line-clamp-2">
                            {item.course_title}
                          </h3>
                        </div>

                        <div className="mt-4 pt-4 border-t border-brand-100 dark:border-brand-800 space-y-2 text-xs">
                          <div className="flex items-center text-brand-600 dark:text-brand-400 font-medium">
                            <Clock size={14} className="mr-1.5 text-brand-500 shrink-0" />
                            <span>
                              {item.start_time.substring(0, 5)} - {item.end_time.substring(0, 5)}
                            </span>
                          </div>
                          <div className="flex items-center text-brand-600 dark:text-brand-400">
                            <MapPin size={14} className="mr-1.5 text-brand-500 shrink-0" />
                            <span className="truncate">{item.venue || 'Venue TBA'}</span>
                          </div>

                          {/* Calendar Sync Options */}
                          <div className="pt-2 flex items-center gap-2 print:hidden">
                            <a
                              href={buildGoogleCalendarUrl(item)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] text-brand-600 dark:text-brand-400 hover:text-brand-800 font-semibold"
                            >
                              <CalendarPlus size={12} />
                              <span>Google Cal</span>
                            </a>
                            <span className="text-brand-300 dark:text-brand-700">&bull;</span>
                            <button
                              onClick={() => downloadIcs([item], `${item.course_code}.ics`)}
                              className="inline-flex items-center gap-1 text-[11px] text-brand-600 dark:text-brand-400 hover:text-brand-800 font-semibold"
                            >
                              <Download size={12} />
                              <span>Apple/iCal</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
