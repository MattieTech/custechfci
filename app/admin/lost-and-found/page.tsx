'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Trash2, 
  Tag, 
  MapPin, 
  Phone, 
  Clock, 
  Plus, 
  ShieldCheck,
  PackageSearch
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface LostFoundItem {
  id: string;
  type: 'lost' | 'found';
  title: string;
  category: string;
  venue: string;
  date: string;
  description: string;
  contactInfo: string;
  status: 'active' | 'claimed';
  verificationHint?: string;
  createdAt: string;
}

export default function AdminLostFoundPage() {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('custech_fci_lost_found');
      if (saved) {
        const parsed = JSON.parse(saved);
        const clean = Array.isArray(parsed)
          ? parsed.filter((item: any) => item.id !== 'lf-1' && item.id !== 'lf-2' && item.id !== 'lf-3')
          : [];
        setItems(clean);
        localStorage.setItem('custech_fci_lost_found', JSON.stringify(clean));
      }
    } catch (e) {}
  }, []);

  const handleToggleClaimed = (id: string) => {
    const updated = items.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'active' ? 'claimed' as const : 'active' as const;
        return { ...item, status: nextStatus };
      }
      return item;
    });

    setItems(updated);
    try {
      localStorage.setItem('custech_fci_lost_found', JSON.stringify(updated));
    } catch (e) {}

    toast.success('Status updated successfully!');
  };

  const handleDeleteItem = (id: string) => {
    if (!confirm('Are you sure you want to remove this item report from the community board?')) return;

    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    try {
      localStorage.setItem('custech_fci_lost_found', JSON.stringify(updated));
    } catch (e) {}

    toast.success('Report removed');
  };

  const filtered = items.filter(i => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return i.title.toLowerCase().includes(q) || i.venue.toLowerCase().includes(q) || i.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/40">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
            <PackageSearch className="h-3.5 w-3.5" />
            <span>Community Oversight</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-serif">
            Faculty Lost &amp; Found Administration
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Oversee lost property reports, verify claimed items, and reconcile recovered student belongings.
          </p>
        </div>
      </div>

      <div className="bg-card border border-border p-3 rounded-xl flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search items, venues, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {items.length} Total Reports
        </span>
      </div>

      <div className="divide-y divide-border/40 border border-border rounded-2xl bg-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            No items match your search.
          </div>
        ) : (
          filtered.map(item => (
            <div key={item.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-muted/20 transition-colors">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline"
                    className={`text-[10px] uppercase font-bold ${
                      item.status === 'claimed' ? 'bg-muted text-muted-foreground' :
                      item.type === 'found' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {item.status === 'claimed' ? 'Reunited' : item.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-medium">{item.category}</span>
                  <span className="text-[10px] text-muted-foreground">&bull; {item.date}</span>
                </div>

                <h3 className="font-bold text-base text-foreground leading-snug">{item.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <MapPin className="h-3 w-3 text-primary" /> {item.venue}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-emerald-500" /> {item.contactInfo}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  size="sm"
                  variant={item.status === 'claimed' ? 'outline' : 'primary'}
                  onClick={() => handleToggleClaimed(item.id)}
                  className="text-xs gap-1.5"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {item.status === 'claimed' ? 'Reopen Active' : 'Mark Claimed'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-xs text-muted-foreground hover:text-rose-500 p-2"
                  title="Remove Item"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

