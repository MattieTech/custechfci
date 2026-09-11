'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  Award, 
  Plus, 
  Trash2, 
  Calendar, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  FileText,
  RotateCcw,
  GraduationCap,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export interface SemesterRecord {
  id: string;
  level: number;
  semester: 1 | 2;
  gpa: number;
  units: number;
  label: string;
}

const DEFAULT_SAMPLE_ROADMAP: SemesterRecord[] = [
  { id: 'sem-1', level: 100, semester: 1, gpa: 4.62, units: 21, label: '100L Harmattan' },
  { id: 'sem-2', level: 100, semester: 2, gpa: 4.45, units: 22, label: '100L Rain' },
];

export function CGPARoadmap() {
  const [records, setRecords] = useState<SemesterRecord[]>([]);
  const [targetDegree, setTargetDegree] = useState<'first-class' | 'second-upper'>('first-class');
  const [totalProgramYears, setTotalProgramYears] = useState<number>(4);

  // New entry form state
  const [formLevel, setFormLevel] = useState<number>(200);
  const [formSemester, setFormSemester] = useState<1 | 2>(1);
  const [formGPA, setFormGPA] = useState<string>('4.50');
  const [formUnits, setFormUnits] = useState<string>('20');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fci_cgpa_roadmap');
      if (saved) {
        setRecords(JSON.parse(saved));
      } else {
        setRecords(DEFAULT_SAMPLE_ROADMAP);
      }
    } catch (e) {
      setRecords(DEFAULT_SAMPLE_ROADMAP);
    }
  }, []);

  // Save to localStorage
  const saveRecords = (newRecords: SemesterRecord[]) => {
    setRecords(newRecords);
    try {
      localStorage.setItem('fci_cgpa_roadmap', JSON.stringify(newRecords));
    } catch (e) {
      console.warn('Failed to save roadmap', e);
    }
  };

  // Cumulative Calculations
  const stats = useMemo(() => {
    let totalQualityPoints = 0;
    let totalUnits = 0;

    const progression = records.map((rec) => {
      const qp = rec.gpa * rec.units;
      totalQualityPoints += qp;
      totalUnits += rec.units;
      const currentCumulative = totalUnits > 0 ? totalQualityPoints / totalUnits : 0;
      return {
        ...rec,
        cumulativeCGPA: Number(currentCumulative.toFixed(2))
      };
    });

    const finalCGPA = totalUnits > 0 ? Number((totalQualityPoints / totalUnits).toFixed(2)) : 0;

    let degreeClass = 'Pass Degree';
    let badgeColor = 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-300';

    if (finalCGPA >= 4.50) {
      degreeClass = 'First Class Honours';
      badgeColor = 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30';
    } else if (finalCGPA >= 3.50) {
      degreeClass = 'Second Class Upper (2:1)';
      badgeColor = 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30';
    } else if (finalCGPA >= 2.40) {
      degreeClass = 'Second Class Lower (2:2)';
      badgeColor = 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30';
    } else if (finalCGPA >= 1.50) {
      degreeClass = 'Third Class';
      badgeColor = 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30';
    }

    // Forecast remaining semesters
    const totalSemestersInProgram = totalProgramYears * 2;
    const completedSemesters = records.length;
    const remainingSemesters = Math.max(0, totalSemestersInProgram - completedSemesters);

    const targetCGPA = targetDegree === 'first-class' ? 4.50 : 3.50;
    const avgUnitsPerSem = 20;
    const futureTotalUnits = totalUnits + (remainingSemesters * avgUnitsPerSem);
    const requiredTotalQP = targetCGPA * futureTotalUnits;
    const remainingQPNeeded = requiredTotalQP - totalQualityPoints;
    const requiredFutureAvgGPA = remainingSemesters > 0 
      ? Number((remainingQPNeeded / (remainingSemesters * avgUnitsPerSem)).toFixed(2)) 
      : 0;

    return {
      totalUnits,
      finalCGPA,
      degreeClass,
      badgeColor,
      progression,
      completedSemesters,
      remainingSemesters,
      requiredFutureAvgGPA,
      isTargetAchievable: requiredFutureAvgGPA <= 5.0 && requiredFutureAvgGPA > 0
    };
  }, [records, targetDegree, totalProgramYears]);

  const handleAddSemester = (e: React.FormEvent) => {
    e.preventDefault();
    const gpaNum = parseFloat(formGPA);
    const unitsNum = parseInt(formUnits, 10);

    if (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 5.0) {
      toast.error('GPA must be between 0.00 and 5.00');
      return;
    }

    if (isNaN(unitsNum) || unitsNum <= 0) {
      toast.error('Registered credit units must be positive');
      return;
    }

    const label = `${formLevel}L ${formSemester === 1 ? 'Harmattan' : 'Rain'}`;

    const newRecord: SemesterRecord = {
      id: 'sem-' + Date.now(),
      level: formLevel,
      semester: formSemester,
      gpa: Number(gpaNum.toFixed(2)),
      units: unitsNum,
      label
    };

    const updated = [...records, newRecord];
    saveRecords(updated);
    setShowAddForm(false);
    toast.success(`Added ${label} to your Academic Roadmap!`);
  };

  const handleDeleteRecord = (id: string) => {
    const updated = records.filter(r => r.id !== id);
    saveRecords(updated);
    toast.success('Semester removed from roadmap');
  };

  const handleResetRoadmap = () => {
    if (confirm('Reset your roadmap to initial data?')) {
      saveRecords(DEFAULT_SAMPLE_ROADMAP);
      toast.success('Roadmap reset');
    }
  };

  // SVG Chart Dimensions
  const chartHeight = 220;
  const chartWidth = 520;
  const paddingX = 45;
  const paddingY = 30;

  const getYCoord = (gpa: number) => {
    // scale 0.00 to 5.00 into chartHeight
    const normalized = Math.max(0, Math.min(5.0, gpa)) / 5.0;
    return (chartHeight - paddingY) - (normalized * (chartHeight - (paddingY * 2)));
  };

  const getXCoord = (index: number) => {
    if (stats.progression.length <= 1) return chartWidth / 2;
    const step = (chartWidth - (paddingX * 2)) / (stats.progression.length - 1);
    return paddingX + (index * step);
  };

  // Generate SVG Path
  const points = stats.progression.map((item, idx) => ({
    x: getXCoord(idx),
    y: getYCoord(item.cumulativeCGPA),
    gpa: item.cumulativeCGPA,
    semGPA: item.gpa,
    label: item.label
  }));

  const linePath = points.length > 0 
    ? points.reduce((acc, pt, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${pt.x} ${pt.y}`, '') 
    : '';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cumulative CGPA */}
        <div className="rounded-2xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-zinc-900 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Cumulative CGPA
            </span>
            <div className="p-2 rounded-xl bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-300">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-serif">
              {stats.finalCGPA.toFixed(2)}
            </div>
            <div className="mt-1">
              <Badge className={`text-xs font-semibold px-2 py-0.5 border ${stats.badgeColor}`}>
                {stats.degreeClass}
              </Badge>
            </div>
          </div>
        </div>

        {/* Total Credits */}
        <div className="rounded-2xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-zinc-900 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Credits Logged
            </span>
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.totalUnits} <span className="text-sm font-medium text-slate-500">Units</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Across {stats.completedSemesters} completed {stats.completedSemesters === 1 ? 'semester' : 'semesters'}
            </p>
          </div>
        </div>

        {/* Remaining Semesters */}
        <div className="rounded-2xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-zinc-900 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Remaining Semesters
            </span>
            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {stats.remainingSemesters} <span className="text-sm font-medium text-slate-500">Left</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Based on {totalProgramYears}-year degree standard
            </p>
          </div>
        </div>

        {/* Target Milestone */}
        <div className="rounded-2xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-zinc-900 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Target Forecaster
            </span>
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {stats.remainingSemesters > 0 ? (
                stats.isTargetAchievable ? (
                  `${stats.requiredFutureAvgGPA.toFixed(2)} GPA`
                ) : (
                  <span className="text-amber-600 text-sm">Target Unattainable</span>
                )
              ) : (
                <span className="text-emerald-600 text-sm">Degree Completed</span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Avg GPA required to achieve {targetDegree === 'first-class' ? 'First Class (≥4.50)' : '2:1 (≥3.50)'}
            </p>
          </div>
        </div>
      </div>

      {/* Visual Trajectory Graph Card */}
      <div className="rounded-2xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-heading">
                Academic Trajectory &amp; Degree Class Benchmarks
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Visual curve tracking your cumulative CGPA across recorded semesters relative to CUSTECH degree thresholds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={targetDegree}
              onChange={(e) => setTargetDegree(e.target.value as any)}
              className="h-8 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 px-2.5 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none"
            >
              <option value="first-class">Goal: First Class (4.50+)</option>
              <option value="second-upper">Goal: 2:1 (3.50+)</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(true)}
              className="h-8 text-xs gap-1.5 border-brand-300 text-brand-700 dark:text-brand-300"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Semester</span>
            </Button>
          </div>
        </div>

        {/* Interactive SVG Chart */}
        <div className="w-full overflow-x-auto no-scrollbar pt-2 pb-4">
          <div className="min-w-[480px]">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-auto overflow-visible"
            >
              {/* Background Grid Lines */}
              {[5.0, 4.5, 3.5, 2.4, 1.0].map((val) => {
                const y = getYCoord(val);
                const isFirstClass = val === 4.5;
                const isSecondUpper = val === 3.5;

                return (
                  <g key={val}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={chartWidth - paddingX}
                      y2={y}
                      stroke={isFirstClass ? '#10b981' : isSecondUpper ? '#3b82f6' : 'currentColor'}
                      strokeOpacity={isFirstClass || isSecondUpper ? 0.4 : 0.08}
                      strokeDasharray={isFirstClass || isSecondUpper ? '4 3' : 'none'}
                      strokeWidth={isFirstClass || isSecondUpper ? 1.5 : 1}
                    />
                    <text
                      x={paddingX - 8}
                      y={y + 3}
                      textAnchor="end"
                      fontSize="9"
                      fill={isFirstClass ? '#10b981' : isSecondUpper ? '#3b82f6' : '#94a3b8'}
                      fontWeight={isFirstClass || isSecondUpper ? 'bold' : 'normal'}
                      fontFamily="monospace"
                    >
                      {val.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Benchmark labels on right */}
              <text
                x={chartWidth - paddingX + 6}
                y={getYCoord(4.5) + 3}
                fontSize="8"
                fill="#10b981"
                fontWeight="bold"
              >
                1st Class (4.50)
              </text>
              <text
                x={chartWidth - paddingX + 6}
                y={getYCoord(3.5) + 3}
                fontSize="8"
                fill="#3b82f6"
                fontWeight="bold"
              >
                2:1 (3.50)
              </text>

              {/* Trajectory Curve Line */}
              {points.length > 1 && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="#7A5A42"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {/* Data Points */}
              {points.map((pt, idx) => {
                const isAboveFirst = pt.gpa >= 4.50;
                return (
                  <g key={idx} className="group cursor-pointer">
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="5"
                      fill={isAboveFirst ? '#10b981' : '#7A5A42'}
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    {/* CGPA Text Bubble */}
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill="currentColor"
                      className="fill-slate-800 dark:fill-white font-mono"
                    >
                      {pt.gpa.toFixed(2)}
                    </text>
                    {/* X Axis Label */}
                    <text
                      x={pt.x}
                      y={chartHeight - 10}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#64748b"
                    >
                      {pt.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Graph Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-zinc-800/80 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-600"></span>
              <span>Cumulative CGPA</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-500 border-dashed"></span>
              <span>First Class Line (4.50)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-blue-500 border-dashed"></span>
              <span>2:1 Line (3.50)</span>
            </span>
          </div>
          <span>Stored privately on this device</span>
        </div>
      </div>

      {/* Semester History Table */}
      <div className="rounded-2xl border border-brand-200 dark:border-brand-800 bg-white dark:bg-zinc-900 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-heading">
              Semester Academic Records
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetRoadmap}
              className="text-xs h-8 text-slate-500 hover:text-slate-900 dark:hover:text-white gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={() => setShowAddForm(true)}
              className="text-xs h-8 bg-brand-600 hover:bg-brand-700 text-white gap-1"
            >
              <Plus className="w-3 h-3" />
              Add Record
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-500 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Semester</th>
                <th className="py-2.5 px-3">Registered Units</th>
                <th className="py-2.5 px-3">Semester GPA</th>
                <th className="py-2.5 px-3">Cumulative CGPA</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60">
              {stats.progression.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                    {item.label}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-zinc-300">
                    {item.units} Units
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800 dark:text-zinc-100">
                    {item.gpa.toFixed(2)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono font-extrabold text-brand-700 dark:text-brand-300">
                      {item.cumulativeCGPA.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteRecord(item.id)}
                      className="p-1 rounded text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Semester Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-brand-600" />
                Add Completed Semester
              </h4>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
                aria-label="Close form"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSemester} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 block mb-1">
                    Academic Level
                  </label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(Number(e.target.value))}
                    className="w-full h-9 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 px-3 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-brand-500"
                  >
                    <option value={100}>100 Level</option>
                    <option value={200}>200 Level</option>
                    <option value={300}>300 Level</option>
                    <option value={400}>400 Level</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 block mb-1">
                    Semester
                  </label>
                  <select
                    value={formSemester}
                    onChange={(e) => setFormSemester(Number(e.target.value) as 1 | 2)}
                    className="w-full h-9 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 px-3 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-brand-500"
                  >
                    <option value={1}>Harmattan (1st)</option>
                    <option value={2}>Rain (2nd)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 block mb-1">
                  Semester GPA (0.00 – 5.00)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="5.0"
                  value={formGPA}
                  onChange={(e) => setFormGPA(e.target.value)}
                  placeholder="e.g. 4.55"
                  required
                  className="w-full h-9 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 px-3 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 block mb-1">
                  Total Registered Credit Units
                </label>
                <input
                  type="number"
                  min="1"
                  max="35"
                  value={formUnits}
                  onChange={(e) => setFormUnits(e.target.value)}
                  placeholder="e.g. 21"
                  required
                  className="w-full h-9 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 px-3 text-xs text-slate-900 dark:text-white focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs h-8 bg-brand-600 hover:bg-brand-700 text-white"
                >
                  Save to Roadmap
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
