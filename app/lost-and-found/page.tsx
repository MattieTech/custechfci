'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  MapPin, 
  Calendar, 
  Tag, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Phone, 
  MessageSquare,
  HelpCircle,
  Clock,
  ShieldCheck,
  Filter,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

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

const SAMPLE_ITEMS: LostFoundItem[] = [
  {
    id: 'lf-1',
    type: 'found',
    title: 'CUSTECH Student ID Card (Computer Science)',
    category: 'ID Cards & Documents',
    venue: 'Computer Lab 1 (Beside System 14)',
    date: '08 Sep 2026',
    description: 'Found a student identity card belonging to a 200L Computer Science student. Dropped with the Lab Attendant.',
    contactInfo: '0803XXXXXXX (Lab Attendant Engr. Bello)',
    status: 'active',
    verificationHint: 'Owner must provide matriculation number to verify.',
    createdAt: '08 Sep 2026'
  },
  {
    id: 'lf-2',
    type: 'lost',
    title: 'Casio fx-991EX Scientific Calculator (Black/Silver)',
    category: 'Electronics & Gadgets',
    venue: 'FCI Lecture Theatre 2 (Back Row)',
    date: '07 Sep 2026',
    description: 'Misplaced my calculator during STA 131 lecture on Tuesday afternoon. Has a small yellow sticker at the back.',
    contactInfo: 'WhatsApp: 0812XXXXXXX',
    status: 'active',
    verificationHint: 'Yellow sticker contains initials "K.A."',
    createdAt: '07 Sep 2026'
  },
  {
    id: 'lf-3',
    type: 'found',
    title: 'HP Laptop Charger (Blue Tip 65W)',
    category: 'Electronics & Gadgets',
    venue: 'ETF Hall 3',
    date: '05 Sep 2026',
    description: 'Left plugged into the wall socket after the 100L GST 111 morning class. Handed to the Class Rep.',
    contactInfo: 'Course Rep Emmanuel (0814XXXXXXX)',
    status: 'claimed',
    verificationHint: 'Owner claimed and verified serial number.',
    createdAt: '05 Sep 2026'
  }
];

export default function LostAndFoundPage() {
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'lost' | 'found' | 'claimed'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formType, setFormType] = useState<'lost' | 'found'>('lost');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('ID Cards & Documents');
  const [formVenue, setFormVenue] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDesc, setFormDesc] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formHint, setFormHint] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('custech_fci_lost_found');
      if (saved) {
        setItems(JSON.parse(saved));
      } else {
        setItems(SAMPLE_ITEMS);
        localStorage.setItem('custech_fci_lost_found', JSON.stringify(SAMPLE_ITEMS));
      }
    } catch (e) {
      setItems(SAMPLE_ITEMS);
    }
  }, []);

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formVenue.trim() || !formDesc.trim() || !formContact.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    const newItem: LostFoundItem = {
      id: 'lf-' + Date.now(),
      type: formType,
      title: formTitle.trim(),
      category: formCategory,
      venue: formVenue.trim(),
      date: formDate,
      description: formDesc.trim(),
      contactInfo: formContact.trim(),
      verificationHint: formHint.trim() || undefined,
      status: 'active',
      createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    const updated = [newItem, ...items];
    setItems(updated);
    try {
      localStorage.setItem('custech_fci_lost_found', JSON.stringify(updated));
    } catch (e) {}

    toast.success('Report posted to community board!');
    setShowModal(false);
    setFormTitle('');
    setFormVenue('');
    setFormDesc('');
    setFormContact('');
    setFormHint('');
    setSubmitting(false);
  };

  const filteredItems = items.filter(item => {
    if (typeFilter === 'lost' && item.type !== 'lost') return false;
    if (typeFilter === 'found' && item.type !== 'found') return false;
    if (typeFilter === 'claimed' && item.status !== 'claimed') return false;
    if (typeFilter !== 'claimed' && item.status === 'claimed' && typeFilter !== 'all') return false;

    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.venue.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Banner */}
      <header className="border-b border-border/40 bg-card/60 backdrop-blur sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-foreground">Faculty Lost &amp; Found Board</h1>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                  CUSTECH FCI Community
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Recover misplaced items, search recovered student IDs, and report found belongings
              </p>
            </div>
          </div>

          <Button 
            size="sm" 
            onClick={() => setShowModal(true)}
            className="gap-1.5 text-xs font-semibold"
          >
            <Plus className="h-4 w-4" />
            <span>Report Item</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-6 max-w-5xl space-y-6">
        {/* Search & Filter Hub */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search lost or found items (e.g. 'Casio Calculator', 'Student ID', 'Hall B')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-background text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="flex gap-1.5 bg-muted/50 p-1 rounded-xl">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'lost', label: 'Lost' },
                { id: 'found', label: 'Found' },
                { id: 'claimed', label: 'Reunited' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setTypeFilter(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    typeFilter === tab.id 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 pt-1 border-t border-border/40">
            {[
              'all',
              'ID Cards & Documents',
              'Electronics & Gadgets',
              'Books & Notebooks',
              'Keys & Wallets',
              'Clothing & Bags'
            ].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  categoryFilter === cat 
                    ? 'bg-primary text-primary-foreground border-primary' 
                    : 'bg-background hover:bg-muted/40 border-border text-muted-foreground'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.length === 0 ? (
            <div className="col-span-full py-16 text-center bg-card border border-dashed border-border rounded-2xl">
              <Search className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-40" />
              <h3 className="font-bold text-sm text-foreground">No Items Found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                No items match your search filters. Have you lost or found something? Click <strong>Report Item</strong> to alert the community.
              </p>
            </div>
          ) : (
            filteredItems.map(item => {
              const isFound = item.type === 'found';
              const isClaimed = item.status === 'claimed';

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border bg-card p-5 shadow-sm flex flex-col justify-between transition-all hover:border-primary/40 ${
                    isClaimed ? 'opacity-70 border-border/40' : 'border-border'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <Badge 
                        variant="outline"
                        className={`text-[10px] font-bold uppercase tracking-wider ${
                          isClaimed ? 'bg-muted text-muted-foreground border-border' :
                          isFound ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' :
                          'bg-amber-500/10 text-amber-500 border-amber-500/30'
                        }`}
                      >
                        {isClaimed ? 'Claimed & Reunited' : isFound ? 'Found' : 'Lost'}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground font-mono">{item.date}</span>
                    </div>

                    <h3 className="font-bold text-base text-foreground leading-snug">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-primary font-medium mt-1 mb-2">
                      <Tag className="h-3 w-3" />
                      <span>{item.category}</span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/40 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                      <span className="truncate">{item.venue}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-foreground font-medium">
                      <Phone className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />
                      <span className="truncate">{item.contactInfo}</span>
                    </div>

                    {item.verificationHint && (
                      <div className="p-2 rounded-lg bg-muted/40 border border-border/40 text-[11px] text-muted-foreground">
                        <strong>Claim Verification:</strong> {item.verificationHint}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Report Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <h3 className="font-bold text-lg text-foreground">Post to Lost &amp; Found Board</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4">
              {/* Type Switcher */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Report Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormType('lost')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      formType === 'lost' 
                        ? 'bg-amber-500/10 text-amber-500 border-amber-500 ring-1 ring-amber-500' 
                        : 'border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    I Lost Something
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormType('found')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                      formType === 'found' 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500 ring-1 ring-emerald-500' 
                        : 'border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    I Found Something
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Item Title / Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Student Identity Card, Casio Scientific Calculator..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                  >
                    <option value="ID Cards & Documents">ID Cards &amp; Documents</option>
                    <option value="Electronics & Gadgets">Electronics &amp; Gadgets</option>
                    <option value="Books & Notebooks">Books &amp; Notebooks</option>
                    <option value="Keys & Wallets">Keys &amp; Wallets</option>
                    <option value="Clothing & Bags">Clothing &amp; Bags</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Location / Venue</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ETF Hall 3, Computer Lab 2, FCI LT 1..."
                  value={formVenue}
                  onChange={(e) => setFormVenue(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Color, brand, distinguishing marks, where it was left or dropped off..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Contact Phone / WhatsApp</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 08123456789 or Course Rep David (080...)"
                  value={formContact}
                  onChange={(e) => setFormContact(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Claim Verification Hint (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Owner must state student name or serial number"
                  value={formHint}
                  onChange={(e) => setFormHint(e.target.value)}
                  className="w-full h-10 rounded-xl border border-border bg-background px-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-border/40 flex items-center justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowModal(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={submitting}
                  className="text-xs font-semibold px-5"
                >
                  Publish Report
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

