import Link from "next/link";
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
  Info
} from "lucide-react";

export function generateStaticParams() {
  return [
    { level: "100" },
    { level: "200" },
    { level: "300" },
    { level: "400" },
  ];
}

const FACULTY_REP = {
  name: "Faculty Representative",
  role: "Faculty Executive Representative (FCI)",
  phone: "09054177365",
  title: "Faculty Student Representative",
  description: "Official student liaison and executive representative for all departments across the Faculty of Computing and Informatics at CUSTECH Osara.",
};

type DepartmentContact = {
  department: string;
  reps: {
    name: string;
    role: string;
    phone: string;
    note?: string;
  }[];
};

const CONTACTS_BY_LEVEL: Record<string, DepartmentContact[]> = {
  "100": [
    {
      department: "Computer Science",
      reps: [
        {
          name: "100L Course Representative",
          role: "Course Representative",
          phone: "-",
          note: "Fresh student rep appointment in progress. Please contact the Faculty Rep for immediate assistance.",
        },
      ],
    },
    {
      department: "Software Engineering",
      reps: [
        {
          name: "100L Course Representative",
          role: "Course Representative",
          phone: "-",
          note: "Fresh student rep appointment in progress. Please contact the Faculty Rep for immediate assistance.",
        },
      ],
    },
    {
      department: "Cyber Security",
      reps: [
        {
          name: "100L Course Representative",
          role: "Course Representative",
          phone: "-",
          note: "Fresh student rep appointment in progress. Please contact the Faculty Rep for immediate assistance.",
        },
      ],
    },
    {
      department: "Information Technology (IFT)",
      reps: [
        {
          name: "100L Course Representative",
          role: "Course Representative",
          phone: "-",
          note: "Fresh student rep appointment in progress. Please contact the Faculty Rep for immediate assistance.",
        },
      ],
    },
    {
      department: "Library & Information Science",
      reps: [
        {
          name: "100L Course Representative",
          role: "Course Representative",
          phone: "-",
          note: "Fresh student rep appointment in progress. Please contact the Faculty Rep for immediate assistance.",
        },
      ],
    },
  ],
  "200": [
    {
      department: "Computer Science",
      reps: [
        { name: "200L Course Rep", role: "Course Representative", phone: "09044201253" },
      ],
    },
    {
      department: "Software Engineering",
      reps: [
        { name: "200L Course Rep", role: "Course Representative", phone: "08107966054" },
      ],
    },
    {
      department: "Cyber Security",
      reps: [
        { name: "200L Course Rep", role: "Course Representative", phone: "09036812126" },
      ],
    },
    {
      department: "Information Technology (IFT)",
      reps: [
        { name: "200L Course Rep", role: "Course Representative", phone: "08157135703" },
      ],
    },
    {
      department: "Library & Information Science",
      reps: [
        { name: "200L Course Rep", role: "Course Representative", phone: "07046346210" },
      ],
    },
  ],
  "300": [
    {
      department: "Computer Science",
      reps: [
        { name: "300L Course Rep", role: "Course Representative", phone: "-", note: "Contact via department group or Faculty Rep" },
      ],
    },
    {
      department: "Software Engineering",
      reps: [
        { name: "300L Course Rep", role: "Course Representative", phone: "-", note: "Contact via department group or Faculty Rep" },
      ],
    },
    {
      department: "Cyber Security",
      reps: [
        { name: "300L Course Rep", role: "Course Representative", phone: "-", note: "Contact via department group or Faculty Rep" },
      ],
    },
    {
      department: "Information Technology (IFT)",
      reps: [
        { name: "300L Course Rep", role: "Course Representative", phone: "-", note: "Contact via department group or Faculty Rep" },
      ],
    },
    {
      department: "Library & Information Science",
      reps: [
        { name: "300L Course Rep", role: "Course Representative", phone: "-", note: "Contact via department group or Faculty Rep" },
      ],
    },
  ],
  "400": [
    {
      department: "Computer Science",
      reps: [
        { name: "400L Course Rep", role: "Course Representative", phone: "-", note: "Contact via department group or Faculty Rep" },
      ],
    },
    {
      department: "Software Engineering",
      reps: [
        { name: "400L Course Rep", role: "Course Representative", phone: "-", note: "Contact via department group or Faculty Rep" },
      ],
    },
    {
      department: "Cyber Security",
      reps: [
        { name: "400L Course Rep", role: "Course Representative", phone: "-", note: "Contact via department group or Faculty Rep" },
      ],
    },
    {
      department: "Information Technology (IFT)",
      reps: [
        { name: "400L Course Rep", role: "Course Representative", phone: "-", note: "Contact via department group or Faculty Rep" },
      ],
    },
    {
      department: "Library & Information Science",
      reps: [
        { name: "400L Course Rep", role: "Course Representative", phone: "-", note: "Contact via department group or Faculty Rep" },
      ],
    },
  ],
};

export default function LevelContactsPage({ params }: { params: { level: string } }) {
  const { level } = params;
  const levelNum = parseInt(level, 10);

  const prevLevel = levelNum > 100 ? levelNum - 100 : null;
  const nextLevel = levelNum < 400 ? levelNum + 100 : null;

  const contacts = CONTACTS_BY_LEVEL[level] || CONTACTS_BY_LEVEL["200"];

  const facultyCleanPhone = FACULTY_REP.phone.replace(/\D/g, "");
  const facultyWaNumber = facultyCleanPhone.startsWith("0") ? `234${facultyCleanPhone.slice(1)}` : facultyCleanPhone;

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
            <span className="text-brand-900 dark:text-brand-100">{level} Level</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-950 dark:text-brand-50 font-serif">
                {level} Level Contacts Directory
              </h1>
              <p className="text-sm text-brand-600 dark:text-brand-400 mt-1">
                Faculty Executive Liaison &amp; Departmental Course Representatives
              </p>
            </div>

            <div className="flex items-center gap-2">
              {prevLevel ? (
                <Link
                  href={`/contacts/${prevLevel}`}
                  className="inline-flex items-center justify-center rounded-md border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-900 px-3 py-2 text-sm font-medium text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-800 transition-colors"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" /> {prevLevel}L
                </Link>
              ) : (
                <span className="inline-flex items-center justify-center rounded-md border border-brand-200/50 dark:border-brand-800/50 bg-brand-100/50 dark:bg-brand-900/50 px-3 py-2 text-sm font-medium text-brand-400 dark:text-brand-600 cursor-not-allowed">
                  <ArrowLeft className="mr-1 h-4 w-4" /> Prev
                </span>
              )}

              {nextLevel ? (
                <Link
                  href={`/contacts/${nextLevel}`}
                  className="inline-flex items-center justify-center rounded-md border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-900 px-3 py-2 text-sm font-medium text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-800 transition-colors"
                >
                  {nextLevel}L <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              ) : (
                <span className="inline-flex items-center justify-center rounded-md border border-brand-200/50 dark:border-brand-800/50 bg-brand-100/50 dark:bg-brand-900/50 px-3 py-2 text-sm font-medium text-brand-400 dark:text-brand-600 cursor-not-allowed">
                  Next <ArrowRight className="ml-1 h-4 w-4" />
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10 flex-grow space-y-10">
        {/* STAND-ALONE FACULTY REPRESENTATIVE SECTION */}
        <section className="bg-gradient-to-br from-brand-900 via-brand-950 to-brand-900 text-white rounded-2xl border border-brand-800 p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-700/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-800/80 text-brand-200 text-xs font-semibold border border-brand-700/60">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>Executive Student Council &bull; Stand-alone Faculty Representative</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                {FACULTY_REP.name}
              </h2>
              <p className="text-brand-200 text-sm max-w-2xl leading-relaxed">
                {FACULTY_REP.description}
              </p>
              <div className="flex items-center gap-2 pt-1 text-brand-300 text-xs">
                <Users size={14} />
                <span>Represents all students across 100L, 200L, 300L, and 400L in FCI</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <div className="bg-brand-800/60 border border-brand-700/80 rounded-xl px-4 py-2.5 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-brand-700 text-white">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-brand-300 uppercase tracking-wider block font-medium">Official Line</span>
                  <span className="text-base font-bold text-white tracking-wide">{FACULTY_REP.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/${facultyWaNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#1ebd5a] px-4 py-3 text-xs sm:text-sm font-semibold text-white shadow transition-colors"
                >
                  <MessageSquare size={16} />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`tel:${FACULTY_REP.phone}`}
                  className="inline-flex items-center justify-center p-3 rounded-xl border border-brand-700 bg-brand-800/80 hover:bg-brand-700 text-white transition-colors"
                  title="Direct Phone Call"
                >
                  <Phone size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* DEPARTMENTAL COURSE REPRESENTATIVES */}
        <div>
          <div className="flex items-center justify-between gap-4 mb-6 pb-3 border-b border-brand-200 dark:border-brand-800">
            <div>
              <h2 className="text-2xl font-bold text-brand-900 dark:text-brand-100 font-serif">
                Departmental Class Representatives
              </h2>
              <p className="text-sm text-brand-600 dark:text-brand-400 mt-0.5">
                {level} Level course governors for each accredited department in FCI.
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-900 text-brand-800 dark:text-brand-200 border border-brand-200 dark:border-brand-800">
              {level} Level Directory
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contacts.map((dept) => {
              const rep = dept.reps[0];
              const hasPhone = rep.phone && rep.phone !== "-";
              const cleanPhone = hasPhone ? rep.phone.replace(/\D/g, "") : "";
              const waNumber = cleanPhone.startsWith("0") ? `234${cleanPhone.slice(1)}` : cleanPhone;

              return (
                <div
                  key={dept.department}
                  className="bg-white dark:bg-brand-900 p-6 rounded-2xl border border-brand-200 dark:border-brand-800 shadow-sm flex flex-col justify-between hover:border-brand-400 dark:hover:border-brand-600 transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center rounded-full bg-brand-100 dark:bg-brand-800 px-3 py-1 text-xs font-semibold text-brand-800 dark:text-brand-200">
                        {rep.role}
                      </span>
                      <span className="text-[11px] font-bold text-brand-500">
                        {level}L
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-brand-900 dark:text-brand-100 font-serif">
                      {dept.department}
                    </h3>

                    <p className="text-sm font-medium text-brand-700 dark:text-brand-300 mt-2">
                      {rep.name}
                    </p>

                    {hasPhone ? (
                      <div className="flex items-center text-brand-600 dark:text-brand-400 text-sm mt-3">
                        <Phone className="h-4 w-4 mr-2 text-brand-500 shrink-0" />
                        <span className="font-mono font-medium">{rep.phone}</span>
                      </div>
                    ) : (
                      <p className="text-xs text-brand-500 dark:text-brand-400 mt-3 leading-relaxed">
                        {rep.note || "Contact via the Faculty Representative or official WhatsApp group."}
                      </p>
                    )}
                  </div>

                  <div className="pt-5 mt-5 border-t border-brand-100 dark:border-brand-800 flex items-center gap-2">
                    {hasPhone ? (
                      <>
                        <a
                          href={`https://wa.me/${waNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] hover:bg-[#1ebd5a] px-3 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition-colors"
                        >
                          <MessageSquare className="h-4 w-4" /> WhatsApp
                        </a>
                        <a
                          href={`tel:${rep.phone}`}
                          className="inline-flex items-center justify-center rounded-xl border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-900 p-2 text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-800 transition-colors"
                          title="Call representative"
                        >
                          <Phone className="h-4 w-4" />
                        </a>
                      </>
                    ) : (
                      <a
                        href={`https://wa.me/${facultyWaNumber}?text=Hello%20Faculty%20Rep,%20I%20am%20a%20${level}L%20student%20in%20${encodeURIComponent(dept.department)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-brand-200 dark:border-brand-700 bg-brand-50 dark:bg-brand-950 px-3 py-2 text-xs font-semibold text-brand-800 dark:text-brand-200 hover:bg-brand-100 dark:hover:bg-brand-900 transition-colors"
                      >
                        <MessageSquare className="h-3.5 w-3.5" /> Reach via Faculty Rep
                      </a>
                    )}
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