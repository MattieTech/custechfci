'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  CBT_COURSES, 
  CBT_QUESTIONS, 
  CBTCourse, 
  CBTQuestion,
  getMergedQuestionsForCourse
} from '@/lib/cbt-banks';
import { 
  BookOpen, 
  Clock, 
  Award, 
  CheckCircle2, 
  XCircle, 
  Flag, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  AlertCircle,
  BarChart3,
  HelpCircle,
  Flame,
  ArrowLeft,
  Check,
  Zap,
  Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AnswerRecord {
  questionId: string;
  selectedOption: number | null;
  flagged: boolean;
}

interface AttemptHistory {
  id: string;
  courseCode: string;
  courseTitle: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
  timeSpentSec: number;
}

export default function CBTPage() {
  const [selectedCourse, setSelectedCourse] = useState<CBTCourse | null>(null);
  const [examMode, setExamMode] = useState<'setup' | 'active' | 'review'>('setup');
  
  // Setup Options
  const [isTimed, setIsTimed] = useState<boolean>(true);
  const [questionLimit, setQuestionLimit] = useState<number>(20);
  
  // Active Exam State
  const [activeQuestions, setActiveQuestions] = useState<CBTQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, AnswerRecord>>({});
  const [timeLeftSec, setTimeLeftSec] = useState<number>(0);
  const [timeSpentSec, setTimeSpentSec] = useState<number>(0);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [filterReview, setFilterReview] = useState<'all' | 'incorrect' | 'flagged'>('all');

  // History from localStorage
  const [pastAttempts, setPastAttempts] = useState<AttemptHistory[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('custech_fci_cbt_history');
      if (saved) {
        setPastAttempts(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load past CBT attempts:', e);
    }
  }, []);

  // Timer Effect
  useEffect(() => {
    if (examMode !== 'active' || !isTimed) return;

    const timer = setInterval(() => {
      setTimeSpentSec(prev => prev + 1);
      setTimeLeftSec(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examMode, isTimed]);

  const startExam = (course: CBTCourse) => {
    const rawQuestions = getMergedQuestionsForCourse(course.code);
    if (rawQuestions.length === 0) return;

    // Shuffle questions
    const shuffled = [...rawQuestions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(questionLimit, shuffled.length));

    const initialAnswers: Record<string, AnswerRecord> = {};
    selected.forEach(q => {
      initialAnswers[q.id] = { questionId: q.id, selectedOption: null, flagged: false };
    });

    setSelectedCourse(course);
    setActiveQuestions(selected);
    setAnswers(initialAnswers);
    setCurrentIndex(0);
    setTimeSpentSec(0);
    setTimeLeftSec(course.durationMinutes * 60);
    setExamMode('active');
  };

  const handleSelectOption = (optionIndex: number) => {
    const currentQ = activeQuestions[currentIndex];
    if (!currentQ) return;

    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        selectedOption: optionIndex
      }
    }));
  };

  const handleToggleFlag = () => {
    const currentQ = activeQuestions[currentIndex];
    if (!currentQ) return;

    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        flagged: !prev[currentQ.id]?.flagged
      }
    }));
  };

  const handleClearSelection = () => {
    const currentQ = activeQuestions[currentIndex];
    if (!currentQ) return;

    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        ...prev[currentQ.id],
        selectedOption: null
      }
    }));
  };

  const handleSubmitExam = () => {
    setShowSubmitModal(false);
    setExamMode('review');

    // Calculate score
    if (!selectedCourse) return;
    let score = 0;
    activeQuestions.forEach(q => {
      if (answers[q.id]?.selectedOption === q.correctAnswer) {
        score++;
      }
    });

    const total = activeQuestions.length;
    const percentage = Math.round((score / total) * 100);

    const newRecord: AttemptHistory = {
      id: Date.now().toString(),
      courseCode: selectedCourse.code,
      courseTitle: selectedCourse.title,
      score,
      total,
      percentage,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      timeSpentSec
    };

    const updated = [newRecord, ...pastAttempts].slice(0, 15);
    setPastAttempts(updated);
    try {
      localStorage.setItem('custech_fci_cbt_history', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save CBT score:', e);
    }
  };

  // Stats calculation for active exam
  const answeredCount = useMemo(() => {
    return Object.values(answers).filter(a => a.selectedOption !== null).length;
  }, [answers]);

  const flaggedCount = useMemo(() => {
    return Object.values(answers).filter(a => a.flagged).length;
  }, [answers]);

  // Review calculations
  const reviewScore = useMemo(() => {
    let score = 0;
    activeQuestions.forEach(q => {
      if (answers[q.id]?.selectedOption === q.correctAnswer) score++;
    });
    return score;
  }, [activeQuestions, answers]);

  const reviewPercentage = useMemo(() => {
    if (activeQuestions.length === 0) return 0;
    return Math.round((reviewScore / activeQuestions.length) * 100);
  }, [reviewScore, activeQuestions.length]);

  const getGradeBadge = (pct: number) => {
    if (pct >= 70) return { label: 'A - Distinction (First Class)', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
    if (pct >= 60) return { label: 'B - Very Good (2:1 Equivalent)', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    if (pct >= 50) return { label: 'C - Good (2:2 Equivalent)', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' };
    if (pct >= 45) return { label: 'D - Pass', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
    if (pct >= 40) return { label: 'E - Weak Pass', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
    return { label: 'F - Needs Intensive Revision', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header Banner */}
      <header className="border-b border-border/40 bg-card/60 backdrop-blur sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-foreground">FCI Drill: Interactive CBT Engine</h1>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                  CUSTECH Mock
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Computer-Based Test Simulator with instant scoring and detailed answers
              </p>
            </div>
          </div>

          {examMode === 'active' && (
            <div className="flex items-center gap-3">
              {isTimed && (
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border transition-colors ${
                  timeLeftSec < 180 
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse' 
                    : 'bg-muted text-foreground border-border'
                }`}>
                  <Clock className={`h-3.5 w-3.5 ${timeLeftSec < 180 ? 'animate-icon-wiggle text-rose-400' : 'animate-icon-pulse-glow'}`} />
                  {formatTime(timeLeftSec)}
                </div>
              )}
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => setShowSubmitModal(true)}
                className="font-medium text-xs px-3"
              >
                Submit Exam
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 pt-6 max-w-6xl">
        {/* ======================= SETUP MODE ======================= */}
        {examMode === 'setup' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Introduction Card */}
            <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-6 md:p-8">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                  <Zap className="h-3.5 w-3.5 animate-icon-bounce text-amber-500" />
                  Exam Readiness Center
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                  Master CUSTECH CBT Exams with Real Past Questions
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Practice with real verified question banks for GST 111, CSC 142, SWE 142, STA 131, and more. 
                  Experience timed pressure, instant automated scoring, and comprehensive explanations for every option.
                </p>
              </div>

              {/* Quick Settings Bar */}
              <div className="mt-6 pt-6 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-2">Practice Mode</label>
                  <div className="flex gap-2">
                    <Button 
                      type="button"
                      size="sm" 
                      variant={isTimed ? 'primary' : 'outline'}
                      onClick={() => setIsTimed(true)}
                      className="text-xs flex-1 gap-1.5"
                    >
                      <Clock className="h-3.5 w-3.5" />
                      Timed (Exam Simulation)
                    </Button>
                    <Button 
                      type="button"
                      size="sm" 
                      variant={!isTimed ? 'primary' : 'outline'}
                      onClick={() => setIsTimed(false)}
                      className="text-xs flex-1 gap-1.5"
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      Untimed Study
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground block mb-2">Questions per Session</label>
                  <div className="flex gap-2">
                    {[10, 20, 30].map(count => (
                      <Button
                        key={count}
                        type="button"
                        size="sm"
                        variant={questionLimit === count ? 'primary' : 'outline'}
                        onClick={() => setQuestionLimit(count)}
                        className="text-xs flex-1"
                      >
                        {count} Qs
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Course Selection Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Select a Course to Practice
                </h3>
                <span className="text-xs text-muted-foreground">
                  {CBT_COURSES.length} Courses Available
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CBT_COURSES.map(course => {
                  const qCount = getMergedQuestionsForCourse(course.code).length;
                  return (
                    <div 
                      key={course.code}
                      className="group relative rounded-xl border border-border/60 bg-card p-5 hover:border-primary/50 transition-all hover:shadow-lg flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="font-mono text-xs font-bold text-primary px-2.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                            {course.code}
                          </span>
                          <div className="flex gap-1.5">
                            <Badge variant="outline" className="text-[10px]">{course.level}</Badge>
                            <Badge variant="secondary" className="text-[10px]">{course.semester} Sem</Badge>
                          </div>
                        </div>

                        <h4 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors">
                          {course.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                          {course.description}
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-border/40 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono">
                          <span className="flex items-center gap-1">
                            <HelpCircle className="h-3 w-3" />
                            {qCount} Qs
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {course.durationMinutes}m
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          onClick={() => startExam(course)}
                          className="gap-1 text-xs"
                        >
                          Start Drill
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Past Attempts History */}
            {pastAttempts.length > 0 && (
              <div className="mt-8 rounded-xl border border-border/50 bg-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Your Recent Drill Attempts
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-muted-foreground hover:text-destructive"
                    onClick={() => {
                      setPastAttempts([]);
                      localStorage.removeItem('custech_fci_cbt_history');
                    }}
                  >
                    Clear History
                  </Button>
                </div>

                <div className="divide-y divide-border/40">
                  {pastAttempts.map(att => (
                    <div key={att.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-foreground mr-2">{att.courseCode}</span>
                        <span className="text-muted-foreground hidden sm:inline">{att.courseTitle}</span>
                        <span className="text-[10px] text-muted-foreground ml-2">({att.date})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-muted-foreground">
                          {att.score}/{att.total}
                        </span>
                        <Badge 
                          variant="outline"
                          className={att.percentage >= 70 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}
                        >
                          {att.percentage}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================= ACTIVE EXAM MODE ======================= */}
        {examMode === 'active' && activeQuestions.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
            {/* Main Question Arena */}
            <div className="lg:col-span-8 space-y-6">
              {/* Question Header Card */}
              <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-border/40 mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      Question {currentIndex + 1} of {activeQuestions.length}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {selectedCourse?.code}
                    </Badge>
                  </div>

                  <Button
                    variant={answers[activeQuestions[currentIndex]?.id]?.flagged ? 'primary' : 'outline'}
                    size="sm"
                    onClick={handleToggleFlag}
                    className={`gap-1.5 text-xs ${answers[activeQuestions[currentIndex]?.id]?.flagged ? 'bg-amber-500 hover:bg-amber-600 text-black border-amber-500' : ''}`}
                  >
                    <Flag className={`h-3.5 w-3.5 transition-transform ${answers[activeQuestions[currentIndex]?.id]?.flagged ? 'animate-icon-wiggle' : 'group-hover:scale-110'}`} />
                    {answers[activeQuestions[currentIndex]?.id]?.flagged ? 'Flagged' : 'Flag for Review'}
                  </Button>
                </div>

                {/* Question Text */}
                <h3 className="text-base sm:text-lg font-medium text-foreground leading-relaxed">
                  {activeQuestions[currentIndex]?.question}
                </h3>

                {/* Option Radios */}
                <div className="mt-6 space-y-3">
                  {activeQuestions[currentIndex]?.options.map((opt, idx) => {
                    const isSelected = answers[activeQuestions[currentIndex]?.id]?.selectedOption === idx;
                    const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectOption(idx)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 group ${
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-sm ring-1 ring-primary'
                            : 'border-border/60 hover:border-primary/40 bg-background/50 hover:bg-muted/40'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-primary text-primary-foreground font-mono'
                            : 'border border-border text-muted-foreground group-hover:border-primary group-hover:text-primary'
                        }`}>
                          {optionLetter}
                        </span>
                        <span className={`text-sm pt-0.5 leading-relaxed ${isSelected ? 'text-foreground font-medium' : 'text-muted-foreground group-hover:text-foreground'}`}>
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Navigation controls */}
                <div className="mt-8 pt-5 border-t border-border/40 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                      disabled={currentIndex === 0}
                      className="gap-1 text-xs"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      Previous
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearSelection}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear Choice
                    </Button>
                  </div>

                  {currentIndex < activeQuestions.length - 1 ? (
                    <Button
                      size="sm"
                      onClick={() => setCurrentIndex(prev => Math.min(activeQuestions.length - 1, prev + 1))}
                      className="gap-1 text-xs"
                    >
                      Next
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setShowSubmitModal(true)}
                      className="text-xs font-semibold"
                    >
                      Finish & Submit
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Questions Grid Pallet (Sidebar) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-sm">Question Palette</h4>
                  <span className="text-xs text-muted-foreground font-mono">
                    {answeredCount}/{activeQuestions.length} Done
                  </span>
                </div>

                {/* Pallet Legend */}
                <div className="grid grid-cols-3 gap-2 text-[10px] text-muted-foreground pb-3 mb-3 border-b border-border/40">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-primary"></span>
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
                    <span>Flagged</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded border border-border"></span>
                    <span>Pending</span>
                  </div>
                </div>

                {/* Grid Numbers */}
                <div className="grid grid-cols-5 gap-2">
                  {activeQuestions.map((q, idx) => {
                    const ans = answers[q.id];
                    const isAnswered = ans?.selectedOption !== null;
                    const isFlagged = ans?.flagged;
                    const isCurrent = idx === currentIndex;

                    let bgClass = 'border-border/60 hover:border-foreground/40 text-muted-foreground';
                    if (isAnswered) bgClass = 'bg-primary text-primary-foreground font-bold border-primary';
                    if (isFlagged) bgClass = 'bg-amber-500 text-black font-bold border-amber-500';

                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-9 rounded-lg text-xs font-mono transition-all flex items-center justify-center border relative ${bgClass} ${
                          isCurrent ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background scale-105' : ''
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-border/40 space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full text-xs" 
                    onClick={() => setShowSubmitModal(true)}
                  >
                    Submit Exam & View Report
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================= REVIEW / RESULTS MODE ======================= */}
        {examMode === 'review' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Scorecard Hero */}
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8 text-center max-w-3xl mx-auto shadow-md">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 text-primary mb-4">
                <Award className="h-8 w-8 animate-icon-bounce text-amber-500" />
              </div>
              <h2 className="text-2xl font-bold">{selectedCourse?.title} - Performance Report</h2>
              <p className="text-xs text-muted-foreground font-mono mt-1">{selectedCourse?.code} • Mock Drill Results</p>

              {/* Score Circle & Metrics */}
              <div className="my-6 flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="relative flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 border-primary/20 bg-primary/5">
                  <span className="text-4xl font-extrabold font-mono text-foreground">{reviewPercentage}%</span>
                  <span className="text-xs text-muted-foreground font-medium">Score</span>
                </div>

                <div className="text-left space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Correct Answers: <strong>{reviewScore}</strong> / {activeQuestions.length}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-rose-400" />
                    <span>Incorrect Answers: <strong>{activeQuestions.length - reviewScore}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-400" />
                    <span>Time Spent: <strong>{formatTime(timeSpentSec)}</strong></span>
                  </div>
                  <div className="pt-2">
                    <Badge variant="outline" className={`text-xs px-3 py-1 font-semibold ${getGradeBadge(reviewPercentage).color}`}>
                      {getGradeBadge(reviewPercentage).label}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-border/40">
                <Button 
                  onClick={() => selectedCourse && startExam(selectedCourse)} 
                  className="gap-1.5 text-xs"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Retake This Course
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setExamMode('setup')}
                  className="text-xs"
                >
                  Select Another Course
                </Button>
              </div>
            </div>

            {/* Answer Explanations Review */}
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-border/40">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Detailed Question-by-Question Review
                </h3>
                
                {/* Filter toggles */}
                <div className="flex gap-1.5 bg-muted/60 p-1 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setFilterReview('all')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${filterReview === 'all' ? 'bg-background font-bold text-foreground shadow-sm' : 'text-muted-foreground'}`}
                  >
                    All ({activeQuestions.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterReview('incorrect')}
                    className={`px-2.5 py-1 rounded-md transition-colors ${filterReview === 'incorrect' ? 'bg-background font-bold text-foreground shadow-sm' : 'text-muted-foreground'}`}
                  >
                    Incorrect Only ({activeQuestions.length - reviewScore})
                  </button>
                </div>
              </div>

              {/* Review Cards */}
              <div className="space-y-4">
                {activeQuestions
                  .filter(q => {
                    const isCorrect = answers[q.id]?.selectedOption === q.correctAnswer;
                    if (filterReview === 'incorrect') return !isCorrect;
                    return true;
                  })
                  .map((q, idx) => {
                    const ans = answers[q.id];
                    const isCorrect = ans?.selectedOption === q.correctAnswer;
                    const studentChoice = ans?.selectedOption;

                    return (
                      <div 
                        key={q.id}
                        className={`rounded-xl border p-5 bg-card transition-all ${
                          isCorrect ? 'border-emerald-500/30' : 'border-rose-500/30'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="font-mono text-xs font-bold text-muted-foreground">
                            Question #{idx + 1}
                          </span>
                          {isCorrect ? (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Correct (+1)
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-rose-500/10 text-rose-400 border-rose-500/30 text-xs gap-1">
                              <XCircle className="h-3 w-3" />
                              {studentChoice === null ? 'Unanswered' : 'Incorrect'}
                            </Badge>
                          )}
                        </div>

                        <p className="font-medium text-foreground text-sm sm:text-base leading-relaxed mb-4">
                          {q.question}
                        </p>

                        {/* Options List */}
                        <div className="space-y-2 mb-4">
                          {q.options.map((opt, oIdx) => {
                            const isThisCorrect = oIdx === q.correctAnswer;
                            const isThisSelected = oIdx === studentChoice;

                            let optionStyle = 'border-border/40 text-muted-foreground';
                            if (isThisCorrect) {
                              optionStyle = 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300 font-semibold';
                            } else if (isThisSelected && !isThisCorrect) {
                              optionStyle = 'border-rose-500/60 bg-rose-500/10 text-rose-300 line-through';
                            }

                            return (
                              <div 
                                key={oIdx}
                                className={`p-3 rounded-lg border text-xs sm:text-sm flex items-start gap-2.5 ${optionStyle}`}
                              >
                                <span className="font-mono font-bold">{String.fromCharCode(65 + oIdx)}.</span>
                                <span className="flex-1">{opt}</span>
                                {isThisCorrect && <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation Box */}
                        <div className="rounded-lg bg-muted/40 border border-border/40 p-3.5 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5 font-bold text-foreground mb-1">
                            <HelpCircle className="h-3.5 w-3.5 text-primary" />
                            Official CUSTECH Syllabus Explanation:
                          </div>
                          <p className="leading-relaxed">{q.explanation}</p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-amber-500/10 text-amber-400">
                <AlertCircle className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg">Ready to Submit?</h3>
            </div>

            <p className="text-sm text-muted-foreground">
              You have answered <strong className="text-foreground font-mono">{answeredCount}</strong> of{' '}
              <strong className="text-foreground font-mono">{activeQuestions.length}</strong> questions.
              {activeQuestions.length - answeredCount > 0 && (
                <span className="flex items-center gap-1.5 mt-1 text-amber-500 font-medium text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>You have {activeQuestions.length - answeredCount} unanswered questions remaining!</span>
                </span>
              )}
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowSubmitModal(false)}
              >
                Continue Exam
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleSubmitExam}
              >
                Yes, Submit Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

