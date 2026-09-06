"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronRight,
  Home,
  Clock,
  Printer,
  CheckCircle2,
  CalendarDays,
  Sparkles,
  BookOpen,
  GraduationCap,
  Bell,
  AlertCircle,
  FileText
} from "lucide-react";
import {
  FIRST_SEMESTER_EVENTS,
  SECOND_SEMESTER_EVENTS,
  ACADEMIC_SESSION,
  INSTITUTION_NAME,
  ISSUED_BY,
  CalendarEvent,
} from "@/lib/academic-calendar";

export default function CalendarPage() {
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const events = selectedSemester === 1 ? FIRST_SEMESTER_EVENTS : SECOND_SEMESTER_EVENTS;

  const filteredEvents = events.filter((ev) => {
    if (filterCategory === "all") return true;
    return ev.category === filterCategory;
  });

  const getCategoryBadge = (category: CalendarEvent['category']) => {
    switch (category) {
      case 'exam':
        return { label: 'Examinations', bg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800' };
      case 'ca_test':
        return { label: 'CA Test / Quiz', bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
      case 'lecture':
        return { label: 'Lectures', bg: 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800' };
      case 'orientation':
        return { label: 'Orientation', bg: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800' };
      case 'registration':
        return { label: 'Registration & Screening', bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
      case 'break':
        return { label: 'Break / Holiday', bg: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
      case 'ceremony':
        return { label: 'Ceremony', bg: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' };
      case 'siwes':
        return { label: 'SIWES / SWEP', bg: 'bg-teal-100 text-teal-800 dark:bg-teal-950/80 dark:text-teal-300 border-teal-200 dark:border-teal-800' };
      default:
        return { label: 'Activity', bg: 'bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-300 border-brand-200' };
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-50/40 dark:bg-brand-950">
      {/* Top Header */}
      <div className="bg-white dark:bg-brand-900 border-b border-brand-200 dark:border-brand-800 py-8 px-4 md:px-6">
        <div className="container mx-auto">
          <nav className="flex items-center text-sm font-medium text-brand-500 mb-4">
            <Link href="/" className="hover:text-brand-800 dark:hover:text-brand-300 flex items-center">
              <Home className="h-4 w-4 mr-1" /> Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-brand-900 dark:text-brand-100">Academic Calendar</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-800/60 text-brand-800 dark:text-brand-200 text-xs font-semibold mb-2 border border-brand-200 dark:border-brand-700">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Session {ACADEMIC_SESSION} Official Calendar</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-brand-950 dark:text-brand-50 font-serif">
                CUSTECH Academic Calendar
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-brand-600 dark:text-brand-400 max-w-2xl">
                {INSTITUTION_NAME} &bull; Prepared by {ISSUED_BY}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-900 text-xs sm:text-sm font-medium text-brand-800 dark:text-brand-200 hover:bg-brand-50 dark:hover:bg-brand-800 shadow-sm transition-colors"
              >
                <Printer size={16} />
                <span>Print Schedule</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 md:px-6 py-8 flex-grow space-y-8">
        {/* Semester Selector & Overview Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-white dark:bg-brand-900 p-6 rounded-2xl border border-brand-200 dark:border-brand-800 shadow-sm flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-brand-900 dark:text-brand-100 font-serif mb-2">
                Select Academic Semester
              </h2>
              <p className="text-xs sm:text-sm text-brand-600 dark:text-brand-400 mb-6">
                Switch between First Semester and Second Semester schedules for the {ACADEMIC_SESSION} session.
              </p>

              {/* Semester Tabs */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedSemester(1)}
                  className={`flex-1 min-w-[200px] p-4 rounded-xl border text-left transition-all ${
                    selectedSemester === 1
                      ? "border-brand-600 bg-brand-50 dark:bg-brand-950 text-brand-950 dark:text-brand-50 shadow-sm ring-2 ring-brand-500/20"
                      : "border-brand-200 dark:border-brand-800 hover:border-brand-400 dark:hover:border-brand-700 bg-white dark:bg-brand-900 text-brand-700 dark:text-brand-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-base">First Semester</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-brand-200/60 dark:bg-brand-800 text-brand-800 dark:text-brand-200">
                      12 Key Activities
                    </span>
                  </div>
                  <p className="text-xs text-brand-600 dark:text-brand-400">
                    Mon 28 Sept 2026 &ndash; Sat 6 Feb 2027
                  </p>
                </button>

                <button
                  onClick={() => setSelectedSemester(2)}
                  className={`flex-1 min-w-[200px] p-4 rounded-xl border text-left transition-all ${
                    selectedSemester === 2
                      ? "border-brand-600 bg-brand-50 dark:bg-brand-950 text-brand-950 dark:text-brand-50 shadow-sm ring-2 ring-brand-500/20"
                      : "border-brand-200 dark:border-brand-800 hover:border-brand-400 dark:hover:border-brand-700 bg-white dark:bg-brand-900 text-brand-700 dark:text-brand-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-base">Second Semester</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-brand-200/60 dark:bg-brand-800 text-brand-800 dark:text-brand-200">
                      8 Key Activities
                    </span>
                  </div>
                  <p className="text-xs text-brand-600 dark:text-brand-400">
                    Mon 22 Feb 2027 &ndash; Sat 19 June 2027
                  </p>
                </button>
              </div>
            </div>

            {/* Quick Filter Bar */}
            <div className="mt-6 pt-4 border-t border-brand-100 dark:border-brand-800/60 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-brand-500 mr-2">Filter by Category:</span>
              {[
                { id: "all", label: "All Activities" },
                { id: "lecture", label: "Lectures" },
                { id: "ca_test", label: "CA Tests" },
                { id: "exam", label: "Examinations" },
                { id: "break", label: "Breaks / Holidays" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterCategory(f.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    filterCategory === f.id
                      ? "bg-brand-800 text-white dark:bg-brand-200 dark:text-brand-900"
                      : "bg-brand-100/60 dark:bg-brand-800 text-brand-700 dark:text-brand-300 hover:bg-brand-200 dark:hover:bg-brand-700"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Notice Card */}
          <div className="bg-brand-900 text-brand-50 p-6 rounded-2xl border border-brand-800 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-brand-300 text-xs font-semibold mb-3">
                <AlertCircle size={15} /> Academic Notice
              </div>
              <h3 className="font-bold text-lg text-white mb-2 font-serif">75% Attendance Rule</h3>
              <p className="text-xs text-brand-200 leading-relaxed mb-4">
                In line with CUSTECH Senate regulations, a minimum of 75% lecture and practical attendance is strictly mandatory to be accredited for semester examinations.
              </p>
            </div>
            <div className="relative z-10 pt-4 border-t border-brand-800 flex items-center justify-between text-xs text-brand-300">
              <span>Directorate of Academic Planning</span>
              <FileText size={16} />
            </div>
          </div>
        </div>

        {/* Detailed Timeline Table */}
        <div className="bg-white dark:bg-brand-900 rounded-2xl border border-brand-200 dark:border-brand-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-brand-100 dark:border-brand-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold text-brand-900 dark:text-brand-100 font-serif">
                {selectedSemester === 1 ? "First Semester Schedule" : "Second Semester Schedule"}
              </h3>
              <p className="text-xs text-brand-500 mt-0.5">
                Official approved dates for lectures, assessments, breaks, and examinations.
              </p>
            </div>
            <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-3 py-1 rounded-full border border-brand-200 dark:border-brand-800 self-start sm:self-auto">
              {filteredEvents.length} {filteredEvents.length === 1 ? "Event" : "Events"} Listed
            </span>
          </div>

          <div className="divide-y divide-brand-100 dark:divide-brand-800">
            {filteredEvents.map((item, idx) => {
              const badge = getCategoryBadge(item.category);
              return (
                <div
                  key={item.id || idx}
                  className={`p-5 sm:p-6 transition-colors hover:bg-brand-50/50 dark:hover:bg-brand-950/40 flex flex-col md:flex-row md:items-start justify-between gap-4 ${
                    item.isMilestone ? "bg-amber-50/20 dark:bg-amber-950/10" : ""
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold border ${badge.bg}`}>
                        {badge.label}
                      </span>
                      {item.isMilestone && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/70 px-2 py-0.5 rounded-md">
                          <Sparkles size={12} /> Key Milestone
                        </span>
                      )}
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-brand-950 dark:text-brand-100">
                      {item.activity}
                    </h4>

                    {item.details && item.details.length > 0 && (
                      <ul className="mt-2.5 space-y-1">
                        {item.details.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start text-xs sm:text-sm text-brand-600 dark:text-brand-400">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-400 mt-2 mr-2 shrink-0" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="shrink-0 md:text-right">
                    <div className="inline-flex items-center gap-1.5 rounded-xl bg-brand-100/80 dark:bg-brand-800/80 px-4 py-2 border border-brand-200 dark:border-brand-700 shadow-sm text-xs sm:text-sm font-semibold text-brand-900 dark:text-brand-100">
                      <Clock size={14} className="text-brand-600 dark:text-brand-400 shrink-0" />
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="p-4 bg-brand-50/70 dark:bg-brand-950/70 border-t border-brand-100 dark:border-brand-800 text-xs text-brand-600 dark:text-brand-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Official Academic Calendar &bull; {INSTITUTION_NAME}</span>
            <span className="font-semibold text-brand-700 dark:text-brand-300">{ISSUED_BY}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
