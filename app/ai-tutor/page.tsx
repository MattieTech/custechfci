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
  Code, 
  Cpu, 
  GraduationCap, 
  HelpCircle,
  Zap,
  Lightbulb
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  { icon: '🎴', label: 'GST 111 Flashcards', prompt: 'Generate 5 high-yield revision flashcards for GST 111 (English & Concord).' },
  { icon: '💻', label: 'OOP Pillars (CSC 233)', prompt: 'Explain the 4 pillars of Object-Oriented Programming with Python examples for CSC 233.' },
  { icon: '🖥️', label: 'Von Neumann (CSC 231)', prompt: 'Summarize Von Neumann Architecture, its components, and the bottleneck for CSC 231.' },
  { icon: '📊', label: 'First Class Guide', prompt: 'How does the CUSTECH 5.0 CGPA scale work, and what semester GPA is needed for First Class?' },
  { icon: '⚙️', label: 'Agile vs Waterfall', prompt: 'Compare Waterfall vs Agile software methodologies for SWE 142 exams.' }
];

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `### Welcome to FCI AI Study Copilot 🎓🤖\n\nI am your intelligent academic study companion, customized for the **Faculty of Computing and Informatics at CUSTECH Osara**.\n\nAsk me anything about your lecture notes, coding questions (C++, Python, Java), CBT past questions, or exam preparation tips!\n\n*Try one of the quick prompts below to get started.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

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
        content: 'I had trouble connecting to the CUSTECH academic tutor network. Please try asking again!',
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
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `### Chat History Cleared 🧹\n\nHow can I help you with your CUSTECH computing studies today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <header className="border-b border-border/40 bg-card/70 backdrop-blur sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base font-bold text-foreground">Ask FCI AI: Academic Study Copilot</h1>
                  <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                    Online
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  CUSTECH Computing Curriculum Tutor &amp; Flashcard Generator
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetChat}
              className="text-xs text-muted-foreground hover:text-foreground gap-1"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear Chat</span>
            </Button>
            <Link href="/cbt">
              <Button size="sm" variant="outline" className="text-xs gap-1">
                <Zap className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">CBT Practice</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Chat Container */}
      <main className="container mx-auto px-4 py-4 max-w-4xl flex-1 flex flex-col justify-between">
        {/* Messages List */}
        <div className="space-y-4 pb-6 flex-1">
          {messages.map((msg) => {
            const isBot = msg.role === 'assistant';

            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 text-sm animate-in fade-in duration-200 ${isBot ? 'justify-start' : 'justify-end'}`}
              >
                {isBot && (
                  <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div 
                  className={`relative max-w-[88%] sm:max-w-[80%] rounded-2xl p-4 shadow-sm ${
                    isBot 
                      ? 'bg-card border border-border/60 text-foreground' 
                      : 'bg-primary text-primary-foreground font-medium'
                  }`}
                >
                  {/* Markdown formatted content */}
                  <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-wrap space-y-2">
                    {msg.content}
                  </div>

                  <div className="mt-2 pt-2 flex items-center justify-between text-[10px] opacity-60 border-t border-border/20">
                    <span>{msg.timestamp}</span>
                    {isBot && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="hover:opacity-100 flex items-center gap-1 transition-opacity"
                        title="Copy note"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 text-sm animate-in fade-in">
              <div className="w-8 h-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 animate-pulse">
                <Bot className="h-4 w-4" />
              </div>
              <div className="bg-card border border-border/60 rounded-2xl p-4 text-xs text-muted-foreground flex items-center gap-2 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                </div>
                <span>FCI AI is consulting CUSTECH curriculum notes...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="pt-2 pb-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2 font-medium">
            <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
            <span>Recommended CUSTECH Study Topics:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(item.prompt)}
                className="text-xs px-3 py-1.5 rounded-full border border-border/70 bg-card hover:border-primary/50 hover:bg-muted/50 text-foreground transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="sticky bottom-3 pt-2">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 bg-card border border-border/80 rounded-2xl p-2 shadow-lg focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary"
          >
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask FCI AI anything (e.g. 'Explain binary search trees' or 'Generate 3 flashcards for CSC 142')..."
              rows={1}
              className="flex-1 bg-transparent px-3 py-1.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none max-h-32"
            />
            <Button
              type="submit"
              size="sm"
              disabled={!input.trim() || loading}
              className="rounded-xl px-4 h-10 gap-1.5 text-xs font-semibold"
            >
              <span>Send</span>
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
          <p className="text-[10px] text-center text-muted-foreground mt-1.5">
            FCI AI provides study assistance aligned with CUSTECH Faculty of Computing and Informatics course outlines.
          </p>
        </div>
      </main>
    </div>
  );
}

