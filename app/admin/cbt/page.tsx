'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  CBT_COURSES, 
  CBTCourse, 
  CBTQuestion,
  getMergedQuestionsForCourse,
  getCustomQuestions,
  saveOrUpdateQuestion,
  deleteCustomQuestion,
  CBT_QUESTIONS
} from '@/lib/cbt-banks';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  HelpCircle, 
  FileSpreadsheet, 
  Download, 
  Filter, 
  Check, 
  X, 
  Sparkles, 
  GraduationCap,
  Layers,
  ArrowUpDown,
  FileQuestion
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function AdminCBTPage() {
  const [selectedCourseCode, setSelectedCourseCode] = useState<string>('GST 111');
  const [searchQuery, setSearchQuery] = useState('');
  const [questions, setQuestions] = useState<CBTQuestion[]>([]);
  const [customMap, setCustomMap] = useState<Record<string, CBTQuestion[]>>({});
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<CBTQuestion | null>(null);
  
  // Form State
  const [formCourseCode, setFormCourseCode] = useState('GST 111');
  const [formQuestion, setFormQuestion] = useState('');
  const [formOptionA, setFormOptionA] = useState('');
  const [formOptionB, setFormOptionB] = useState('');
  const [formOptionC, setFormOptionC] = useState('');
  const [formOptionD, setFormOptionD] = useState('');
  const [formCorrectAnswer, setFormCorrectAnswer] = useState<number>(0);
  const [formExplanation, setFormExplanation] = useState('');

  // Reload data
  const refreshQuestions = () => {
    const custom = getCustomQuestions();
    setCustomMap(custom);
    if (selectedCourseCode === 'ALL') {
      let all: CBTQuestion[] = [];
      CBT_COURSES.forEach(c => {
        all = all.concat(getMergedQuestionsForCourse(c.code));
      });
      setQuestions(all);
    } else {
      setQuestions(getMergedQuestionsForCourse(selectedCourseCode));
    }
  };

  useEffect(() => {
    refreshQuestions();
  }, [selectedCourseCode]);

  const customQuestionIds = useMemo(() => {
    const ids = new Set<string>();
    Object.values(customMap).forEach(list => {
      list.forEach(q => ids.add(q.id));
    });
    return ids;
  }, [customMap]);

  const filteredQuestions = useMemo(() => {
    if (!searchQuery.trim()) return questions;
    const q = searchQuery.toLowerCase();
    return questions.filter(item => 
      item.question.toLowerCase().includes(q) ||
      item.courseCode.toLowerCase().includes(q) ||
      item.explanation.toLowerCase().includes(q) ||
      item.options.some(opt => opt.toLowerCase().includes(q))
    );
  }, [questions, searchQuery]);

  const openAddModal = () => {
    setEditingQuestion(null);
    setFormCourseCode(selectedCourseCode === 'ALL' ? 'GST 111' : selectedCourseCode);
    setFormQuestion('');
    setFormOptionA('');
    setFormOptionB('');
    setFormOptionC('');
    setFormOptionD('');
    setFormCorrectAnswer(0);
    setFormExplanation('');
    setIsModalOpen(true);
  };

  const openEditModal = (q: CBTQuestion) => {
    setEditingQuestion(q);
    setFormCourseCode(q.courseCode);
    setFormQuestion(q.question);
    setFormOptionA(q.options[0] || '');
    setFormOptionB(q.options[1] || '');
    setFormOptionC(q.options[2] || '');
    setFormOptionD(q.options[3] || '');
    setFormCorrectAnswer(q.correctAnswer);
    setFormExplanation(q.explanation || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim() || !formOptionA.trim() || !formOptionB.trim() || !formOptionC.trim() || !formOptionD.trim()) {
      toast.error('Please fill in the question and all 4 options');
      return;
    }

    const questionId = editingQuestion ? editingQuestion.id : `q_custom_${Date.now()}`;
    const newQuestion: CBTQuestion = {
      id: questionId,
      courseCode: formCourseCode,
      question: formQuestion.trim(),
      options: [
        formOptionA.trim(),
        formOptionB.trim(),
        formOptionC.trim(),
        formOptionD.trim()
      ],
      correctAnswer: formCorrectAnswer,
      explanation: formExplanation.trim() || 'Verified syllabus explanation provided by course rep / faculty.'
    };

    saveOrUpdateQuestion(newQuestion);
    toast.success(editingQuestion ? 'Question updated successfully!' : 'New practice question added to question bank!');
    setIsModalOpen(false);
    refreshQuestions();
  };

  const handleDelete = (q: CBTQuestion) => {
    if (!confirm(`Are you sure you want to remove this question (${q.id})?`)) return;
    deleteCustomQuestion(q.courseCode, q.id);
    toast.success('Question removed from custom question bank');
    refreshQuestions();
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredQuestions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `fci_cbt_bank_${selectedCourseCode.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Question bank exported as JSON');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-heading font-bold text-brand-900 dark:text-brand-100">
              CBT Practice Question Bank
            </h1>
            <Badge variant="outline" className="border-brand-300 text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/50">
              Live Mock Engine
            </Badge>
          </div>
          <p className="text-sm text-brand-500 dark:text-brand-400 mt-1">
            Author, edit, and organize practice exam questions across 100L and 200L faculty courses
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportJSON}
            className="flex items-center gap-2 text-xs"
          >
            <Download className="w-4 h-4" />
            Export JSON
          </Button>
          <Button 
            size="sm" 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs"
          >
            <Plus className="w-4 h-4" />
            Add New Question
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-brand-900 p-4 rounded-xl border border-brand-200 dark:border-brand-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-brand-500 dark:text-brand-400">Total Available Courses</p>
            <p className="text-2xl font-heading font-bold text-brand-900 dark:text-brand-100 mt-1">
              {CBT_COURSES.length}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-brand-900 p-4 rounded-xl border border-brand-200 dark:border-brand-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-brand-500 dark:text-brand-400">Questions in Selected View</p>
            <p className="text-2xl font-heading font-bold text-brand-900 dark:text-brand-100 mt-1">
              {filteredQuestions.length}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <FileQuestion className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-brand-900 p-4 rounded-xl border border-brand-200 dark:border-brand-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-brand-500 dark:text-brand-400">Custom Admin-Added Questions</p>
            <p className="text-2xl font-heading font-bold text-brand-900 dark:text-brand-100 mt-1">
              {customQuestionIds.size}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Course Filter Bar & Search */}
      <div className="bg-white dark:bg-brand-900 p-4 rounded-xl border border-brand-200 dark:border-brand-800 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Course selector tabs */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            <button
              onClick={() => setSelectedCourseCode('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCourseCode === 'ALL'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-300 hover:bg-brand-200 dark:hover:bg-brand-700'
              }`}
            >
              All Courses
            </button>
            {CBT_COURSES.map(course => (
              <button
                key={course.code}
                onClick={() => setSelectedCourseCode(course.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  selectedCourseCode === course.code
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-300 hover:bg-brand-200 dark:hover:bg-brand-700'
                }`}
              >
                <span>{course.code}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                  selectedCourseCode === course.code ? 'bg-white/20' : 'bg-brand-200/60 dark:bg-brand-700/60'
                }`}>
                  {getMergedQuestionsForCourse(course.code).length}
                </span>
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
            <input
              type="text"
              placeholder="Search questions or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-brand-200 dark:border-brand-700 bg-brand-50 dark:bg-brand-800/60 text-brand-900 dark:text-brand-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="bg-white dark:bg-brand-900 rounded-xl border border-brand-200 dark:border-brand-800 p-12 text-center">
            <HelpCircle className="w-10 h-10 text-brand-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-brand-900 dark:text-brand-100">No questions found</h3>
            <p className="text-xs text-brand-500 dark:text-brand-400 mt-1 max-w-sm mx-auto">
              No practice questions match your filter. Click &quot;Add New Question&quot; above to post new mock examination items.
            </p>
            <Button size="sm" onClick={openAddModal} className="mt-4 text-xs">
              <Plus className="w-4 h-4 mr-1" />
              Add Question
            </Button>
          </div>
        ) : (
          filteredQuestions.map((q, idx) => {
            const isCustom = customQuestionIds.has(q.id);
            const letters = ['A', 'B', 'C', 'D'];

            return (
              <div 
                key={q.id}
                className="bg-white dark:bg-brand-900 rounded-xl border border-brand-200 dark:border-brand-800 p-5 shadow-sm hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand-700 dark:text-brand-300 bg-brand-100 dark:bg-brand-800 px-2 py-0.5 rounded">
                      #{idx + 1}
                    </span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {q.courseCode}
                    </Badge>
                    {isCustom ? (
                      <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800 text-[10px]">
                        Admin Added
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        Default Syllabus Bank
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditModal(q)}
                      className="h-7 px-2 text-xs text-brand-600 hover:text-brand-900 dark:hover:text-brand-100"
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </Button>
                    {isCustom && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(q)}
                        className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>

                {/* Question Statement */}
                <p className="text-sm font-medium text-brand-900 dark:text-brand-100 mb-4 whitespace-pre-line leading-relaxed">
                  {q.question}
                </p>

                {/* 4 Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = q.correctAnswer === optIdx;
                    return (
                      <div
                        key={optIdx}
                        className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 transition-colors ${
                          isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-medium'
                            : 'bg-brand-50/50 dark:bg-brand-800/30 border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-300'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                          isCorrect
                            ? 'bg-emerald-600 text-white'
                            : 'bg-brand-200 dark:bg-brand-700 text-brand-700 dark:text-brand-300'
                        }`}>
                          {letters[optIdx]}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="p-2.5 rounded-lg bg-brand-50 dark:bg-brand-800/40 border border-brand-200/70 dark:border-brand-800 text-xs text-brand-600 dark:text-brand-400">
                    <span className="font-semibold text-brand-800 dark:text-brand-200 mr-1">Explanation:</span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-brand-900 rounded-2xl border border-brand-200 dark:border-brand-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-brand-200 dark:border-brand-800 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-heading font-bold text-brand-900 dark:text-brand-100">
                  {editingQuestion ? 'Edit Practice Question' : 'Add New Practice Question'}
                </h3>
                <p className="text-xs text-brand-500 dark:text-brand-400">
                  Fill in the question details, 4 choices, answer key, and syllabus rationale
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-brand-400 hover:text-brand-700 dark:hover:text-brand-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Course Selector */}
              <div>
                <label className="block text-xs font-semibold text-brand-700 dark:text-brand-300 mb-1">
                  Target Course
                </label>
                <select
                  value={formCourseCode}
                  onChange={(e) => setFormCourseCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-brand-300 dark:border-brand-700 bg-white dark:bg-brand-800 text-brand-900 dark:text-brand-100 focus:ring-2 focus:ring-brand-500"
                >
                  {CBT_COURSES.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.code} — {c.title} ({c.level})
                    </option>
                  ))}
                </select>
              </div>

              {/* Question Statement */}
              <div>
                <label className="block text-xs font-semibold text-brand-700 dark:text-brand-300 mb-1">
                  Question Statement
                </label>
                <textarea
                  rows={3}
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  placeholder="Type the examination question statement here..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-brand-300 dark:border-brand-700 bg-white dark:bg-brand-800 text-brand-900 dark:text-brand-100 focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-brand-700 dark:text-brand-300">
                  Multiple Choice Options (Select radio button beside the correct answer)
                </label>
                
                {[
                  { label: 'Option A', val: formOptionA, setVal: setFormOptionA, idx: 0 },
                  { label: 'Option B', val: formOptionB, setVal: setFormOptionB, idx: 1 },
                  { label: 'Option C', val: formOptionC, setVal: setFormOptionC, idx: 2 },
                  { label: 'Option D', val: formOptionD, setVal: setFormOptionD, idx: 3 },
                ].map(({ label, val, setVal, idx }) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      id={`opt-${idx}`}
                      checked={formCorrectAnswer === idx}
                      onChange={() => setFormCorrectAnswer(idx)}
                      className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 shrink-0 cursor-pointer"
                    />
                    <label htmlFor={`opt-${idx}`} className="text-xs font-bold text-brand-600 dark:text-brand-400 w-16 shrink-0 cursor-pointer">
                      {label}:
                    </label>
                    <input
                      type="text"
                      value={val}
                      onChange={(e) => setVal(e.target.value)}
                      placeholder={`Enter text for ${label}...`}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-brand-300 dark:border-brand-700 bg-white dark:bg-brand-800 text-brand-900 dark:text-brand-100 focus:ring-1 focus:ring-brand-500"
                      required
                    />
                  </div>
                ))}
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-xs font-semibold text-brand-700 dark:text-brand-300 mb-1">
                  Answer Explanation / Syllabus Citation
                </label>
                <textarea
                  rows={2}
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  placeholder="Explain why the selected option is correct so students learn during review..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-brand-300 dark:border-brand-700 bg-white dark:bg-brand-800 text-brand-900 dark:text-brand-100 focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-brand-200 dark:border-brand-800">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-brand-600 hover:bg-brand-700 text-white text-xs"
                >
                  {editingQuestion ? 'Update Question' : 'Save to Question Bank'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

