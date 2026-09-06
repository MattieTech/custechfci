"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Home,
  Users,
  MapPin,
  Mail,
  Globe,
  Code,
  MessageSquare,
  ShieldCheck,
  Send,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Filter,
  Phone,
} from "lucide-react";
import { loadCommunityGroups, type ClassGroup, DEFAULT_COMMUNITY_GROUPS } from "@/lib/community-groups";

export default function ContactsPage() {
  const [groups, setGroups] = useState<ClassGroup[]>(DEFAULT_COMMUNITY_GROUPS);
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");

  useEffect(() => {
    loadCommunityGroups().then(setGroups);

    const handleUpdate = () => {
      loadCommunityGroups().then(setGroups);
    };

    window.addEventListener("community_groups_updated", handleUpdate);
    return () => window.removeEventListener("community_groups_updated", handleUpdate);
  }, []);

  const filteredGroups = groups.filter((grp) => {
    const matchDept = selectedDept === "All" || grp.department === selectedDept || grp.department === "General Faculty";
    const matchLevel = selectedLevel === "All" || grp.level === 0 || grp.level === parseInt(selectedLevel);
    return matchDept && matchLevel;
  });


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
            <span className="text-brand-900 dark:text-brand-100">Contact & Community Directory</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-950 dark:text-brand-50 font-serif">
            Student Contacts & Verified Groups
          </h1>
          <p className="mt-2 text-brand-600 dark:text-brand-400 max-w-2xl">
            Find verified contact details for course representatives and join official department and faculty WhatsApp communities.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-10 flex-grow space-y-12">
        {/* Verified Class WhatsApp Directory (Feature 5) */}
        <section className="bg-white dark:bg-brand-900 rounded-2xl border border-brand-200 dark:border-brand-800 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-brand-100 dark:border-brand-800 pb-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-2">
                <ShieldCheck size={14} /> Official Verified Directory
              </div>
              <h2 className="text-2xl font-bold text-brand-900 dark:text-brand-100 font-serif">
                Department & Class WhatsApp Groups
              </h2>
              <p className="text-sm text-brand-600 dark:text-brand-400 mt-0.5">
                Direct join links for verified class governor broadcasts and study groups.
              </p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-xs font-medium focus:ring-2 focus:ring-brand-500"
              >
                <option value="All">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Information Technology (IFT)">Information Tech</option>
                <option value="Library & Information Science">Library & Info Sci</option>
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-xs font-medium focus:ring-2 focus:ring-brand-500"
              >
                <option value="All">All Levels</option>
                <option value="100">100 Level</option>
                <option value="200">200 Level</option>
                <option value="300">300 Level</option>
                <option value="400">400 Level</option>
              </select>
            </div>
          </div>

          {/* Group Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGroups.map((grp) => (
              <div
                key={grp.id}
                className="p-5 rounded-xl border border-brand-200 dark:border-brand-800 bg-brand-50/40 dark:bg-brand-950/40 flex flex-col justify-between hover:border-brand-400 dark:hover:border-brand-600 transition-all shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60">
                      <CheckCircle2 size={12} /> Verified Group
                    </span>
                    <span className="text-[11px] text-brand-500 font-medium">
                      {grp.member_estimate || "100+ students"}
                    </span>
                  </div>

                  <h3 className="font-bold text-brand-900 dark:text-brand-100 text-base leading-snug">
                    {grp.name}
                  </h3>
                  <p className="text-xs font-medium text-brand-600 dark:text-brand-400 mt-1">
                    {grp.department} {grp.level > 0 ? `• ${grp.level}L` : ""}
                  </p>
                  <p className="text-[11px] text-brand-500 mt-2">
                    Managed by: {grp.rep_name || "Course Rep"}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-brand-200/60 dark:border-brand-800/60 flex items-center gap-2">
                  <a
                    href={grp.whatsapp_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#25D366] hover:bg-[#1ebd5a] px-3 py-2 text-xs font-semibold text-white shadow-sm transition-colors"
                  >
                    <MessageSquare size={14} /> Join WhatsApp
                  </a>
                  {grp.telegram_link && (
                    <a
                      href={grp.telegram_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-[#229ED9] hover:bg-[#1b8ec3] text-white text-xs transition-colors"
                      title="Join Telegram"
                    >
                      <Send size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}

          </div>

          {/* Safety Notice */}
          <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
            <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
              <strong>Security Guideline:</strong> Only join community groups carrying the official faculty verification badge above. CUSTECH FCI administration will never solicit personal banking passwords, course registration fees, or departmental dues directly over social chat.
            </p>
          </div>
        </section>

        {/* Level Contacts Navigation Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-6 w-6 text-brand-600 dark:text-brand-400" />
            <h2 className="text-2xl font-bold text-brand-900 dark:text-brand-100 font-serif">
              Course Representatives Phone Directory
            </h2>
          </div>
          <p className="text-brand-600 dark:text-brand-400 mb-6 max-w-2xl text-sm">
            Select your academic level to view direct phone numbers and WhatsApp links for class representatives.
          </p>

          {/* Hierarchy Guide Banner */}
          <div className="bg-brand-100/60 dark:bg-brand-900/50 p-5 rounded-2xl border border-brand-200/80 dark:border-brand-800/80 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-brand-700 dark:text-brand-300 uppercase tracking-wider block">
                Level-Specific Representation
              </span>
              <p className="text-xs sm:text-sm text-brand-800 dark:text-brand-200">
                Each academic level features its own <strong>Faculty Representative</strong> as well as <strong>Course Representatives</strong> and <strong>Assistant Course Representatives</strong> for every accredited department.
              </p>
            </div>
            <span className="shrink-0 text-xs font-medium text-brand-600 dark:text-brand-400 bg-white dark:bg-brand-950 px-3 py-1.5 rounded-lg border border-brand-200 dark:border-brand-800 shadow-sm">
              Select Your Level Below
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[100, 200, 300, 400].map((level) => (
              <Link key={level} href={`/contacts/${level}`} className="group">
                <div className="bg-white dark:bg-brand-900 p-8 rounded-xl border border-brand-200 dark:border-brand-800 shadow-sm hover:border-brand-400 dark:hover:border-brand-600 transition-all duration-200 text-center flex flex-col items-center justify-center h-full">
                  <span className="text-4xl font-bold text-brand-900 dark:text-brand-100 font-serif mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {level}
                  </span>
                  <span className="text-brand-500 dark:text-brand-400 font-medium uppercase tracking-wider text-sm mb-4">
                    Level
                  </span>
                  <div className="mt-auto flex items-center text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:text-brand-800 dark:group-hover:text-brand-300">
                    View Contacts <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* General Info & Developer Section in a Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Information */}
          <section className="bg-white dark:bg-brand-900 p-8 rounded-xl border border-brand-200 dark:border-brand-800 shadow-sm h-full">
            <h2 className="text-xl font-bold text-brand-900 dark:text-brand-100 font-serif mb-6 border-b border-brand-100 dark:border-brand-800/50 pb-4">
              General Information
            </h2>

            <ul className="space-y-6">
              <li className="flex items-start">
                <div className="p-2 bg-brand-50 dark:bg-brand-950 rounded-lg text-brand-600 dark:text-brand-400 mr-4 shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-brand-900 dark:text-brand-100 mb-1">Faculty Location</h3>
                  <p className="text-sm text-brand-600 dark:text-brand-400">
                    Main Campus, CUSTECH Osara, Kogi State, Nigeria.
                  </p>
                </div>
              </li>

              <li className="flex items-start">
                <div className="p-2 bg-brand-50 dark:bg-brand-950 rounded-lg text-brand-600 dark:text-brand-400 mr-4 shrink-0">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-brand-900 dark:text-brand-100 mb-1">Official Website</h3>
                  <a
                    href="https://custech.edu.ng"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    custech.edu.ng
                  </a>
                </div>
              </li>

              <li className="flex items-start">
                <div className="p-2 bg-brand-50 dark:bg-brand-950 rounded-lg text-brand-600 dark:text-brand-400 mr-4 shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-brand-900 dark:text-brand-100 mb-1">General Inquiries</h3>
                  <p className="text-sm text-brand-600 dark:text-brand-400">info@custech.edu.ng</p>
                </div>
              </li>
            </ul>
          </section>

          {/* Developer Section */}
          <section className="bg-brand-900 p-8 rounded-xl border border-brand-800 shadow-sm text-brand-50 h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-800/50 rounded-bl-full -mr-16 -mt-16 z-0"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <Code className="h-6 w-6 text-brand-400" />
                <h2 className="text-xl font-bold text-white font-serif">Platform Developer</h2>
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-1">Matthew Aliu</h3>
                <p className="text-brand-300 font-medium mb-4">MattieTech</p>
                <p className="text-brand-200 text-sm leading-relaxed max-w-md">
                  This student portal was designed and developed to enhance the academic experience for students at the
                  Faculty of Computing and Informatics.
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-brand-300">Have suggestions or found a bug?</p>
                <a
                  href="mailto:contact@mattietech.com"
                  className="inline-flex items-center justify-center rounded-md bg-brand-500 px-6 py-2.5 text-sm font-medium text-white shadow transition-colors hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-400"
                >
                  <Mail className="mr-2 h-4 w-4" /> Reach out to developer
                </a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

