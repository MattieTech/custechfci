'use client';

import React, { useState, useEffect } from 'react';
import { 
  Inbox, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Check, 
  Building2, 
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

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
}

export default function AdminGrievancesPage() {
  const [tickets, setTickets] = useState<GrievanceTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<GrievanceTicket | null>(null);
  const [responseText, setResponseText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_review' | 'resolved'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('custech_fci_grievances');
      if (saved) {
        const parsed = JSON.parse(saved);
        const clean = Array.isArray(parsed)
          ? parsed.filter((t: any) => t.id !== 'sample-1' && t.id !== 'sample-2')
          : [];
        setTickets(clean);
        localStorage.setItem('custech_fci_grievances', JSON.stringify(clean));
      }
    } catch (e) {}
  }, []);

  const handleUpdateTicket = (newStatus: GrievanceTicket['status']) => {
    if (!selectedTicket) return;

    const updated = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: newStatus,
          adminResponse: responseText.trim() || t.adminResponse
        };
      }
      return t;
    });

    setTickets(updated);
    try {
      localStorage.setItem('custech_fci_grievances', JSON.stringify(updated));
    } catch (e) {}

    toast.success('Ticket updated successfully!');
    setSelectedTicket(null);
    setResponseText('');
  };

  const filteredTickets = tickets.filter(t => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        t.title.toLowerCase().includes(q) ||
        t.trackingCode.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
            <Inbox className="h-3.5 w-3.5" />
            <span>Guild Administration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-serif">
            Student Grievance &amp; Suggestion Desk
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Review and resolve anonymous issues reported by students across all 5 departments.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card border border-border p-3 rounded-xl">
        <div className="relative flex-1 max-w-sm">
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search code, title, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex gap-1.5">
          {(['all', 'pending', 'in_review', 'resolved'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                statusFilter === tab ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted/50'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ticket List */}
        <div className="lg:col-span-7 space-y-3">
          {filteredTickets.length === 0 ? (
            <div className="p-12 text-center bg-card border border-border rounded-2xl text-xs text-muted-foreground">
              No tickets found for this filter.
            </div>
          ) : (
            filteredTickets.map(ticket => (
              <div
                key={ticket.id}
                onClick={() => {
                  setSelectedTicket(ticket);
                  setResponseText(ticket.adminResponse || '');
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer bg-card hover:border-primary/50 shadow-sm ${
                  selectedTicket?.id === ticket.id ? 'border-primary ring-1 ring-primary' : 'border-border/60'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-mono text-xs font-bold text-primary">{ticket.trackingCode}</span>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline"
                      className={`text-[10px] ${
                        ticket.urgency === 'critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold' :
                        ticket.urgency === 'important' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                        'bg-muted text-muted-foreground'
                      }`}
                    >
                      {ticket.urgency}
                    </Badge>
                    <Badge 
                      variant="outline"
                      className={`text-[10px] ${
                        ticket.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                        ticket.status === 'in_review' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-foreground leading-snug">{ticket.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">{ticket.description}</p>

                <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between text-[10px] text-muted-foreground">
                  <span>{ticket.department} • {ticket.level}</span>
                  <span>{ticket.createdAt}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Ticket Action Panel */}
        <div className="lg:col-span-5">
          {selectedTicket ? (
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4 sticky top-20">
              <div className="flex items-center justify-between pb-3 border-b border-border/40">
                <span className="font-mono text-xs font-bold text-primary">{selectedTicket.trackingCode}</span>
                <span className="text-[10px] text-muted-foreground">{selectedTicket.createdAt}</span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground block">{selectedTicket.category}</span>
                <h3 className="text-base font-bold text-foreground mt-0.5">{selectedTicket.title}</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>

              <div className="pt-2 border-t border-border/40 space-y-3">
                <label className="text-xs font-semibold text-foreground block">Official Guild Resolution Response</label>
                <textarea
                  rows={4}
                  placeholder="Type official reply / actions taken so the student can track resolution..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                />

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateTicket('in_review')}
                    className="text-xs flex-1"
                  >
                    Mark In Review
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleUpdateTicket('resolved')}
                    className="text-xs flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Resolve &amp; Close
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-dashed border-border rounded-2xl p-8 text-center text-xs text-muted-foreground">
              Select a ticket on the left to review details, assign status, or write an official resolution note.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

