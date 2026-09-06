'use client';

import React, { useState } from 'react';
import { BookOpen, Search, Layers, CheckCircle2 } from 'lucide-react';
import { Course } from '@/lib/departments-data';

interface DepartmentCourseTabsProps {
  departmentName: string;
  courses: {
    [level: number]: {
      1: Course[];
      2: Course[];
    };
  };
}

const LEVELS = [100, 200, 300, 400];

export function DepartmentCourseTabs({ departmentName, courses }: DepartmentCourseTabsProps) {
  const [activeLevel, setActiveLevel] = useState<number>(100);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const currentLevelData = courses[activeLevel] || { 1: [], 2: [] };

  const filterCourses = (list: Course[]) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (c) => c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)
    );
  };

  const sem1Courses = filterCourses(currentLevelData[1] || []);
  const sem2Courses = filterCourses(currentLevelData[2] || []);

  const sem1TotalUnits = (currentLevelData[1] || []).reduce((sum, c) => sum + c.units, 0);
  const sem2TotalUnits = (currentLevelData[2] || []).reduce((sum, c) => sum + c.units, 0);

  return (
    <div className="space-y-8">
      {/* Controls Bar: Level Tabs + Quick Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between pb-2 border-b border-brand-200 dark:border-brand-800">
        {/* Level Selector Pills */}
        <div className="inline-flex p-1 rounded-xl bg-brand-100/70 dark:bg-brand-900/60 border border-brand-200 dark:border-brand-800 self-start sm:self-auto">
          {LEVELS.map((lvl) => {
            const isActive = activeLevel === lvl;
            const hasData = !!(courses[lvl] && (courses[lvl][1]?.length || courses[lvl][2]?.length));
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => setActiveLevel(lvl)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-brand-700 dark:text-brand-300 hover:text-brand-950 dark:hover:text-white'
                }`}
              >
                {lvl} Level
              </button>
            );
          })}
        </div>

        {/* Filter Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-brand-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search code or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white dark:bg-brand-900/70 border border-brand-200 dark:border-brand-700 rounded-lg text-brand-900 dark:text-brand-100 placeholder-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Course Tables for Active Level */}
      <div className="space-y-10 animate-fade-in">
        {/* First Semester */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xl font-bold text-brand-900 dark:text-brand-100 font-serif flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-500"></span>
              First Semester ({activeLevel} Level)
            </h3>
            <span className="text-xs font-semibold px-3 py-1 bg-brand-100 dark:bg-brand-800 text-brand-800 dark:text-brand-200 rounded-full w-fit">
              Total: {sem1TotalUnits} Credit Units &middot; {currentLevelData[1]?.length || 0} Courses
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-900 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-brand-50/80 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 border-b border-brand-200 dark:border-brand-800">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-semibold">Course Code</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">Course Title</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-center">Credit Units</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 dark:divide-brand-800/60">
                {sem1Courses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-brand-500 dark:text-brand-400">
                      No courses found matching "{searchQuery}"
                    </td>
                  </tr>
                ) : (
                  sem1Courses.map((course) => (
                    <tr
                      key={course.code + course.title}
                      className="hover:bg-brand-50/50 dark:hover:bg-brand-800/40 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-bold text-brand-900 dark:text-brand-100 whitespace-nowrap">
                        {course.code}
                      </td>
                      <td className="px-5 py-3.5 text-brand-800 dark:text-brand-200 font-medium">
                        {course.title}
                      </td>
                      <td className="px-5 py-3.5 text-center text-brand-700 dark:text-brand-300 font-semibold">
                        {course.units}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            course.status === 'Core'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                          }`}
                        >
                          {course.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Second Semester */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-xl font-bold text-brand-900 dark:text-brand-100 font-serif flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-500"></span>
              Second Semester ({activeLevel} Level)
            </h3>
            <span className="text-xs font-semibold px-3 py-1 bg-brand-100 dark:bg-brand-800 text-brand-800 dark:text-brand-200 rounded-full w-fit">
              Total: {sem2TotalUnits} Credit Units &middot; {currentLevelData[2]?.length || 0} Courses
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-900 shadow-sm">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-brand-50/80 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 border-b border-brand-200 dark:border-brand-800">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-semibold">Course Code</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">Course Title</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold text-center">Credit Units</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 dark:divide-brand-800/60">
                {sem2Courses.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-brand-500 dark:text-brand-400">
                      No courses found matching "{searchQuery}"
                    </td>
                  </tr>
                ) : (
                  sem2Courses.map((course) => (
                    <tr
                      key={course.code + course.title}
                      className="hover:bg-brand-50/50 dark:hover:bg-brand-800/40 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-bold text-brand-900 dark:text-brand-100 whitespace-nowrap">
                        {course.code}
                      </td>
                      <td className="px-5 py-3.5 text-brand-800 dark:text-brand-200 font-medium">
                        {course.title}
                      </td>
                      <td className="px-5 py-3.5 text-center text-brand-700 dark:text-brand-300 font-semibold">
                        {course.units}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            course.status === 'Core'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                          }`}
                        >
                          {course.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Academic Session Note */}
        <div className="p-4 bg-brand-50 dark:bg-brand-950 rounded-xl border border-brand-200 dark:border-brand-800 text-xs text-brand-600 dark:text-brand-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
          <span>
            Official curriculum outline for {departmentName} &middot; Validated for current CUSTECH Osara academic regulations.
          </span>
        </div>
      </div>
    </div>
  );
}
