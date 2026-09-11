'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  UserCheck,
  UserPlus,
  Search,
  KeyRound,
  Trash2,
  Edit2,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  X,
  Shield,
  GraduationCap,
  BookOpen,
  Users,
  Building,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  roleTitle: string;
  department: string;
  level: string;
  phone: string;
  createdAt: string;
  lastSignInAt: string | null;
}

const ROLES = [
  'Faculty Representative',
  'Department Course Representative',
  'Assistant Course Representative',
  'Lecturer / Course Coordinator',
  'Faculty Administrator / Executive',
];

const DEPARTMENTS = [
  'General Faculty / Multi-dept',
  'Computer Science',
  'Cyber Security',
  'Information Technology',
  'Software Engineering',
  'Library & Information Science',
];

const LEVELS = ['All Levels', '100L', '200L', '300L', '400L'];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Form State
  const [formFullName, setFormFullName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRoleTitle, setFormRoleTitle] = useState(ROLES[0]);
  const [formDepartment, setFormDepartment] = useState(DEPARTMENTS[0]);
  const [formLevel, setFormLevel] = useState(LEVELS[0]);
  const [formPhone, setFormPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Credentials Result
  const [lastCreatedCredentials, setLastCreatedCredentials] = useState<{
    email: string;
    password: string;
    fullName: string;
    roleTitle: string;
    department: string;
    level: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Load users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch users');
      setUsers(data.users || []);
    } catch (err: any) {
      toast.error('Could not load portal accounts', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Generate a random strong password
  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%&*';
    let pass = '';
    for (let i = 0; i < 10; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormPassword(pass);
    setShowPassword(true);
  };

  // Open Create Modal
  const openCreateModal = () => {
    setFormFullName('');
    setFormEmail('');
    setFormRoleTitle(ROLES[0]);
    setFormDepartment(DEPARTMENTS[0]);
    setFormLevel(LEVELS[0]);
    setFormPhone('');
    generatePassword();
    setShowCreateModal(true);
  };

  // Open Edit Modal
  const openEditModal = (user: AdminUser) => {
    setSelectedUser(user);
    setFormFullName(user.fullName);
    setFormEmail(user.email);
    setFormRoleTitle(user.roleTitle || ROLES[0]);
    setFormDepartment(user.department || DEPARTMENTS[0]);
    setFormLevel(user.level || LEVELS[0]);
    setFormPhone(user.phone || '');
    setFormPassword('');
    setShowPassword(false);
    setShowEditModal(true);
  };

  // Handle Onboard Submission
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formEmail.trim() || !formPassword) {
      toast.error('Email and password are required');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formFullName.trim(),
          email: formEmail.trim(),
          password: formPassword,
          roleTitle: formRoleTitle,
          department: formDepartment,
          level: formLevel,
          phone: formPhone.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to onboard user');

      toast.success('Admin account created successfully!');
      setLastCreatedCredentials({
        email: formEmail.trim(),
        password: formPassword,
        fullName: formFullName.trim(),
        roleTitle: formRoleTitle,
        department: formDepartment,
        level: formLevel,
      });

      setShowCreateModal(false);
      setShowCredentialsModal(true);
      fetchUsers();
    } catch (err: any) {
      toast.error('Onboarding failed', { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Update User
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUser.id,
          fullName: formFullName.trim(),
          roleTitle: formRoleTitle,
          department: formDepartment,
          level: formLevel,
          phone: formPhone.trim(),
          ...(formPassword.trim() ? { password: formPassword.trim() } : {}),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update user');

      toast.success('User updated successfully');
      setShowEditModal(false);
      fetchUsers();
    } catch (err: any) {
      toast.error('Update failed', { description: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete / Revoke Access
  const handleDeleteUser = async (user: AdminUser) => {
    const confirmMsg = `Are you sure you want to revoke admin access for ${user.fullName || user.email}? They will no longer be able to log in.`;
    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/admin/users?userId=${user.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to revoke access');

      toast.success(`Access revoked for ${user.fullName || user.email}`);
      setUsers(users.filter((u) => u.id !== user.id));
    } catch (err: any) {
      toast.error('Failed to revoke access', { description: err.message });
    }
  };

  // Copy WhatsApp Invitation
  const copyInvitationText = () => {
    if (!lastCreatedCredentials) return;
    const loginUrl = `${window.location.origin}/admin/login`;
    const inviteText = `*CUSTECH FCI Student Guide — Portal Admin Access*

Hello *${lastCreatedCredentials.fullName || 'Representative'}*,
You have been onboarded as a *${lastCreatedCredentials.roleTitle}* (${lastCreatedCredentials.department} - ${lastCreatedCredentials.level}) on the CUSTECH Faculty of Computing & Informatics portal.

You now have admin privileges to manage timetables, study materials, and faculty announcements.

*Your Login Details:*
• *Portal Login URL:* ${loginUrl}
• *Email:* ${lastCreatedCredentials.email}
• *Password:* ${lastCreatedCredentials.password}

_Please log in and keep your password secure. For assistance, contact the faculty guild admin._`;

    navigator.clipboard.writeText(inviteText);
    setCopied(true);
    toast.success('Login credentials & invitation copied to clipboard!');
    setTimeout(() => setCopied(false), 3000);
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.roleTitle.toLowerCase().includes(q) ||
      u.department.toLowerCase().includes(q);

    const matchesRole = !roleFilter || u.roleTitle.toLowerCase().includes(roleFilter.toLowerCase());
    const matchesDept = !deptFilter || u.department.toLowerCase().includes(deptFilter.toLowerCase());
    const matchesLevel = !levelFilter || u.level === levelFilter;

    return matchesSearch && matchesRole && matchesDept && matchesLevel;
  });

  // Role badge styling helper
  const getRoleBadge = (roleTitle: string) => {
    const lower = (roleTitle || '').toLowerCase();
    if (lower.includes('faculty rep')) {
      return 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
    }
    if (lower.includes('course rep') && !lower.includes('assistant')) {
      return 'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    }
    if (lower.includes('assistant')) {
      return 'bg-cyan-100 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800';
    }
    if (lower.includes('lecturer')) {
      return 'bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    }
    return 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
  };

  // Stats
  const facultyRepsCount = users.filter((u) => (u.roleTitle || '').toLowerCase().includes('faculty rep')).length;
  const courseRepsCount = users.filter((u) => (u.roleTitle || '').toLowerCase().includes('course rep')).length;
  const lecturersCount = users.filter((u) => (u.roleTitle || '').toLowerCase().includes('lecturer')).length;
  const adminsCount = users.filter((u) => (u.roleTitle || '').toLowerCase().includes('admin')).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-brand-900 p-6 rounded-2xl border border-brand-200 dark:border-brand-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>Role & Access Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-brand-900 dark:text-brand-50">
            Portal Admins &amp; Representatives
          </h1>
          <p className="text-xs sm:text-sm text-brand-600 dark:text-brand-400 mt-1 max-w-2xl">
            Onboard Faculty Representatives, Course Reps, Assistants, and Lecturers as portal administrators. Manage their access directly without needing to open Supabase.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-[0.98] shrink-0"
        >
          <UserPlus size={18} />
          <span>Onboard New Admin / Rep</span>
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-brand-900 p-4 rounded-xl border border-brand-200 dark:border-brand-800">
          <div className="flex items-center justify-between text-brand-500">
            <span className="text-xs font-medium">Total Portal Admins</span>
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-2xl font-bold font-heading text-brand-900 dark:text-brand-100 mt-1">
            {users.length}
          </p>
          <span className="text-[11px] text-brand-400">All registered roles</span>
        </div>

        <div className="bg-white dark:bg-brand-900 p-4 rounded-xl border border-brand-200 dark:border-brand-800">
          <div className="flex items-center justify-between text-indigo-600">
            <span className="text-xs font-medium">Faculty Reps</span>
            <GraduationCap className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold font-heading text-brand-900 dark:text-brand-100 mt-1">
            {facultyRepsCount}
          </p>
          <span className="text-[11px] text-brand-400">Across 100L–400L</span>
        </div>

        <div className="bg-white dark:bg-brand-900 p-4 rounded-xl border border-brand-200 dark:border-brand-800">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs font-medium">Course Reps &amp; Assistants</span>
            <UserCheck className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold font-heading text-brand-900 dark:text-brand-100 mt-1">
            {courseRepsCount}
          </p>
          <span className="text-[11px] text-brand-400">Department representatives</span>
        </div>

        <div className="bg-white dark:bg-brand-900 p-4 rounded-xl border border-brand-200 dark:border-brand-800">
          <div className="flex items-center justify-between text-purple-600">
            <span className="text-xs font-medium">Lecturers &amp; Staff</span>
            <BookOpen className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold font-heading text-brand-900 dark:text-brand-100 mt-1">
            {lecturersCount + adminsCount}
          </p>
          <span className="text-[11px] text-brand-400">Faculty &amp; System Admins</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-brand-900 p-4 rounded-xl border border-brand-200 dark:border-brand-800 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email, role, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-brand-50/50 dark:bg-brand-950 text-brand-900 dark:text-brand-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-xs text-brand-800 dark:text-brand-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="">All Roles</option>
              <option value="Faculty Representative">Faculty Rep</option>
              <option value="Department Course Representative">Course Rep</option>
              <option value="Assistant Course Representative">Assistant Rep</option>
              <option value="Lecturer">Lecturer / Staff</option>
              <option value="Faculty Administrator">Administrator</option>
            </select>

            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-xs text-brand-800 dark:text-brand-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-xs text-brand-800 dark:text-brand-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="">All Levels</option>
              <option value="100L">100L</option>
              <option value="200L">200L</option>
              <option value="300L">300L</option>
              <option value="400L">400L</option>
            </select>

            {(searchQuery || roleFilter || deptFilter || levelFilter) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setRoleFilter('');
                  setDeptFilter('');
                  setLevelFilter('');
                }}
                className="px-2.5 py-1.5 text-xs text-brand-600 hover:text-brand-800 font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-brand-900 rounded-xl border border-brand-200 dark:border-brand-800 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-brand-500 flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-brand-600" />
            <p className="text-sm">Loading portal administrators...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-brand-500 px-4">
            <Users className="w-12 h-12 text-brand-300 dark:text-brand-700 mx-auto mb-3" />
            <h3 className="font-semibold text-brand-800 dark:text-brand-200 text-base">
              No portal administrators found
            </h3>
            <p className="text-xs text-brand-500 mt-1 max-w-md mx-auto">
              {searchQuery || roleFilter || deptFilter
                ? 'Try adjusting your search criteria or filters.'
                : 'Click "Onboard New Admin / Rep" to add the first representative or lecturer.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-50/70 dark:bg-brand-950/50 text-xs uppercase tracking-wider text-brand-600 dark:text-brand-400 border-b border-brand-200 dark:border-brand-800">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Representative / Staff</th>
                  <th className="px-6 py-3.5 font-semibold">Designated Role</th>
                  <th className="px-6 py-3.5 font-semibold">Department &amp; Level</th>
                  <th className="px-6 py-3.5 font-semibold">Phone / WhatsApp</th>
                  <th className="px-6 py-3.5 font-semibold">Added On</th>
                  <th className="px-6 py-3.5 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 dark:divide-brand-800/60">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-brand-50/50 dark:hover:bg-brand-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {(user.fullName || user.email).charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-brand-900 dark:text-brand-100">
                            {user.fullName || 'Unnamed Account'}
                          </div>
                          <div className="text-xs text-brand-500 flex items-center gap-1.5 mt-0.5">
                            <Mail className="w-3 h-3" />
                            <span>{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleBadge(
                          user.roleTitle
                        )}`}
                      >
                        <UserCheck className="w-3 h-3" />
                        <span>{user.roleTitle || 'Faculty Admin'}</span>
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="font-medium text-brand-800 dark:text-brand-200 text-xs">
                        {user.department || 'General Faculty'}
                      </div>
                      <div className="text-[11px] text-brand-500 mt-0.5">
                        {user.level || 'All Levels'}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-brand-600 dark:text-brand-400">
                      {user.phone ? (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-brand-400" />
                          <span>{user.phone}</span>
                        </span>
                      ) : (
                        <span className="text-brand-400 italic">Not set</span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-xs text-brand-500">
                      <div>{new Date(user.createdAt).toLocaleDateString()}</div>
                      {user.lastSignInAt && (
                        <div className="text-[10px] text-brand-400">
                          Active {new Date(user.lastSignInAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(user)}
                          title="Edit Details & Password"
                          className="p-1.5 text-brand-600 hover:text-brand-900 hover:bg-brand-100 dark:hover:bg-brand-800 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          title="Revoke Portal Access"
                          className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Onboarding Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-brand-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-brand-200 dark:border-brand-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-brand-200 dark:border-brand-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-200 rounded-lg">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-brand-900 dark:text-brand-100">
                    Onboard Representative or Staff
                  </h3>
                  <p className="text-xs text-brand-500">
                    Creates an authorized portal login with immediate admin privileges.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-brand-400 hover:text-brand-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-brand-700 dark:text-brand-300 mb-1 uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aliyu Matthew"
                  value={formFullName}
                  onChange={(e) => setFormFullName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-700 dark:text-brand-300 mb-1 uppercase tracking-wider">
                  Email Address * (For Portal Login)
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. aliyu.rep@custech.edu.ng"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-brand-700 dark:text-brand-300 uppercase tracking-wider">
                    Password *
                  </label>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="text-xs text-brand-600 hover:text-brand-800 dark:text-brand-400 font-medium flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate Strong</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm font-mono focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-brand-700 dark:text-brand-300 mb-1 uppercase tracking-wider">
                    Role / Designation *
                  </label>
                  <select
                    value={formRoleTitle}
                    onChange={(e) => setFormRoleTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-700 dark:text-brand-300 mb-1 uppercase tracking-wider">
                    Assigned Level *
                  </label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    {LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-brand-700 dark:text-brand-300 mb-1 uppercase tracking-wider">
                    Department *
                  </label>
                  <select
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-700 dark:text-brand-300 mb-1 uppercase tracking-wider">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 08012345678"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-brand-50 dark:bg-brand-950/60 rounded-xl border border-brand-200/60 dark:border-brand-800 text-xs text-brand-600 dark:text-brand-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <span>
                  After creating this account, login credentials will be displayed for you to copy and send to the representative via WhatsApp or SMS.
                </span>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-brand-200 dark:border-brand-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-brand-200 dark:border-brand-700 rounded-xl text-sm font-medium text-brand-700 dark:text-brand-300 hover:bg-brand-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                >
                  {submitting ? 'Onboarding...' : 'Create Admin Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit & Password Reset Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-brand-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-brand-200 dark:border-brand-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-brand-200 dark:border-brand-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-200 rounded-lg">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-brand-900 dark:text-brand-100">
                    Edit Account &amp; Password
                  </h3>
                  <p className="text-xs text-brand-500">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-1 text-brand-400 hover:text-brand-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-brand-700 dark:text-brand-300 mb-1 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formFullName}
                  onChange={(e) => setFormFullName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-brand-700 dark:text-brand-300 mb-1 uppercase tracking-wider">
                    Role / Designation
                  </label>
                  <select
                    value={formRoleTitle}
                    onChange={(e) => setFormRoleTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-700 dark:text-brand-300 mb-1 uppercase tracking-wider">
                    Assigned Level
                  </label>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    {LEVELS.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-brand-700 dark:text-brand-300 mb-1 uppercase tracking-wider">
                    Department
                  </label>
                  <select
                    value={formDepartment}
                    onChange={(e) => setFormDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-700 dark:text-brand-300 mb-1 uppercase tracking-wider">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-brand-700 dark:text-brand-300 uppercase tracking-wider">
                    Reset Password (Optional)
                  </label>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="text-xs text-brand-600 hover:text-brand-800 font-medium flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate Strong</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Leave blank to keep existing password"
                    minLength={6}
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    className="w-full pl-3.5 pr-10 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm font-mono focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-400 hover:text-brand-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-brand-200 dark:border-brand-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-brand-200 dark:border-brand-700 rounded-xl text-sm font-medium text-brand-700 dark:text-brand-300 hover:bg-brand-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success / Instant Credentials Card Modal */}
      {showCredentialsModal && lastCreatedCredentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-brand-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-green-200 dark:border-green-800 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-950/60 text-green-600 flex items-center justify-center mx-auto mb-3">
              <UserCheck className="w-8 h-8" />
            </div>

            <h3 className="font-heading font-bold text-xl text-brand-900 dark:text-brand-100">
              Account Onboarded Successfully!
            </h3>
            <p className="text-xs text-brand-600 dark:text-brand-400 mt-1 mb-5">
              Copy these login details and send them to the representative or lecturer.
            </p>

            <div className="bg-brand-50 dark:bg-brand-950 p-4 rounded-xl border border-brand-200 dark:border-brand-800 text-left space-y-2.5 text-xs font-mono mb-5">
              <div>
                <span className="text-brand-500 font-sans block text-[10px] uppercase font-bold tracking-wider">
                  Representative Name
                </span>
                <span className="font-semibold text-brand-900 dark:text-brand-100 text-sm">
                  {lastCreatedCredentials.fullName || 'Admin User'}
                </span>
              </div>

              <div>
                <span className="text-brand-500 font-sans block text-[10px] uppercase font-bold tracking-wider">
                  Assigned Designation
                </span>
                <span className="font-semibold text-brand-800 dark:text-brand-200">
                  {lastCreatedCredentials.roleTitle} ({lastCreatedCredentials.department} - {lastCreatedCredentials.level})
                </span>
              </div>

              <div>
                <span className="text-brand-500 font-sans block text-[10px] uppercase font-bold tracking-wider">
                  Login Email
                </span>
                <span className="font-semibold text-brand-900 dark:text-brand-100">
                  {lastCreatedCredentials.email}
                </span>
              </div>

              <div>
                <span className="text-brand-500 font-sans block text-[10px] uppercase font-bold tracking-wider">
                  Temporary Password
                </span>
                <span className="font-bold text-brand-900 dark:text-brand-100 text-sm bg-white dark:bg-brand-900 px-2 py-0.5 rounded border border-brand-200 dark:border-brand-800 inline-block mt-0.5">
                  {lastCreatedCredentials.password}
                </span>
              </div>

              <div>
                <span className="text-brand-500 font-sans block text-[10px] uppercase font-bold tracking-wider">
                  Portal Login URL
                </span>
                <span className="text-brand-600 dark:text-brand-400 truncate block">
                  {typeof window !== 'undefined' ? `${window.location.origin}/admin/login` : '/admin/login'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={copyInvitationText}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
              >
                {copied ? <Check size={18} /> : <MessageSquare size={18} />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy WhatsApp Invitation'}</span>
              </button>

              <button
                onClick={() => setShowCredentialsModal(false)}
                className="w-full px-4 py-2 text-xs text-brand-500 hover:text-brand-700 font-medium"
              >
                Done / Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

