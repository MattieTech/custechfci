'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Plus,
  Search,
  FileCode,
  Lightbulb,
  Check,
  Copy,
  User,
  Filter,
  AlertCircle,
  HelpCircle,
  BookOpen,
  X,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  DiscussionItem,
  getAllDiscussions,
  verifyDiscussionSolution,
  deleteDiscussionItem,
  addOfficialDiscussion
} from '@/lib/discussions';

export default function AdminDiscussionsPage() {
  const [items, setItems] = useState<DiscussionItem[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'solution' | 'question'>('all');
  const [filterVerified, setFilterVerified] = useState<'all' | 'verified' | 'unverified'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Official Post Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetMaterialId, setTargetMaterialId] = useState('default');
  const [courseCode, setCourseCode] = useState('CSC 142');
  const [materialTitle, setMaterialTitle] = useState('CSC 142 Past Question (2023/2024)');
  const [authorName, setAuthorName] = useState('FCI Academic Officer / Course Rep');
  const [department, setDepartment] = useState('Computer Science');
  const [solutionContent, setSolutionContent] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('python');

  const refreshItems = () => {
    const list = getAllDiscussions();
    setItems(list);
  };

  useEffect(() => {
    refreshItems();
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (filterType !== 'all' && item.type !== filterType) return false;
      if (filterVerified === 'verified' && !item.isVerified) return false;
      if (filterVerified === 'unverified' && item.isVerified) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesContent = item.content.toLowerCase().includes(q);
        const matchesAuthor = item.authorName.toLowerCase().includes(q);
        const matchesCourse = (item.courseCode || '').toLowerCase().includes(q);
        const matchesMaterial = (item.materialTitle || '').toLowerCase().includes(q);
        if (!matchesContent && !matchesAuthor && !matchesCourse && !matchesMaterial) return false;
      }
      return true;
    });
  }, [items, filterType, filterVerified, searchQuery]);

  const verifiedCount = useMemo(() => {
    return items.filter(i => i.isVerified).length;
  }, [items]);

  const questionsCount = useMemo(() => {
    return items.filter(i => i.type === 'question').length;
  }, [items]);

  const handleToggleVerify = (item: DiscussionItem) => {
    const nextStatus = !item.isVerified;
    verifyDiscussionSolution(item.materialId, item.id, nextStatus);
    toast.success(nextStatus ? 'Solution verified and awarded faculty badge!' : 'Verified badge removed');
    refreshItems();
  };

  const handleDelete = (item: DiscussionItem) => {
    if (!confirm('Are you sure you want to remove this discussion item?')) return;
    deleteDiscussionItem(item.materialId, item.id);
    toast.success('Discussion item deleted');
    refreshItems();
  };

  const handleCopyCode = (id: string, code?: string) => {
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreateOfficialSolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!solutionContent.trim()) {
      toast.error('Please enter the official solution or marking guide details');
      return;
    }

    addOfficialDiscussion(targetMaterialId, {
      materialTitle,
      courseCode,
      authorName: authorName.trim() || 'FCI Course Rep / Lecturer',
      department,
      level: 100,
      type: 'solution',
      content: solutionContent.trim(),
      codeSnippet: codeSnippet.trim() || undefined,
      codeLanguage: codeSnippet.trim() ? codeLanguage : undefined
    });

    toast.success('Official marking guide / solution pinned successfully!');
    setIsModalOpen(false);
    setSolutionContent('');
    setCodeSnippet('');
    refreshItems();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-heading font-bold text-brand-900 dark:text-brand-100">
              Past Question Discussions & Solution Moderation Desk
            </h1>
            <Badge variant="outline" className="border-brand-300 text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/50">
              Peer & Faculty QA
            </Badge>
          </div>
          <p className="text-sm text-brand-500 dark:text-brand-400 mt-1">
            Review student solutions, verify lecturer marking guides, and pin official past question explanations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-xs"
          >
            <Plus className="w-4 h-4" />
            Pin Official Solution
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-brand-900 p-4 rounded-xl border border-brand-200 dark:border-brand-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-brand-500 dark:text-brand-400">Total Discussion Threads</p>
            <p className="text-2xl font-heading font-bold text-brand-900 dark:text-brand-100 mt-1">
              {items.length}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-brand-900 p-4 rounded-xl border border-brand-200 dark:border-brand-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-brand-500 dark:text-brand-400">Verified Solutions</p>
            <p className="text-2xl font-heading font-bold text-brand-900 dark:text-brand-100 mt-1">
              {verifiedCount}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white dark:bg-brand-900 p-4 rounded-xl border border-brand-200 dark:border-brand-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-brand-500 dark:text-brand-400">Student Inquiries</p>
            <p className="text-2xl font-heading font-bold text-brand-900 dark:text-brand-100 mt-1">
              {questionsCount}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
            <HelpCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-brand-900 p-4 rounded-xl border border-brand-200 dark:border-brand-800 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Type filter */}
            <div className="flex items-center gap-1 bg-brand-100 dark:bg-brand-800 p-1 rounded-lg text-xs">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filterType === 'all' ? 'bg-white dark:bg-brand-900 text-brand-900 dark:text-brand-100 shadow-xs' : 'text-brand-600 dark:text-brand-400'
                }`}
              >
                All ({items.length})
              </button>
              <button
                onClick={() => setFilterType('solution')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filterType === 'solution' ? 'bg-white dark:bg-brand-900 text-brand-900 dark:text-brand-100 shadow-xs' : 'text-brand-600 dark:text-brand-400'
                }`}
              >
                Solutions
              </button>
              <button
                onClick={() => setFilterType('question')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filterType === 'question' ? 'bg-white dark:bg-brand-900 text-brand-900 dark:text-brand-100 shadow-xs' : 'text-brand-600 dark:text-brand-400'
                }`}
              >
                Questions
              </button>
            </div>

            {/* Verification filter */}
            <div className="flex items-center gap-1 bg-brand-100 dark:bg-brand-800 p-1 rounded-lg text-xs">
              <button
                onClick={() => setFilterVerified('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filterVerified === 'all' ? 'bg-white dark:bg-brand-900 text-brand-900 dark:text-brand-100 shadow-xs' : 'text-brand-600 dark:text-brand-400'
                }`}
              >
                Status: All
              </button>
              <button
                onClick={() => setFilterVerified('verified')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filterVerified === 'verified' ? 'bg-white dark:bg-brand-900 text-brand-900 dark:text-brand-100 shadow-xs' : 'text-brand-600 dark:text-brand-400'
                }`}
              >
                Verified Only
              </button>
              <button
                onClick={() => setFilterVerified('unverified')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filterVerified === 'unverified' ? 'bg-white dark:bg-brand-900 text-brand-900 dark:text-brand-100 shadow-xs' : 'text-brand-600 dark:text-brand-400'
                }`}
              >
                Unverified
              </button>
            </div>
          </div>

          {/* Search box */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-400" />
            <input
              type="text"
              placeholder="Search solutions, author, code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-brand-200 dark:border-brand-700 bg-brand-50 dark:bg-brand-800/60 text-brand-900 dark:text-brand-100 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Discussion List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="bg-white dark:bg-brand-900 rounded-xl border border-brand-200 dark:border-brand-800 p-12 text-center">
            <MessageSquare className="w-10 h-10 text-brand-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-brand-900 dark:text-brand-100">No discussions found</h3>
            <p className="text-xs text-brand-500 dark:text-brand-400 mt-1 max-w-sm mx-auto">
              No questions or solutions match your filter criteria. Pin an official marking guide or solution above.
            </p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-brand-900 rounded-xl border border-brand-200 dark:border-brand-800 p-5 shadow-sm hover:border-brand-300 dark:hover:border-brand-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {item.courseCode || 'GENERAL'}
                  </Badge>
                  {item.materialTitle && (
                    <span className="text-xs font-semibold text-brand-700 dark:text-brand-300 truncate max-w-xs">
                      {item.materialTitle}
                    </span>
                  )}
                  {item.type === 'solution' ? (
                    <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 text-[10px]">
                      Solution
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 text-[10px]">
                      Question
                    </Badge>
                  )}
                  {item.isVerified && (
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 text-[10px] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Verified Solution
                    </Badge>
                  )}
                </div>

                {/* Moderation Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {item.type === 'solution' && (
                    <Button
                      size="sm"
                      variant={item.isVerified ? 'secondary' : 'outline'}
                      onClick={() => handleToggleVerify(item)}
                      className={`h-7 px-2.5 text-xs flex items-center gap-1.5 ${
                        item.isVerified 
                          ? 'border-emerald-300 text-emerald-700 dark:text-emerald-300' 
                          : 'border-brand-300 text-brand-700 dark:text-brand-300 hover:border-emerald-500 hover:text-emerald-600'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {item.isVerified ? 'Revoke Badge' : 'Verify Solution'}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(item)}
                    className="h-7 px-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-2 text-xs text-brand-500 dark:text-brand-400 mb-2">
                <span className="font-semibold text-brand-800 dark:text-brand-200">{item.authorName}</span>
                <span>•</span>
                <span>{item.department}</span>
                <span>•</span>
                <span>{item.level}L</span>
                <span>•</span>
                <span>{item.createdAt}</span>
                <span>•</span>
                <span>{item.upvotes} upvotes</span>
              </div>

              {/* Content */}
              <p className="text-xs sm:text-sm text-brand-800 dark:text-brand-200 whitespace-pre-line leading-relaxed mb-3">
                {item.content}
              </p>

              {/* Code snippet if present */}
              {item.codeSnippet && (
                <div className="rounded-lg border border-brand-200 dark:border-brand-800 bg-brand-950 text-brand-100 p-3 my-2 font-mono text-xs overflow-x-auto relative">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-brand-800/80 text-[10px] text-brand-400">
                    <span className="uppercase">{item.codeLanguage || 'code'}</span>
                    <button
                      onClick={() => handleCopyCode(item.id, item.codeSnippet)}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="whitespace-pre overflow-x-auto">{item.codeSnippet}</pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pin Official Solution Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-brand-900 rounded-2xl border border-brand-200 dark:border-brand-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-brand-200 dark:border-brand-800 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-heading font-bold text-brand-900 dark:text-brand-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Pin Official Solution / Marking Guide
                </h3>
                <p className="text-xs text-brand-500 dark:text-brand-400 mt-0.5">
                  Publish an official lecturer or faculty rep marking scheme with an automatic verified badge
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-brand-400 hover:text-brand-700 dark:hover:text-brand-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOfficialSolution} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-brand-700 dark:text-brand-300 mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="e.g. CSC 142, GST 111, SWE 142"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-brand-300 dark:border-brand-700 bg-white dark:bg-brand-800 text-brand-900 dark:text-brand-100 focus:ring-1 focus:ring-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-700 dark:text-brand-300 mb-1">
                    Target Material / Exam Reference
                  </label>
                  <input
                    type="text"
                    value={materialTitle}
                    onChange={(e) => setMaterialTitle(e.target.value)}
                    placeholder="e.g. 2023/2024 Exam Past Questions"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-brand-300 dark:border-brand-700 bg-white dark:bg-brand-800 text-brand-900 dark:text-brand-100 focus:ring-1 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-brand-700 dark:text-brand-300 mb-1">
                    Author / Title
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. CSC Department Rep / Dr. Lecturer"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-brand-300 dark:border-brand-700 bg-white dark:bg-brand-800 text-brand-900 dark:text-brand-100 focus:ring-1 focus:ring-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-700 dark:text-brand-300 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-brand-300 dark:border-brand-700 bg-white dark:bg-brand-800 text-brand-900 dark:text-brand-100 focus:ring-1 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-700 dark:text-brand-300 mb-1">
                  Official Solution / Marking Scheme
                </label>
                <textarea
                  rows={4}
                  value={solutionContent}
                  onChange={(e) => setSolutionContent(e.target.value)}
                  placeholder="Detail the complete step-by-step marking guide, formula, or breakdown..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-brand-300 dark:border-brand-700 bg-white dark:bg-brand-800 text-brand-900 dark:text-brand-100 focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-brand-700 dark:text-brand-300">
                    Code Implementation (Optional)
                  </label>
                  <select
                    value={codeLanguage}
                    onChange={(e) => setCodeLanguage(e.target.value)}
                    className="text-[10px] px-2 py-0.5 rounded border border-brand-300 dark:border-brand-700 bg-white dark:bg-brand-800"
                  >
                    <option value="python">Python</option>
                    <option value="javascript">JavaScript</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                    <option value="sql">SQL</option>
                  </select>
                </div>
                <textarea
                  rows={3}
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  placeholder="Paste syntax, algorithms, or queries..."
                  className="w-full font-mono px-3 py-2 text-xs rounded-lg border border-brand-300 dark:border-brand-700 bg-white dark:bg-brand-800 text-brand-900 dark:text-brand-100 focus:ring-2 focus:ring-brand-500"
                />
              </div>

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
                  Pin Verified Solution
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

