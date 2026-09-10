'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Clock, 
  MapPin, 
  BookOpen, 
  Calendar, 
  ChevronRight, 
  UserCheck, 
  BellRing,
  ArrowRight,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface LectureItem {
  id: string;
  courseCode: string;
  courseTitle: string;
  dayOfWeek: string;
  startTime: string; // "09:00"
  endTime: string;   // "11:00"
  venue: string;
  lecturer?: string;
  level: number;
  deptCode: string; // "CSC", "SWE", "CYB", "IFT", "DSC", "ALL"
}

// Fallback weekly timetable for CUSTECH FCI when database entries are pending
const CURATED_LECTURES: LectureItem[] = [
  // 100L
  { id: '100-1', courseCode: 'GST 111', courseTitle: 'Communication in English', dayOfWeek: 'Monday', startTime: '08:00', endTime: '10:00', venue: 'FCI Multi-Purpose Hall A', lecturer: 'Dr. Olorunfemi', level: 100, deptCode: 'ALL' },
  { id: '100-2', courseCode: 'CSC 142', courseTitle: 'Computers and Society', dayOfWeek: 'Monday', startTime: '10:00', endTime: '12:00', venue: 'Computer Lab 1', lecturer: 'Engr. Bello', level: 100, deptCode: 'ALL' },
  { id: '100-3', courseCode: 'MTH 141', courseTitle: 'General Mathematics I', dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '11:00', venue: 'FCI Lecture Theatre 2', lecturer: 'Prof. Adeleke', level: 100, deptCode: 'ALL' },
  { id: '100-4', courseCode: 'STA 131', courseTitle: 'Inference I / Probability', dayOfWeek: 'Wednesday', startTime: '11:00', endTime: '13:00', venue: 'ETF Hall 3', lecturer: 'Dr. Yakubu', level: 100, deptCode: 'ALL' },
  { id: '100-5', courseCode: 'SWE 142', courseTitle: 'Intro to Software Engineering', dayOfWeek: 'Thursday', startTime: '10:00', endTime: '12:00', venue: 'Software Engineering Studio', lecturer: 'Engr. Mattie', level: 100, deptCode: 'SWE' },
  { id: '100-6', courseCode: 'PHY 141', courseTitle: 'General Physics I', dayOfWeek: 'Friday', startTime: '08:00', endTime: '10:00', venue: 'Physics Lecture Hall', lecturer: 'Dr. Usman', level: 100, deptCode: 'ALL' },

  // 200L
  { id: '200-1', courseCode: 'CSC 231', courseTitle: 'Computer Architecture & Org', dayOfWeek: 'Monday', startTime: '09:00', endTime: '11:00', venue: 'Hardware & Embedded Lab', lecturer: 'Dr. Sanni', level: 200, deptCode: 'CSC' },
  { id: '200-2', courseCode: 'CSC 233', courseTitle: 'Object-Oriented Programming', dayOfWeek: 'Tuesday', startTime: '10:00', endTime: '12:00', venue: 'Lab 2 (Main Campus)', lecturer: 'Mr. Abubakar', level: 200, deptCode: 'ALL' },
  { id: '200-3', courseCode: 'MTH 211', courseTitle: 'Mathematical Methods I', dayOfWeek: 'Wednesday', startTime: '08:00', endTime: '10:00', venue: 'FCI LT 1', lecturer: 'Dr. Joseph', level: 200, deptCode: 'ALL' },
  { id: '200-4', courseCode: 'CYB 201', courseTitle: 'Fundamentals of Cyber Security', dayOfWeek: 'Thursday', startTime: '11:00', endTime: '13:00', venue: 'Cyber Lab Alpha', lecturer: 'Engr. Idris', level: 200, deptCode: 'CYB' },
  { id: '200-5', courseCode: 'CSC 215', courseTitle: 'Data Structures and Algorithms', dayOfWeek: 'Friday', startTime: '10:00', endTime: '12:00', venue: 'FCI Hall B', lecturer: 'Dr. Alabi', level: 200, deptCode: 'CSC' }
];

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function NextLectureWidget() {
  const [level, setLevel] = useState<number>(100);
  const [deptCode, setDeptCode] = useState<string>('CSC');
  const [now, setNow] = useState<Date>(new Date());
  const [dbLectures, setDbLectures] = useState<LectureItem[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [alarmsEnabled, setAlarmsEnabled] = useState<boolean>(false);

  // Check initial alarm preference
  useEffect(() => {
    try {
      const savedAlarm = localStorage.getItem('custech_fci_lecture_alarm');
      if (savedAlarm === 'true') {
        setAlarmsEnabled(true);
      }
    } catch (e) {}
  }, []);

  const handleToggleAlarms = async () => {
    if (!alarmsEnabled) {
      if ('Notification' in window) {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          setAlarmsEnabled(true);
          try {
            localStorage.setItem('custech_fci_lecture_alarm', 'true');
          } catch (e) {}
          toast.success('Lecture Alarms Activated! You will receive an alert 15 minutes before your scheduled lectures.');

          if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: 'SHOW_LECTURE_ALARM',
              title: 'FCI Lecture Alarm Activated',
              body: `You will be notified 15 minutes before scheduled ${deptCode} ${level}L lectures.`,
              url: '/timetable'
            });
          }
        } else {
          toast.error('Please allow notifications in your browser settings to receive lecture alarms.');
        }
      } else {
        toast.error('Browser does not support notifications.');
      }
    } else {
      setAlarmsEnabled(false);
      try {
        localStorage.setItem('custech_fci_lecture_alarm', 'false');
      } catch (e) {}
      toast.info('Lecture Alarms turned off.');
    }
  };

  // Load preferences from localStorage
  useEffect(() => {
    try {
      const savedDept = localStorage.getItem('custech_fci_student_dept');
      const savedLevel = localStorage.getItem('custech_fci_student_level');
      if (savedDept) setDeptCode(savedDept);
      if (savedLevel) setLevel(Number(savedLevel));
    } catch (e) {
      // Ignore in SSR
    }
    setIsLoaded(true);

    // Keep clock in sync
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Save changes to localStorage
  const handleDeptChange = (newDept: string) => {
    setDeptCode(newDept);
    try {
      localStorage.setItem('custech_fci_student_dept', newDept);
    } catch (e) {}
  };

  const handleLevelChange = (newLevel: number) => {
    setLevel(newLevel);
    try {
      localStorage.setItem('custech_fci_student_level', String(newLevel));
    } catch (e) {}
  };

  // Try fetching any published lectures from Supabase exam_timetable
  useEffect(() => {
    async function fetchTimetable() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('exam_timetable')
          .select('*')
          .eq('is_published', true)
          .order('start_time', { ascending: true });

        if (!error && data && data.length > 0) {
          const mapped: LectureItem[] = data.map((d: any) => ({
            id: d.id,
            courseCode: d.course_code,
            courseTitle: d.course_title,
            dayOfWeek: d.day_of_week || 'Monday',
            startTime: d.start_time || '09:00',
            endTime: d.end_time || '11:00',
            venue: d.venue || 'FCI Lecture Hall',
            level: d.level || 100,
            deptCode: 'ALL'
          }));
          setDbLectures(mapped);
        }
      } catch (e) {
        // Fall back to curated
      }
    }
    fetchTimetable();
  }, []);

  const allLectures = useMemo(() => {
    const combined = dbLectures.length > 0 ? dbLectures : CURATED_LECTURES;
    return combined.filter(l => l.level === level && (l.deptCode === 'ALL' || l.deptCode === deptCode));
  }, [dbLectures, level, deptCode]);

  // Determine current or next lecture
  const lectureStatus = useMemo(() => {
    if (allLectures.length === 0) return null;

    const currentDayName = DAYS[now.getDay()]; // e.g. "Monday"
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentTimeMinutes = currentHour * 60 + currentMin;

    // Check today's lectures first
    const todayLectures = allLectures
      .filter(l => l.dayOfWeek.toLowerCase() === currentDayName.toLowerCase())
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    for (const lec of todayLectures) {
      const [sH, sM] = lec.startTime.split(':').map(Number);
      const [eH, eM] = lec.endTime.split(':').map(Number);
      const startMin = sH * 60 + sM;
      const endMin = eH * 60 + eM;

      // Ongoing right now
      if (currentTimeMinutes >= startMin && currentTimeMinutes < endMin) {
        return {
          type: 'ongoing' as const,
          lecture: lec,
          label: 'In Progress Now',
          endsInMinutes: endMin - currentTimeMinutes
        };
      }

      // Coming up later today
      if (currentTimeMinutes < startMin) {
        return {
          type: 'upcoming_today' as const,
          lecture: lec,
          label: `Today at ${lec.startTime}`,
          startsInMinutes: startMin - currentTimeMinutes
        };
      }
    }

    // If no more lectures today, find next lecture in subsequent days
    const currentDayIndex = now.getDay();
    for (let offset = 1; offset <= 7; offset++) {
      const checkDayIndex = (currentDayIndex + offset) % 7;
      const checkDayName = DAYS[checkDayIndex];
      const futureLecs = allLectures.filter(l => l.dayOfWeek.toLowerCase() === checkDayName.toLowerCase());
      if (futureLecs.length > 0) {
        return {
          type: 'next_day' as const,
          lecture: futureLecs[0],
          label: `${checkDayName} at ${futureLecs[0].startTime}`,
          dayName: checkDayName
        };
      }
    }

    // Default fallback to first lecture
    return {
      type: 'general' as const,
      lecture: allLectures[0],
      label: `${allLectures[0].dayOfWeek} at ${allLectures[0].startTime}`
    };
  }, [allLectures, now]);

  if (!isLoaded) return null;

  return (
    <div className="rounded-2xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-900/80 shadow-sm p-5 sm:p-6 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-brand-100 dark:border-brand-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-300">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-brand-950 dark:text-brand-50">
              Personalized Lecture Tracker
            </h3>
            <p className="text-xs text-brand-600 dark:text-brand-400">
              Real-time schedule for your enrolled department and level
            </p>
          </div>
        </div>

        {/* Level and Dept Quick Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={deptCode}
            onChange={(e) => handleDeptChange(e.target.value)}
            className="flex-1 sm:flex-none h-8 rounded-lg border border-brand-200 dark:border-brand-700 bg-brand-50/60 dark:bg-brand-950 px-2 text-xs font-semibold text-brand-900 dark:text-brand-100 focus:outline-none"
          >
            <option value="CSC">Computer Science (CSC)</option>
            <option value="SWE">Software Engineering (SWE)</option>
            <option value="CYB">Cyber Security (CYB)</option>
            <option value="IFT">Information Tech (IFT)</option>
          </select>

          <select
            value={level}
            onChange={(e) => handleLevelChange(Number(e.target.value))}
            className="h-8 rounded-lg border border-brand-200 dark:border-brand-700 bg-brand-50/60 dark:bg-brand-950 px-2.5 text-xs font-semibold text-brand-900 dark:text-brand-100 focus:outline-none"
          >
            <option value={100}>100L</option>
            <option value={200}>200L</option>
            <option value={300}>300L</option>
            <option value={400}>400L</option>
          </select>
        </div>
      </div>

      {/* Main Lecture Card */}
      {lectureStatus ? (
        <div className="mt-4 pt-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-200 border border-brand-200 dark:border-brand-700">
                {lectureStatus.lecture.courseCode}
              </span>
              <Badge 
                variant="outline" 
                className={
                  lectureStatus.type === 'ongoing' 
                    ? 'bg-rose-500/10 text-rose-500 border-rose-500/30 animate-pulse text-xs'
                    : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30 text-xs'
                }
              >
                {lectureStatus.label}
              </Badge>
            </div>

            <h4 className="text-lg font-bold text-brand-950 dark:text-brand-50 leading-snug">
              {lectureStatus.lecture.courseTitle}
            </h4>

            <div className="flex flex-wrap items-center gap-4 text-xs text-brand-600 dark:text-brand-400">
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="h-3.5 w-3.5 text-brand-500" />
                {lectureStatus.lecture.venue}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Clock className="h-3.5 w-3.5 text-brand-500" />
                {lectureStatus.lecture.startTime} &ndash; {lectureStatus.lecture.endTime}
              </span>
              {lectureStatus.lecture.lecturer && (
                <span className="flex items-center gap-1">
                  <UserCheck className="h-3.5 w-3.5 text-brand-500" />
                  {lectureStatus.lecture.lecturer}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 pt-2 md:pt-0">
            <Link href="/timetable">
              <Button size="sm" variant="outline" className="text-xs gap-1">
                Full Timetable
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link href="/resources">
              <Button size="sm" className="text-xs gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                Course Notes
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="py-6 text-center text-xs text-brand-500">
          No lecture scheduled for this selection. Check the full faculty timetable.
        </div>
      )}
    </div>
  );
}

