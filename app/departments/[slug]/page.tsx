import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Home, Info, Briefcase } from "lucide-react";
import { DEPARTMENTS_DATA } from "@/lib/departments-data";
import { DepartmentCourseTabs } from "@/components/department-course-tabs";
import {
  FlaticonDeptCs,
  FlaticonDeptCyber,
  FlaticonDeptSe,
  FlaticonDeptIt,
  FlaticonDeptLis,
  FlaticonCourseOutlines,
  FlaticonGraduationMortarboard
} from "@/components/animated-flaticons";

export function generateStaticParams() {
  return [
    { slug: "computer-science" },
    { slug: "cyber-security" },
    { slug: "software-engineering" },
    { slug: "information-technology" },
    { slug: "library-info-science" },
  ];
}

const DEPT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "computer-science": FlaticonDeptCs,
  "cyber-security": FlaticonDeptCyber,
  "software-engineering": FlaticonDeptSe,
  "information-technology": FlaticonDeptIt,
  "library-info-science": FlaticonDeptLis,
};

export default function DepartmentDetailPage({ params }: { params: { slug: string } }) {
  let normalizedSlug = params.slug.toLowerCase();
  if (normalizedSlug === "ict") normalizedSlug = "information-technology";
  if (normalizedSlug === "library-and-information-science") normalizedSlug = "library-info-science";

  const dept = DEPARTMENTS_DATA[normalizedSlug];

  if (!dept) {
    notFound();
  }

  const Icon = DEPT_ICONS[dept.slug] || FlaticonDeptCs;

  return (
    <div className="flex flex-col min-h-screen bg-brand-50/30 dark:bg-brand-950">
      {/* Page Header / Hero */}
      <div className="bg-brand-900 text-brand-50 border-b border-brand-800 py-12 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-800/50 via-brand-900 to-brand-950"></div>
        <div className="container mx-auto relative z-10">
          <nav className="flex items-center text-sm font-medium text-brand-300 mb-6">
            <Link href="/" className="hover:text-white flex items-center">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/departments" className="hover:text-white">
              Departments
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-white">{dept.name}</span>
          </nav>
          
          <div className="flex items-center gap-3.5 mb-3">
            <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
              <Icon className="w-11 h-11" />
            </div>
            <span className="text-sm font-semibold tracking-wide uppercase text-brand-200">
              Faculty of Computing and Informatics &middot; CUSTECH Osara
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-serif mb-4">
            Department of {dept.name}
          </h1>
          <p className="text-brand-200 max-w-3xl text-base md:text-lg leading-relaxed">
            {dept.summary}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* About Section */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white dark:bg-brand-900 p-8 rounded-xl border border-brand-200 dark:border-brand-800 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Info className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                <h2 className="text-2xl font-bold text-brand-900 dark:text-brand-100 font-serif">About the Department</h2>
              </div>
              <div className="space-y-4 text-brand-700 dark:text-brand-300 leading-relaxed">
                {dept.about.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>
            </section>

            {/* What Students Learn */}
            {dept.skills.length > 0 && (
              <section className="bg-white dark:bg-brand-900 p-8 rounded-xl border border-brand-200 dark:border-brand-800 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-brand-100 dark:bg-brand-800/80 text-brand-700 dark:text-brand-300">
                    <FlaticonGraduationMortarboard className="w-7 h-7" />
                  </div>
                  <h2 className="text-2xl font-bold text-brand-900 dark:text-brand-100 font-serif">What Students Learn</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {dept.skills.map((skill) => (
                    <div
                      key={skill.title}
                      className="p-4 bg-brand-50/70 dark:bg-brand-950/70 rounded-xl border border-brand-200 dark:border-brand-800/80"
                    >
                      <h3 className="font-bold text-brand-900 dark:text-brand-100 text-sm mb-1">
                        {skill.title}
                      </h3>
                      <p className="text-xs text-brand-600 dark:text-brand-400">
                        {skill.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Careers Section */}
          <div className="space-y-6">
            <section className="bg-white dark:bg-brand-900 p-8 rounded-xl border border-brand-200 dark:border-brand-800 shadow-sm h-full flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                <h2 className="text-2xl font-bold text-brand-900 dark:text-brand-100 font-serif">Career Pathways</h2>
              </div>
              <p className="text-brand-600 dark:text-brand-400 text-sm mb-6">
                Graduates from {dept.name} possess versatile skillsets sought across government, industry, and enterprise:
              </p>
              
              <div className="flex flex-wrap gap-2.5">
                {dept.careers.map((career) => (
                  <span
                    key={career}
                    className="inline-flex items-center rounded-full bg-brand-100 dark:bg-brand-800/90 border border-brand-200 dark:border-brand-700 px-3.5 py-1.5 text-xs font-semibold text-brand-900 dark:text-brand-100"
                  >
                    {career}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Complete Course Outlines by Level */}
        <section className="bg-white dark:bg-brand-900 rounded-xl border border-brand-200 dark:border-brand-800 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 border-b border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-900/30 flex items-start gap-4">
            <div className="p-2 bg-white dark:bg-brand-800/80 rounded-2xl border border-brand-200 dark:border-brand-700 shadow-2xs shrink-0">
              <FlaticonCourseOutlines className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-brand-900 dark:text-brand-100 font-serif">Official Course Outlines</h2>
              <p className="text-brand-600 dark:text-brand-400 text-sm mt-1">
                Comprehensive 100L through 400L curriculum breakdown with credit units, core, and elective designations.
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <DepartmentCourseTabs departmentName={dept.name} courses={dept.courses} />
          </div>
        </section>
      </div>
    </div>
  );
}
