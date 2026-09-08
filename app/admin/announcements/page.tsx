'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Plus, Trash2, Edit, Loader2, CheckCircle2, XCircle, BellRing, Send } from 'lucide-react';

type Announcement = {
  id: string;
  title: string;
  content: string;
  category: string;
  is_important: boolean;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
};

export default function AnnouncementsAdminPage() {
  const supabase = createClient();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [isImportant, setIsImportant] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [sendPush, setSendPush] = useState(true);

  // Standalone Push Broadcast Modal State
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastBody, setBroadcastBody] = useState('');
  const [broadcastUrl, setBroadcastUrl] = useState('/announcements');
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error: any) {
      toast.error('Failed to load announcements', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error('Title and content are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title,
        content,
        category,
        is_important: isImportant,
        is_published: isPublished,
        published_at: isPublished ? new Date().toISOString() : null,
      };

      if (editingId) {
        const { error } = await supabase.from('announcements').update(payload).eq('id', editingId);
        if (error) throw error;
        toast.success('Announcement updated successfully');
      } else {
        const { error } = await supabase.from('announcements').insert(payload);
        if (error) throw error;
        toast.success('Announcement created successfully');

        // Broadcast Web Push to students if enabled
        if (isPublished && sendPush) {
          fetch('/api/notifications/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: `📢 ${title}`,
              body: content.length > 120 ? `${content.substring(0, 117)}...` : content,
              url: '/announcements',
              tag: `announcement-${Date.now()}`,
            }),
          })
            .then((r) => r.json())
            .then((resData) => {
              if (resData.sentCount > 0) {
                toast.info(`🔔 Push notification delivered to ${resData.sentCount} active subscriber(s)!`);
              }
            })
            .catch(() => {});
        }
      }

      setShowModal(false);
      resetForm();
      fetchAnnouncements();
    } catch (error: any) {
      toast.error('Submission failed', { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastBody) {
      toast.error('Title and message are required for push broadcast');
      return;
    }

    setIsBroadcasting(true);
    try {
      const res = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: broadcastTitle,
          body: broadcastBody,
          url: broadcastUrl || '/announcements',
          tag: `broadcast-${Date.now()}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send broadcast');

      toast.success('Push notification broadcasted!', {
        description: `Delivered to ${data.sentCount} active device(s).`,
      });
      setShowBroadcastModal(false);
      setBroadcastTitle('');
      setBroadcastBody('');
    } catch (error: any) {
      toast.error('Broadcast failed', { description: error.message });
    } finally {
      setIsBroadcasting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setCategory('general');
    setIsImportant(false);
    setIsPublished(true);
    setSendPush(true);
    setEditingId(null);
  };

  const handleEdit = (announcement: Announcement) => {
    setTitle(announcement.title);
    setContent(announcement.content);
    setCategory(announcement.category);
    setIsImportant(announcement.is_important);
    setIsPublished(announcement.is_published);
    setEditingId(announcement.id);
    setShowModal(true);
  };

  const toggleStatus = async (id: string, field: 'is_published' | 'is_important', currentValue: boolean) => {
    try {
      const updates: any = { [field]: !currentValue };
      if (field === 'is_published' && !currentValue) {
        updates.published_at = new Date().toISOString();
      }
      
      const { error } = await supabase.from('announcements').update(updates).eq('id', id);
      if (error) throw error;
      
      toast.success(`Status updated successfully`);
      setAnnouncements(announcements.map(a => a.id === id ? { ...a, ...updates } : a));
    } catch (error: any) {
      toast.error('Update failed', { description: error.message });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      const { error } = await supabase.from('announcements').delete().eq('id', id);
      if (error) throw error;
      toast.success('Announcement deleted successfully');
      setAnnouncements(announcements.filter(a => a.id !== id));
    } catch (error: any) {
      toast.error('Delete failed', { description: error.message });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold font-playfair text-brand-900 dark:text-brand-50">Announcements</h1>
          <p className="text-xs text-brand-500">Manage faculty announcements and student push alerts</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-md text-sm font-medium transition-colors shadow-sm"
            title="Send an instant Web Push alert to all subscribed devices"
          >
            <BellRing size={16} />
            <span>Send Push Alert</span>
          </button>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-md text-sm font-medium transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>New Announcement</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-brand-600" size={32} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.length === 0 ? (
            <div className="col-span-full py-12 text-center text-brand-500 bg-white dark:bg-brand-900 rounded-lg border border-brand-200 dark:border-brand-800">
              No announcements found.
            </div>
          ) : (
            announcements.map((announcement) => (
              <div key={announcement.id} className="bg-white dark:bg-brand-900 rounded-lg shadow-sm border border-brand-200 dark:border-brand-800 p-5 flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-brand-100 text-brand-800 dark:bg-brand-800 dark:text-brand-200 capitalize">
                    {announcement.category}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(announcement)} className="text-brand-500 hover:text-brand-700 p-1">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(announcement.id)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <h3 className="font-bold text-lg mb-2 text-brand-900 dark:text-brand-50 line-clamp-2">{announcement.title}</h3>
                <p className="text-sm text-brand-600 dark:text-brand-400 mb-4 flex-1 line-clamp-3">{announcement.content}</p>
                
                <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-brand-100 dark:border-brand-800">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-brand-500">
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleStatus(announcement.id, 'is_published', announcement.is_published)}
                      className={`flex-1 flex justify-center items-center gap-1 text-xs py-1.5 rounded border transition-colors ${
                        announcement.is_published 
                          ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' 
                          : 'bg-brand-50 border-brand-200 text-brand-600 hover:bg-brand-100 dark:bg-brand-800 dark:border-brand-700 dark:text-brand-300'
                      }`}
                    >
                      {announcement.is_published ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      {announcement.is_published ? 'Published' : 'Draft'}
                    </button>
                    <button
                      onClick={() => toggleStatus(announcement.id, 'is_important', announcement.is_important)}
                      className={`flex-1 flex justify-center items-center gap-1 text-xs py-1.5 rounded border transition-colors ${
                        announcement.is_important 
                          ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400' 
                          : 'bg-brand-50 border-brand-200 text-brand-600 hover:bg-brand-100 dark:bg-brand-800 dark:border-brand-700 dark:text-brand-300'
                      }`}
                    >
                      {announcement.is_important ? '★ Important' : '☆ Normal'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white dark:bg-brand-950 rounded-lg w-full max-w-2xl shadow-xl my-8">
            <div className="p-6 border-b border-brand-200 dark:border-brand-800 flex justify-between items-center">
              <h2 className="text-xl font-bold font-playfair">{editingId ? 'Edit Announcement' : 'New Announcement'}</h2>
              <button onClick={() => setShowModal(false)} className="text-brand-500 hover:text-brand-700">
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-brand-200 dark:border-brand-800 bg-transparent focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content *</label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 rounded-md border border-brand-200 dark:border-brand-800 bg-transparent focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-brand-200 dark:border-brand-800 bg-transparent focus:ring-2 focus:ring-brand-500"
                >
                  <option value="general">General</option>
                  <option value="academic">Academic</option>
                  <option value="events">Events</option>
                  <option value="facilities">Facilities</option>
                  <option value="workshop">Workshop</option>
                  <option value="awards">Awards</option>
                </select>
              </div>
              
              <div className="flex flex-wrap gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isImportant}
                    onChange={(e) => setIsImportant(e.target.checked)}
                    className="rounded border-brand-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm font-medium">Mark as Important</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded border-brand-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-sm font-medium">Publish Immediately</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendPush}
                    onChange={(e) => setSendPush(e.target.checked)}
                    className="rounded border-brand-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                    <BellRing size={14} />
                    Push Notify Devices
                  </span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-brand-200 dark:border-brand-800 rounded-md hover:bg-brand-50 dark:hover:bg-brand-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-md transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : null}
                  <span>{isSubmitting ? 'Saving...' : 'Save Announcement'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Custom Push Notification Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-brand-900 rounded-xl max-w-lg w-full p-6 shadow-xl border border-brand-200 dark:border-brand-800">
            <div className="flex items-center justify-between mb-4 border-b border-brand-100 dark:border-brand-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600">
                  <BellRing size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-brand-950 dark:text-brand-50">
                    Send Instant Web Push Alert
                  </h2>
                  <p className="text-xs text-brand-500">
                    Delivered in background to all students with notifications enabled
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="text-brand-400 hover:text-brand-600"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCustomBroadcast} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
                  Notification Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 📢 Urgent: Exam Hall Relocation"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-brand-200 dark:border-brand-800 bg-transparent focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
                  Alert Message / Body *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g., CSC 201 Examination has been rescheduled to Hall B at 10:00 AM."
                  value={broadcastBody}
                  onChange={(e) => setBroadcastBody(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-brand-200 dark:border-brand-800 bg-transparent focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400 mb-1">
                  Action Link URL
                </label>
                <input
                  type="text"
                  placeholder="/timetable or /announcements"
                  value={broadcastUrl}
                  onChange={(e) => setBroadcastUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-brand-200 dark:border-brand-800 bg-transparent focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-[11px] text-brand-400 mt-1 block">
                  Students will be redirected here when they tap the notification.
                </span>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-brand-100 dark:border-brand-800">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 text-sm border border-brand-200 dark:border-brand-800 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBroadcasting}
                  className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shadow-sm disabled:opacity-50"
                >
                  {isBroadcasting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={16} />
                  )}
                  <span>{isBroadcasting ? 'Broadcasting...' : 'Broadcast to All Devices'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
