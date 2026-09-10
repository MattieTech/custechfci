"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Home,
  Calculator,
  BookOpen,
  Calendar,
  Clock,
  Plus,
  Trash2,
  Info,
  Target,
  FileText,
  Download,
  Eye,
  Search,
  Upload,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  Loader2,
  GraduationCap,
  HardDrive,
  Bookmark,
  BookmarkCheck,
  MessageSquare,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  FIRST_SEMESTER_EVENTS,
  SECOND_SEMESTER_EVENTS,
  ACADEMIC_SESSION,
  INSTITUTION_NAME,
  ISSUED_BY,
} from "@/lib/academic-calendar";
import { cn } from "@/lib/utils";
import { DiscussionDrawer } from "@/components/discussion-drawer";

type Course = {
  id: string;
  code: string;
  units: number;
  grade: string;
};

type Material = {
  id: string;
  title: string;
  description: string | null;
  course_code: string | null;
  course_title: string | null;
  level: number | null;
  semester: number | null;
  material_type: string;
  type?: string;
  session: string | null;
  file_url: string;
  file_name: string;
  file_size: number | null;
  download_count?: number;
  is_published: boolean;
  created_at: string;
};

export default function ResourcesPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState("cgpa");
  const [calendarSemester, setCalendarSemester] = useState<1 | 2>(1);

  // CGPA Calculator State
  const [courses, setCourses] = useState<Course[]>([
    { id: "1", code: "CSC 101", units: 3, grade: "A" },
    { id: "2", code: "MTH 101", units: 3, grade: "B" },
    { id: "3", code: "PHY 101", units: 3, grade: "C" },
  ]);
  const [prevCGPA, setPrevCGPA] = useState("");
  const [prevUnits, setPrevUnits] = useState("");
  const [result, setResult] = useState<{ gpa: number; cgpa: number; class: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Target CGPA Planner State
  const [targetCurrentCgpa, setTargetCurrentCgpa] = useState("");
  const [targetUnitsCompleted, setTargetUnitsCompleted] = useState("");
  const [targetDesiredCgpa, setTargetDesiredCgpa] = useState("4.50");
  const [targetRemainingUnits, setTargetRemainingUnits] = useState("60");
  const [targetPlanResult, setTargetPlanResult] = useState<{
    requiredGpa: number;
    status: "achievable" | "challenging" | "impossible";
    message: string;
    targetClass: string;
  } | null>(null);

  // Age Calculator State
  const [dob, setDob] = useState("");
  const [ageResult, setAgeResult] = useState<{ years: number; months: number; days: number } | null>(null);

  // Study Materials State
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [materialSearch, setMaterialSearch] = useState("");
  const [materialLevel, setMaterialLevel] = useState("");
  const [materialTypeFilter, setMaterialTypeFilter] = useState("");
  const [previewMaterial, setPreviewMaterial] = useState<Material | null>(null);
  const [discussionMaterial, setDiscussionMaterial] = useState<Material | null>(null);

  // Offline Vault State (IndexedDB / LocalStorage)
  const [vaultMaterials, setVaultMaterials] = useState<Material[]>([]);

  useEffect(() => {
    try {
      const savedVault = localStorage.getItem('custech_fci_offline_vault');
      if (savedVault) {
        setVaultMaterials(JSON.parse(savedVault));
      }
    } catch (e) {
      console.warn('Failed to load offline vault:', e);
    }
  }, []);

  const toggleVaultMaterial = (item: Material) => {
    try {
      const exists = vaultMaterials.some(v => v.id === item.id);
      let updated: Material[];
      if (exists) {
        updated = vaultMaterials.filter(v => v.id !== item.id);
        toast.info("Removed from Offline Vault");
      } else {
        updated = [item, ...vaultMaterials];
        toast.success("Saved to Offline Vault!", {
          description: "This document is now saved locally for zero-data offline reading."
        });
      }
      setVaultMaterials(updated);
      localStorage.setItem('custech_fci_offline_vault', JSON.stringify(updated));
    } catch (e) {
      toast.error("Failed to update Offline Vault");
    }
  };

  // Student Contribution Modal State
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [contribTitle, setContribTitle] = useState("");
  const [contribCourseCode, setContribCourseCode] = useState("");
  const [contribCourseTitle, setContribCourseTitle] = useState("");
  const [contribLevel, setContribLevel] = useState("100");
  const [contribSemester, setContribSemester] = useState("1");
  const [contribType, setContribType] = useState("past_question");
  const [contribFile, setContribFile] = useState<File | null>(null);
  const [contribSubmitting, setContribSubmitting] = useState(false);

  const gradePoints: Record<string, number> = {
    A: 5,
    B: 4,
    C: 3,
    D: 2,
    E: 1,
    F: 0,
  };

  const addCourse = () => {
    setCourses([...courses, { id: Math.random().toString(), code: "", units: 0, grade: "A" }]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter((c) => c.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: any) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const calculateCGPA = () => {
    setError(null);
    if (courses.some((c) => c.units <= 0)) {
      setError("All courses must have credit units greater than 0");
      return;
    }

    let totalPoints = 0;
    let totalUnits = 0;

    courses.forEach((course) => {
      totalPoints += course.units * gradePoints[course.grade];
      totalUnits += course.units;
    });

    const currentGpa = totalUnits > 0 ? totalPoints / totalUnits : 0;
    let finalCgpa = currentGpa;

    if (prevCGPA && prevUnits) {
      const pCgpa = parseFloat(prevCGPA);
      const pUnits = parseFloat(prevUnits);

      if (!isNaN(pCgpa) && !isNaN(pUnits)) {
        const pastPoints = pCgpa * pUnits;
        finalCgpa = (pastPoints + totalPoints) / (pUnits + totalUnits);
      }
    }

    let degreeClass = "";
    if (finalCgpa >= 4.5) degreeClass = "First Class Honours";
    else if (finalCgpa >= 3.5) degreeClass = "Second Class Honours (Upper Division)";
    else if (finalCgpa >= 2.4) degreeClass = "Second Class Honours (Lower Division)";
    else if (finalCgpa >= 1.5) degreeClass = "Third Class Honours";
    else degreeClass = "Pass / Fail";

    setResult({
      gpa: Number(currentGpa.toFixed(2)),
      cgpa: Number(finalCgpa.toFixed(2)),
      class: degreeClass,
    });
  };

  // Target CGPA Calculation
  const calculateTargetPlan = () => {
    const curCgpa = parseFloat(targetCurrentCgpa);
    const curUnits = parseFloat(targetUnitsCompleted);
    const targetCgpa = parseFloat(targetDesiredCgpa);
    const remUnits = parseFloat(targetRemainingUnits);

    if (isNaN(curCgpa) || isNaN(curUnits) || isNaN(targetCgpa) || isNaN(remUnits)) {
      toast.error("Please enter all required values for the target projection");
      return;
    }

    if (remUnits <= 0) {
      toast.error("Remaining units must be greater than 0");
      return;
    }

    const totalUnits = curUnits + remUnits;
    const requiredTotalPoints = targetCgpa * totalUnits;
    const earnedPoints = curCgpa * curUnits;
    const neededPoints = requiredTotalPoints - earnedPoints;
    const requiredGpa = neededPoints / remUnits;

    let targetClass = "";
    if (targetCgpa >= 4.5) targetClass = "First Class Honours";
    else if (targetCgpa >= 3.5) targetClass = "Second Class Upper (2:1)";
    else if (targetCgpa >= 2.4) targetClass = "Second Class Lower (2:2)";
    else targetClass = "Third Class";

    if (requiredGpa > 5.0) {
      setTargetPlanResult({
        requiredGpa: Number(requiredGpa.toFixed(2)),
        status: "impossible",
        message: `Mathematically unreachable. Even with a perfect 5.00 GPA across all ${remUnits} remaining units, your maximum possible graduating CGPA is ${( (earnedPoints + 5.0 * remUnits) / totalUnits ).toFixed(2)}.`,
        targetClass,
      });
    } else if (requiredGpa >= 4.2) {
      setTargetPlanResult({
        requiredGpa: Number(requiredGpa.toFixed(2)),
        status: "challenging",
        message: `High distinction required! You need an average semester GPA of ${requiredGpa.toFixed(2)} (primarily 'A' grades with very few 'B's) across your remaining ${remUnits} credit units.`,
        targetClass,
      });
    } else {
      setTargetPlanResult({
        requiredGpa: Number(Math.max(0, requiredGpa).toFixed(2)),
        status: "achievable",
        message: `Very realistic goal! Maintaining an average semester GPA of ${Math.max(0, requiredGpa).toFixed(2)} across your next ${remUnits} units will secure your ${targetClass}.`,
        targetClass,
      });
    }
  };

  const calculateAge = () => {
    if (!dob) return;
    const birthDate = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    setAgeResult({ years, months, days });
  };

  // Fetch Study Materials
  const fetchMaterials = async () => {
    setLoadingMaterials(true);
    try {
      let query = supabase
        .from("materials")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (materialLevel) {
        query = query.eq("level", parseInt(materialLevel));
      }
      if (materialTypeFilter) {
        query = query.eq("type", materialTypeFilter);
        query = query.eq("material_type", materialTypeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setMaterials(data || []);
    } catch (err: any) {
      console.error("Error loading materials:", err);
    } finally {
      setLoadingMaterials(false);
    }
  };

  useEffect(() => {
    if (activeTab === "materials") {
      fetchMaterials();
    }
  }, [activeTab, materialLevel, materialTypeFilter]);

  const incrementMaterialView = async (id: string) => {
    try {
      fetch('/api/materials/view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materialId: id }),
      });
      setMaterials((prev) =>
        prev.map((m) => (m.id === id ? { ...m, download_count: (m.download_count || 0) + 1 } : m))
      );
    } catch (e) {
      console.warn('View count increment error:', e);
    }
  };

  // Handle Student Material Contribution
  const handleStudentSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contribTitle.trim() || !contribFile) {
      toast.error("Please provide a title and select a file");
      return;
    }

    if (contribFile.size > 15 * 1024 * 1024) {
      toast.error("File size cannot exceed 15MB");
      return;
    }

    setContribSubmitting(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", contribFile);
      uploadFormData.append("bucket", "materials");

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.url) {
        throw new Error(uploadData.error || "Failed to upload file to storage");
      }

      const { error: insertError } = await supabase.from("materials").insert({
        title: contribTitle.trim(),
        description: "Student Community Submission",
        course_code: contribCourseCode.trim().toUpperCase() || null,
        course_title: contribCourseTitle.trim() || null,
        level: parseInt(contribLevel),
        semester: parseInt(contribSemester),
        material_type: contribType,
        session: "2025/2026",
        file_url: uploadData.url,
        file_name: uploadData.fileName || contribFile.name,
        file_size: uploadData.size || contribFile.size,
        is_published: false, // Pending admin review
      });

      if (insertError) throw insertError;

      toast.success("Submission received successfully!", {
        description: "Your study material has been sent to faculty admins for review and will be published shortly.",
      });

      setShowContributeModal(false);
      setContribTitle("");
      setContribCourseCode("");
      setContribCourseTitle("");
      setContribFile(null);
    } catch (err: any) {
      toast.error("Submission failed", { description: err.message });
    } finally {
      setContribSubmitting(false);
    }
  };

  const filteredMaterials = materials.filter((m) => {
    const q = materialSearch.toLowerCase();
    return (
      m.title.toLowerCase().includes(q) ||
      (m.course_code && m.course_code.toLowerCase().includes(q)) ||
      (m.course_title && m.course_title.toLowerCase().includes(q))
    );
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
            <span className="text-brand-900 dark:text-brand-100">Tools & Resources</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-brand-950 dark:text-brand-50 font-serif">
            Tools & Academic Resources
          </h1>
          <p className="mt-2 text-brand-600 dark:text-brand-400 max-w-2xl">
            Access CGPA projections, target degree planning, verified past questions, and essential faculty utilities.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-10 flex-grow w-full max-w-full overflow-hidden">
        {/* Custom Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-6 sm:mb-8 border-b border-brand-200 dark:border-brand-800 pb-2 overflow-x-auto no-scrollbar scroll-smooth w-full">
          <button
            onClick={() => setActiveTab("cgpa")}
            className={`flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors shrink-0 whitespace-nowrap ${
              activeTab === "cgpa"
                ? "border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400"
                : "border-transparent text-brand-600 dark:text-brand-400 hover:text-brand-900 dark:hover:text-brand-200 hover:border-brand-300 dark:hover:border-brand-700"
            }`}
          >
            <Calculator className="w-4 h-4 mr-1.5 sm:mr-2" /> CGPA Calculator
          </button>
          <button
            onClick={() => setActiveTab("target_planner")}
            className={`flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors shrink-0 whitespace-nowrap ${
              activeTab === "target_planner"
                ? "border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400"
                : "border-transparent text-brand-600 dark:text-brand-400 hover:text-brand-900 dark:hover:text-brand-200 hover:border-brand-300 dark:hover:border-brand-700"
            }`}
          >
            <Target className="w-4 h-4 mr-1.5 sm:mr-2 text-amber-500" /> Target CGPA Planner
          </button>
          <button
            onClick={() => setActiveTab("materials")}
            className={`flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors shrink-0 whitespace-nowrap ${
              activeTab === "materials"
                ? "border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400"
                : "border-transparent text-brand-600 dark:text-brand-400 hover:text-brand-900 dark:hover:text-brand-200 hover:border-brand-300 dark:hover:border-brand-700"
            }`}
          >
            <BookOpen className="w-4 h-4 mr-1.5 sm:mr-2" /> Study Materials &amp; Past Qs
          </button>
          <button
            onClick={() => setActiveTab("vault")}
            className={`flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors shrink-0 whitespace-nowrap ${
              activeTab === "vault"
                ? "border-purple-600 text-purple-600 dark:border-purple-400 dark:text-purple-400"
                : "border-transparent text-brand-600 dark:text-brand-400 hover:text-brand-900 dark:hover:text-brand-200 hover:border-brand-300 dark:hover:border-brand-700"
            }`}
          >
            <HardDrive className="w-4 h-4 mr-1.5 sm:mr-2 text-purple-500" /> Offline Vault ({vaultMaterials.length})
          </button>
          <button
            onClick={() => setActiveTab("age")}
            className={`flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors shrink-0 whitespace-nowrap ${
              activeTab === "age"
                ? "border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400"
                : "border-transparent text-brand-600 dark:text-brand-400 hover:text-brand-900 dark:hover:text-brand-200 hover:border-brand-300 dark:hover:border-brand-700"
            }`}
          >
            <Clock className="w-4 h-4 mr-1.5 sm:mr-2" /> Age Calculator
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium border-b-2 transition-colors shrink-0 whitespace-nowrap ${
              activeTab === "calendar"
                ? "border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400"
                : "border-transparent text-brand-600 dark:text-brand-400 hover:text-brand-900 dark:hover:text-brand-200 hover:border-brand-300 dark:hover:border-brand-700"
            }`}
          >
            <Calendar className="w-4 h-4 mr-1.5 sm:mr-2" /> Academic Calendar
          </button>
        </div>

        {/* Tab Contents */}
        <div className="bg-white dark:bg-brand-900 rounded-xl border border-brand-200 dark:border-brand-800 shadow-sm p-3.5 sm:p-6 md:p-8 w-full max-w-full overflow-hidden">
          {/* CGPA Calculator */}
          {activeTab === "cgpa" && (
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-brand-900 dark:text-brand-100 font-serif mb-2">
                  Semester CGPA Calculator
                </h2>
                <p className="text-brand-600 dark:text-brand-400 text-sm">
                  Calculate your current semester GPA and cumulative CGPA based on the 5.0 grading scale.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300 text-sm flex items-start">
                  <Info className="h-5 w-5 mr-2 shrink-0" /> {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6 bg-brand-50 dark:bg-brand-950/50 rounded-xl border border-brand-100 dark:border-brand-800">
                <div>
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">
                    Previous CGPA (Optional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 4.25"
                    value={prevCGPA}
                    onChange={(e) => setPrevCGPA(e.target.value)}
                    className="w-full rounded-md border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-1">
                    Total Previous Units Completed
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 36"
                    value={prevUnits}
                    onChange={(e) => setPrevUnits(e.target.value)}
                    className="w-full rounded-md border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto no-scrollbar w-full pb-2">
                <div className="min-w-[440px] space-y-4 mb-6">
                  <div className="grid grid-cols-12 gap-4 px-2 pb-2 border-b border-brand-100 dark:border-brand-800 text-sm font-medium text-brand-500 dark:text-brand-400">
                    <div className="col-span-5 md:col-span-6">Course Code</div>
                    <div className="col-span-3">Units</div>
                    <div className="col-span-3 md:col-span-2">Grade</div>
                    <div className="col-span-1"></div>
                  </div>

                  {courses.map((course, index) => (
                    <div key={course.id} className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-5 md:col-span-6">
                        <input
                          type="text"
                          placeholder={`Course ${index + 1}`}
                          value={course.code}
                          onChange={(e) => updateCourse(course.id, "code", e.target.value)}
                          className="w-full rounded-md border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                      <div className="col-span-3">
                        <input
                          type="number"
                          min="1"
                          max="6"
                          value={course.units || ""}
                          onChange={(e) => updateCourse(course.id, "units", parseInt(e.target.value) || 0)}
                          className="w-full rounded-md border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                      <div className="col-span-3 md:col-span-2">
                        <select
                          value={course.grade}
                          onChange={(e) => updateCourse(course.id, "grade", e.target.value)}
                          className="w-full rounded-md border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        >
                          <option value="A">A (5.0)</option>
                          <option value="B">B (4.0)</option>
                          <option value="C">C (3.0)</option>
                          <option value="D">D (2.0)</option>
                          <option value="E">E (1.0)</option>
                          <option value="F">F (0.0)</option>
                        </select>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button
                          onClick={() => removeCourse(course.id)}
                          disabled={courses.length <= 1}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md disabled:opacity-30 transition-colors"
                          title="Remove course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mb-8 border-t border-brand-100 dark:border-brand-800 pt-6">
                <button
                  onClick={addCourse}
                  className="inline-flex items-center text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-800 dark:hover:text-brand-300"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Course
                </button>
                <button
                  onClick={calculateCGPA}
                  className="inline-flex items-center justify-center rounded-md bg-brand-600 px-6 py-2.5 text-sm font-medium text-white shadow transition-colors hover:bg-brand-700"
                >
                  Calculate Results
                </button>
              </div>

              {result && (
                <div className="bg-brand-50 dark:bg-brand-950 p-6 rounded-xl border border-brand-200 dark:border-brand-800 animate-in fade-in slide-in-from-bottom-4">
                  <h3 className="text-lg font-bold text-brand-900 dark:text-brand-100 font-serif mb-4 text-center">
                    Your Results
                  </h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white dark:bg-brand-900 p-4 rounded-lg border border-brand-100 dark:border-brand-800 text-center">
                      <p className="text-xs text-brand-500 dark:text-brand-400 uppercase tracking-wider font-medium mb-1">
                        Semester GPA
                      </p>
                      <p className="text-3xl font-bold text-brand-900 dark:text-brand-100 font-serif">
                        {result.gpa.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-brand-600 p-4 rounded-lg text-white text-center shadow-md">
                      <p className="text-xs text-brand-200 uppercase tracking-wider font-medium mb-1">
                        Cumulative CGPA
                      </p>
                      <p className="text-3xl font-bold font-serif">{result.cgpa.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="inline-flex items-center rounded-full bg-brand-100 dark:bg-brand-900 px-3 py-1 text-sm font-medium text-brand-800 dark:text-brand-200">
                      Classification: {result.class}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Target CGPA Planner (Feature 3) */}
          {activeTab === "target_planner" && (
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-3">
                  <GraduationCap size={14} /> Smart Graduation Projection
                </div>
                <h2 className="text-2xl font-bold text-brand-900 dark:text-brand-100 font-serif mb-2">
                  Target CGPA & Degree Planner
                </h2>
                <p className="text-brand-600 dark:text-brand-400 text-sm">
                  Find out exactly what average GPA you must maintain across your remaining semesters to graduate with
                  your target class of degree.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6 p-6 bg-brand-50/60 dark:bg-brand-950/40 rounded-xl border border-brand-200 dark:border-brand-800">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1.5">
                    Current CGPA *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="5.00"
                    placeholder="e.g. 3.45"
                    value={targetCurrentCgpa}
                    onChange={(e) => setTargetCurrentCgpa(e.target.value)}
                    className="w-full rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1.5">
                    Credit Units Completed So Far *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 40"
                    value={targetUnitsCompleted}
                    onChange={(e) => setTargetUnitsCompleted(e.target.value)}
                    className="w-full rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <span className="text-[11px] text-brand-500 mt-1 block">Usually ~36-44 units per full academic year</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1.5">
                    Target Degree Classification *
                  </label>
                  <select
                    value={targetDesiredCgpa}
                    onChange={(e) => setTargetDesiredCgpa(e.target.value)}
                    className="w-full rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="4.50">First Class Honours (4.50+)</option>
                    <option value="3.50">Second Class Upper Division (3.50+)</option>
                    <option value="2.40">Second Class Lower Division (2.40+)</option>
                    <option value="1.50">Third Class (1.50+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1.5">
                    Remaining Units to Take *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 80"
                    value={targetRemainingUnits}
                    onChange={(e) => setTargetRemainingUnits(e.target.value)}
                    className="w-full rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-900 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <span className="text-[11px] text-brand-500 mt-1 block">A 4-year degree is typically 140-160 total units</span>
                </div>
              </div>

              <div className="flex justify-end mb-8">
                <button
                  onClick={calculateTargetPlan}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
                >
                  <Target size={16} /> Calculate Target Requirement
                </button>
              </div>

              {targetPlanResult && (
                <div
                  className={`p-6 rounded-xl border animate-in fade-in zoom-95 ${
                    targetPlanResult.status === "impossible"
                      ? "bg-red-50/70 border-red-200 dark:bg-red-950/30 dark:border-red-800 text-red-900 dark:text-red-100"
                      : targetPlanResult.status === "challenging"
                      ? "bg-amber-50/70 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800 text-amber-900 dark:text-amber-100"
                      : "bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl shrink-0 ${
                        targetPlanResult.status === "impossible"
                          ? "bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200"
                          : targetPlanResult.status === "challenging"
                          ? "bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200"
                          : "bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200"
                      }`}
                    >
                      {targetPlanResult.status === "impossible" ? (
                        <AlertTriangle size={24} />
                      ) : (
                        <CheckCircle2 size={24} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <h4 className="text-lg font-bold font-serif">
                          Target: {targetPlanResult.targetClass}
                        </h4>
                        <span className="text-2xl font-black font-mono">
                          {targetPlanResult.requiredGpa > 5.0
                            ? "> 5.00"
                            : `${targetPlanResult.requiredGpa.toFixed(2)} GPA`}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed opacity-90">{targetPlanResult.message}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Study Materials & Past Questions (Features 4 & 7) */}
          {activeTab === "materials" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-brand-900 dark:text-brand-100 font-serif">
                    Course Materials & Past Questions
                  </h2>
                  <p className="text-brand-600 dark:text-brand-400 text-sm mt-1">
                    Download lecture slides, textbooks, and past examination papers. Preview PDFs directly in your browser.
                  </p>
                </div>
                <button
                  onClick={() => setShowContributeModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm shrink-0"
                >
                  <Upload size={16} />
                  <span>Submit Study Material</span>
                </button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-brand-50/50 dark:bg-brand-950/40 rounded-xl border border-brand-200 dark:border-brand-800">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" />
                  <input
                    type="text"
                    value={materialSearch}
                    onChange={(e) => setMaterialSearch(e.target.value)}
                    placeholder="Search course code or title..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-900 text-sm focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <select
                  value={materialLevel}
                  onChange={(e) => setMaterialLevel(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-900 text-sm focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">All Levels</option>
                  <option value="100">100 Level</option>
                  <option value="200">200 Level</option>
                  <option value="300">300 Level</option>
                  <option value="400">400 Level</option>
                </select>

                <select
                  value={materialTypeFilter}
                  onChange={(e) => setMaterialTypeFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-900 text-sm focus:ring-2 focus:ring-brand-500"
                >
                  <option value="">All Categories</option>
                  <option value="past_question">Past Questions</option>
                  <option value="lecture_note">Lecture Notes</option>
                  <option value="textbook">Textbooks & Handouts</option>
                  <option value="assignment">Assignments / Solutions</option>
                </select>
              </div>

              {/* Material Cards */}
              {loadingMaterials ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="animate-spin text-brand-600" size={32} />
                </div>
              ) : filteredMaterials.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-brand-200 dark:border-brand-800 rounded-xl">
                  <BookOpen className="w-12 h-12 text-brand-400 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-brand-900 dark:text-brand-100 font-serif">
                    No Materials Found
                  </h3>
                  <p className="text-brand-600 dark:text-brand-400 text-sm mt-1 max-w-sm mx-auto">
                    No materials currently match your search. Be the first to contribute a past question or note!
                  </p>
                  <button
                    onClick={() => setShowContributeModal(true)}
                    className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg text-xs font-semibold hover:bg-brand-700 transition-colors"
                  >
                    Upload Past Question
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 w-full">
                  {filteredMaterials.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-brand-950/60 p-4 sm:p-5 rounded-xl border border-brand-200 dark:border-brand-800 flex flex-col justify-between hover:border-brand-400 dark:hover:border-brand-600 transition-all shadow-sm w-full min-w-0 overflow-hidden"
                    >
                      <div className="w-full min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-brand-100 dark:bg-brand-800 text-brand-800 dark:text-brand-200 truncate">
                            {(item.material_type || item.type || "material").replace("_", " ")}
                          </span>
                          {item.level && (
                            <span className="text-xs font-medium text-brand-500 shrink-0">{item.level}L</span>
                          )}
                        </div>

                        <h3 className="font-bold text-brand-900 dark:text-brand-100 text-sm sm:text-base line-clamp-2 break-words">
                          {item.title}
                        </h3>

                        {item.course_code && (
                          <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 mt-1 break-words">
                            {item.course_code} {item.course_title ? `— ${item.course_title}` : ""}
                          </p>
                        )}

                        {item.description && (
                          <p className="text-xs text-brand-500 dark:text-brand-400 mt-2 line-clamp-2 break-words">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-3.5 mt-3.5 border-t border-brand-100 dark:border-brand-800/60 flex flex-col gap-2.5 w-full">
                        <div className="flex items-center justify-between gap-2 text-[11px] text-brand-500 dark:text-brand-400 w-full min-w-0">
                          <div className="flex items-center gap-1.5 min-w-0 truncate">
                            <span className="shrink-0">{item.file_size ? `${(item.file_size / (1024 * 1024)).toFixed(1)} MB` : "Document"}</span>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1 font-medium text-brand-600 dark:text-brand-300 shrink-0">
                              <Eye size={12} /> {item.download_count || 0} views
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => toggleVaultMaterial(item)}
                            title={vaultMaterials.some(v => v.id === item.id) ? "In Offline Vault" : "Save for offline reading"}
                            className={cn(
                              "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors shrink-0",
                              vaultMaterials.some(v => v.id === item.id)
                                ? "bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700"
                                : "bg-brand-50 hover:bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300"
                            )}
                          >
                            {vaultMaterials.some(v => v.id === item.id) ? (
                              <BookmarkCheck size={14} className="text-purple-600 dark:text-purple-400" />
                            ) : (
                              <Bookmark size={14} />
                            )}
                            <span>{vaultMaterials.some(v => v.id === item.id) ? "In Vault" : "Offline"}</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2 w-full">
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewMaterial(item);
                              incrementMaterialView(item.id);
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-brand-800 dark:text-brand-200 bg-brand-100/80 hover:bg-brand-200 dark:bg-brand-900/80 dark:hover:bg-brand-800 transition-colors min-h-[38px]"
                          >
                            <Eye size={14} /> Preview
                          </button>
                          <a
                            href={item.file_url}
                            download={item.file_name}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => incrementMaterialView(item.id)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-xs min-h-[38px]"
                          >
                            <Download size={14} /> Download
                          </a>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDiscussionMaterial(item)}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/40 dark:hover:bg-brand-900/80 border border-brand-200/80 dark:border-brand-800 transition-colors"
                        >
                          <MessageSquare size={13} className="text-brand-600 dark:text-brand-400" />
                          <span>Discuss &amp; Solutions</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Offline Vault Tab */}
          {activeTab === "vault" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-900/20 via-card to-background border border-purple-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 text-xs font-bold mb-2">
                    <HardDrive className="h-3.5 w-3.5" />
                    PWA Offline Vault Engine
                  </div>
                  <h2 className="text-2xl font-bold font-serif text-foreground">
                    Your Offline Academic Vault
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
                    Documents saved here are stored in your device's local memory. You can access, preview, and study them even during network downtime or data exhaustion at CUSTECH Osara.
                  </p>
                </div>

                {vaultMaterials.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to clear all materials from your offline vault?")) {
                        setVaultMaterials([]);
                        localStorage.removeItem("custech_fci_offline_vault");
                        toast.info("Offline Vault cleared");
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 transition-colors flex-shrink-0"
                  >
                    Clear All Vault Items
                  </button>
                )}
              </div>

              {vaultMaterials.length === 0 ? (
                <div className="text-center py-16 px-4 bg-white dark:bg-brand-900 rounded-2xl border border-dashed border-brand-200 dark:border-brand-800">
                  <HardDrive className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                  <h3 className="text-base font-bold text-foreground">Your Offline Vault is Empty</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                    Browse the <strong>Study Materials &amp; Past Qs</strong> tab and click the <strong>Offline</strong> button on any lecture slide or past question to save it here for zero-internet studying!
                  </p>
                  <button
                    onClick={() => setActiveTab("materials")}
                    className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity"
                  >
                    <BookOpen size={14} /> Browse Available Materials
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 w-full">
                  {vaultMaterials.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-brand-900 p-4 sm:p-5 rounded-2xl border border-purple-200 dark:border-purple-900/60 shadow-sm flex flex-col justify-between w-full min-w-0 overflow-hidden"
                    >
                      <div className="w-full min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 truncate">
                            {(item.material_type || item.type || "material").replace("_", " ")}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">
                            Saved Offline
                          </span>
                        </div>

                        <h3 className="font-bold text-brand-900 dark:text-brand-100 text-sm sm:text-base line-clamp-2 break-words">
                          {item.title}
                        </h3>

                        {item.course_code && (
                          <p className="text-xs font-semibold text-brand-600 dark:text-brand-400 mt-1 break-words">
                            {item.course_code} {item.course_title ? `— ${item.course_title}` : ""}
                          </p>
                        )}
                      </div>

                      <div className="pt-3.5 sm:pt-4 mt-3 sm:mt-4 border-t border-brand-100 dark:border-brand-800/60 flex items-center justify-between gap-2 w-full">
                        <span className="text-[11px] text-muted-foreground shrink-0">
                          {item.file_size ? `${(item.file_size / (1024 * 1024)).toFixed(1)} MB` : "Document"}
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewMaterial(item)}
                            className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 hover:bg-brand-100 dark:bg-brand-800 transition-colors"
                          >
                            <Eye size={14} /> View
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleVaultMaterial(item)}
                            className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition-colors"
                            title="Remove from vault"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Age Calculator */}
          {activeTab === "age" && (
            <div className="max-w-md mx-auto py-8 text-center">
              <div className="mb-8">
                <Clock className="w-12 h-12 text-brand-300 dark:text-brand-700 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-brand-900 dark:text-brand-100 font-serif mb-2">Age Calculator</h2>
                <p className="text-brand-600 dark:text-brand-400 text-sm">
                  Calculate your exact age in years, months, and days.
                </p>
              </div>

              <div className="space-y-4 mb-8 text-left">
                <label className="block text-sm font-medium text-brand-700 dark:text-brand-300">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full rounded-md border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-900 px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <button
                onClick={calculateAge}
                disabled={!dob}
                className="w-full inline-flex items-center justify-center rounded-md bg-brand-600 px-6 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-600 disabled:opacity-50"
              >
                Calculate Age
              </button>

              {ageResult && (
                <div className="mt-8 p-6 bg-brand-50 dark:bg-brand-950 rounded-xl border border-brand-200 dark:border-brand-800 animate-in fade-in zoom-in-95">
                  <p className="text-sm text-brand-500 dark:text-brand-400 mb-2">You are exactly</p>
                  <p className="text-xl font-bold text-brand-900 dark:text-brand-100 font-serif">
                    {ageResult.years} years, {ageResult.months} months, and {ageResult.days} days old.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Academic Calendar */}
          {activeTab === "calendar" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-200 dark:border-brand-800">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 dark:bg-brand-800/60 text-brand-800 dark:text-brand-200 text-xs font-semibold mb-2 border border-brand-200 dark:border-brand-700">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Official Session {ACADEMIC_SESSION}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-brand-900 dark:text-brand-100 font-serif">Academic Calendar</h2>
                  <p className="text-brand-600 dark:text-brand-400 text-sm mt-0.5">
                    {INSTITUTION_NAME} &bull; {ISSUED_BY}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/calendar"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition-colors"
                  >
                    <span>Full Calendar Page</span>
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Semester Switcher */}
              <div className="flex gap-3 bg-brand-100/60 dark:bg-brand-900/60 p-1.5 rounded-xl border border-brand-200/80 dark:border-brand-800">
                <button
                  onClick={() => setCalendarSemester(1)}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    calendarSemester === 1
                      ? "bg-white dark:bg-brand-800 text-brand-900 dark:text-brand-50 shadow-sm"
                      : "text-brand-600 dark:text-brand-400 hover:text-brand-900 dark:hover:text-brand-200"
                  }`}
                >
                  First Semester (28 Sep 2026 – 6 Feb 2027)
                </button>
                <button
                  onClick={() => setCalendarSemester(2)}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    calendarSemester === 2
                      ? "bg-white dark:bg-brand-800 text-brand-900 dark:text-brand-50 shadow-sm"
                      : "text-brand-600 dark:text-brand-400 hover:text-brand-900 dark:hover:text-brand-200"
                  }`}
                >
                  Second Semester (22 Feb 2027 – 19 Jun 2027)
                </button>
              </div>

              {/* Schedule List */}
              <div className="bg-white dark:bg-brand-900 rounded-2xl border border-brand-200 dark:border-brand-800 overflow-hidden shadow-sm divide-y divide-brand-100 dark:divide-brand-800">
                {(calendarSemester === 1 ? FIRST_SEMESTER_EVENTS : SECOND_SEMESTER_EVENTS).map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 transition-colors hover:bg-brand-50/50 dark:hover:bg-brand-950/40 ${
                      item.isMilestone ? "bg-amber-50/20 dark:bg-amber-950/10" : ""
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                          {item.category.replace('_', ' ')}
                        </span>
                        {item.isMilestone && (
                          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/70 px-2 py-0.5 rounded">
                            Key Date
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-brand-950 dark:text-brand-100 text-sm sm:text-base">
                        {item.activity}
                      </h4>
                      {item.details && (
                        <ul className="mt-1.5 space-y-0.5">
                          {item.details.map((bullet, bIdx) => (
                            <li key={bIdx} className="text-xs text-brand-600 dark:text-brand-400 flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-brand-400 shrink-0" />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="shrink-0 self-start sm:self-auto">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 text-xs font-semibold text-brand-800 dark:text-brand-200">
                        <Clock size={12} className="text-brand-500" />
                        {item.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* In-Browser PDF Preview Modal (Feature 4) */}
      {previewMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-white dark:bg-brand-900 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl border border-brand-200 dark:border-brand-800 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-brand-200 dark:border-brand-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="text-brand-600 shrink-0" size={22} />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-brand-900 dark:text-brand-100 truncate">
                    {previewMaterial.title}
                  </h3>
                  <p className="text-xs text-brand-500">
                    {previewMaterial.course_code || "Material"} &bull; {previewMaterial.file_name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:inline-flex items-center gap-1 text-xs text-brand-600 dark:text-brand-300 font-medium px-2.5 py-1 rounded-lg bg-brand-100 dark:bg-brand-800">
                  <Eye size={13} /> {previewMaterial.download_count || 0} views
                </span>
                <a
                  href={previewMaterial.file_url}
                  download={previewMaterial.file_name}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium transition-colors"
                >
                  <Download size={14} /> <span>Download</span>
                </a>
                <a
                  href={previewMaterial.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg border border-brand-200 dark:border-brand-700 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-800"
                  title="Open in new tab"
                >
                  <ExternalLink size={16} />
                </a>
                <button
                  onClick={() => setPreviewMaterial(null)}
                  className="p-1.5 rounded-lg text-brand-400 hover:text-brand-700 dark:hover:text-brand-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Document Viewer Frame */}
            <div className="flex-1 bg-brand-100 dark:bg-brand-950 p-1 sm:p-2">
              <iframe
                src={`${previewMaterial.file_url}#toolbar=1`}
                className="w-full h-full rounded-lg border border-brand-200 dark:border-brand-800 bg-white"
                title={previewMaterial.title}
              />
            </div>
          </div>
        </div>
      )}

      {/* Student Material Contribution Modal (Feature 7) */}
      {showContributeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-brand-900 rounded-2xl w-full max-w-lg shadow-2xl border border-brand-200 dark:border-brand-800 my-8">
            <div className="p-5 border-b border-brand-200 dark:border-brand-800 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold font-serif text-brand-900 dark:text-brand-100">
                  Submit Study Material
                </h3>
                <p className="text-xs text-brand-500">Contribute past questions or lecture notes for fellow students</p>
              </div>
              <button onClick={() => setShowContributeModal(false)} className="text-brand-400 hover:text-brand-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleStudentSubmission} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                  Document Title *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. CSC 201 Midterm Past Questions 2024"
                  value={contribTitle}
                  onChange={(e) => setContribTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CSC 201"
                    value={contribCourseCode}
                    onChange={(e) => setContribCourseCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                    Level *
                  </label>
                  <select
                    value={contribLevel}
                    onChange={(e) => setContribLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="100">100 Level</option>
                    <option value="200">200 Level</option>
                    <option value="300">300 Level</option>
                    <option value="400">400 Level</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                    Semester
                  </label>
                  <select
                    value={contribSemester}
                    onChange={(e) => setContribSemester(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="1">1st Semester</option>
                    <option value="2">2nd Semester</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                    Material Type
                  </label>
                  <select
                    value={contribType}
                    onChange={(e) => setContribType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="past_question">Past Question</option>
                    <option value="lecture_note">Lecture Note / Slide</option>
                    <option value="textbook">Textbook / Handout</option>
                    <option value="assignment">Assignment / Tutorial</option>
                    <option value="other">Other Material</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                  Attach File * (PDF, DOCX, PPT - Max 10MB)
                </label>
                <input
                  required
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                  onChange={(e) => setContribFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-brand-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-100 file:text-brand-800 hover:file:bg-brand-200"
                />
              </div>

              <div className="p-3 bg-brand-50 dark:bg-brand-950 rounded-lg text-xs text-brand-600 dark:text-brand-400">
                Notice: All student submissions undergo admin verification before appearing publicly on the portal.
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-brand-200 dark:border-brand-800">
                <button
                  type="button"
                  onClick={() => setShowContributeModal(false)}
                  className="px-4 py-2 border border-brand-200 dark:border-brand-700 rounded-lg text-sm text-brand-700 dark:text-brand-300 hover:bg-brand-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={contribSubmitting}
                  className="flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {contribSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  <span>{contribSubmitting ? "Uploading..." : "Submit Material"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

