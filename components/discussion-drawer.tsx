'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  MessageSquare, 
  ThumbsUp, 
  Code2, 
  CheckCircle2, 
  Send, 
  HelpCircle, 
  Sparkles, 
  Copy, 
  Check, 
  User, 
  ShieldCheck,
  Lightbulb,
  FileCode,
  Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  DiscussionItem, 
  getDiscussionsForMaterial, 
  saveDiscussionsForMaterial,
  BASELINE_DISCUSSIONS 
} from '@/lib/discussions';
export type { DiscussionItem };

interface DiscussionDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  materialId: string;
  materialTitle: string;
  courseCode?: string | null;
  courseTitle?: string | null;
}

export function DiscussionDrawer({
  open,
  onOpenChange,
  materialId,
  materialTitle,
  courseCode,
  courseTitle
}: DiscussionDrawerProps) {
  const [discussions, setDiscussions] = useState<DiscussionItem[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'solutions' | 'questions'>('all');
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [authorName, setAuthorName] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [entryType, setEntryType] = useState<'solution' | 'question'>('solution');
  const [content, setContent] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('python');
  const [showCodeInput, setShowCodeInput] = useState(false);

  // Load discussions
  useEffect(() => {
    if (!open) return;

    try {
      const items = getDiscussionsForMaterial(materialId);
      setDiscussions(items);

      const upvotesKey = 'fci_user_upvotes';
      const savedUpvotes = localStorage.getItem(upvotesKey);
      if (savedUpvotes) {
        setUpvotedIds(new Set(JSON.parse(savedUpvotes)));
      }
    } catch (e) {
      console.warn('Failed to load discussions from storage', e);
    }
  }, [open, materialId]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Save to localStorage
  const saveDiscussions = (items: DiscussionItem[]) => {
    setDiscussions(items);
    try {
      localStorage.setItem(`fci_disc_${materialId}`, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to persist discussions', e);
    }
  };

  const handleUpvote = (id: string) => {
    const nextUpvotes = new Set(upvotedIds);
    let delta = 1;

    if (nextUpvotes.has(id)) {
      nextUpvotes.delete(id);
      delta = -1;
    } else {
      nextUpvotes.add(id);
      toast.success('Solution upvoted!');
    }

    setUpvotedIds(nextUpvotes);
    try {
      localStorage.setItem('fci_user_upvotes', JSON.stringify(Array.from(nextUpvotes)));
    } catch (e) {}

    const updated = discussions.map(item => {
      if (item.id === id) {
        const newCount = Math.max(0, item.upvotes + delta);
        return {
          ...item,
          upvotes: newCount,
          isVerified: newCount >= 5 // Auto-verified if 5+ community upvotes
        };
      }
      return item;
    });

    saveDiscussions(updated);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Please enter your question or solution note');
      return;
    }

    const newItem: DiscussionItem = {
      id: 'disc-' + Date.now(),
      materialId,
      authorName: authorName.trim() || 'FCI Student',
      department,
      level: 100,
      type: entryType,
      content: content.trim(),
      codeSnippet: showCodeInput && codeSnippet.trim() ? codeSnippet.trim() : undefined,
      codeLanguage: showCodeInput ? codeLanguage : undefined,
      upvotes: 1,
      isVerified: false,
      createdAt: 'Just now'
    };

    const updated = [newItem, ...discussions];
    saveDiscussions(updated);
    setContent('');
    setCodeSnippet('');
    setShowCodeInput(false);
    toast.success(entryType === 'solution' ? 'Solution posted for students!' : 'Question posted to discussion!');
  };

  const filteredDiscussions = useMemo(() => {
    if (filterType === 'solutions') return discussions.filter(d => d.type === 'solution');
    if (filterType === 'questions') return discussions.filter(d => d.type === 'question');
    return discussions;
  }, [discussions, filterType]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white dark:bg-zinc-950 h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-zinc-800 animate-in slide-in-from-right duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-zinc-800 flex items-start justify-between gap-3 bg-slate-50/70 dark:bg-zinc-900/70 shrink-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300">
                <MessageSquare className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Peer Solutions &amp; Q&amp;A
              </span>
              {courseCode && (
                <Badge variant="outline" className="text-[11px] font-bold border-brand-300 text-brand-700 dark:text-brand-300">
                  {courseCode}
                </Badge>
              )}
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 font-heading">
              {materialTitle}
            </h2>
            {courseTitle && (
              <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">
                {courseTitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors shrink-0"
            aria-label="Close discussions"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="px-4 py-2.5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-2 bg-white dark:bg-zinc-950 shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterType === 'all' 
                  ? 'bg-brand-600 text-white' 
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200'
              }`}
            >
              All ({discussions.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterType('solutions')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                filterType === 'solutions' 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              Solutions
            </button>
            <button
              type="button"
              onClick={() => setFilterType('questions')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                filterType === 'questions' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200'
              }`}
            >
              <HelpCircle className="w-3 h-3" />
              Questions
            </button>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 hidden sm:inline">
            Verified with 5+ upvotes
          </span>
        </div>

        {/* Message Thread List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredDiscussions.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-3">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">No discussions yet</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto">
                Be the first to share an answer breakdown or ask a question about this material!
              </p>
            </div>
          ) : (
            filteredDiscussions.map((item) => {
              const isUpvoted = upvotedIds.has(item.id);
              const isSolution = item.type === 'solution';

              return (
                <div 
                  key={item.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-xs space-y-2.5"
                >
                  {/* Item Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 flex items-center justify-center shrink-0 text-xs font-bold">
                        {item.authorName.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.authorName}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-zinc-500 shrink-0">
                            • {item.department}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                          {item.createdAt}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.isVerified && (
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-[10px] gap-1 px-1.5 py-0.5">
                          <ShieldCheck className="w-3 h-3" /> Verified
                        </Badge>
                      )}
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] px-1.5 py-0.5 ${
                          isSolution 
                            ? 'border-emerald-300 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/40' 
                            : 'border-blue-300 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/40'
                        }`}
                      >
                        {isSolution ? 'Solution' : 'Question'}
                      </Badge>
                    </div>
                  </div>

                  {/* Body Text */}
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-zinc-200 leading-relaxed whitespace-pre-line">
                    {item.content}
                  </p>

                  {/* Code Snippet Box */}
                  {item.codeSnippet && (
                    <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-zinc-800 bg-slate-950 text-slate-100 text-xs">
                      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1.5 font-mono uppercase">
                          <Code2 className="w-3.5 h-3.5 text-brand-400" />
                          {item.codeLanguage || 'code'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(item.id, item.codeSnippet!)}
                          className="flex items-center gap-1 text-[10px] hover:text-white transition-colors"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="p-3 overflow-x-auto font-mono text-[11px] leading-relaxed">
                        <code>{item.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {/* Item Footer / Upvote */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-zinc-800/60">
                    <button
                      type="button"
                      onClick={() => handleUpvote(item.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        isUpvoted
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isUpvoted ? 'fill-current' : ''}`} />
                      <span>{item.upvotes} {item.upvotes === 1 ? 'Upvote' : 'Upvotes'}</span>
                    </button>

                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                      CUSTECH Student Discussion
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Input Form Footer */}
        <form onSubmit={handleSubmit} className="p-3.5 border-t border-slate-200 dark:border-zinc-800 bg-slate-50/90 dark:bg-zinc-900/90 shrink-0 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            {/* Author & Dept Pickers */}
            <input
              type="text"
              placeholder="Your Name / Handle (Optional)"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="flex-1 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />

            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="Computer Science">CSC</option>
              <option value="Software Engineering">SWE</option>
              <option value="Cyber Security">CYB</option>
              <option value="Information Tech">IFT</option>
              <option value="Library Science">LIS</option>
            </select>

            {/* Type Toggle */}
            <div className="flex items-center bg-slate-200 dark:bg-zinc-800 p-0.5 rounded-lg shrink-0">
              <button
                type="button"
                onClick={() => setEntryType('solution')}
                className={`px-2 py-1 text-[10px] font-bold rounded-md transition-colors ${
                  entryType === 'solution' ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs' : 'text-slate-600 dark:text-zinc-400'
                }`}
              >
                Solution
              </button>
              <button
                type="button"
                onClick={() => setEntryType('question')}
                className={`px-2 py-1 text-[10px] font-bold rounded-md transition-colors ${
                  entryType === 'question' ? 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-zinc-400'
                }`}
              >
                Question
              </button>
            </div>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={entryType === 'solution' ? "Explain the answer, formulas, or key exam pointers..." : "Ask your question about this past question..."}
            rows={2}
            className="w-full bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
          />

          {showCodeInput && (
            <div className="space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400 flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5 text-brand-500" /> Attach Working Code
                </span>
                <select
                  value={codeLanguage}
                  onChange={(e) => setCodeLanguage(e.target.value)}
                  className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-md px-2 py-0.5 text-[10px] text-slate-900 dark:text-white"
                >
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="sql">SQL</option>
                  <option value="javascript">JavaScript</option>
                  <option value="pseudocode">Pseudocode</option>
                </select>
              </div>
              <textarea
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                placeholder="Paste code or syntax here..."
                rows={3}
                className="w-full font-mono bg-slate-950 text-slate-100 border border-slate-800 rounded-lg p-2.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-brand-500 resize-none"
              />
            </div>
          )}

          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setShowCodeInput(!showCodeInput)}
              className={`text-xs font-semibold flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
                showCodeInput 
                  ? 'bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300' 
                  : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-800'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{showCodeInput ? 'Hide Code' : 'Attach Code'}</span>
            </button>

            <Button
              type="submit"
              size="sm"
              className="bg-brand-600 hover:bg-brand-700 text-white text-xs gap-1.5 h-8 px-3.5 rounded-lg"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post {entryType === 'solution' ? 'Solution' : 'Question'}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
