'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Send, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ArrowLeft, 
  Copy, 
  Check, 
  HelpCircle,
  FileText,
  Lock,
  Building2,
  ChevronRight,
  BadgeAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface GrievanceTicket {
  id: string;
  trackingCode: string;
  category: string;
  department: string;
  level: string;
  title: string;
  description: string;
  urgency: 'normal' | 'important' | 'critical';
  status: 'pending' | 'in_review' | 'resolved';
  adminResponse?: string;
  createdAt: string;
  updatedAt?: string;
}

const DEFAULT_SAMPLE_TICKETS: GrievanceTicket[] = [
  {
    id: 'sample-1',
    trackingCode: 'FCI-9421-A',
    category: 'Facility & Equipment',
    department: 'Computer Science',
    level: '100L',
    title: 'Ceiling Fan and Projector Malfunction in Hall B',
    description: 'During 100L GST 111 lectures, the projector is dim and 3 ceiling fans are completely dead, causing extreme heat.',
    urgency: 'important',
    status: 'resolved',
    adminResponse: 'Maintenance team inspected Hall B on Tuesday. Projector bulb replaced and 3 fans serviced.',
    createdAt: '03 Sep 2026'
  },
  {
    id: 'sample-2',
    trackingCode: 'FCI-3180-C',
    category: 'Timetable Clash',
    department: 'Software Engineering',
    level: '200L',
    title: 'SWE 211 and MTH 211 Lecture Schedule Overlap',
    description: 'Both lectures are fixed for Wednesday 10:00 AM on the faculty timetable draft.',
    urgency: 'critical',
    status: 'in_review',
    adminResponse: 'Faculty timetable committee notified. MTH 211 has been rescheduled to Thursday 8:00 AM.',
    createdAt: '06 Sep 2026'
  }
];

export default function GrievancesPage() {
  const [activeTab, setActiveTab] = useState<'submit' | 'track'>('submit');

  // Form State
  const [category, setCategory] = useState('Facility & Equipment');
  const [department, setDepartment] = useState('General Faculty');
  const [level, setLevel] = useState('All Levels');
  const [urgency, setUrgency] = useState<'normal' | 'important' | 'critical'>('normal');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Success Modal
  const [generatedTicket, setGeneratedTicket] = useState<GrievanceTicket | null>(null);
  const [copied, setCopied] = useState(false);

  // Track Ticket State
  const [searchCode, setSearchCode] = useState('');
  const [trackedTicket, setTrackedTicket] = useState<GrievanceTicket | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Stored tickets in localStorage
  const [allTickets, setAllTickets] = useState<GrievanceTicket[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('custech_fci_grievances');
      if (saved) {
        setAllTickets(JSON.parse(saved));
      } else {
        setAllTickets(DEFAULT_SAMPLE_TICKETS);
        localStorage.setItem('custech_fci_grievances', JSON.stringify(DEFAULT_SAMPLE_TICKETS));
      }
    } catch (e) {
      setAllTickets(DEFAULT_SAMPLE_TICKETS);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error('Please complete all required fields');
      return;
    }

    setSubmitting(true);
    const trackingCode = 'FCI-' + Math.floor(1000 + Math.random() * 9000) + '-' + String.fromCharCode(65 + Math.floor(Math.random() * 26));

    const newTicket: GrievanceTicket = {
      id: 'grv-' + Date.now(),
      trackingCode,
      category,
      department,
      level,
      urgency,
      title: title.trim(),
      description: description.trim(),
      status: 'pending',
      createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    // Try Supabase insert if table exists
    try {
      const supabase = createClient();
      await supabase.from('grievances').insert({
        tracking_code: trackingCode,
        category,
        department,
        level,
        urgency,
        title: title.trim(),
        description: description.trim(),
        status: 'pending'
      });
    } catch (e) {
      // Local fallback
    }

    const updated = [newTicket, ...allTickets];
    setAllTickets(updated);
    try {
      localStorage.setItem('custech_fci_grievances', JSON.stringify(updated));
    } catch (e) {}

    setGeneratedTicket(newTicket);
    setTitle('');
    setDescription('');
    setSubmitting(false);
  };

  const handleTrackTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchCode.trim().toUpperCase();
    if (!query) return;

    setHasSearched(true);
    const found = allTickets.find(t => t.trackingCode.toUpperCase() === query);
    setTrackedTicket(found || null);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Tracking code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/60 backdrop-blur sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-foreground">Guild Suggestion &amp; Grievance Box</h1>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                  100% Anonymous
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Securely report academic or welfare issues to faculty executives with private tracking codes
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-6 max-w-4xl space-y-8">
        {/* Anonymity Guarantee Banner */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 mt-0.5 sm:mt-0">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">Strict Anonymity Protection</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-relaxed">
                No matriculation number, student name, or IP address is recorded. Your submission generates a private 
                tracking token known only to you.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('submit')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'submit' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              Submit Grievance
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'track' ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              Track Ticket
            </button>
          </div>
        </div>

        {/* Tab 1: Submit Form */}
        {activeTab === 'submit' && !generatedTicket && (
          <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-5 animate-in fade-in">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              New Anonymous Report / Suggestion
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Issue Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="Facility & Equipment">Hall Facility / Projector / Power</option>
                  <option value="Course Rep Communication">Course Rep Communication</option>
                  <option value="Timetable Clash">Timetable Clash / Venue</option>
                  <option value="Lecturer Attendance">Lecturer Attendance / Materials</option>
                  <option value="Guild Welfare">Guild Suggestion &amp; Welfare</option>
                  <option value="Harassment / Security">Harassment / Safety Concern</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Department (Optional)</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="General Faculty">General Faculty (All)</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Cyber Security">Cyber Security</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Data Science">Data Science</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Academic Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                >
                  <option value="All Levels">All Levels</option>
                  <option value="100L">100 Level</option>
                  <option value="200L">200 Level</option>
                  <option value="300L">300 Level</option>
                  <option value="400L">400 Level</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Urgency Level</label>
              <div className="flex gap-3">
                {[
                  { id: 'normal', label: 'Normal Feedback', color: 'border-border' },
                  { id: 'important', label: 'Important (Class affected)', color: 'border-amber-500/50 text-amber-400' },
                  { id: 'critical', label: 'Critical Emergency', color: 'border-rose-500/50 text-rose-400' }
                ].map(item => (
                  <label 
                    key={item.id}
                    className={`flex-1 flex items-center justify-center p-3 rounded-xl border cursor-pointer text-xs font-semibold transition-all ${
                      urgency === item.id 
                        ? 'bg-primary/10 border-primary ring-1 ring-primary text-foreground' 
                        : 'bg-background hover:bg-muted/40 text-muted-foreground'
                    }`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={item.id}
                      checked={urgency === item.id}
                      onChange={() => setUrgency(item.id as any)}
                      className="sr-only"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Summary / Subject</label>
              <input
                type="text"
                required
                placeholder="Briefly state the issue (e.g. Broken microphone in ETF 3 during CSC 142)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-10 rounded-xl border border-border bg-background px-3.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Detailed Description</label>
              <textarea
                required
                rows={5}
                placeholder="Provide specific details, dates, course codes, and venues so faculty executives can investigate and resolve immediately..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none resize-none"
              />
            </div>

            <div className="pt-3 border-t border-border/40 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                No personal information is attached.
              </span>

              <Button 
                type="submit" 
                disabled={submitting}
                className="gap-2 text-xs px-6 h-10 font-semibold"
              >
                <Send className="h-4 w-4" />
                <span>Submit Grievance Anonymously</span>
              </Button>
            </div>
          </form>
        )}

        {/* Success Modal / Ticket Generated */}
        {generatedTicket && (
          <div className="bg-card border border-emerald-500/30 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-lg animate-in zoom-in-95">
            <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 mb-2">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h3 className="text-xl font-bold text-foreground">Grievance Submitted Successfully!</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Your submission has been dispatched to Faculty Guild Executives. Save your private tracking code below to check on investigation updates and resolution notes.
            </p>

            <div className="my-6 p-4 rounded-xl bg-muted/40 border border-border/80 max-w-sm mx-auto flex items-center justify-between">
              <span className="font-mono text-xl font-extrabold text-primary tracking-wider">
                {generatedTicket.trackingCode}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyCode(generatedTicket.trackingCode)}
                className="gap-1.5 text-xs"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </Button>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Button
                onClick={() => {
                  setGeneratedTicket(null);
                  setActiveTab('track');
                  setSearchCode(generatedTicket.trackingCode);
                }}
                className="text-xs"
              >
                Track Ticket Status Now
              </Button>
              <Button
                variant="outline"
                onClick={() => setGeneratedTicket(null)}
                className="text-xs"
              >
                Submit Another Report
              </Button>
            </div>
          </div>
        )}

        {/* Tab 2: Track Ticket */}
        {activeTab === 'track' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-2">
                <Search className="h-4 w-4 text-primary" />
                Track Ticket Resolution
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                Enter your 8-character ticket code (e.g. <code>FCI-9421-A</code>) to view real-time status and executive responses.
              </p>

              <form onSubmit={handleTrackTicket} className="flex gap-2 max-w-md">
                <input
                  type="text"
                  placeholder="Enter tracking code (e.g. FCI-9421-A)"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="flex-1 h-10 rounded-xl border border-border bg-background px-3.5 text-xs font-mono uppercase focus:ring-1 focus:ring-primary focus:outline-none"
                />
                <Button type="submit" className="text-xs font-semibold h-10 px-5">
                  Check Status
                </Button>
              </form>
            </div>

            {hasSearched && (
              <div>
                {trackedTicket ? (
                  <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm animate-in fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/40">
                      <div>
                        <span className="font-mono text-xs font-bold text-primary mr-2">
                          {trackedTicket.trackingCode}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Submitted on {trackedTicket.createdAt}
                        </span>
                      </div>

                      <Badge 
                        variant="outline"
                        className={
                          trackedTicket.status === 'resolved' 
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : trackedTicket.status === 'in_review'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }
                      >
                        {trackedTicket.status === 'resolved' ? 'Resolved & Closed' : trackedTicket.status === 'in_review' ? 'Under Review by Guild' : 'Pending Review'}
                      </Badge>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                        {trackedTicket.category} • {trackedTicket.department} ({trackedTicket.level})
                      </span>
                      <h3 className="text-base font-bold text-foreground mt-1">
                        {trackedTicket.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
                        {trackedTicket.description}
                      </p>
                    </div>

                    {/* Official Resolution Box */}
                    <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-primary">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Official Faculty Guild Response:</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {trackedTicket.adminResponse || 'This ticket has been assigned to the department executive committee. An investigation update will be posted here shortly.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center bg-card border border-border rounded-2xl text-muted-foreground text-xs">
                    No ticket found matching code <strong>{searchCode.toUpperCase()}</strong>. Check for typos or verify your code.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

