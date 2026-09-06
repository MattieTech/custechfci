'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import {
  Plus,
  Trash2,
  Edit,
  Loader2,
  Phone,
  XCircle,
  MessageSquare,
  Send,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Users,
} from 'lucide-react';
import {
  loadCommunityGroups,
  saveCommunityGroupsLocally,
  type ClassGroup,
  DEFAULT_COMMUNITY_GROUPS,
} from '@/lib/community-groups';

type Contact = {
  id: string;
  name: string;
  role: string;
  phone: string | null;
  whatsapp_url: string | null;
  level: number | null;
  department_name: string | null;
};

const DEPARTMENTS = [
  'Computer Science',
  'Software Engineering',
  'Information Technology (IFT)',
  'Cyber Security',
  'Library & Information Science',
  'General Faculty',
];

export default function ContactsAdminPage() {
  const supabase = createClient();
  const [activeMainTab, setActiveMainTab] = useState<'groups' | 'reps'>('groups');

  // Groups State
  const [groups, setGroups] = useState<ClassGroup[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);

  // Group Form
  const [groupName, setGroupName] = useState('');
  const [groupDept, setGroupDept] = useState(DEPARTMENTS[0]);
  const [groupLevel, setGroupLevel] = useState('100');
  const [groupRepName, setGroupRepName] = useState('');
  const [groupWaLink, setGroupWaLink] = useState('');
  const [groupTgLink, setGroupTgLink] = useState('');
  const [groupMemberEstimate, setGroupMemberEstimate] = useState('100+ students');
  const [groupIsVerified, setGroupIsVerified] = useState(true);

  // Reps State
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [isSubmittingRep, setIsSubmittingRep] = useState(false);
  const [showRepModal, setShowRepModal] = useState(false);
  const [editingRepId, setEditingRepId] = useState<string | null>(null);

  // Rep Form State
  const [repName, setRepName] = useState('');
  const [repRole, setRepRole] = useState('course_rep');
  const [repPhone, setRepPhone] = useState('');
  const [repWhatsappUrl, setRepWhatsappUrl] = useState('');
  const [repLevel, setRepLevel] = useState('100');
  const [repDepartmentName, setRepDepartmentName] = useState(DEPARTMENTS[0]);

  // Load Groups
  useEffect(() => {
    loadCommunityGroups().then((res) => {
      setGroups(res);
      setLoadingGroups(false);
    });
  }, []);

  // Load Contacts
  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      const { data, error } = await supabase.from('contacts').select('*').order('level', { ascending: true });
      if (error) throw error;
      setContacts(data || []);
    } catch (error: any) {
      // Fallback
    } finally {
      setLoadingContacts(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // --- Group Handlers ---
  const handleOpenAddGroup = () => {
    setEditingGroupId(null);
    setGroupName('');
    setGroupDept(DEPARTMENTS[0]);
    setGroupLevel('100');
    setGroupRepName('Course Rep');
    setGroupWaLink('https://chat.whatsapp.com/');
    setGroupTgLink('');
    setGroupMemberEstimate('100+ students');
    setGroupIsVerified(true);
    setShowGroupModal(true);
  };

  const handleOpenEditGroup = (g: ClassGroup) => {
    setEditingGroupId(g.id);
    setGroupName(g.name);
    setGroupDept(g.department);
    setGroupLevel(g.level.toString());
    setGroupRepName(g.rep_name);
    setGroupWaLink(g.whatsapp_link);
    setGroupTgLink(g.telegram_link || '');
    setGroupMemberEstimate(g.member_estimate);
    setGroupIsVerified(g.is_verified);
    setShowGroupModal(true);
  };

  const handleSaveGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || !groupWaLink.trim()) {
      toast.error('Group name and WhatsApp link are required');
      return;
    }

    let updatedList: ClassGroup[];
    if (editingGroupId) {
      updatedList = groups.map((g) =>
        g.id === editingGroupId
          ? {
              ...g,
              name: groupName.trim(),
              department: groupDept,
              level: parseInt(groupLevel) || 0,
              rep_name: groupRepName.trim(),
              whatsapp_link: groupWaLink.trim(),
              telegram_link: groupTgLink.trim() || undefined,
              member_estimate: groupMemberEstimate.trim() || '100+ students',
              is_verified: groupIsVerified,
            }
          : g
      );
      toast.success('Community group updated successfully');
    } else {
      const newGrp: ClassGroup = {
        id: `grp_${Date.now()}`,
        name: groupName.trim(),
        department: groupDept,
        level: parseInt(groupLevel) || 0,
        rep_name: groupRepName.trim(),
        whatsapp_link: groupWaLink.trim(),
        telegram_link: groupTgLink.trim() || undefined,
        member_estimate: groupMemberEstimate.trim() || '100+ students',
        is_verified: groupIsVerified,
      };
      updatedList = [newGrp, ...groups];
      toast.success('New community group added successfully');
    }

    setGroups(updatedList);
    await saveCommunityGroupsLocally(updatedList);
    setShowGroupModal(false);
  };

  const handleDeleteGroup = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this group link?')) return;
    const updatedList = groups.filter((g) => g.id !== id);
    setGroups(updatedList);
    await saveCommunityGroupsLocally(updatedList);
    toast.success('Group removed');
  };

  const handleResetDefaultGroups = async () => {
    if (!window.confirm('Reset all WhatsApp groups to default placeholders?')) return;
    setGroups(DEFAULT_COMMUNITY_GROUPS);
    await saveCommunityGroupsLocally(DEFAULT_COMMUNITY_GROUPS);
    toast.success('Reset to official defaults completed');
  };

  // --- Rep Handlers ---
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setRepPhone(val);
    if (val) {
      const digits = val.replace(/\D/g, '');
      const waNumber = digits.startsWith('0') ? `234${digits.substring(1)}` : digits;
      setRepWhatsappUrl(`https://wa.me/${waNumber}`);
    } else {
      setRepWhatsappUrl('');
    }
  };

  const handleSubmitRep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repName) {
      toast.error('Name is required');
      return;
    }

    setIsSubmittingRep(true);
    try {
      const payload = {
        name: repName,
        role: repRole,
        phone: repPhone || null,
        whatsapp_url: repWhatsappUrl || null,
        level: repRole === 'faculty_rep' ? null : parseInt(repLevel),
        department_name: repDepartmentName,
      };

      if (editingRepId) {
        const { error } = await supabase.from('contacts').update(payload).eq('id', editingRepId);
        if (error) throw error;
        toast.success('Representative updated successfully');
      } else {
        const { error } = await supabase.from('contacts').insert(payload);
        if (error) throw error;
        toast.success('Representative added successfully');
      }

      setShowRepModal(false);
      resetRepForm();
      fetchContacts();
    } catch (error: any) {
      toast.error('Submission failed', { description: error.message });
    } finally {
      setIsSubmittingRep(false);
    }
  };

  const resetRepForm = () => {
    setRepName('');
    setRepRole('course_rep');
    setRepPhone('');
    setRepWhatsappUrl('');
    setRepLevel('100');
    setRepDepartmentName(DEPARTMENTS[0]);
    setEditingRepId(null);
  };

  const handleEditRep = (contact: Contact) => {
    setRepName(contact.name);
    setRepRole(contact.role);
    setRepPhone(contact.phone || '');
    setRepWhatsappUrl(contact.whatsapp_url || '');
    setRepLevel(contact.level ? contact.level.toString() : '100');
    setRepDepartmentName(contact.department_name || DEPARTMENTS[0]);
    setEditingRepId(contact.id);
    setShowRepModal(true);
  };

  const handleDeleteRep = async (id: string) => {
    if (!window.confirm('Delete this contact?')) return;
    try {
      const { error } = await supabase.from('contacts').delete().eq('id', id);
      if (error) throw error;
      toast.success('Contact removed');
      setContacts(contacts.filter((c) => c.id !== id));
    } catch (error: any) {
      toast.error('Delete failed', { description: error.message });
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-900 dark:text-brand-50">
            Contacts & Community Groups
          </h1>
          <p className="text-xs sm:text-sm text-brand-600 dark:text-brand-400 mt-1">
            Manage official class WhatsApp links, Telegram communities, and course reps directory.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {activeMainTab === 'groups' ? (
            <>
              <button
                onClick={handleResetDefaultGroups}
                className="flex items-center gap-1.5 px-3 py-2 border border-brand-200 dark:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-800 text-brand-700 dark:text-brand-300 rounded-lg text-xs font-semibold transition-colors"
                title="Restore default placeholder links"
              >
                <RotateCcw size={14} />
                <span>Reset Placeholders</span>
              </button>
              <button
                onClick={handleOpenAddGroup}
                className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                <Plus size={18} />
                <span>Add WhatsApp Group</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                resetRepForm();
                setShowRepModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              <Plus size={18} />
              <span>Add Course Rep</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-brand-200 dark:border-brand-800 gap-6">
        <button
          onClick={() => setActiveMainTab('groups')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeMainTab === 'groups'
              ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 font-bold'
              : 'border-transparent text-brand-500 hover:text-brand-800 dark:hover:text-brand-300'
          }`}
        >
          <MessageSquare size={16} />
          <span>Department & Class WhatsApp Groups ({groups.length})</span>
        </button>
        <button
          onClick={() => setActiveMainTab('reps')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeMainTab === 'reps'
              ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 font-bold'
              : 'border-transparent text-brand-500 hover:text-brand-800 dark:hover:text-brand-300'
          }`}
        >
          <Users size={16} />
          <span>Course Representatives ({contacts.length})</span>
        </button>
      </div>

      {/* TAB 1: WhatsApp Groups */}
      {activeMainTab === 'groups' && (
        <div className="space-y-4">
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 p-4 rounded-xl text-xs text-amber-900 dark:text-amber-200">
            <strong>Admin Note:</strong> You can edit any placeholder with real class links anytime. Changes made here appear immediately on the student portal under <strong>/contacts</strong>.
          </div>

          {loadingGroups ? (
            <div className="flex justify-center p-12">
              <Loader2 className="animate-spin text-brand-600" size={32} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groups.map((grp) => (
                <div
                  key={grp.id}
                  className="bg-white dark:bg-brand-900 rounded-xl shadow-sm border border-brand-200 dark:border-brand-800 p-5 flex flex-col justify-between hover:border-brand-400 transition-all"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60">
                        {grp.is_verified ? <CheckCircle2 size={12} /> : null}
                        {grp.is_verified ? 'Verified' : 'Unverified'}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleOpenEditGroup(grp)}
                          className="p-1 text-brand-500 hover:text-brand-700 dark:hover:text-brand-300 rounded"
                          title="Edit Group"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(grp.id)}
                          className="p-1 text-red-500 hover:text-red-700 rounded"
                          title="Delete Group"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-bold text-brand-900 dark:text-brand-100 text-base leading-snug">
                      {grp.name}
                    </h3>
                    <p className="text-xs font-medium text-brand-600 dark:text-brand-400 mt-1">
                      {grp.department} {grp.level > 0 ? `• ${grp.level}L` : ''}
                    </p>
                    <p className="text-xs text-brand-500 mt-2">Rep: {grp.rep_name || 'Course Rep'}</p>
                    <p className="text-[11px] text-brand-400 mt-0.5">Members: {grp.member_estimate}</p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-brand-100 dark:border-brand-800 flex items-center justify-between gap-2">
                    <a
                      href={grp.whatsapp_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline font-semibold"
                    >
                      <MessageSquare size={13} /> Test Link <ExternalLink size={11} />
                    </a>
                    {grp.telegram_link && (
                      <span className="text-[11px] text-brand-400 flex items-center gap-1">
                        <Send size={11} /> Telegram
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Course Representatives */}
      {activeMainTab === 'reps' && (
        <div>
          {loadingContacts ? (
            <div className="flex justify-center p-12">
              <Loader2 className="animate-spin text-brand-600" size={32} />
            </div>
          ) : contacts.length === 0 ? (
            <div className="py-12 text-center text-brand-500 bg-white dark:bg-brand-900 rounded-lg border border-brand-200 dark:border-brand-800">
              No contacts found. Click "Add Course Rep" to create one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-white dark:bg-brand-900 rounded-xl shadow-sm border border-brand-200 dark:border-brand-800 p-5 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-brand-900 dark:text-brand-50">{contact.name}</h3>
                      <p className="text-xs text-brand-500 capitalize">{contact.role.replace('_', ' ')}</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => handleEditRep(contact)} className="text-brand-500 hover:text-brand-700 p-1">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDeleteRep(contact.id)} className="text-red-500 hover:text-red-700 p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-brand-700 dark:text-brand-300 mb-2">
                    {contact.department_name} {contact.level ? `• ${contact.level}L` : ''}
                  </div>

                  {contact.phone && (
                    <div className="flex items-center gap-2 text-xs text-brand-600 dark:text-brand-400 pt-2 border-t border-brand-100 dark:border-brand-800">
                      <Phone size={13} />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Add/Edit WhatsApp Group */}
      {showGroupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-brand-900 rounded-2xl w-full max-w-lg shadow-2xl border border-brand-200 dark:border-brand-800 my-8">
            <div className="p-5 border-b border-brand-200 dark:border-brand-800 flex justify-between items-center">
              <h2 className="text-lg font-bold font-heading text-brand-900 dark:text-brand-100">
                {editingGroupId ? 'Edit WhatsApp Group' : 'Add Official WhatsApp Group'}
              </h2>
              <button onClick={() => setShowGroupModal(false)} className="text-brand-400 hover:text-brand-600">
                <XCircle size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveGroup} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                  Group Title *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. CSC 100L Official Class Group"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                    Department
                  </label>
                  <select
                    value={groupDept}
                    onChange={(e) => setGroupDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                    Level
                  </label>
                  <select
                    value={groupLevel}
                    onChange={(e) => setGroupLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="0">General / All Levels</option>
                    <option value="100">100 Level</option>
                    <option value="200">200 Level</option>
                    <option value="300">300 Level</option>
                    <option value="400">400 Level</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                    Managed By
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Course Rep (08012345678)"
                    value={groupRepName}
                    onChange={(e) => setGroupRepName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                    Member Estimate
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 150+ students"
                    value={groupMemberEstimate}
                    onChange={(e) => setGroupMemberEstimate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                  WhatsApp Invite URL *
                </label>
                <input
                  required
                  type="url"
                  placeholder="https://chat.whatsapp.com/..."
                  value={groupWaLink}
                  onChange={(e) => setGroupWaLink(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                  Telegram Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://t.me/..."
                  value={groupTgLink}
                  onChange={(e) => setGroupTgLink(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="inline-flex items-center gap-2 cursor-pointer pt-2">
                  <input
                    type="checkbox"
                    checked={groupIsVerified}
                    onChange={(e) => setGroupIsVerified(e.target.checked)}
                    className="rounded border-brand-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-brand-800 dark:text-brand-200">
                    Display "Verified Faculty Group" badge
                  </span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-brand-200 dark:border-brand-800">
                <button
                  type="button"
                  onClick={() => setShowGroupModal(false)}
                  className="px-4 py-2 border border-brand-200 dark:border-brand-700 rounded-lg text-sm text-brand-700 dark:text-brand-300 hover:bg-brand-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                  Save Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add/Edit Course Rep */}
      {showRepModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-brand-900 rounded-2xl w-full max-w-lg shadow-2xl border border-brand-200 dark:border-brand-800 my-8">
            <div className="p-5 border-b border-brand-200 dark:border-brand-800 flex justify-between items-center">
              <h2 className="text-lg font-bold font-heading text-brand-900 dark:text-brand-100">
                {editingRepId ? 'Edit Representative' : 'Add Representative'}
              </h2>
              <button onClick={() => setShowRepModal(false)} className="text-brand-400 hover:text-brand-600">
                <XCircle size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmitRep} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                  Name *
                </label>
                <input
                  required
                  type="text"
                  value={repName}
                  onChange={(e) => setRepName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                    Role *
                  </label>
                  <select
                    required
                    value={repRole}
                    onChange={(e) => setRepRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="course_rep">Course Rep</option>
                    <option value="faculty_rep">Faculty Rep</option>
                  </select>
                </div>

                {repRole === 'course_rep' && (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                      Level *
                    </label>
                    <select
                      required
                      value={repLevel}
                      onChange={(e) => setRepLevel(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="100">100 Level</option>
                      <option value="200">200 Level</option>
                      <option value="300">300 Level</option>
                      <option value="400">400 Level</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                  Department
                </label>
                <select
                  value={repDepartmentName}
                  onChange={(e) => setRepDepartmentName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                >
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={repPhone}
                  onChange={handlePhoneChange}
                  placeholder="08012345678"
                  className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                  WhatsApp Direct URL
                </label>
                <input
                  type="url"
                  value={repWhatsappUrl}
                  onChange={(e) => setRepWhatsappUrl(e.target.value)}
                  placeholder="https://wa.me/2348012345678"
                  className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-brand-200 dark:border-brand-800">
                <button
                  type="button"
                  onClick={() => setShowRepModal(false)}
                  className="px-4 py-2 border border-brand-200 dark:border-brand-700 rounded-lg text-sm text-brand-700 dark:text-brand-300 hover:bg-brand-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRep}
                  className="flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 shadow-sm"
                >
                  {isSubmittingRep ? <Loader2 size={16} className="animate-spin" /> : null}
                  <span>{isSubmittingRep ? 'Saving...' : 'Save Representative'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

