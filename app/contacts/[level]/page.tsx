'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  Home,
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  Phone,
  ShieldCheck,
  Award,
  Users,
  Building2,
  UserCheck
} from 'lucide-react';
import {
  loadLevelRepresentatives,
  type LevelRepresentatives,
  DEFAULT_LEVEL_REPRESENTATIVES,
  formatWhatsAppUrl
} from '@/lib/contacts-data';

export default function LevelContactsPage({ params }: { params: { level: string } }) {
  const { level } = params;
  const levelNum = parseInt(level, 10) || 100;

  const [allLevelReps, setAllLevelReps] = useState<LevelRepresentatives[]>(DEFAULT_LEVEL_REPRESENTATIVES);

  useEffect(() => {
    loadLevelRepresentatives().then(setAllLevelReps);

    const handleUpdate = () => {
      loadLevelRepresentatives().then(setAllLevelReps);
    };

    window.addEventListener('representatives_updated', handleUpdate);
    return () => window.removeEventListener('representatives_updated', handleUpdate);
  }, []);

  const currentLevelData = allLevelReps.find((lr) => lr.level === levelNum) || 
    DEFAULT_LEVEL_REPRESENTATIVES.find((lr) => lr.level === levelNum) ||
    DEFAULT_LEVEL_REPRESENTATIVES[0];

  const prevLevel = levelNum > 100 ? levelNum - 100 : null;
  const nextLevel = levelNum < 400 ? levelNum + 100 : null;

  const facultyRep = currentLevelData.faculty_rep;
  const facultyWaUrl = facultyRep.whatsapp || formatWhatsAppUrl(facultyRep.phone);

  return (
    <div className="flex flex-col min-h-screen bg-brand-50/40 dark:bg-brand-950">
      {/* Top Header */}
      <div className="bg-white dark:bg-brand-900 border-b border-brand-200 dark:border-brand-800 py-8 px-4 md:px-6">
        <div className="container mx-auto">
          <nav className="flex items-center text-sm font-medium text-brand-500 mb-4">
            <Link href="/" className="hover:text-brand-800 dark:hover:text-brand-300 flex items-center">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/contacts" className="hover:text-brand-800 dark:hover:text-brand-300">
              Contacts
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-brand-900 dark:text-brand-100">{levelNum} Level</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-800/60 text-brand-800 dark:text-brand-200 text-xs font-semibold mb-2 border border-brand-200 dark:border-brand-700">
                <Users className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span>{levelNum} Level Leadership Directory</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-brand-950 dark:text-brand-50 font-serif">
                {levelNum} Level Representatives
              </h1>
              <p className="text-xs sm:text-sm text-brand-600 dark:text-brand-400 mt-1">
                Official {levelNum}L Faculty Representative &amp; Departmental Course Executives
              </p>
            </div>

            <div className="flex items-center gap-2">
              {prevLevel ? (
                <Link
                  href={`/contacts/${prevLevel}`}
                  className="inline-flex items-center justify-center rounded-xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-900 px-3.5 py-2 text-xs sm:text-sm font-medium text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-800 transition-colors shadow-sm"
                >
                  <ArrowLeft className="mr-1.5 h-4 w-4" /> {prevLevel}L
                </Link>
              ) : (
                <span className="inline-flex items-center justify-center rounded-xl border border-brand-200/50 dark:border-brand-800/50 bg-brand-100/50 dark:bg-brand-900/50 px-3.5 py-2 text-xs sm:text-sm font-medium text-brand-400 dark:text-brand-600 cursor-not-allowed">
                  <ArrowLeft className="mr-1.5 h-4 w-4" /> Prev
                </span>
              )}

              {nextLevel ? (
                <Link
                  href={`/contacts/${nextLevel}`}
                  className="inline-flex items-center justify-center rounded-xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-900 px-3.5 py-2 text-xs sm:text-sm font-medium text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-800 transition-colors shadow-sm"
                >
                  {nextLevel}L <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              ) : (
                <span className="inline-flex items-center justify-center rounded-xl border border-brand-200/50 dark:border-brand-800/50 bg-brand-100/50 dark:bg-brand-900/50 px-3.5 py-2 text-xs sm:text-sm font-medium text-brand-400 dark:text-brand-600 cursor-not-allowed">
                  Next <ArrowRight className="ml-1.5 h-4 w-4" />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10 flex-grow space-y-12">
        {/* 1. LEVEL-SPECIFIC FACULTY REPRESENTATIVE (STAND-ALONE) */}
        <section className="bg-gradient-to-br from-brand-900 via-brand-950 to-brand-900 text-white rounded-2xl border border-brand-800 p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-brand-700/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-800/90 text-brand-200 text-xs font-semibold border border-brand-700/60">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Level Leadership &bull; {levelNum} Level Faculty Representative</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                {facultyRep.name || `${levelNum}L Faculty Representative`}
              </h2>
              <p className="text-brand-200 text-xs sm:text-sm max-w-2xl leading-relaxed">
                Official faculty student liaison representing all students in <strong className="text-white">{levelNum} Level</strong> across Computer Science, Software Engineering, Cyber Security, IFT, and Library &amp; Information Science.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <div className="bg-brand-800/70 border border-brand-700/80 rounded-xl px-4 py-2.5 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-brand-700 text-white">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-brand-300 uppercase tracking-wider block font-medium">{levelNum}L Faculty Rep Line</span>
                  <span className="text-sm sm:text-base font-bold text-white tracking-wide font-mono">
                    {facultyRep.phone || 'Contact via WhatsApp'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {facultyWaUrl ? (
                  <a
                    href={facultyWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1ebd5a] px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow transition-colors"
                  >
                    <MessageSquare size={16} />
                    <span>WhatsApp</span>
                  </a>
                ) : null}

                {facultyRep.phone ? (
                  <a
                    href={`tel:${facultyRep.phone}`}
                    className="inline-flex items-center justify-center p-3 rounded-xl border border-brand-700 bg-brand-800 hover:bg-brand-700 text-white transition-colors"
                    title={`Call ${levelNum}L Faculty Representative`}
                  >
                    <Phone size={16} />
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* 2. DEPARTMENTAL COURSE REPRESENTATIVES (COURSE REP & ASSISTANT REP) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-brand-200 dark:border-brand-800">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-brand-900 dark:text-brand-100 font-serif">
                Departmental Representatives ({levelNum} Level)
              </h2>
              <p className="text-xs sm:text-sm text-brand-600 dark:text-brand-400 mt-0.5">
                Course Representative and Assistant Course Representative for each department in {levelNum}L.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-800 dark:text-brand-200 border border-brand-200 dark:border-brand-800 self-start sm:self-auto">
              5 Departments
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {currentLevelData.departments.map((dept) => {
              const courseRep = dept.course_rep;
              const assistantRep = dept.assistant_rep;

              const cWaUrl = courseRep.whatsapp || formatWhatsAppUrl(courseRep.phone);
              const aWaUrl = assistantRep.whatsapp || formatWhatsAppUrl(assistantRep.phone);

              return (
                <div
                  key={dept.department}
                  className="bg-white dark:bg-brand-900 rounded-2xl border border-brand-200 dark:border-brand-800 shadow-sm p-6 flex flex-col justify-between hover:border-brand-400 dark:hover:border-brand-600 transition-all duration-200"
                >
                  <div>
                    {/* Department Title */}
                    <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-brand-100 dark:border-brand-800/80">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-300">
                          <Building2 size={16} />
                        </div>
                        <h3 className="text-lg font-bold text-brand-950 dark:text-brand-50 font-serif">
                          {dept.department}
                        </h3>
                      </div>
                      <span className="text-xs font-semibold text-brand-500 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded-md border border-brand-200 dark:border-brand-800">
                        {levelNum}L
                      </span>
                    </div>

                    {/* Dual Reps Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Course Representative */}
                      <div className="p-4 rounded-xl bg-brand-50/60 dark:bg-brand-950/60 border border-brand-100 dark:border-brand-800/80 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-700 dark:text-brand-300 bg-brand-100/80 dark:bg-brand-800/80 px-2 py-0.5 rounded-md">
                              <UserCheck size={12} /> Course Rep
                            </span>
                          </div>
                          <h4 className="font-bold text-brand-900 dark:text-brand-100 text-sm leading-snug">
                            {courseRep.name || `${dept.department} Course Rep`}
                          </h4>
                          <div className="flex items-center text-xs text-brand-600 dark:text-brand-400 mt-2 font-mono">
                            <Phone size={12} className="mr-1.5 text-brand-500 shrink-0" />
                            <span>{courseRep.phone || 'Phone pending'}</span>
                          </div>
                        </div>

                        <div className="pt-3 mt-3 border-t border-brand-200/60 dark:border-brand-800/60 flex items-center gap-2">
                          {cWaUrl ? (
                            <a
                              href={cWaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-[#25D366] hover:bg-[#1ebd5a] px-2.5 py-1.5 text-xs font-semibold text-white transition-colors shadow-sm"
                            >
                              <MessageSquare size={13} /> WhatsApp
                            </a>
                          ) : null}
                          {courseRep.phone && courseRep.phone !== '08000000000' && courseRep.phone !== '-' ? (
                            <a
                              href={`tel:${courseRep.phone}`}
                              className="p-1.5 rounded-lg border border-brand-200 dark:border-brand-700 text-brand-700 dark:text-brand-300 hover:bg-white dark:hover:bg-brand-800 transition-colors"
                              title={`Call ${courseRep.name}`}
                            >
                              <Phone size={13} />
                            </a>
                          ) : null}
                        </div>
                      </div>

                      {/* Assistant Course Representative */}
                      <div className="p-4 rounded-xl bg-brand-50/60 dark:bg-brand-950/60 border border-brand-100 dark:border-brand-800/80 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100/80 dark:bg-indigo-950/80 px-2 py-0.5 rounded-md">
                              <Award size={12} /> Assistant Rep
                            </span>
                          </div>
                          <h4 className="font-bold text-brand-900 dark:text-brand-100 text-sm leading-snug">
                            {assistantRep.name || `${dept.department} Assistant Rep`}
                          </h4>
                          <div className="flex items-center text-xs text-brand-600 dark:text-brand-400 mt-2 font-mono">
                            <Phone size={12} className="mr-1.5 text-brand-500 shrink-0" />
                            <span>{assistantRep.phone || 'Phone pending'}</span>
                          </div>
                        </div>

                        <div className="pt-3 mt-3 border-t border-brand-200/60 dark:border-brand-800/60 flex items-center gap-2">
                          {aWaUrl ? (
                            <a
                              href={aWaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg bg-[#25D366] hover:bg-[#1ebd5a] px-2.5 py-1.5 text-xs font-semibold text-white transition-colors shadow-sm"
                            >
                              <MessageSquare size={13} /> WhatsApp
                            </a>
                          ) : null}
                          {assistantRep.phone && assistantRep.phone !== '08000000000' && assistantRep.phone !== '-' ? (
                            <a
                              href={`tel:${assistantRep.phone}`}
                              className="p-1.5 rounded-lg border border-brand-200 dark:border-brand-700 text-brand-700 dark:text-brand-300 hover:bg-white dark:hover:bg-brand-800 transition-colors"
                              title={`Call ${assistantRep.name}`}
                            >
                              <Phone size={13} />
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}