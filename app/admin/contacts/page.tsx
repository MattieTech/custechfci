'use client';

import { useState, useEffect } from 'react';
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
  Building2,
  Award,
  UserCheck
} from 'lucide-react';
import {
  loadCommunityGroups,
  saveCommunityGroupsLocally,
  type ClassGroup,
  DEFAULT_COMMUNITY_GROUPS,
} from '@/lib/community-groups';
import {
  loadLevelRepresentatives,
  saveLevelRepresentativesLocally,
  type LevelRepresentatives,
  type DepartmentRepresentatives,
  DEFAULT_LEVEL_REPRESENTATIVES,
  FCI_DEPARTMENTS,
  formatWhatsAppUrl,
} from '@/lib/contacts-data';

export default function ContactsAdminPage() {
  const [activeMainTab, setActiveMainTab] = useState<'groups' | 'reps'>('reps');

  // Groups State
  const [groups, setGroups] = useState<ClassGroup[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);

  // Group Form
  const [groupName, setGroupName] = useState('');
  const [groupDept, setGroupDept] = useState(FCI_DEPARTMENTS[0]);
  const [groupLevel, setGroupLevel] = useState('100');
  const [groupRepName, setGroupRepName] = useState('');
  const [groupWaLink, setGroupWaLink] = useState('');
  const [groupTgLink, setGroupTgLink] = useState('');
  const [groupMemberEstimate, setGroupMemberEstimate] = useState('100+ students');
  const [groupIsVerified, setGroupIsVerified] = useState(true);

  // Representatives State
  const [levelReps, setLevelReps] = useState<LevelRepresentatives[]>(DEFAULT_LEVEL_REPRESENTATIVES);
  const [loadingReps, setLoadingReps] = useState(true);
  const [selectedAdminLevel, setSelectedAdminLevel] = useState<number>(200);

  // Faculty Rep Edit Modal State
  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [facLevel, setFacLevel] = useState<number>(200);
  const [facName, setFacName] = useState('');
  const [facPhone, setFacPhone] = useState('');
  const [facWhatsapp, setFacWhatsapp] = useState('');

  // Department Reps Edit Modal State
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [deptLevel, setDeptLevel] = useState<number>(200);
  const [deptName, setDeptName] = useState('');
  const [courseRepName, setCourseRepName] = useState('');
  const [courseRepPhone, setCourseRepPhone] = useState('');
  const [courseRepWhatsapp, setCourseRepWhatsapp] = useState('');
  const [asstRepName, setAsstRepName] = useState('');
  const [asstRepPhone, setAsstRepPhone] = useState('');
  const [asstRepWhatsapp, setAsstRepWhatsapp] = useState('');

  // Load Groups and Representatives
  useEffect(() => {
    loadCommunityGroups().then((res) => {
      setGroups(res);
      setLoadingGroups(false);
    });

    loadLevelRepresentatives().then((res) => {
      setLevelReps(res);
      setLoadingReps(false);
    });
  }, []);

  // --- Group Handlers ---
  const handleOpenAddGroup = () => {
    setEditingGroupId(null);
    setGroupName('');
    setGroupDept(FCI_DEPARTMENTS[0]);
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

  // --- Representatives Handlers ---
  const currentActiveLevelData = levelReps.find((lr) => lr.level === selectedAdminLevel) || levelReps[0];

  const handleOpenEditFacultyRep = (levelNum: number) => {
    const lvl = levelReps.find((lr) => lr.level === levelNum);
    if (!lvl) return;
    setFacLevel(levelNum);
    setFacName(lvl.faculty_rep.name);
    setFacPhone(lvl.faculty_rep.phone);
    setFacWhatsapp(lvl.faculty_rep.whatsapp);
    setShowFacultyModal(true);
  };

  const handleSaveFacultyRep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!facName.trim()) {
      toast.error('Faculty Representative name is required');
      return;
    }

    const updated = levelReps.map((lr) => {
      if (lr.level === facLevel) {
        return {
          ...lr,
          faculty_rep: {
            name: facName.trim(),
            phone: facPhone.trim(),
            whatsapp: facWhatsapp.trim() || formatWhatsAppUrl(facPhone.trim()),
          },
        };
      }
      return lr;
    });

    setLevelReps(updated);
    await saveLevelRepresentativesLocally(updated);
    setShowFacultyModal(false);
    toast.success(`${facLevel} Level Faculty Representative updated successfully`);
  };

  const handleOpenEditDepartmentReps = (levelNum: number, dept: DepartmentRepresentatives) => {
    setDeptLevel(levelNum);
    setDeptName(dept.department);
    setCourseRepName(dept.course_rep.name);
    setCourseRepPhone(dept.course_rep.phone);
    setCourseRepWhatsapp(dept.course_rep.whatsapp);
    setAsstRepName(dept.assistant_rep.name);
    setAsstRepPhone(dept.assistant_rep.phone);
    setAsstRepWhatsapp(dept.assistant_rep.whatsapp);
    setShowDeptModal(true);
  };

  const handleSaveDepartmentReps = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseRepName.trim() && !asstRepName.trim()) {
      toast.error('Representative name is required');
      return;
    }

    const updated = levelReps.map((lr) => {
      if (lr.level === deptLevel) {
        const updatedDepts = lr.departments.map((d) => {
          if (d.department === deptName) {
            return {
              ...d,
              course_rep: {
                name: courseRepName.trim() || `${deptName} Course Rep`,
                phone: courseRepPhone.trim(),
                whatsapp: courseRepWhatsapp.trim() || formatWhatsAppUrl(courseRepPhone.trim()),
              },
              assistant_rep: {
                name: asstRepName.trim() || `${deptName} Assistant Rep`,
                phone: asstRepPhone.trim(),
                whatsapp: asstRepWhatsapp.trim() || formatWhatsAppUrl(asstRepPhone.trim()),
              },
            };
          }
          return d;
        });
        return { ...lr, departments: updatedDepts };
      }
      return lr;
    });

    setLevelReps(updated);
    await saveLevelRepresentativesLocally(updated);
    setShowDeptModal(false);
    toast.success(`${deptName} (${deptLevel}L) representatives updated successfully`);
  };

  const handleResetLevelReps = async () => {
    if (!window.confirm(`Reset all representatives for ${selectedAdminLevel} Level to defaults?`)) return;
    const defaultForLevel = DEFAULT_LEVEL_REPRESENTATIVES.find((lr) => lr.level === selectedAdminLevel);
    if (!defaultForLevel) return;

    const updated = levelReps.map((lr) => (lr.level === selectedAdminLevel ? defaultForLevel : lr));
    setLevelReps(updated);
    await saveLevelRepresentativesLocally(updated);
    toast.success(`${selectedAdminLevel} Level reset to defaults`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-900 dark:text-brand-50">
            Contacts &amp; Leadership Directory
          </h1>
          <p className="text-xs sm:text-sm text-brand-600 dark:text-brand-400 mt-1">
            Manage level-specific Faculty Representatives, departmental Course &amp; Assistant Reps, and WhatsApp groups.
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
                <span>Reset Groups</span>
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
              onClick={handleResetLevelReps}
              className="flex items-center gap-1.5 px-3 py-2 border border-brand-200 dark:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-800 text-brand-700 dark:text-brand-300 rounded-lg text-xs font-semibold transition-colors"
              title="Restore official default reps for this level"
            >
              <RotateCcw size={14} />
              <span>Reset {selectedAdminLevel}L Defaults</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex border-b border-brand-200 dark:border-brand-800 gap-6">
        <button
          onClick={() => setActiveMainTab('reps')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeMainTab === 'reps'
              ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 font-bold'
              : 'border-transparent text-brand-500 hover:text-brand-800 dark:hover:text-brand-300'
          }`}
        >
          <Users size={16} />
          <span>Faculty &amp; Departmental Course Reps (By Level)</span>
        </button>

        <button
          onClick={() => setActiveMainTab('groups')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeMainTab === 'groups'
              ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400 font-bold'
              : 'border-transparent text-brand-500 hover:text-brand-800 dark:hover:text-brand-300'
          }`}
        >
          <MessageSquare size={16} />
          <span>Department &amp; Class WhatsApp Groups ({groups.length})</span>
        </button>
      </div>

      {/* TAB 1: Level Representatives Directory */}
      {activeMainTab === 'reps' && (
        <div className="space-y-6">
          {/* Level Switcher Subtabs */}
          <div className="flex items-center gap-2 bg-brand-100/60 dark:bg-brand-900/60 p-1.5 rounded-2xl border border-brand-200/80 dark:border-brand-800">
            {[100, 200, 300, 400].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedAdminLevel(lvl)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  selectedAdminLevel === lvl
                    ? 'bg-white dark:bg-brand-800 text-brand-900 dark:text-brand-50 shadow-sm ring-1 ring-brand-200 dark:ring-brand-700'
                    : 'text-brand-600 dark:text-brand-400 hover:text-brand-900 dark:hover:text-brand-200'
                }`}
              >
                {lvl} Level
              </button>
            ))}
          </div>

          {loadingReps ? (
            <div className="flex justify-center p-12">
              <Loader2 className="animate-spin text-brand-600" size={32} />
            </div>
          ) : currentActiveLevelData ? (
            <div className="space-y-6">
              {/* SECTION 1: Level-Specific Faculty Representative */}
              <div className="bg-gradient-to-r from-brand-900 via-brand-950 to-brand-900 text-white rounded-2xl border border-brand-800 p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-800 text-brand-200 text-xs font-semibold mb-2 border border-brand-700">
                    <ShieldCheck size={13} className="text-emerald-400" />
                    <span>{selectedAdminLevel} Level Faculty Representative</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
                    {currentActiveLevelData.faculty_rep.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-brand-200 mt-2 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Phone size={13} className="text-brand-400" />
                      {currentActiveLevelData.faculty_rep.phone || 'No phone set'}
                    </span>
                    {currentActiveLevelData.faculty_rep.whatsapp ? (
                      <a
                        href={currentActiveLevelData.faculty_rep.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:underline flex items-center gap-1"
                      >
                        <MessageSquare size={13} /> WhatsApp URL
                      </a>
                    ) : null}
                  </div>
                </div>

                <button
                  onClick={() => handleOpenEditFacultyRep(selectedAdminLevel)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-700 hover:bg-brand-600 text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm self-start md:self-center"
                >
                  <Edit size={15} />
                  <span>Edit Faculty Rep</span>
                </button>
              </div>

              {/* SECTION 2: Departmental Course & Assistant Reps */}
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-brand-200 dark:border-brand-800">
                  <div>
                    <h3 className="text-lg font-bold text-brand-900 dark:text-brand-100 font-serif">
                      Departmental Representatives ({selectedAdminLevel} Level)
                    </h3>
                    <p className="text-xs text-brand-500">
                      Manage Course Representatives and Assistant Course Representatives for each accredited department.
                    </p>
                  </div>
                  <span className="text-xs font-medium text-brand-500">
                    {currentActiveLevelData.departments.length} Departments
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {currentActiveLevelData.departments.map((dept) => (
                    <div
                      key={dept.department}
                      className="bg-white dark:bg-brand-900 rounded-2xl border border-brand-200 dark:border-brand-800 shadow-sm p-5 flex flex-col justify-between hover:border-brand-400 dark:hover:border-brand-700 transition-all"
                    >
                      <div>
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 mb-3 border-b border-brand-100 dark:border-brand-800">
                          <div className="flex items-center gap-2">
                            <Building2 size={16} className="text-brand-600 dark:text-brand-400" />
                            <h4 className="font-bold text-brand-900 dark:text-brand-100 text-base">
                              {dept.department}
                            </h4>
                          </div>
                          <button
                            onClick={() => handleOpenEditDepartmentReps(selectedAdminLevel, dept)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-brand-100 hover:bg-brand-200 dark:bg-brand-800 dark:hover:bg-brand-700 text-brand-800 dark:text-brand-200 transition-colors"
                          >
                            <Edit size={13} /> Edit Reps
                          </button>
                        </div>

                        {/* Dual Reps Display */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Course Rep */}
                          <div className="p-3.5 rounded-xl bg-brand-50/70 dark:bg-brand-950/70 border border-brand-100 dark:border-brand-800/80">
                            <div className="flex items-center gap-1 text-[11px] font-bold text-brand-700 dark:text-brand-300 mb-1">
                              <UserCheck size={12} /> Course Representative
                            </div>
                            <p className="font-semibold text-sm text-brand-950 dark:text-brand-100 truncate">
                              {dept.course_rep.name}
                            </p>
                            <p className="text-xs text-brand-500 font-mono mt-1">
                              {dept.course_rep.phone || 'No phone'}
                            </p>
                            {dept.course_rep.whatsapp ? (
                              <a
                                href={dept.course_rep.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline mt-2 font-medium"
                              >
                                <MessageSquare size={11} /> Test WhatsApp
                              </a>
                            ) : null}
                          </div>

                          {/* Assistant Rep */}
                          <div className="p-3.5 rounded-xl bg-brand-50/70 dark:bg-brand-950/70 border border-brand-100 dark:border-brand-800/80">
                            <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 mb-1">
                              <Award size={12} /> Assistant Course Rep
                            </div>
                            <p className="font-semibold text-sm text-brand-950 dark:text-brand-100 truncate">
                              {dept.assistant_rep.name}
                            </p>
                            <p className="text-xs text-brand-500 font-mono mt-1">
                              {dept.assistant_rep.phone || 'No phone'}
                            </p>
                            {dept.assistant_rep.whatsapp ? (
                              <a
                                href={dept.assistant_rep.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline mt-2 font-medium"
                              >
                                <MessageSquare size={11} /> Test WhatsApp
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* TAB 2: WhatsApp Groups */}
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

      {/* Modal: Edit Faculty Representative */}
      {showFacultyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-brand-900 rounded-2xl w-full max-w-md shadow-2xl border border-brand-200 dark:border-brand-800 my-8">
            <div className="p-5 border-b border-brand-200 dark:border-brand-800 flex justify-between items-center">
              <h2 className="text-lg font-bold font-heading text-brand-900 dark:text-brand-100">
                Edit {facLevel}L Faculty Representative
              </h2>
              <button onClick={() => setShowFacultyModal(false)} className="text-brand-400 hover:text-brand-600">
                <XCircle size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveFacultyRep} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                  Level
                </label>
                <input
                  type="text"
                  disabled
                  value={`${facLevel} Level`}
                  className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-brand-50 dark:bg-brand-950/50 text-sm text-brand-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                  Faculty Rep Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. John Doe (Faculty Rep)"
                  value={facName}
                  onChange={(e) => setFacName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. 09054177365"
                  value={facPhone}
                  onChange={(e) => {
                    setFacPhone(e.target.value);
                    if (!facWhatsapp || facWhatsapp.includes('wa.me')) {
                      setFacWhatsapp(formatWhatsAppUrl(e.target.value));
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                  WhatsApp Direct URL
                </label>
                <input
                  type="url"
                  placeholder="https://wa.me/2349054177365"
                  value={facWhatsapp}
                  onChange={(e) => setFacWhatsapp(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500 font-mono text-xs"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-brand-100 dark:border-brand-800">
                <button
                  type="button"
                  onClick={() => setShowFacultyModal(false)}
                  className="px-4 py-2 border border-brand-200 dark:border-brand-700 rounded-lg text-xs font-semibold text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  Save Faculty Rep
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Department Course & Assistant Reps */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-brand-900 rounded-2xl w-full max-w-xl shadow-2xl border border-brand-200 dark:border-brand-800 my-8">
            <div className="p-5 border-b border-brand-200 dark:border-brand-800 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold font-heading text-brand-900 dark:text-brand-100">
                  Edit Department Representatives
                </h2>
                <p className="text-xs text-brand-500">
                  {deptName} &bull; {deptLevel} Level
                </p>
              </div>
              <button onClick={() => setShowDeptModal(false)} className="text-brand-400 hover:text-brand-600">
                <XCircle size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveDepartmentReps} className="p-6 space-y-6">
              {/* Part 1: Course Representative */}
              <div className="p-4 rounded-xl bg-brand-50/60 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800 space-y-3">
                <span className="text-xs font-bold text-brand-800 dark:text-brand-200 flex items-center gap-1.5 uppercase tracking-wider">
                  <UserCheck size={14} /> Course Representative
                </span>

                <div>
                  <label className="block text-xs font-medium text-brand-600 dark:text-brand-400 mb-1">
                    Course Rep Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jane Doe"
                    value={courseRepName}
                    onChange={(e) => setCourseRepName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-brand-600 dark:text-brand-400 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 08012345678"
                      value={courseRepPhone}
                      onChange={(e) => {
                        setCourseRepPhone(e.target.value);
                        if (!courseRepWhatsapp || courseRepWhatsapp.includes('wa.me')) {
                          setCourseRepWhatsapp(formatWhatsAppUrl(e.target.value));
                        }
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm font-mono focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brand-600 dark:text-brand-400 mb-1">
                      WhatsApp URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://wa.me/..."
                      value={courseRepWhatsapp}
                      onChange={(e) => setCourseRepWhatsapp(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-xs font-mono focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>

              {/* Part 2: Assistant Course Representative */}
              <div className="p-4 rounded-xl bg-brand-50/60 dark:bg-brand-950/60 border border-brand-200/80 dark:border-brand-800 space-y-3">
                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <Award size={14} /> Assistant Course Representative
                </span>

                <div>
                  <label className="block text-xs font-medium text-brand-600 dark:text-brand-400 mb-1">
                    Assistant Rep Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Smith"
                    value={asstRepName}
                    onChange={(e) => setAsstRepName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-brand-600 dark:text-brand-400 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 08087654321"
                      value={asstRepPhone}
                      onChange={(e) => {
                        setAsstRepPhone(e.target.value);
                        if (!asstRepWhatsapp || asstRepWhatsapp.includes('wa.me')) {
                          setAsstRepWhatsapp(formatWhatsAppUrl(e.target.value));
                        }
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm font-mono focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-brand-600 dark:text-brand-400 mb-1">
                      WhatsApp URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://wa.me/..."
                      value={asstRepWhatsapp}
                      onChange={(e) => setAsstRepWhatsapp(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-xs font-mono focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-brand-100 dark:border-brand-800">
                <button
                  type="button"
                  onClick={() => setShowDeptModal(false)}
                  className="px-4 py-2 border border-brand-200 dark:border-brand-700 rounded-lg text-xs font-semibold text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  Save Department Reps
                </button>
              </div>
            </form>
          </div>
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
                    {[...FCI_DEPARTMENTS, 'General Faculty'].map((d) => (
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
                    className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-brand-700 dark:text-brand-300">
                    Display Verified Faculty Badge
                  </span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-brand-100 dark:border-brand-800">
                <button
                  type="button"
                  onClick={() => setShowGroupModal(false)}
                  className="px-4 py-2 border border-brand-200 dark:border-brand-700 rounded-lg text-xs font-semibold text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                >
                  Save Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
