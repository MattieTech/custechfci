"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Calendar,
  CalendarDays,
  ClipboardCheck,
  BookOpen,
} from "lucide-react";

export type Milestone = {
  id: string;
  title: string;
  shortName: string;
  category: "exam" | "ca_test" | "ceremony" | "resumption";
  targetDate: string;
  displayDate: string;
  description: string;
  badge: string;
  primaryColor: string;
  accentBg: string;
};

export const DEFAULT_MILESTONES: Milestone[] = [
  {
    id: "sem1-resumption",
    title: "2026/2027 Session Resumption",
    shortName: "Session Resumption",
    category: "resumption",
    targetDate: "2026-09-28T08:00:00+01:00",
    displayDate: "Monday, 28 September 2026",
    description: "Official resumption of academic activities and commencement of lectures.",
    badge: "Session Resumption",
    primaryColor: "text-emerald-600 dark:text-emerald-400",
    accentBg: "from-emerald-500/10 via-brand-500/5 to-teal-500/10 dark:from-emerald-950/40 dark:via-brand-950/20 dark:to-teal-950/30",
  },
  {
    id: "sem1-exam",
    title: "First Semester Examination",
    shortName: "1st Sem Exams",
    category: "exam",
    targetDate: "2027-01-25T08:00:00+01:00",
    displayDate: "Monday, 25 January 2027",
    description: "Official 1st semester examinations across all FCI departments.",
    badge: "Faculty Exams",
    primaryColor: "text-rose-600 dark:text-rose-400",
    accentBg: "from-rose-500/10 via-brand-500/5 to-amber-500/10 dark:from-rose-950/40 dark:via-brand-950/20 dark:to-amber-950/30",
  },
  {
    id: "sem1-ca",
    title: "Continuous Assessment (CA) Tests",
    shortName: "CA Tests",
    category: "ca_test",
    targetDate: "2026-12-14T08:00:00+01:00",
    displayDate: "Monday, 14 December 2026",
    description: "Mid-semester continuous assessment tests and CBT evaluations.",
    badge: "Assessments",
    primaryColor: "text-amber-600 dark:text-amber-400",
    accentBg: "from-amber-500/10 via-brand-500/5 to-emerald-500/10 dark:from-amber-950/40 dark:via-brand-950/20 dark:to-emerald-950/30",
  },
  {
    id: "sem1-matric",
    title: "Matriculation Ceremony",
    shortName: "Matriculation",
    category: "ceremony",
    targetDate: "2026-11-11T09:00:00+01:00",
    displayDate: "Wednesday, 11 November 2026",
    description: "Official induction ceremony for newly admitted 100L students.",
    badge: "Freshers Induction",
    primaryColor: "text-purple-600 dark:text-purple-400",
    accentBg: "from-purple-500/10 via-brand-500/5 to-indigo-500/10 dark:from-purple-950/40 dark:via-brand-950/20 dark:to-indigo-950/30",
  },
  {
    id: "sem2-resumption",
    title: "Second Semester Commencement",
    shortName: "2nd Sem Resumption",
    category: "resumption",
    targetDate: "2027-02-22T08:00:00+01:00",
    displayDate: "Monday, 22 February 2027",
    description: "Commencement of lectures and academic activities for 2nd semester.",
    badge: "Next Semester",
    primaryColor: "text-emerald-600 dark:text-emerald-400",
    accentBg: "from-emerald-500/10 via-brand-500/5 to-blue-500/10 dark:from-emerald-950/40 dark:via-brand-950/20 dark:to-blue-950/30",
  },
];

interface CountdownWidgetProps {
  variant?: "hero" | "banner" | "compact";
  defaultMilestoneId?: string;
  showSelector?: boolean;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  isToday: boolean;
}

export function CountdownWidget({
  variant = "hero",
  defaultMilestoneId = "sem1-exam",
  showSelector = true,
  className = "",
}: CountdownWidgetProps) {
  const [selectedId, setSelectedId] = useState<string>(defaultMilestoneId);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
    isToday: false,
  });
  const [isClient, setIsClient] = useState(false);

  const activeMilestone =
    DEFAULT_MILESTONES.find((m) => m.id === selectedId) || DEFAULT_MILESTONES[0];

  useEffect(() => {
    setIsClient(true);

    const calculateTime = () => {
      const targetTime = new Date(activeMilestone.targetDate).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        const isToday = difference > -86400000;
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPast: !isToday,
          isToday,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isPast: false,
        isToday: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [activeMilestone.targetDate]);

  if (!isClient) {
    return (
      <div className={`w-full py-6 px-4 animate-pulse bg-brand-50/50 dark:bg-brand-900/30 rounded-2xl border border-brand-200/60 dark:border-brand-800 ${className}`}>
        <div className="h-6 w-48 bg-brand-200 dark:bg-brand-800 rounded mx-auto mb-4" />
        <div className="h-16 w-3/4 max-w-md bg-brand-200 dark:bg-brand-800 rounded-xl mx-auto" />
      </div>
    );
  }

  // Render COMPACT / BANNER Variant
  if (variant === "compact" || variant === "banner") {
    return (
      <div
        className={`w-full relative overflow-hidden rounded-xl border border-brand-200/80 dark:border-brand-800 bg-gradient-to-r ${activeMilestone.accentBg} p-4 sm:p-5 shadow-sm transition-all ${className}`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-white dark:bg-brand-900 shadow-sm border border-brand-200/70 dark:border-brand-800 text-brand-600 dark:text-brand-400">
              <Clock size={22} className="animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-brand-600 text-white">
                  Countdown
                </span>
                <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                  {activeMilestone.displayDate}
                </span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-brand-950 dark:text-brand-50 mt-0.5">
                {activeMilestone.title}
              </h4>
            </div>
          </div>

          {/* Time digits */}
          <div className="flex items-center gap-2 sm:gap-3">
            {timeLeft.isToday ? (
              <span className="px-4 py-2 rounded-lg bg-rose-600 text-white font-bold text-sm animate-pulse">
                EVENT COMMENCES TODAY
              </span>
            ) : timeLeft.isPast ? (
              <span className="px-4 py-2 rounded-lg bg-brand-200 dark:bg-brand-800 text-brand-800 dark:text-brand-200 font-bold text-sm">
                COMPLETED
              </span>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center bg-white dark:bg-brand-900/90 border border-brand-200 dark:border-brand-700 rounded-lg px-2.5 py-1.5 min-w-[52px] shadow-sm">
                  <span className="text-lg sm:text-xl font-mono font-black text-brand-900 dark:text-brand-50">
                    {String(timeLeft.days).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-brand-500">Days</span>
                </div>
                <span className="text-brand-400 font-bold">:</span>
                <div className="flex flex-col items-center justify-center bg-white dark:bg-brand-900/90 border border-brand-200 dark:border-brand-700 rounded-lg px-2.5 py-1.5 min-w-[52px] shadow-sm">
                  <span className="text-lg sm:text-xl font-mono font-black text-brand-900 dark:text-brand-50">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-brand-500">Hours</span>
                </div>
                <span className="text-brand-400 font-bold">:</span>
                <div className="flex flex-col items-center justify-center bg-white dark:bg-brand-900/90 border border-brand-200 dark:border-brand-700 rounded-lg px-2.5 py-1.5 min-w-[52px] shadow-sm">
                  <span className="text-lg sm:text-xl font-mono font-black text-brand-900 dark:text-brand-50">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-brand-500">Mins</span>
                </div>
                <span className="text-brand-400 font-bold">:</span>
                <div className="flex flex-col items-center justify-center bg-white dark:bg-brand-900/90 border border-brand-200 dark:border-brand-700 rounded-lg px-2.5 py-1.5 min-w-[52px] shadow-sm">
                  <span className="text-lg sm:text-xl font-mono font-black text-brand-900 dark:text-brand-50">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-brand-500">Secs</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render HERO Variant
  return (
    <div
      className={`w-full relative overflow-hidden rounded-2xl border border-brand-200/90 dark:border-brand-800/90 bg-gradient-to-br ${activeMilestone.accentBg} p-5 sm:p-7 shadow-md dark:shadow-2xl transition-all ${className}`}
    >
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-brand-400/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

      {/* Header & Milestone Selector Tabs */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-brand-200/70 dark:border-brand-800/70">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-brand-900 border border-brand-200 dark:border-brand-700 text-xs font-semibold text-brand-700 dark:text-brand-300 shadow-sm mb-2">
            <CalendarDays size={14} className="text-brand-600 dark:text-brand-400" />
            <span>Academic Session 2026/2027 Countdown</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-brand-950 dark:text-brand-50 tracking-tight">
            Key Academic Milestones
          </h3>
        </div>

        {/* Milestone switcher buttons */}
        {showSelector && (
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-white/70 dark:bg-brand-900/70 backdrop-blur-sm border border-brand-200/80 dark:border-brand-800">
            {DEFAULT_MILESTONES.map((m) => {
              const isSelected = m.id === activeMilestone.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setSelectedId(m.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-brand-700 text-white shadow-sm"
                      : "text-brand-700 dark:text-brand-300 hover:bg-brand-100 dark:hover:bg-brand-800/50"
                  }`}
                >
                  {m.shortName}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Countdown Body */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-6">
        {/* Left column: Event info & description */}
        <div className="lg:col-span-6 space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-md bg-brand-100 dark:bg-brand-800 text-brand-800 dark:text-brand-200">
              {activeMilestone.badge}
            </span>
            <span className="text-xs text-brand-600 dark:text-brand-400 font-medium flex items-center gap-1">
              <Calendar size={13} />
              {activeMilestone.displayDate}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-brand-950 dark:text-brand-50 leading-snug">
            {activeMilestone.title}
          </h2>

          <p className="text-sm text-brand-700 dark:text-brand-300 line-clamp-2">
            {activeMilestone.description}
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <Link
              href="/timetable"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-brand-700 hover:bg-brand-800 dark:bg-brand-600 dark:hover:bg-brand-500 rounded-lg shadow-sm transition-all"
            >
              <ClipboardCheck size={14} />
              <span>Exam & Test Timetable</span>
            </Link>
            <Link
              href="/calendar"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-brand-800 dark:text-brand-200 bg-white dark:bg-brand-900/80 hover:bg-brand-100 dark:hover:bg-brand-800 border border-brand-200 dark:border-brand-700 rounded-lg shadow-sm transition-all"
            >
              <Calendar size={14} />
              <span>Full Academic Calendar</span>
            </Link>
            <Link
              href="/resources"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-brand-800 dark:text-brand-200 bg-white dark:bg-brand-900/80 hover:bg-brand-100 dark:hover:bg-brand-800 border border-brand-200 dark:border-brand-700 rounded-lg shadow-sm transition-all"
            >
              <BookOpen size={14} />
              <span>Past Questions & Study Materials</span>
            </Link>
          </div>
        </div>

        {/* Right column: Big Digital Clock Cards */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          {timeLeft.isToday ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-brand-900 border border-rose-300 dark:border-rose-800 text-center shadow-lg animate-pulse">
              <span className="text-2xl font-black text-rose-600 dark:text-rose-400 block mb-1">
                EVENT STARTS TODAY!
              </span>
              <p className="text-sm text-brand-600 dark:text-brand-300">
                Check timetable hall allocations and arrive early.
              </p>
            </div>
          ) : timeLeft.isPast ? (
            <div className="p-8 rounded-2xl bg-white dark:bg-brand-900 border border-brand-300 dark:border-brand-800 text-center shadow-md">
              <span className="text-xl font-bold text-brand-700 dark:text-brand-300 block mb-1">
                Milestone Concluded
              </span>
              <p className="text-xs text-brand-500">
                Select another milestone tab above to view upcoming events.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-md">
              {/* Days */}
              <div className="group flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-white dark:bg-brand-900/90 border border-brand-200 dark:border-brand-700 shadow-sm hover:shadow-md transition-all">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-mono font-black text-brand-950 dark:text-brand-50 tracking-tighter">
                  {String(timeLeft.days).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs uppercase font-extrabold text-brand-500 dark:text-brand-400 tracking-wider mt-1">
                  Days
                </span>
              </div>

              {/* Hours */}
              <div className="group flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-white dark:bg-brand-900/90 border border-brand-200 dark:border-brand-700 shadow-sm hover:shadow-md transition-all">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-mono font-black text-brand-950 dark:text-brand-50 tracking-tighter">
                  {String(timeLeft.hours).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs uppercase font-extrabold text-brand-500 dark:text-brand-400 tracking-wider mt-1">
                  Hours
                </span>
              </div>

              {/* Minutes */}
              <div className="group flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-white dark:bg-brand-900/90 border border-brand-200 dark:border-brand-700 shadow-sm hover:shadow-md transition-all">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-mono font-black text-brand-950 dark:text-brand-50 tracking-tighter">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs uppercase font-extrabold text-brand-500 dark:text-brand-400 tracking-wider mt-1">
                  Minutes
                </span>
              </div>

              {/* Seconds */}
              <div className="group flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-white dark:bg-brand-900/90 border border-brand-200 dark:border-brand-700 shadow-sm hover:shadow-md transition-all">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-mono font-black text-brand-700 dark:text-brand-300 tracking-tighter">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </span>
                <span className="text-[10px] sm:text-xs uppercase font-extrabold text-brand-500 dark:text-brand-400 tracking-wider mt-1">
                  Seconds
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

