'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import {
  Plus,
  Trash2,
  Search,
  Filter,
  Loader2,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Check,
  ExternalLink,
  Eye,
  X,
  AlertCircle,
} from 'lucide-react';

type Material = {
  id: string;
  title: string;
  description: string | null;
  course_code: string | null;
  course_title: string | null;
  level: number | null;
  semester: number | null;
  material_type: string;
  type?: string;
  session: string | null;
  file_url: string;
  file_name: string;
  file_size: number | null;
  download_count?: number;
  is_published: boolean;
  created_at: string;
};

export default function MaterialsAdminPage() {
  const supabase = createClient();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending'>('all');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [level, setLevel] = useState('100');
  const [semester, setSemester] = useState('1');
  const [materialType, setMaterialType] = useState('lecture_note');
  const [sessionStr, setSessionStr] = useState('2025/2026');
  const [file, setFile] = useState<File | null>(null);

  const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      let query = supabase.from('materials').select('*').order('created_at', { ascending: false });

      if (levelFilter) {
        query = query.eq('level', parseInt(levelFilter));
      }
      if (typeFilter) {
        query = query.eq('material_type', typeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setMaterials(data || []);
    } catch (error: any) {
      toast.error('Failed to load materials', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, [levelFilter, typeFilter]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file) {
      toast.error('Title and file are required');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size exceeds 15MB limit');
      return;
    }

    setIsUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('bucket', 'materials');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData.url) {
        throw new Error(uploadData.error || 'Failed to upload file to storage');
      }

      const { error: insertError } = await supabase.from('materials').insert({
        title: title.trim(),
        description: description.trim() || null,
        course_code: courseCode ? courseCode.trim().toUpperCase() : null,
        course_title: courseTitle ? courseTitle.trim() : null,
        level: parseInt(level),
        semester: parseInt(semester),
        material_type: materialType,
        session: sessionStr,
        file_url: uploadData.url,
        file_name: uploadData.fileName || file.name,
        file_size: uploadData.size || file.size,
        is_published: true,
      });

      if (insertError) throw insertError;

      toast.success('Material uploaded successfully');
      setShowModal(false);
      resetForm();
      fetchMaterials();
    } catch (error: any) {
      toast.error('Upload failed', { description: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCourseCode('');
    setCourseTitle('');
    setLevel('100');
    setSemester('1');
    setMaterialType('lecture_note');
    setSessionStr('2025/2026');
    setFile(null);
  };

  const togglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.from('materials').update({ is_published: !currentStatus }).eq('id', id);
      if (error) throw error;
      toast.success(`Material ${currentStatus ? 'unpublished' : 'published'}`);
      setMaterials(materials.map((m) => (m.id === id ? { ...m, is_published: !currentStatus } : m)));
    } catch (error: any) {
      toast.error('Update failed', { description: error.message });
    }
  };

  const approveSubmission = async (id: string) => {
    try {
      const { error } = await supabase.from('materials').update({ is_published: true }).eq('id', id);
      if (error) throw error;
      toast.success('Material approved and published to portal!');
      setMaterials(materials.map((m) => (m.id === id ? { ...m, is_published: true } : m)));
    } catch (error: any) {
      toast.error('Failed to approve', { description: error.message });
    }
  };

  const handleDelete = async (id: string, fileUrl: string) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    try {
      try {
        const urlObj = new URL(fileUrl);
        const pathParts = urlObj.pathname.split('/');
        const fileName = pathParts[pathParts.length - 1];
        if (fileName) {
          await supabase.storage.from('materials').remove([fileName]);
          await fetch('/api/upload', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: fileName, bucket: 'materials' }),
          });
        }
      } catch (e) {
        console.error('Error deleting file from storage', e);
      }

      const { error } = await supabase.from('materials').delete().eq('id', id);
      if (error) throw error;
      toast.success('Material removed successfully');
      setMaterials(materials.filter((m) => m.id !== id));
    } catch (error: any) {
      toast.error('Delete failed', { description: error.message });
    }
  };

  const pendingCount = materials.filter((m) => !m.is_published).length;

  const filteredMaterials = materials
    .filter((m) => {
      if (activeTab === 'pending') return !m.is_published;
      return true;
    })
    .filter(
      (m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.course_code && m.course_code.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-playfair text-brand-900 dark:text-brand-50">Materials Management</h1>
          <p className="text-xs sm:text-sm text-brand-600 dark:text-brand-400 mt-1">
            Upload course notes, past questions, and review student contributions.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus size={18} />
          <span>Upload Material</span>
        </button>
      </div>

      {/* Tabs: All vs Pending Review */}
      <div className="flex flex-wrap items-center border-b border-brand-200 dark:border-brand-800 gap-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'border-brand-600 text-brand-600 dark:border-brand-400 dark:text-brand-400'
              : 'border-transparent text-brand-500 hover:text-brand-800 dark:hover:text-brand-300'
          }`}
        >
          All Materials ({materials.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'pending'
              ? 'border-amber-600 text-amber-600 dark:border-amber-400 dark:text-amber-400'
              : 'border-transparent text-brand-500 hover:text-brand-800 dark:hover:text-brand-300'
          }`}
        >
          <span>Student Submissions Review</span>
          {pendingCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500 text-white font-bold animate-pulse">
              {pendingCount} new
            </span>
          )}
        </button>

        <div className="sm:ml-auto flex items-center gap-1.5 text-xs text-brand-700 dark:text-brand-300 font-semibold px-3 py-1.5 bg-brand-100/80 dark:bg-brand-800/80 rounded-lg mb-2">
          <Eye size={13} className="text-brand-500" />
          <span>{materials.reduce((sum, m) => sum + (m.download_count || 0), 0)} Total Views &amp; Reads</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-brand-900 rounded-xl shadow-sm border border-brand-200 dark:border-brand-800 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-400" size={18} />
            <input
              type="text"
              placeholder="Search by title or course code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Levels</option>
              <option value="100">100 Level</option>
              <option value="200">200 Level</option>
              <option value="300">300 Level</option>
              <option value="400">400 Level</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Types</option>
              <option value="past_question">Past Question</option>
              <option value="lecture_note">Lecture Note</option>
              <option value="textbook">Textbook</option>
              <option value="assignment">Assignment</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="animate-spin text-brand-600" size={32} />
        </div>
      ) : (
        <div className="bg-white dark:bg-brand-900 rounded-xl shadow-sm border border-brand-200 dark:border-brand-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-50/75 dark:bg-brand-800 text-brand-700 dark:text-brand-200 border-b border-brand-200 dark:border-brand-700">
                <tr>
                  <th className="px-6 py-4 font-semibold">Title &amp; Course</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Level</th>
                  <th className="px-6 py-4 font-semibold">Views</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-100 dark:divide-brand-800">
                {filteredMaterials.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-brand-500">
                      {activeTab === 'pending'
                        ? 'No pending student submissions waiting for review!'
                        : 'No study materials found.'}
                    </td>
                  </tr>
                ) : (
                  filteredMaterials.map((material) => (
                    <tr key={material.id} className="hover:bg-brand-50/50 dark:hover:bg-brand-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-brand-900 dark:text-brand-100">{material.title}</div>
                        <div className="text-xs text-brand-500 flex items-center gap-2 mt-0.5">
                          {material.course_code && <span className="font-medium text-brand-600 dark:text-brand-400">{material.course_code}</span>}
                          {material.description && <span>&bull; {material.description}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 capitalize text-brand-700 dark:text-brand-300">
                        {(material.material_type || material.type || 'material').replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4 text-brand-700 dark:text-brand-300">{material.level}L</td>
                      <td className="px-6 py-4 text-xs font-semibold text-brand-700 dark:text-brand-300">
                        <span className="flex items-center gap-1">
                          <Eye size={13} className="text-brand-400" />
                          <span>{material.download_count || 0}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => togglePublish(material.id, material.is_published)}
                          className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                            material.is_published
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                          }`}
                        >
                          {material.is_published ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          <span>{material.is_published ? 'Published' : 'Pending Review'}</span>
                        </button>
                      </td>
                      <td className="px-6 py-4 text-xs text-brand-500">
                        {new Date(material.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!material.is_published && (
                            <button
                              onClick={() => approveSubmission(material.id)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
                              title="Approve & Publish to portal"
                            >
                              <Check size={14} /> Approve
                            </button>
                          )}
                          <a
                            href={material.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-brand-200 dark:border-brand-700 text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-800"
                            title="Preview file"
                          >
                            <ExternalLink size={16} />
                          </a>
                          <button
                            onClick={() => handleDelete(material.id, material.file_url)}
                            className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                            title="Delete material"
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

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-brand-900 rounded-2xl w-full max-w-2xl shadow-2xl border border-brand-200 dark:border-brand-800 my-8">
            <div className="p-5 border-b border-brand-200 dark:border-brand-800 flex justify-between items-center">
              <h2 className="text-xl font-bold font-playfair">Upload New Material</h2>
              <button onClick={() => setShowModal(false)} className="text-brand-400 hover:text-brand-600">
                <XCircle size={22} />
              </button>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                  Title *
                </label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-transparent text-sm focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-transparent text-sm focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="e.g. CSC 201"
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-transparent text-sm focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="e.g. Object Oriented Programming"
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-transparent text-sm focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                    Level
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                    Semester
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
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                    Material Type
                  </label>
                  <select
                    value={materialType}
                    onChange={(e) => setMaterialType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-white dark:bg-brand-950 text-sm focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="past_question">Past Question</option>
                    <option value="lecture_note">Lecture Note</option>
                    <option value="textbook">Textbook</option>
                    <option value="assignment">Assignment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                    Session
                  </label>
                  <input
                    type="text"
                    value={sessionStr}
                    onChange={(e) => setSessionStr(e.target.value)}
                    placeholder="2025/2026"
                    className="w-full px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-700 bg-transparent text-sm focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-300 mb-1">
                  File * (Max 10MB)
                </label>
                <input
                  required
                  type="file"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-brand-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-100 file:text-brand-800 hover:file:bg-brand-200"
                />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-brand-200 dark:border-brand-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-brand-200 dark:border-brand-700 rounded-lg text-sm text-brand-700 dark:text-brand-300 hover:bg-brand-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {isUploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  <span>{isUploading ? 'Uploading...' : 'Upload Material'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

