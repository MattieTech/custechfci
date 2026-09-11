'use client';

import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Megaphone, 
  Smartphone, 
  Radio, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ExternalLink,
  MessageSquare,
  Share2,
  Users,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface BroadcastRecord {
  id: string;
  title: string;
  category: string;
  audience: string;
  message: string;
  channels: string[];
  sentAt: string;
  status: 'delivered' | 'partial' | 'failed';
}

export default function AdminBroadcastPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('exam');
  const [audience, setAudience] = useState('All FCI Students');
  const [message, setMessage] = useState('');
  const [actionUrl, setActionUrl] = useState('https://custechfci.vercel.app');

  // Channels
  const [sendTelegram, setSendTelegram] = useState(true);
  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [sendPush, setSendPush] = useState(true);

  const [isSending, setIsSending] = useState(false);
  const [history, setHistory] = useState<BroadcastRecord[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('custech_fci_broadcast_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }

      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        const urlTitle = params.get('title');
        const urlMessage = params.get('message');
        const urlCategory = params.get('category');
        if (urlTitle) setTitle(urlTitle);
        if (urlMessage) setMessage(urlMessage);
        if (urlCategory) setCategory(urlCategory);
      }
    } catch (e) {}
  }, []);

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error('Please enter a title and message');
      return;
    }

    if (!sendTelegram && !sendWhatsApp && !sendPush) {
      toast.error('Please select at least one dispatch channel');
      return;
    }

    setIsSending(true);
    try {
      const res = await fetch('/api/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          audience,
          message,
          actionUrl,
          channels: {
            telegram: sendTelegram,
            whatsapp: sendWhatsApp,
            push: sendPush
          }
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to broadcast');

      toast.success('Broadcast dispatched successfully!', {
        description: `Dispatched to ${[sendTelegram && 'Telegram', sendWhatsApp && 'WhatsApp', sendPush && 'PWA Push'].filter(Boolean).join(', ')}`
      });

      const newRecord: BroadcastRecord = {
        id: 'bc-' + Date.now(),
        title,
        category,
        audience,
        message,
        channels: [sendTelegram && 'Telegram', sendWhatsApp && 'WhatsApp', sendPush && 'PWA Push'].filter(Boolean) as string[],
        sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' }),
        status: 'delivered'
      };

      const updated = [newRecord, ...history].slice(0, 20);
      setHistory(updated);
      try {
        localStorage.setItem('custech_fci_broadcast_history', JSON.stringify(updated));
      } catch (e) {}

      // Reset fields
      setTitle('');
      setMessage('');

    } catch (err: any) {
      toast.error('Broadcast failed: ' + err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            <span>Multi-Channel Broadcast Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-serif">
            Telegram &amp; WhatsApp Broadcaster
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Instantly broadcast emergency announcements, lecture venue shifts, and materials to official faculty groups.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Broadcast Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleBroadcast} className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-primary" />
              Compose Broadcast Notice
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Notice Headline / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. URGENT: CSC 142 CBT Venue Relocated to Main Hall A"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border bg-background px-3.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="exam">Exam Timetable &amp; CBT</option>
                    <option value="lecture">Lecture / Venue Change</option>
                    <option value="materials">Academic Notes Upload</option>
                    <option value="senate">Official Senate Circular</option>
                    <option value="guild">Guild Welfare Notice</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Target Audience</label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="All FCI Students">All FCI Students (100L - 400L)</option>
                    <option value="100L Freshers Only">100L Freshers Only</option>
                    <option value="200L Students Only">200L Students Only</option>
                    <option value="Computer Science Dept">Computer Science Dept</option>
                    <option value="Software Engineering Dept">Software Engineering Dept</option>
                    <option value="Cyber Security Dept">Cyber Security Dept</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Message Content</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Detail the announcement, date, time, and instructions for affected students..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Action Link (Portal URL)</label>
                <input
                  type="url"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border bg-background px-3.5 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              {/* Channels Selection */}
              <div className="pt-2">
                <label className="text-xs font-semibold text-muted-foreground block mb-2">Dispatch Destination Channels</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${sendTelegram ? 'bg-primary/10 border-primary text-foreground' : 'border-border text-muted-foreground'}`}>
                    <input
                      type="checkbox"
                      checked={sendTelegram}
                      onChange={(e) => setSendTelegram(e.target.checked)}
                      className="rounded text-primary focus:ring-0"
                    />
                    <span className="text-xs font-bold">Telegram Channel</span>
                  </label>

                  <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${sendWhatsApp ? 'bg-emerald-500/10 border-emerald-500 text-foreground' : 'border-border text-muted-foreground'}`}>
                    <input
                      type="checkbox"
                      checked={sendWhatsApp}
                      onChange={(e) => setSendWhatsApp(e.target.checked)}
                      className="rounded text-emerald-500 focus:ring-0"
                    />
                    <span className="text-xs font-bold">WhatsApp Webhook</span>
                  </label>

                  <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${sendPush ? 'bg-purple-500/10 border-purple-500 text-foreground' : 'border-border text-muted-foreground'}`}>
                    <input
                      type="checkbox"
                      checked={sendPush}
                      onChange={(e) => setSendPush(e.target.checked)}
                      className="rounded text-purple-500 focus:ring-0"
                    />
                    <span className="text-xs font-bold">PWA Web Push</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/40 flex items-center justify-end">
              <Button 
                type="submit" 
                disabled={isSending}
                className="gap-2 text-xs px-6 font-semibold h-10"
              >
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Broadcasting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Dispatch Broadcast Now</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Right: Real-time Live Mobile Simulation Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/40">
              <span className="text-xs font-mono uppercase text-muted-foreground font-semibold flex items-center gap-1.5">
                <Smartphone className="h-4 w-4" />
                Live Student Preview
              </span>
              <Badge variant="outline" className="text-[10px]">Mobile Viewport</Badge>
            </div>

            {/* Simulated Chat Bubble */}
            <div className="rounded-xl bg-muted/40 p-4 border border-border/60 space-y-3 font-sans">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <Megaphone className="h-3.5 w-3.5" />
                <span>CUSTECH FCI OFFICIAL NOTICE</span>
              </div>

              <div className="flex gap-1.5">
                <Badge variant="outline" className="text-[9px] uppercase tracking-wide bg-background">
                  {category}
                </Badge>
                <Badge variant="secondary" className="text-[9px]">
                  {audience}
                </Badge>
              </div>

              <h4 className="font-bold text-sm text-foreground leading-snug">
                {title || 'Headline will appear here...'}
              </h4>

              <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {message || 'Type your message in the form to see how it will be delivered across student devices.'}
              </p>

              {actionUrl && (
                <div className="pt-2">
                  <a
                    href={actionUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-primary underline"
                  >
                    <span>Open on FCI Portal</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Broadcast Dispatch Log */}
          {history.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-mono uppercase font-bold text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Recent Broadcast Dispatches ({history.length})
              </h3>
              <div className="divide-y divide-border/40 text-xs">
                {history.map((h) => (
                  <div key={h.id} className="py-2.5 flex items-start justify-between gap-2">
                    <div>
                      <span className="font-semibold text-foreground line-clamp-1">{h.title}</span>
                      <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                        <span>{h.sentAt}</span>
                        <span>&bull;</span>
                        <span>{h.channels.join(', ')}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30 flex-shrink-0">
                      Dispatched
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

