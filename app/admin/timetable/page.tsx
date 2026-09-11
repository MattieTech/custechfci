'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import {
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  Search,
  FileSpreadsheet,
  Download,
  UploadCloud,
  AlertTriangle,
  Check,
  X,
  Radio,
  type LucideIcon,
} from 'lucide-react';

export type TimetableType = 'lecture' | 'ca_test' | 'exam';

export type TimetableEntry = {
  id: string;
  course_code: string;
  course_title: string;
  timetable_type: TimetableType;
  day_of_week: string | null;
  exam_date: string | null;
  start_time: string;
  end_time: string;
  venue: string | null;
  level: number;
  semester: number;
  session: string | null;
  is_published: boolean;
};

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const TABS: { id: TimetableType; label: string; icon: LucideIcon }[] = [
  { id: 'lecture', label: 'Lecture Timetable', icon: BookOpen },
  { id: 'ca_test', label: 'CA Test Timetable', icon: ClipboardCheck },
  { id: 'exam', label: 'Exam Timetable', icon: GraduationCap },
];

export default function TimetableAdminPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<TimetableType>('lecture');
  const [entries, setEntries] = useState<TimetableEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [levelFilter, setLevelFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  // Bulk CSV Modal State
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [isImportingCsv, setIsImportingCsv] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [formType, setFormType] = useState<TimetableType>('lecture');
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('10:00');
  const [venue, setVenue] = useState('');
  const [level, setLevel] = useState('100');
  const [semester, setSemester] = useState('1');
  const [sessionStr, setSessionStr] = useState('2025/2026');
  const [isPublished, setIsPublished] = useState(true);


  // Sync form default type when active tab changes
  useEffect(() => {
    setFormType(activeTab);
  }, [activeTab]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      let query = supabase.from('exam_timetable').select('*');

      // Filter by active category (support legacy null as 'exam')
      if (activeTab === 'exam') {
        query = query.or('timetable_type.eq.exam,timetable_type.is.null');
      } else {
        query = query.eq('timetable_type', activeTab);
      }

      if (levelFilter) {
        query = query.eq('level', parseInt(levelFilter));
      }

      // Order
      if (activeTab === 'lecture') {
        query = query.order('start_time', { ascending: true });
      } else {
        query = query.order('exam_date', { ascending: true }).order('start_time', { ascending: true });
      }

      const { data, error } = await query;
      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      toast.error('Failed to load timetable', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [activeTab, levelFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim() || !courseTitle.trim() || !startTime || !endTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formType !== 'lecture' && !date) {
      toast.error(`Please select a date for the ${formType === 'ca_test' ? 'CA Test' : 'Exam'}`);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        course_code: courseCode.trim().toUpperCase(),
        course_title: courseTitle.trim(),
        timetable_type: formType,
        day_of_week: formType === 'lecture' ? dayOfWeek : null,
        exam_date: formType !== 'lecture' ? date : (date || null),
        start_time: startTime,
        end_time: endTime,
        venue: venue.trim() || null,
        level: parseInt(level),
        semester: parseInt(semester),
        session: sessionStr,
        is_published: isPublished,
      };

      const { error } = await supabase.from('exam_timetable').insert(payload);
      if (error) throw error;

      toast.success(`${formType === 'lecture' ? 'Lecture' : formType === 'ca_test' ? 'CA Test' : 'Exam'} timetable entry added!`);
      setShowModal(false);
      resetForm();
      fetchEntries();
    } catch (error: any) {
      toast.error('Failed to add entry', { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setCourseCode('');
    setCourseTitle('');
    setDate('');
    setDayOfWeek('Monday');
    setStartTime('08:00');
    setEndTime('10:00');
    setVenue('');
    setLevel('100');
    setSemester('1');
    setSessionStr('2025/2026');
    setIsPublished(true);
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('exam_timetable')
        .update({ is_published: !currentStatus })
        .eq('id', id);
      if (error) throw error;
      toast.success(`Entry ${currentStatus ? 'unpublished' : 'published'}`);
      setEntries(entries.map((e) => (e.id === id ? { ...e, is_published: !currentStatus } : e)));
    } catch (error: any) {
      toast.error('Update failed', { description: error.message });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    try {
      const { error } = await supabase.from('exam_timetable').delete().eq('id', id);
      if (error) throw error;
      toast.success('Entry deleted successfully');
      setEntries(entries.filter((e) => e.id !== id));
    } catch (error: any) {
      toast.error('Delete failed', { description: error.message });
    }
  };

  const downloadCsvTemplate = () => {
    const csvContent =
      "course_code,course_title,timetable_type,day_of_week,exam_date,start_time,end_time,venue,level,semester,session\n" +
      "CSC 101,Introduction to Computer Science,lecture,Monday,,08:00,10:00,ETF Hall A,100,1,2025/2026\n" +
      "MTH 101,Elementary Mathematics I,ca_test,,2025-11-15,10:00,12:00,Auditorium 1,100,1,2025/2026\n" +
      "PHY 101,General Physics I,exam,,2026-01-20,09:00,12:00,Science Complex Lab,100,1,2025/2026";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "custech_timetable_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("CSV template downloaded!");
  };

  const handleCsvFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;
      parseCsv(text);
    };
    reader.readAsText(file);
  };

  const parseCsv = (csvText: string) => {
    const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length < 2) {
      toast.error("The CSV file must contain a header row and at least one data row");
      return;
    }

    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const expectedHeaders = ['course_code', 'course_title', 'start_time', 'end_time', 'level'];
    const missingHeaders = expectedHeaders.filter((eh) => !headers.includes(eh));
    if (missingHeaders.length > 0) {
      toast.error(`Missing required CSV columns: ${missingHeaders.join(', ')}`);
      return;
    }

    const rows: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim().replace(/^["']|["']$/g, ''));
      if (values.length < headers.length) continue;

      const rowObj: any = {};
      headers.forEach((h, idx) => {
        rowObj[h] = values[idx] || '';
      });

      const isValid = Boolean(
        rowObj.course_code &&
        rowObj.course_title &&
        rowObj.start_time &&
        rowObj.end_time &&
        rowObj.level
      );

      rows.push({
        course_code: (rowObj.course_code || '').toUpperCase(),
        course_title: rowObj.course_title || '',
        timetable_type: ['lecture', 'ca_test', 'exam'].includes(rowObj.timetable_type) ? rowObj.timetable_type : 'lecture',
        day_of_week: rowObj.day_of_week || null,
        exam_date: rowObj.exam_date || null,
        start_time: rowObj.start_time || '08:00',
        end_time: rowObj.end_time || '10:00',
        venue: rowObj.venue || null,
        level: parseInt(rowObj.level) || 100,
        semester: parseInt(rowObj.semester) || 1,
        session: rowObj.session || '2025/2026',
        is_published: true,
        isValid,
      });
    }

    setParsedRows(rows);
    toast.info(`Parsed ${rows.length} rows from CSV`);
  };

  const handleBulkImport = async () => {
    const validRows = parsedRows.filter((r) => r.isValid).map(({ isValid, ...entry }) => entry);
    if (validRows.length === 0) {
      toast.error("No valid rows found to import");
      return;
    }

    setIsImportingCsv(true);
    try {
      const { error } = await supabase.from('exam_timetable').insert(validRows);
      if (error) throw error;

      toast.success(`Successfully imported ${validRows.length} timetable entries!`);
      setShowCsvModal(false);
      setParsedRows([]);
      setCsvFile(null);
      fetchEntries();
    } catch (err: any) {
      toast.error('Bulk import failed', { description: err.message });
    } finally {
      setIsImportingCsv(false);
    }
  };

  // Filter entries by search query
  const filteredEntries = entries.filter((entry) => {
    const q = searchQuery.toLowerCase();
    return (
      entry.course_code.toLowerCase().includes(q) ||
      entry.course_title.toLowerCase().includes(q) ||
      (entry.venue && entry.venue.toLowerCase().includes(q)) ||
      (entry.day_of_week && entry.day_of_week.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-brand-900 dark:text-brand-50">
            Timetable Management
          </h1>
          <p className="text-sm text-brand-600 dark:text-brand-400 mt-1">
            Manage official schedules for Lectures, CA Tests, and Examinations.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowCsvModal(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm"
          >
            <FileSpreadsheet size={18} />
            <span>Import CSV</span>
          </button>
          <button
            onClick={() => {
              setFormType(activeTab);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>Add {activeTab === 'lecture' ? 'Lecture' : activeTab === 'ca_test' ? 'CA Test' : 'Exam'}</span>
          </button>
        </div>
      </div>


      {/* Category Tabs */}
      <div className="flex flex-wrap border-b border-brand-200 dark:border-brand-800 gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-all cursor-pointer ${
                isActive
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400 dark:border-brand-400 font-semibold'
                  : 'border-transparent text-brand-500 hover:text-brand-800 dark:hover:text-brand-200'
              }`}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Controls: Level Filter + Search */}
      <div className="bg-white dark:bg-brand-900 rounded-xl shadow-sm border border-brand-200 dark:border-brand-800 p-4 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-500">Filter Level:</span>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
          >
            <option value="">All Levels</option>
            <option value="100">100 Level</option>
            <option value="200">200 Level</option>
            <option value="300">300 Level</option>
            <option value="400">400 Level</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search course or venue..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Content Table */}
      {loading ? (
        <div className="flex justify-center items-center py-20 bg-white dark:bg-brand-900 rounded-xl border border-brand-200 dark:border-brand-800">
          <Loader2 className="animate-spin text-brand-600" size={32} />
        </div>
      ) : (
        <div className="bg-white dark:bg-brand-900 rounded-xl shadow-sm border border-brand-200 dark:border-brand-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-50/75 dark:bg-brand-800/60 text-brand-700 dark:text-brand-200 border-b border-brand-200 dark:border-brand-700">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Course</th>
                  <th className="px-6 py-3.5 font-semibold">
                    {activeTab === 'lecture' ? 'Day & Time' : 'Date & Time'}
                  </th>
                  <th className="px-6 py-3.5 font-semibold">Venue</th>
                  <th className="px-6 py-3.5 font-semibold">Level / Sem</th>
                  <th className="px-6 py-3.5 font-semibold">Status</th>
                  <th className="px-6 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 dark:divide-brand-800">
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-brand-500">
                      No {activeTab === 'lecture' ? 'lecture' : activeTab === 'ca_test' ? 'CA test' : 'exam'} timetable entries found.
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-brand-50/50 dark:hover:bg-brand-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-brand-900 dark:text-brand-100">{entry.course_code}</div>
                        <div className="text-xs text-brand-600 dark:text-brand-400 line-clamp-1">{entry.course_title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium flex items-center gap-1.5 text-brand-800 dark:text-brand-200">
                          {activeTab === 'lecture' ? (
                            <span>{entry.day_of_week || (entry.exam_date ? new Date(entry.exam_date).toLocaleDateString() : 'Weekly')}</span>
                          ) : (
                            <span>{entry.exam_date ? new Date(entry.exam_date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : '-'}</span>
                          )}
                        </div>
                        <div className="text-xs text-brand-500 flex items-center gap-1 mt-0.5">
                          <Clock size={12} />
                          <span>
                            {entry.start_time.substring(0, 5)} - {entry.end_time.substring(0, 5)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-brand-700 dark:text-brand-300">
                          <MapPin size={14} className="text-brand-400" />
                          <span>{entry.venue || 'TBA'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-100 dark:bg-brand-800 text-brand-800 dark:text-brand-200">
                          {entry.level}L &bull; Sem {entry.semester}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => togglePublish(entry.id, entry.is_published)}
                          className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                            entry.is_published
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                          }`}
                        >
                          {entry.is_published ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          <span>{entry.is_published ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                          title="Delete entry"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/broadcast?title=${encodeURIComponent(`Class & Venue Update: ${entry.course_code}`)}&message=${encodeURIComponent(`Important update for ${entry.level}L: ${entry.course_code} (${entry.course_title}) scheduled for ${entry.start_time.substring(0, 5)} - ${entry.end_time.substring(0, 5)} is holding at ${entry.venue || 'TBA'}. Please take note.`)}&category=timetable`}
                            className="text-brand-600 dark:text-brand-400 hover:text-brand-900 dark:hover:text-brand-100 p-1.5 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-800 transition-colors inline-flex items-center gap-1 text-xs"
                            title="Dispatch emergency broadcast to students"
                          >
                            <Radio size={14} />
                            <span className="hidden sm:inline">Broadcast</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                            title="Delete entry"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-brand-900 rounded-2xl w-full max-w-xl shadow-2xl border border-brand-200 dark:border-brand-800 my-8">
            <div className="p-5 border-b border-brand-200 dark:border-brand-800 flex justify-between items-center">
              <h2 className="text-lg font-bold font-heading text-brand-900 dark:text-brand-100">
                Add {formType === 'lecture' ? 'Lecture' : formType === 'ca_test' ? 'CA Test' : 'Exam'} Schedule
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-brand-400 hover:text-brand-600 dark:hover:text-brand-200"
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Type Switcher in Form */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300 mb-1.5">
                  Timetable Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setFormType(tab.id)}
                      className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-all ${
                        formType === tab.id
                          ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                          : 'border-brand-200 dark:border-brand-700 hover:bg-brand-50 dark:hover:bg-brand-800'
                      }`}
                    >
                      {tab.label.replace(' Timetable', '')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Course Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300 mb-1">
                    Course Code *
                  </label>
                  <input
                    required
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="e.g. CSC 101"
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300 mb-1">
                    Course Title *
                  </label>
                  <input
                    required
                    type="text"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="e.g. Intro to Computer Science"
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Date or Day of Week depending on type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {formType === 'lecture' ? (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300 mb-1">
                      Day of Week *
                    </label>
                    <select
                      value={dayOfWeek}
                      onChange={(e) => setDayOfWeek(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                    >
                      {DAYS_OF_WEEK.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300 mb-1">
                      {formType === 'ca_test' ? 'Test Date *' : 'Exam Date *'}
                    </label>
                    <input
                      required
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                    >
                    </input>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    placeholder="e.g. ETF Hall A / Lab 2"
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Time Slots */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300 mb-1">
                    Start Time *
                  </label>
                  <input
                    required
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300 mb-1">
                    End Time *
                  </label>
                  <input
                    required
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Academic Level, Semester, Session */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300 mb-1">
                    Level *
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="100">100 Level</option>
                    <option value="200">200 Level</option>
                    <option value="300">300 Level</option>
                    <option value="400">400 Level</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300 mb-1">
                    Semester *
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="1">1st Semester</option>
                    <option value="2">2nd Semester</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-300 mb-1">
                    Session
                  </label>
                  <input
                    type="text"
                    value={sessionStr}
                    onChange={(e) => setSessionStr(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Publish Toggle */}
              <div className="pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="rounded border-brand-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
                  />
                  <span className="text-sm font-medium text-brand-800 dark:text-brand-200">Publish to student portal immediately</span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 flex justify-end gap-3 border-t border-brand-200 dark:border-brand-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-brand-200 dark:border-brand-700 rounded-lg text-sm text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
                  <span>{isSubmitting ? 'Saving...' : 'Save Schedule'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Bulk Upload Modal (Feature 6) */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-brand-900 rounded-2xl w-full max-w-2xl shadow-2xl border border-brand-200 dark:border-brand-800 my-8 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-brand-200 dark:border-brand-800 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-lg font-bold font-heading text-brand-900 dark:text-brand-100 flex items-center gap-2">
                  <FileSpreadsheet className="text-emerald-600" size={20} />
                  Bulk Import Timetable Entries
                </h2>
                <p className="text-xs text-brand-500 mt-0.5">
                  Upload multiple lectures, tests, or exam dates simultaneously via CSV spreadsheet.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCsvModal(false);
                  setParsedRows([]);
                  setCsvFile(null);
                }}
                className="text-brand-400 hover:text-brand-600 dark:hover:text-brand-200"
              >
                <XCircle size={22} />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Step 1: Template Download */}
              <div className="p-4 rounded-xl bg-brand-50/60 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-800 dark:text-brand-200">
                    Step 1: Download Format Template
                  </h4>
                  <p className="text-xs text-brand-500 mt-0.5">
                    Pre-formatted columns: course_code, course_title, timetable_type, start_time, etc.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={downloadCsvTemplate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-brand-300 dark:border-brand-700 bg-white dark:bg-brand-900 text-xs font-semibold text-brand-700 dark:text-brand-300 hover:bg-brand-50 shadow-xs shrink-0"
                >
                  <Download size={14} /> Download Template (.csv)
                </button>
              </div>

              {/* Step 2: Upload CSV */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-brand-800 dark:text-brand-200 mb-2">
                  Step 2: Select or Drop CSV File
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-brand-200 dark:border-brand-700 hover:border-brand-400 rounded-xl p-6 text-center cursor-pointer bg-brand-50/20 hover:bg-brand-50/50 dark:hover:bg-brand-950/30 transition-all"
                >
                  <UploadCloud className="mx-auto text-brand-400 mb-2" size={32} />
                  <p className="text-sm font-semibold text-brand-800 dark:text-brand-200">
                    {csvFile ? csvFile.name : "Click to select CSV file from your computer"}
                  </p>
                  <p className="text-xs text-brand-400 mt-1">Accepts standard .csv spreadsheets</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleCsvFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Step 3: Preview Parsed Rows */}
              {parsedRows.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-brand-700 dark:text-brand-300">
                      Step 3: Preview ({parsedRows.length} rows detected)
                    </span>
                    <span className="text-emerald-600">
                      {parsedRows.filter((r) => r.isValid).length} valid rows ready
                    </span>
                  </div>

                  <div className="border border-brand-200 dark:border-brand-800 rounded-xl overflow-hidden max-h-48 overflow-y-auto text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-brand-50 dark:bg-brand-800/60 sticky top-0 border-b border-brand-200 dark:border-brand-700">
                        <tr>
                          <th className="p-2">Code</th>
                          <th className="p-2">Title</th>
                          <th className="p-2">Type</th>
                          <th className="p-2">Day/Date</th>
                          <th className="p-2">Time</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-100 dark:divide-brand-800/50">
                        {parsedRows.map((r, i) => (
                          <tr key={i} className={r.isValid ? "" : "bg-red-50/50 dark:bg-red-950/20"}>
                            <td className="p-2 font-mono font-bold">{r.course_code || "-"}</td>
                            <td className="p-2 truncate max-w-[120px]">{r.course_title || "-"}</td>
                            <td className="p-2 uppercase text-[10px]">{r.timetable_type}</td>
                            <td className="p-2">{r.day_of_week || r.exam_date || "-"}</td>
                            <td className="p-2 font-mono">{r.start_time}-{r.end_time}</td>
                            <td className="p-2">
                              {r.isValid ? (
                                <span className="text-emerald-600 font-bold flex items-center gap-1">
                                  <Check size={12} /> Valid
                                </span>
                              ) : (
                                <span className="text-red-500 font-bold flex items-center gap-1">
                                  <AlertTriangle size={12} /> Incomplete
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-brand-200 dark:border-brand-800 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowCsvModal(false);
                  setParsedRows([]);
                  setCsvFile(null);
                }}
                className="px-4 py-2 border border-brand-200 dark:border-brand-700 rounded-lg text-sm text-brand-700 dark:text-brand-300 hover:bg-brand-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkImport}
                disabled={isImportingCsv || parsedRows.filter((r) => r.isValid).length === 0}
                className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 shadow-sm"
              >
                {isImportingCsv ? <Loader2 size={16} className="animate-spin" /> : <FileSpreadsheet size={16} />}
                <span>
                  {isImportingCsv
                    ? "Importing..."
                    : `Batch Import ${parsedRows.filter((r) => r.isValid).length} Entries`}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

