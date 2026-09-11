'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  DEPARTMENTS_DATA, 
  DepartmentData, 
  Course 
} from '@/lib/departments-data';
import { 
  Calculator, 
  Award, 
  TrendingUp, 
  Plus, 
  Trash2, 
  RotateCcw, 
  ArrowLeft, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle,
  Printer,
  Sparkles,
  Target,
  GraduationCap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CGPARoadmap } from '@/components/cgpa-roadmap';
import { toast } from 'sonner';

interface CourseGradeRow {
  id: string;
  code: string;
  title: string;
  units: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | '';
}

const GRADE_POINTS: Record<string, number> = {
  'A': 5,
  'B': 4,
  'C': 3,
  'D': 2,
  'E': 1,
  'F': 0,
};

export default function CGPACalculatorPage() {
  const [activeView, setActiveView] = useState<'calculator' | 'roadmap'>('calculator');
  const departmentKeys = Object.keys(DEPARTMENTS_DATA);
  const [selectedDeptSlug, setSelectedDeptSlug] = useState<string>('computer-science');
  const [selectedLevel, setSelectedLevel] = useState<number>(100);
  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);

  // Active Courses Table
  const [courseRows, setCourseRows] = useState<CourseGradeRow[]>([]);

  // Cumulative Prior inputs
  const [hasPriorResults, setHasPriorResults] = useState<boolean>(false);
  const [priorUnits, setPriorUnits] = useState<number>(0);
  const [priorCGPA, setPriorCGPA] = useState<number>(0);

  // Forecaster (Target Mode) state
  const [targetClass, setTargetClass] = useState<number>(4.50); // First class default
  const [forecastCurrentUnits, setForecastCurrentUnits] = useState<number>(36);
  const [forecastCurrentCGPA, setForecastCurrentCGPA] = useState<number>(3.80);
  const [forecastRemainingUnits, setForecastRemainingUnits] = useState<number>(72);

  // Auto-load courses from departments-data
  const loadPresetCourses = () => {
    const dept = DEPARTMENTS_DATA[selectedDeptSlug];
    if (!dept || !dept.courses[selectedLevel] || !dept.courses[selectedLevel][selectedSemester]) {
      setCourseRows([]);
      return;
    }

    const rawCourses = dept.courses[selectedLevel][selectedSemester];
    const initialRows: CourseGradeRow[] = rawCourses.map((c, i) => ({
      id: `${c.code}-${i}`,
      code: c.code,
      title: c.title,
      units: c.units,
      grade: ''
    }));

    setCourseRows(initialRows);
  };

  useEffect(() => {
    loadPresetCourses();
  }, [selectedDeptSlug, selectedLevel, selectedSemester]);

  // Handle grade change
  const handleGradeChange = (id: string, grade: CourseGradeRow['grade']) => {
    setCourseRows(prev => prev.map(row => row.id === id ? { ...row, grade } : row));
  };

  // Add custom course row
  const handleAddCustomCourse = () => {
    const newRow: CourseGradeRow = {
      id: `custom-${Date.now()}`,
      code: 'NEW 000',
      title: 'Elective / Carryover Course',
      units: 2,
      grade: ''
    };
    setCourseRows(prev => [...prev, newRow]);
  };

  // Remove row
  const handleRemoveCourse = (id: string) => {
    setCourseRows(prev => prev.filter(row => row.id !== id));
  };

  // Update units or code
  const handleUpdateField = (id: string, field: 'code' | 'title' | 'units', val: any) => {
    setCourseRows(prev => prev.map(row => {
      if (row.id === id) {
        return { ...row, [field]: field === 'units' ? Math.max(1, Number(val) || 1) : val };
      }
      return row;
    }));
  };

  // Calculation for current semester
  const { totalUnits, totalQualityPoints, semesterGPA, gradedUnits } = useMemo(() => {
    let tUnits = 0;
    let gUnits = 0;
    let tqp = 0;

    courseRows.forEach(row => {
      tUnits += row.units;
      if (row.grade && GRADE_POINTS[row.grade] !== undefined) {
        gUnits += row.units;
        tqp += row.units * GRADE_POINTS[row.grade];
      }
    });

    const gpa = gUnits > 0 ? Number((tqp / gUnits).toFixed(2)) : 0.00;

    return {
      totalUnits: tUnits,
      gradedUnits: gUnits,
      totalQualityPoints: tqp,
      semesterGPA: gpa
    };
  }, [courseRows]);

  // Combined Cumulative CGPA
  const cumulativeCGPA = useMemo(() => {
    if (!hasPriorResults || priorUnits <= 0) return semesterGPA;
    const priorQP = priorUnits * priorCGPA;
    const combinedQP = priorQP + totalQualityPoints;
    const combinedUnits = priorUnits + gradedUnits;
    if (combinedUnits === 0) return 0.00;
    return Number((combinedQP / combinedUnits).toFixed(2));
  }, [hasPriorResults, priorUnits, priorCGPA, totalQualityPoints, gradedUnits, semesterGPA]);

  // Degree Classification
  const getClassification = (cgpa: number) => {
    if (cgpa >= 4.50) return { title: 'First Class Honours', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', desc: 'Distinction performance. Keep it up!' };
    if (cgpa >= 3.50) return { title: 'Second Class Honours (Upper Division)', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30', desc: 'Solid competitive academic standing (2:1).' };
    if (cgpa >= 2.40) return { title: 'Second Class Honours (Lower Division)', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', desc: 'Satisfactory standing (2:2). Push higher with target drills!' };
    if (cgpa >= 1.50) return { title: 'Third Class Honours', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30', desc: 'Academic caution. Intensive revision recommended.' };
    if (cgpa >= 1.00) return { title: 'Pass Degree', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30', desc: 'Borderline pass. Immediate remedial focus needed.' };
    return { title: 'Probation / Warning', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30', desc: 'Below minimum pass benchmark. Consult department advisor.' };
  };

  // Forecast Target Mode Calculation
  const forecastResult = useMemo(() => {
    if (forecastRemainingUnits <= 0) return null;
    const totalProgramUnits = forecastCurrentUnits + forecastRemainingUnits;
    const requiredTotalPoints = targetClass * totalProgramUnits;
    const currentPoints = forecastCurrentCGPA * forecastCurrentUnits;
    const neededPoints = requiredTotalPoints - currentPoints;
    const requiredRemainingGPA = Number((neededPoints / forecastRemainingUnits).toFixed(2));

    const isPossible = requiredRemainingGPA <= 5.00;
    const isAlreadyGuaranteed = requiredRemainingGPA <= 1.00;

    return {
      requiredRemainingGPA,
      isPossible,
      isAlreadyGuaranteed
    };
  }, [targetClass, forecastCurrentUnits, forecastCurrentCGPA, forecastRemainingUnits]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Banner */}
      <header className="border-b border-border/40 bg-card/60 backdrop-blur sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-foreground">Smart CGPA Calculator</h1>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                  5.0 CUSTECH Scale
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Auto-populated course outlines & Degree Class Forecaster
              </p>
            </div>
          </div>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.print()}
            className="text-xs gap-1.5 hidden sm:flex"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Report
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-6 max-w-6xl space-y-8">
        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <button
            type="button"
            onClick={() => setActiveView('calculator')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeView === 'calculator'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Semester GPA &amp; Forecaster</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveView('roadmap')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeView === 'roadmap'
                ? 'bg-primary text-primary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 animate-icon-wiggle" />
            <span>Academic Roadmap &amp; Trajectory</span>
            <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] py-0 px-1 border-0">
              New
            </Badge>
          </button>
        </div>

        {activeView === 'roadmap' ? (
          <CGPARoadmap />
        ) : (
          <>
        {/* Department & Curriculum Selection Hero */}
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
                <GraduationCap className="h-4 w-4 animate-icon-bounce" />
                Curriculum-Grounding Engine
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                Select Your Department & Level
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Courses, units, and core/elective status will automatically populate from official CUSTECH outlines.
              </p>
            </div>

            {/* Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Dept */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Department</label>
                <select
                  value={selectedDeptSlug}
                  onChange={(e) => setSelectedDeptSlug(e.target.value)}
                  className="w-full h-9 rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  {departmentKeys.map(k => (
                    <option key={k} value={k}>
                      {DEPARTMENTS_DATA[k].name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Academic Level</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(Number(e.target.value))}
                  className="w-full h-9 rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value={100}>100 Level</option>
                  <option value={200}>200 Level</option>
                  <option value={300}>300 Level</option>
                  <option value={400}>400 Level</option>
                </select>
              </div>

              {/* Semester */}
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground block mb-1">Semester</label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(Number(e.target.value) as 1 | 2)}
                  className="w-full h-9 rounded-lg border border-border bg-card px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value={1}>First Semester</option>
                  <option value={2}>Second Semester</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Course Grading Table & Live Summary Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Course Table */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="p-4 border-b border-border/40 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-foreground">
                    Registered Courses ({DEPARTMENTS_DATA[selectedDeptSlug]?.name} • {selectedLevel}L {selectedSemester === 1 ? '1st' : '2nd'} Sem)
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {courseRows.length} courses loaded • Enter expected or achieved letter grades
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddCustomCourse}
                    className="text-xs gap-1 h-8"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Course
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={loadPresetCourses}
                    className="text-xs gap-1 h-8 text-muted-foreground hover:text-foreground"
                    title="Reset to default department syllabus"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </Button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-muted/40 border-b border-border/40 font-mono text-[11px] text-muted-foreground">
                    <tr>
                      <th className="p-3 w-28">Course Code</th>
                      <th className="p-3">Course Title</th>
                      <th className="p-3 w-16 text-center">Units</th>
                      <th className="p-3 w-28 text-center">Grade</th>
                      <th className="p-3 w-16 text-center">QP</th>
                      <th className="p-3 w-10 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {courseRows.map((row) => {
                      const points = row.grade ? (GRADE_POINTS[row.grade] ?? 0) : null;
                      const qp = points !== null ? points * row.units : '-';

                      return (
                        <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                          <td className="p-3 font-mono font-bold text-foreground">
                            <input 
                              type="text"
                              value={row.code}
                              onChange={(e) => handleUpdateField(row.id, 'code', e.target.value)}
                              className="w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary rounded px-1"
                            />
                          </td>
                          <td className="p-3 text-muted-foreground">
                            <input 
                              type="text"
                              value={row.title}
                              onChange={(e) => handleUpdateField(row.id, 'title', e.target.value)}
                              className="w-full bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-primary rounded px-1"
                            />
                          </td>
                          <td className="p-3 text-center font-mono">
                            <input 
                              type="number"
                              min={1}
                              max={6}
                              value={row.units}
                              onChange={(e) => handleUpdateField(row.id, 'units', e.target.value)}
                              className="w-12 text-center bg-muted/40 border border-border/50 rounded h-7 text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                            />
                          </td>
                          <td className="p-3 text-center">
                            <select
                              value={row.grade}
                              onChange={(e) => handleGradeChange(row.id, e.target.value as CourseGradeRow['grade'])}
                              className={`h-8 w-20 rounded-md border text-xs font-bold font-mono px-2 transition-colors focus:ring-1 focus:ring-primary focus:outline-none ${
                                row.grade === 'A' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                                row.grade === 'B' ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' :
                                row.grade === 'C' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' :
                                row.grade === 'D' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                                row.grade === 'E' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                                row.grade === 'F' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
                                'bg-card text-muted-foreground border-border'
                              }`}
                            >
                              <option value="">-</option>
                              <option value="A">A (5)</option>
                              <option value="B">B (4)</option>
                              <option value="C">C (3)</option>
                              <option value="D">D (2)</option>
                              <option value="E">E (1)</option>
                              <option value="F">F (0)</option>
                            </select>
                          </td>
                          <td className="p-3 text-center font-mono font-bold text-foreground">
                            {qp}
                          </td>
                          <td className="p-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveCourse(row.id)}
                              className="text-muted-foreground hover:text-rose-400 transition-colors p-1"
                              title="Delete Course"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Prior Cumulative Record Toggle */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-foreground">Include Previous Semesters?</h4>
                  <p className="text-xs text-muted-foreground">
                    Calculate your overall cumulative CGPA across all completed sessions.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={hasPriorResults ? 'primary' : 'outline'}
                  onClick={() => setHasPriorResults(!hasPriorResults)}
                  className="text-xs"
                >
                  {hasPriorResults ? 'Enabled' : 'Enable Combined CGPA'}
                </Button>
              </div>

              {hasPriorResults && (
                <div className="mt-4 pt-4 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      Prior Total Credit Units Completed
                    </label>
                    <input 
                      type="number"
                      min={1}
                      value={priorUnits || ''}
                      onChange={(e) => setPriorUnits(Math.max(0, Number(e.target.value) || 0))}
                      placeholder="e.g. 42"
                      className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs font-mono focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground block mb-1">
                      Prior Cumulative CGPA
                    </label>
                    <input 
                      type="number"
                      step="0.01"
                      min={0}
                      max={5}
                      value={priorCGPA || ''}
                      onChange={(e) => setPriorCGPA(Math.min(5, Math.max(0, Number(e.target.value) || 0)))}
                      placeholder="e.g. 4.15"
                      className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs font-mono focus:ring-1 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Live CGPA Metric Gauge */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-md sticky top-20">
              <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-4">
                <span className="text-xs font-mono uppercase text-muted-foreground font-semibold">Academic Scorecard</span>
                <Badge variant="outline" className="text-[10px]">Nigerian 5.0 Scale</Badge>
              </div>

              {/* Semester GPA Display */}
              <div className="text-center py-4">
                <span className="text-xs text-muted-foreground font-medium block">
                  {hasPriorResults ? 'This Semester GPA' : 'Calculated GPA'}
                </span>
                <div className="text-5xl font-extrabold font-mono text-foreground mt-1 tracking-tight">
                  {semesterGPA.toFixed(2)}
                </div>
                <span className="text-xs text-muted-foreground mt-1 block">
                  {gradedUnits} of {totalUnits} units graded
                </span>
              </div>

              {/* Combined CGPA if enabled */}
              {hasPriorResults && (
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-center mb-4">
                  <span className="text-xs text-primary font-bold block">Overall Cumulative CGPA</span>
                  <div className="text-3xl font-extrabold font-mono text-primary mt-0.5">
                    {cumulativeCGPA.toFixed(2)}
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    Across {priorUnits + gradedUnits} total credit units
                  </span>
                </div>
              )}

              {/* Degree Classification Badge */}
              <div className="mt-2">
                <div className={`p-4 rounded-xl border text-center ${getClassification(hasPriorResults ? cumulativeCGPA : semesterGPA).color}`}>
                  <div className="flex items-center justify-center gap-1.5 font-bold text-sm">
                    <Award className="h-4 w-4" />
                    {getClassification(hasPriorResults ? cumulativeCGPA : semesterGPA).title}
                  </div>
                  <p className="text-[11px] mt-1 opacity-80 leading-snug">
                    {getClassification(hasPriorResults ? cumulativeCGPA : semesterGPA).desc}
                  </p>
                </div>
              </div>

              {/* Breakdown metrics */}
              <div className="mt-6 pt-4 border-t border-border/40 space-y-2 text-xs">
                <div className="flex justify-between text-muted-foreground">
                  <span>Total Credit Units (TCU):</span>
                  <span className="font-mono font-bold text-foreground">{totalUnits}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Total Quality Points (TQP):</span>
                  <span className="font-mono font-bold text-foreground">{totalQualityPoints}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Grading Scale:</span>
                  <span className="font-mono text-foreground">A(5), B(4), C(3), D(2), E(1), F(0)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Target Mode Degree Forecaster */}
        <div className="rounded-2xl border border-primary/30 bg-card p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="p-2 rounded-lg bg-primary/20 text-primary">
              <Target className="h-5 w-5 animate-icon-pulse-glow text-primary" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-foreground">
              Degree Class Forecaster (&quot;Target Mode&quot;)
            </h3>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground max-w-2xl">
            Want to graduate with a First Class or Second Class Upper? Enter your current standing and remaining credits to forecast the exact semester GPA you need to maintain.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Target Degree Class</label>
              <select
                value={targetClass}
                onChange={(e) => setTargetClass(Number(e.target.value))}
                className="w-full h-10 rounded-lg border border-border bg-background px-3 text-xs font-bold text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
              >
                <option value={4.50}>First Class (4.50 - 5.00)</option>
                <option value={3.50}>Second Class Upper 2:1 (3.50 - 4.49)</option>
                <option value={2.40}>Second Class Lower 2:2 (2.40 - 3.49)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Current CGPA</label>
              <input
                type="number"
                step="0.01"
                min={0}
                max={5}
                value={forecastCurrentCGPA}
                onChange={(e) => setForecastCurrentCGPA(Number(e.target.value))}
                className="w-full h-10 rounded-lg border border-border bg-background px-3 text-xs font-mono text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Credits Completed So Far</label>
              <input
                type="number"
                min={1}
                value={forecastCurrentUnits}
                onChange={(e) => setForecastCurrentUnits(Number(e.target.value))}
                className="w-full h-10 rounded-lg border border-border bg-background px-3 text-xs font-mono text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Credits Remaining</label>
              <input
                type="number"
                min={1}
                value={forecastRemainingUnits}
                onChange={(e) => setForecastRemainingUnits(Number(e.target.value))}
                className="w-full h-10 rounded-lg border border-border bg-background px-3 text-xs font-mono text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Forecaster Result Callout */}
          {forecastResult && (
            <div className="mt-6 p-5 rounded-xl border bg-muted/30 border-border flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                  Required Remaining Benchmark
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-3xl font-extrabold font-mono text-primary">
                    {forecastResult.requiredRemainingGPA.toFixed(2)} GPA
                  </span>
                  <Badge 
                    variant="outline"
                    className={forecastResult.isPossible ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}
                  >
                    {forecastResult.isPossible ? 'Mathematically Achievable' : 'Unattainable on 5.0 Scale'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {forecastResult.isPossible ? (
                    `To graduate with ${targetClass >= 4.50 ? 'First Class Honours' : '2:1 Honours'}, you must maintain an average GPA of at least ${forecastResult.requiredRemainingGPA.toFixed(2)} across your next ${forecastRemainingUnits} credit units.`
                  ) : (
                    `Even with straight A's (5.0 GPA) across all remaining ${forecastRemainingUnits} units, the maximum possible finishing CGPA is ${(((forecastCurrentCGPA * forecastCurrentUnits) + (5.0 * forecastRemainingUnits)) / (forecastCurrentUnits + forecastRemainingUnits)).toFixed(2)}. Adjust your target class or explore retaking core courses.`
                  )}
                </p>
              </div>

              <div className="flex-shrink-0">
                <Link href="/cbt">
                  <Button size="sm" className="gap-1.5 text-xs">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Practice Past Questions Now
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
          </>
        )}
      </main>
    </div>
  );
}

