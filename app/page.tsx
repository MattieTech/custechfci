import Link from "next/link";
import { 
  BookOpen, 
  Calculator, 
  Calendar, 
  FileText, 
  GraduationCap, 
  Users, 
  Monitor, 
  Shield, 
  Code, 
  Server, 
  ChevronRight,
  CheckCircle2,
  Clock,
  Award
} from "lucide-react";
import { HeroSlideshow } from "@/components/hero-slideshow";
import { CountdownWidget } from "@/components/countdown-widget";
import { NextLectureWidget } from "@/components/next-lecture-widget";
import { ALL_DEPARTMENTS } from "@/lib/departments-data";

const DEPT_ICONS: Record<string, any> = {
  "computer-science": Monitor,
  "cyber-security": Shield,
  "software-engineering": Code,
  "information-technology": Server,
  "library-info-science": BookOpen,
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section with 4-Image Slideshow Background */}
      <HeroSlideshow />

      {/* Official Academic Calendar & Registration Alert Banner */}
      <div className="bg-amber-500/10 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/80 px-4 py-2.5">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 text-center sm:text-left">
            <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider shrink-0 animate-pulse">
              Senate Update
            </span>
            <span>
              <strong>2026/2027 Academic Calendar Approved</strong>: 1st Semester begins Mon 28th Sept. Course registration strictly closes 31st Oct (Late registration incurs ₦10,000 fee).
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/calendar"
              className="font-bold underline text-amber-900 dark:text-amber-300 hover:text-amber-700 flex items-center gap-1"
            >
              <span>View Calendar</span>
              <ChevronRight size={14} />
            </Link>
            <span className="text-amber-400">&bull;</span>
            <Link
              href="/news"
              className="font-semibold text-brand-700 dark:text-brand-300 hover:underline"
            >
              Read Full Notice
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Academic Stats Bar */}
      <section className="bg-white dark:bg-brand-900 border-b border-brand-200 dark:border-brand-800 py-6 sm:py-8 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-brand-100 dark:divide-brand-800">
            <div className="pt-3 md:pt-0">
              <span className="block font-serif text-3xl sm:text-4xl font-bold text-brand-900 dark:text-brand-100">
                5
              </span>
              <span className="text-xs sm:text-sm font-medium text-brand-600 dark:text-brand-400 mt-1 block">
                Academic Departments
              </span>
            </div>
            <div className="pt-3 md:pt-0">
              <span className="block font-serif text-3xl sm:text-4xl font-bold text-brand-900 dark:text-brand-100">
                4
              </span>
              <span className="text-xs sm:text-sm font-medium text-brand-600 dark:text-brand-400 mt-1 block">
                Levels (100L &ndash; 400L)
              </span>
            </div>
            <div className="pt-3 md:pt-0">
              <span className="block font-serif text-3xl sm:text-4xl font-bold text-brand-900 dark:text-brand-100">
                5.0
              </span>
              <span className="text-xs sm:text-sm font-medium text-brand-600 dark:text-brand-400 mt-1 block">
                Max CGPA Grading Scale
              </span>
            </div>
            <div className="pt-3 md:pt-0">
              <span className="block font-serif text-3xl sm:text-4xl font-bold text-brand-900 dark:text-brand-100">
                100%
              </span>
              <span className="text-xs sm:text-sm font-medium text-brand-600 dark:text-brand-400 mt-1 block">
                Verified Course Outlines
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 Academic Milestone Countdown Timer */}
      <section className="py-8 bg-gradient-to-b from-brand-50/60 to-transparent dark:from-brand-950/60 dark:to-transparent border-b border-brand-200/70 dark:border-brand-800/70">
        <div className="container mx-auto px-4 sm:px-6">
          <CountdownWidget variant="hero" defaultMilestoneId="sem1-resumption" />
        </div>
      </section>

      {/* 3. Explore Departments Section (All 5 Departments) */}
      <section className="py-14 sm:py-20 bg-brand-50/40 dark:bg-brand-950 border-b border-brand-200 dark:border-brand-800">
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-800 dark:text-brand-200 text-xs font-semibold mb-3 border border-brand-200 dark:border-brand-800">
                <GraduationCap className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                <span>Our Degree Programs</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-brand-950 dark:text-brand-50 font-serif">
                Explore Departments
              </h2>
              <p className="text-brand-600 dark:text-brand-400 text-sm sm:text-base max-w-2xl mt-1.5">
                Discover the five accredited programs in the Faculty of Computing and Informatics. Access full course outlines across all levels.
              </p>
            </div>
            <Link
              href="/departments"
              className="inline-flex items-center text-sm font-semibold text-brand-700 dark:text-brand-300 hover:text-brand-900 dark:hover:text-white transition-colors"
            >
              View all programs <ChevronRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_DEPARTMENTS.map((dept) => {
              const Icon = DEPT_ICONS[dept.slug] || Monitor;
              return (
                <Link key={dept.slug} href={`/departments/${dept.slug}`} className="group h-full">
                  <div className="bg-white dark:bg-brand-900/90 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-brand-200/90 dark:border-brand-800 shadow-sm flex flex-col h-full hover:border-brand-400 dark:hover:border-brand-600 hover:shadow-md transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-200 rounded-xl group-hover:bg-brand-600 group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2.5 py-1 rounded-full border border-brand-200 dark:border-brand-800">
                        {dept.careers.length} Careers
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-brand-900 dark:text-brand-100 font-serif mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {dept.name}
                    </h3>

                    <p className="text-brand-600 dark:text-brand-400 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
                      {dept.summary}
                    </p>

                    <div className="mt-auto pt-4 border-t border-brand-100 dark:border-brand-800/60 flex items-center text-sm font-semibold text-brand-600 dark:text-brand-400 group-hover:text-brand-800 dark:group-hover:text-brand-200">
                      View Department &amp; Outlines <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Quick Access Section (Expanded Suite of FCI Student Tools) */}
      <section className="py-14 sm:py-20 bg-white dark:bg-brand-900/40 border-b border-brand-200 dark:border-brand-800">
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-950 dark:text-brand-50 font-serif">
              Faculty Academic Tools &amp; Utilities
            </h2>
            <p className="text-brand-600 dark:text-brand-400 text-sm sm:text-base mt-2">
              Interactive portals built to boost your academic performance, prepare for CBT exams, and resolve student welfare issues.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. CBT Mock Drill */}
            <Link href="/cbt" className="group block h-full">
              <div className="flex flex-col h-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-900/30 hover:border-brand-400 dark:hover:border-brand-600 hover:shadow-md transition-all duration-200">
                <div className="p-3 bg-brand-100 dark:bg-brand-800 rounded-xl w-fit mb-4 text-brand-700 dark:text-brand-300 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-brand-900 dark:text-brand-100">
                    FCI Drill: Interactive CBT
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Practice
                  </span>
                </div>
                <p className="text-brand-600 dark:text-brand-400 text-sm flex-grow leading-relaxed">
                  Timed exam simulations, instant score reports, and question-by-question syllabus explanations.
                </p>
              </div>
            </Link>

            {/* 2. Smart CGPA Calculator */}
            <Link href="/cgpa" className="group block h-full">
              <div className="flex flex-col h-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-900/30 hover:border-brand-400 dark:hover:border-brand-600 hover:shadow-md transition-all duration-200">
                <div className="p-3 bg-brand-100 dark:bg-brand-800 rounded-xl w-fit mb-4 text-brand-700 dark:text-brand-300 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <Calculator className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-brand-900 dark:text-brand-100">
                    Smart CGPA &amp; Forecaster
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    5.0 Scale
                  </span>
                </div>
                <p className="text-brand-600 dark:text-brand-400 text-sm flex-grow leading-relaxed">
                  Auto-populated course outlines for all departments, cumulative CGPA calculation, and Target Mode forecasting.
                </p>
              </div>
            </Link>

            {/* 3. Study Materials & Vault */}
            <Link href="/resources?tab=materials" className="group block h-full">
              <div className="flex flex-col h-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-900/30 hover:border-brand-400 dark:hover:border-brand-600 hover:shadow-md transition-all duration-200">
                <div className="p-3 bg-brand-100 dark:bg-brand-800 rounded-xl w-fit mb-4 text-brand-700 dark:text-brand-300 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-brand-900 dark:text-brand-100">
                    Academic Materials Vault
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    89+ PDFs
                  </span>
                </div>
                <p className="text-brand-600 dark:text-brand-400 text-sm flex-grow leading-relaxed">
                  Direct access to approved lecture slides, syllabus outlines, and past questions with offline caching.
                </p>
              </div>
            </Link>

            {/* 4. Timetable */}
            <Link href="/timetable" className="group block h-full">
              <div className="flex flex-col h-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-900/30 hover:border-brand-400 dark:hover:border-brand-600 hover:shadow-md transition-all duration-200">
                <div className="p-3 bg-brand-100 dark:bg-brand-800 rounded-xl w-fit mb-4 text-brand-700 dark:text-brand-300 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-brand-900 dark:text-brand-100">
                    Lecture &amp; Exam Schedule
                  </h3>
                </div>
                <p className="text-brand-600 dark:text-brand-400 text-sm flex-grow leading-relaxed">
                  Weekly class timetables, hall allocations, CA test dates, and Google Calendar export.
                </p>
              </div>
            </Link>

            {/* 5. Anonymous Grievances & Suggestion Box */}
            <Link href="/grievances" className="group block h-full">
              <div className="flex flex-col h-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-900/30 hover:border-brand-400 dark:hover:border-brand-600 hover:shadow-md transition-all duration-200">
                <div className="p-3 bg-brand-100 dark:bg-brand-800 rounded-xl w-fit mb-4 text-brand-700 dark:text-brand-300 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-brand-900 dark:text-brand-100">
                    Guild Grievance Box
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    Anonymous
                  </span>
                </div>
                <p className="text-brand-600 dark:text-brand-400 text-sm flex-grow leading-relaxed">
                  Safely report course issues, facility problems, or feedback to faculty executives with private tracking tickets.
                </p>
              </div>
            </Link>

            {/* 6. Lost and Found */}
            <Link href="/lost-and-found" className="group block h-full">
              <div className="flex flex-col h-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-900/30 hover:border-brand-400 dark:hover:border-brand-600 hover:shadow-md transition-all duration-200">
                <div className="p-3 bg-brand-100 dark:bg-brand-800 rounded-xl w-fit mb-4 text-brand-700 dark:text-brand-300 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  <Users className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-brand-900 dark:text-brand-100">
                    Faculty Lost &amp; Found
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                    Community
                  </span>
                </div>
                <p className="text-brand-600 dark:text-brand-400 text-sm flex-grow leading-relaxed">
                  Search for misplaced ID cards, notebooks, tech devices, or report found items for quick owner recovery.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Student Academic Regulations & Rules */}
      <section className="py-14 sm:py-20 bg-brand-50/30 dark:bg-brand-950">
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-950 dark:text-brand-50 font-serif">
              Student Academic Guide
            </h2>
            <p className="text-brand-600 dark:text-brand-400 text-sm sm:text-base mt-2">
              Important guidelines and best practices every student in FCI must adhere to during their studies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-brand-900/90 p-6 sm:p-8 rounded-2xl border border-brand-200 dark:border-brand-800 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-lg bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-300">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-brand-900 dark:text-brand-100 font-serif">
                  Faculty Regulations
                </h3>
              </div>
              <ul className="space-y-3.5 text-sm text-brand-700 dark:text-brand-300">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2.5 mt-0.5 text-brand-600 dark:text-brand-400 shrink-0" />
                  <span>A minimum of 75% lecture and laboratory attendance is mandatory for examination eligibility.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2.5 mt-0.5 text-brand-600 dark:text-brand-400 shrink-0" />
                  <span>Academic dishonesty or malpractice carries strict disciplinary actions up to rustication.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2.5 mt-0.5 text-brand-600 dark:text-brand-400 shrink-0" />
                  <span>Course registration forms (CRFs) must be submitted and endorsed within the stipulated deadline.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2.5 mt-0.5 text-brand-600 dark:text-brand-400 shrink-0" />
                  <span>Official faculty dues and clearance receipts are required prior to final exam accreditation.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-brand-900/90 p-6 sm:p-8 rounded-2xl border border-brand-200 dark:border-brand-800 shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 rounded-lg bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-300">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-brand-900 dark:text-brand-100 font-serif">
                  Examination Protocols
                </h3>
              </div>
              <ul className="space-y-3.5 text-sm text-brand-700 dark:text-brand-300">
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2.5 mt-0.5 text-brand-600 dark:text-brand-400 shrink-0" />
                  <span>Arrive at assigned examination venues at least 30 minutes before official paper commencement.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2.5 mt-0.5 text-brand-600 dark:text-brand-400 shrink-0" />
                  <span>Bring valid student identification and printed examination docket to all test halls.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2.5 mt-0.5 text-brand-600 dark:text-brand-400 shrink-0" />
                  <span>Mobile phones, smartwatches, and programmable devices are strictly barred from exam rooms.</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="w-4 h-4 mr-2.5 mt-0.5 text-brand-600 dark:text-brand-400 shrink-0" />
                  <span>Carefully read all rubric instructions on answer booklets before writing your responses.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
