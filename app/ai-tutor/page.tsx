'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  Send, 
  Sparkles, 
  RotateCcw, 
  ArrowLeft, 
  Copy, 
  Check, 
  BookOpen, 
  Code2, 
  Cpu, 
  GraduationCap, 
  Layers,
  GitBranch,
  CheckSquare,
  Plus,
  Compass,
  CornerDownLeft,
  User,
  Zap,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MarkdownRenderer } from '@/components/markdown-renderer';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const STARTER_CARDS = [
  {
    icon: BookOpen,
    iconColor: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    title: 'GST 111 Flashcards',
    subtitle: 'High-yield concord, figures of speech, & reading techniques',
    prompt: 'Generate 5 high-yield revision flashcards for GST 111 (English & Concord) with clear question and answer pairs.'
  },
  {
    icon: Code2,
    iconColor: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    title: 'OOP Pillars (CSC 233)',
    subtitle: 'Encapsulation, inheritance, polymorphism, and abstraction in Python',
    prompt: 'Explain the 4 fundamental pillars of Object-Oriented Programming (OOP) with clean Python code examples for CSC 233.'
  },
  {
    icon: Cpu,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    title: 'Von Neumann Architecture',
    subtitle: 'CPU components, buses, and the memory bottleneck for CSC 231',
    prompt: 'Summarize Von Neumann Architecture, its core sub-units, and the Von Neumann bottleneck for CSC 231.'
  },
  {
    icon: GraduationCap,
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    title: 'First Class CGPA Forecast',
    subtitle: 'Nigerian 5.0 scale benchmarks and GPA milestones',
    prompt: 'How does the CUSTECH 5.0 CGPA scale work, and what semester GPA is required to graduate with First Class Honours?'
  },
  {
    icon: GitBranch,
    iconColor: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
    title: 'Agile vs Waterfall (SWE 142)',
    subtitle: 'Comparison of development lifecycles for software engineering exams',
    prompt: 'Compare Waterfall vs Agile software methodologies, highlighting exam question tips for SWE 142.'
  },
  {
    icon: CheckSquare,
    iconColor: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
    title: 'CBT Exam Strategy',
    subtitle: 'Speed drills, negative marking rules, and time allocation',
    prompt: 'What are the top test-taking strategies for CUSTECH Computer-Based Tests (CBT) in GST, CSC, and STA courses?'
  }
];

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Auto-resize textarea like modern ChatGPT/Gemini
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setLoading(true);

    try {
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) throw new Error('Network error');

      const data = await response.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || 'I apologize, could you please repeat or rephrase your question?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Unable to connect to the CUSTECH academic tutor network. Please try submitting your question again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([]);
    setInput('');
  };

  const handleRetryLast = () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.content);
    }
  };

  return (
    <div className="min-h-screen bg-brand-50/40 dark:bg-brand-950 flex flex-col font-sans">
      {/* Top Header - Minimalist ChatGPT / Gemini Style */}
      <header className="border-b border-brand-200 dark:border-brand-800 bg-white/80 dark:bg-brand-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <Link 
              href="/" 
              className="p-1.5 rounded-lg text-brand-600 dark:text-brand-400 hover:text-brand-900 dark:hover:text-brand-100 hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors"
              title="Return to Home"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-brand-600 dark:bg-brand-500 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-brand-950 dark:text-brand-50">Ask FCI AI</span>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-brand-300 dark:border-brand-700 bg-brand-100/60 dark:bg-brand-800/60 text-brand-700 dark:text-brand-300 font-medium">
                    CUSTECH Copilot
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetChat}
                className="text-xs text-brand-600 dark:text-brand-300 hover:text-brand-900 dark:hover:text-brand-100 gap-1.5 px-2.5 h-8"
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">New Chat</span>
              </Button>
            )}

            <Link href="/cbt">
              <Button size="sm" variant="outline" className="text-xs gap-1.5 h-8 px-2.5 border-brand-200 dark:border-brand-700 text-brand-700 dark:text-brand-300">
                <CheckSquare className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                <span className="hidden sm:inline">CBT Practice</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col justify-between max-w-3xl mx-auto w-full px-2.5 sm:px-4">
        {/* Zero Messages Empty Hero State (Gemini / ChatGPT Style) */}
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col justify-center py-4 sm:py-10 animate-in fade-in duration-300">
            <div className="text-center max-w-lg mx-auto mb-4 sm:mb-8 px-1">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 flex items-center justify-center mx-auto mb-2 sm:mb-4 shadow-2xs sm:shadow-xs">
                <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 text-brand-600 dark:text-brand-400" />
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-brand-950 dark:text-brand-50 tracking-tight">
                Where Knowledge Begins
              </h1>
              <p className="text-[11px] sm:text-sm text-brand-600 dark:text-brand-400 mt-1.5 sm:mt-2 leading-relaxed max-w-md mx-auto">
                Your intelligent study copilot, grounded in CUSTECH Faculty of Computing and Informatics syllabi. Ask questions, generate flashcards, or break down past question solutions.
              </p>
            </div>

            {/* Starter Suggestion Cards: Horizontal Swipe Track on Mobile, 2-Col Grid on Desktop */}
            <div className="w-full max-w-2xl mx-auto">
              <div className="flex items-center justify-between text-[11px] text-brand-500 dark:text-brand-400 mb-1.5 px-0.5 sm:hidden font-medium">
                <span>Suggested study prompts</span>
                <span className="text-[10px] text-brand-400 dark:text-brand-500 flex items-center gap-0.5">Swipe &rarr;</span>
              </div>
              <div className="flex sm:grid sm:grid-cols-2 gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-1.5 sm:pb-0 -mx-2.5 px-2.5 sm:mx-0 sm:px-0 snap-x">
                {STARTER_CARDS.map((card, idx) => {
                  const IconComponent = card.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(card.prompt)}
                      className="w-[195px] sm:w-auto shrink-0 snap-start px-2.5 py-2 sm:p-3.5 rounded-lg sm:rounded-xl border border-brand-200 dark:border-brand-800/90 bg-white dark:bg-brand-900/60 hover:bg-brand-50 dark:hover:bg-brand-800/60 hover:border-brand-300 dark:hover:border-brand-700 text-left transition-all group shadow-2xs sm:shadow-xs flex items-center sm:items-start gap-2.5 sm:gap-3"
                    >
                      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg ${card.bgColor} ${card.iconColor} flex items-center justify-center shrink-0 sm:mt-0.5 group-hover:scale-105 transition-transform`}>
                        <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-xs sm:text-sm font-semibold text-brand-900 dark:text-brand-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                          {card.title}
                        </h2>
                        <p className="text-[10px] sm:text-[11px] text-brand-500 dark:text-brand-400 line-clamp-1 sm:line-clamp-2 mt-0.5 leading-tight sm:leading-snug">
                          {card.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Conversational Messages Thread (Gemini / ChatGPT Style) */
          <div className="py-6 space-y-6 flex-1 w-full">
            {messages.map((msg) => {
              const isBot = msg.role === 'assistant';

              return (
                <div 
                  key={msg.id} 
                  className={`flex w-full animate-in fade-in duration-200 ${isBot ? 'justify-start' : 'justify-end'}`}
                >
                  {isBot ? (
                    /* Assistant Message Block - Spacious & Unboxed */
                    <div className="flex gap-3 sm:gap-4 max-w-full w-full">
                      <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/80 border border-brand-200 dark:border-brand-700 text-brand-700 dark:text-brand-300 flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <Bot className="h-4 w-4" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-semibold text-brand-950 dark:text-brand-50">FCI Copilot</span>
                          <span className="text-[10px] text-brand-400 dark:text-brand-500">{msg.timestamp}</span>
                        </div>

                        {/* Rich Markdown Typography */}
                        <div className="text-sm leading-relaxed text-brand-900 dark:text-brand-100 break-words">
                          <MarkdownRenderer content={msg.content} />
                        </div>

                        {/* Assistant Action Buttons */}
                        <div className="mt-3 pt-2 flex items-center gap-3 border-t border-brand-100 dark:border-brand-800/40 text-[11px] text-brand-500 dark:text-brand-400">
                          <button
                            type="button"
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="inline-flex items-center gap-1 hover:text-brand-900 dark:hover:text-brand-100 transition-colors"
                            title="Copy response"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={handleRetryLast}
                            className="inline-flex items-center gap-1 hover:text-brand-900 dark:hover:text-brand-100 transition-colors"
                            title="Regenerate response"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                            <span>Retry</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* User Message Pill - Rounded Right Bubble */
                    <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%]">
                      <div className="bg-brand-600 text-white dark:bg-brand-500 dark:text-brand-950 rounded-2xl rounded-tr-xs px-4 py-2.5 text-xs sm:text-sm font-normal shadow-xs leading-relaxed break-words">
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-brand-400 dark:text-brand-500 mt-1 mr-1">
                        {msg.timestamp}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}

            {/* In-Progress Loading Indicator */}
            {loading && (
              <div className="flex gap-3 sm:gap-4 max-w-full w-full animate-in fade-in">
                <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/80 border border-brand-200 dark:border-brand-700 text-brand-700 dark:text-brand-300 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-brand-950 dark:text-brand-50">FCI Copilot</span>
                    <span className="text-[10px] text-brand-400">Consulting syllabus...</span>
                  </div>
                  <div className="flex items-center gap-1.5 py-2">
                    <div className="w-2 h-2 rounded-full bg-brand-600 dark:bg-brand-400 animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 rounded-full bg-brand-600 dark:bg-brand-400 animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 rounded-full bg-brand-600 dark:bg-brand-400 animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Bottom Floating Input Capsule (ChatGPT / Gemini Style) */}
        <div className="sticky bottom-0 bg-gradient-to-t from-brand-50/95 dark:from-brand-950/95 via-brand-50/80 dark:via-brand-950/80 to-transparent pt-3 pb-4 z-20">
          {/* Quick topic suggestion chips when in active conversation */}
          {messages.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 mb-1">
              <button
                type="button"
                onClick={() => handleSendMessage("Explain this in simpler terms with a real-world example.")}
                className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-900/90 text-brand-700 dark:text-brand-300 hover:border-brand-400 dark:hover:border-brand-600 transition-colors flex items-center gap-1"
              >
                <Compass className="w-3 h-3 text-brand-500" /> Simplify
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage("Give me 2 practice quiz questions to test my understanding.")}
                className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-900/90 text-brand-700 dark:text-brand-300 hover:border-brand-400 dark:hover:border-brand-600 transition-colors flex items-center gap-1"
              >
                <CheckSquare className="w-3 h-3 text-emerald-500" /> Practice Quiz
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage("Show an implementation example with code and comments.")}
                className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-900/90 text-brand-700 dark:text-brand-300 hover:border-brand-400 dark:hover:border-brand-600 transition-colors flex items-center gap-1"
              >
                <Code2 className="w-3 h-3 text-blue-500" /> Code Example
              </button>
              <button
                type="button"
                onClick={() => handleSendMessage("Summarize the key points in 3 quick bullet items for exam revision.")}
                className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium border border-brand-200 dark:border-brand-800 bg-white dark:bg-brand-900/90 text-brand-700 dark:text-brand-300 hover:border-brand-400 dark:hover:border-brand-600 transition-colors flex items-center gap-1"
              >
                <Layers className="w-3 h-3 text-purple-500" /> Summary
              </button>
            </div>
          )}

          {/* Input Form Container */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="w-full bg-white dark:bg-brand-900 rounded-2xl sm:rounded-3xl border border-brand-200 dark:border-brand-800 shadow-md p-2 flex flex-col focus-within:ring-2 focus-within:ring-brand-500/30 focus-within:border-brand-500 transition-all"
          >
            <div className="flex items-end gap-2 px-1">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask FCI AI a study question, past question breakdown, or code problem..."
                rows={1}
                className="flex-1 bg-transparent px-2.5 py-2 text-xs sm:text-sm text-brand-950 dark:text-brand-50 placeholder:text-brand-400 dark:placeholder:text-brand-500 resize-none focus:outline-none min-h-[40px] max-h-[160px]"
              />

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-full bg-brand-600 text-white dark:bg-brand-500 dark:text-brand-950 flex items-center justify-center hover:bg-brand-700 dark:hover:bg-brand-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all shrink-0 mb-0.5 shadow-xs"
                title="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-between px-2 pt-1 border-t border-brand-100 dark:border-brand-800/40 text-[11px] text-brand-400 dark:text-brand-500">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3 h-3 text-brand-500" />
                <span>CUSTECH Computing Curriculum</span>
              </div>
              <div className="hidden sm:flex items-center gap-1">
                <span>Press</span>
                <kbd className="px-1.5 py-0.5 rounded bg-brand-100 dark:bg-brand-800 text-[10px] font-mono">Enter</kbd>
                <span>to send</span>
              </div>
            </div>
          </form>

          <p className="text-[10px] text-center text-brand-500 dark:text-brand-400 mt-1.5">
            FCI AI provides study assistance tailored to CUSTECH Osara. Verify critical course notices with official faculty coordinators.
          </p>
        </div>
      </main>
    </div>
  );
}


