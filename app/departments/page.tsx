import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { ALL_DEPARTMENTS } from "@/lib/departments-data";
import {
  FlaticonDeptCs,
  FlaticonDeptCyber,
  FlaticonDeptSe,
  FlaticonDeptIt,
  FlaticonDeptLis
} from "@/components/animated-flaticons";

const DEPT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "computer-science": FlaticonDeptCs,
  "cyber-security": FlaticonDeptCyber,
  "software-engineering": FlaticonDeptSe,
  "information-technology": FlaticonDeptIt,
  "library-info-science": FlaticonDeptLis,
};

export default function DepartmentsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-50/30 dark:bg-brand-950">
      {/* Page Header */}
      <div className="bg-white dark:bg-brand-900 border-b border-brand-200 dark:border-brand-800 py-8 px-4 md:px-6">
        <div className="container mx-auto">
          <nav className="flex items-center text-sm font-medium text-brand-500 mb-4">
            <Link href="/" className="hover:text-brand-800 dark:hover:text-brand-300 flex items-center">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-brand-900 dark:text-brand-100">Departments</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-950 dark:text-brand-50 font-serif">
            Departments
          </h1>
          <p className="mt-2 text-brand-600 dark:text-brand-400 max-w-2xl">
            Explore the five specialized academic programs offered within the Faculty of Computing and Informatics at CUSTECH Osara. Each department provides thorough training to prepare you for excellence in technology and information science.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-12 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_DEPARTMENTS.map((dept, index) => {
            const Icon = DEPT_ICONS[dept.slug] || FlaticonDeptCs;
            return (
              <Link
                key={dept.slug}
                href={`/departments/${dept.slug}`}
                className="group h-full animate-fade-in"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="bg-white dark:bg-brand-900 p-5 sm:p-6 rounded-2xl border border-brand-200 dark:border-brand-800 shadow-sm flex flex-col h-full hover:border-brand-400 dark:hover:border-brand-600 hover:shadow-md transition-all duration-300 group-hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 bg-brand-50 dark:bg-brand-950/80 rounded-2xl border border-brand-200/80 dark:border-brand-800 shadow-2xs group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-11 h-11" />
                    </div>
                    <span className="inline-flex items-center rounded-full bg-brand-50 dark:bg-brand-950 px-2.5 py-0.5 text-xs font-semibold text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800">
                      {dept.careers.length} Careers
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-brand-900 dark:text-brand-100 font-serif mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {dept.name}
                  </h2>
                  
                  <p className="text-brand-600 dark:text-brand-400 text-sm mb-6 flex-grow line-clamp-3">
                    {dept.summary}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-brand-100 dark:border-brand-800/50 flex items-center text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:text-brand-800 dark:group-hover:text-brand-300">
                    View Department &amp; Outlines <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
