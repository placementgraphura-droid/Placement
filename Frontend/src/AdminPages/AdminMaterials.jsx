import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Upload,
  Search,
  Filter,
  X,
  Eye,
  Trash2,
  Edit2,
  Download,
  FileText,
  ExternalLink,
  Plus,
  Shield,
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Star
} from 'lucide-react';

const AdminStudyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedUploader, setSelectedUploader] = useState('all');
  const [previewMaterial, setPreviewMaterial] = useState(null);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    subject: '',
    description: '',
    link: '',
    file: null,
  });
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    bySubject: {},  
    recentUploads: 0
  });

  // Subject categories with colors
  const subjectColors = {
    // Programming & Development
    'Web Development': 'bg-gradient-to-r from-blue-500 to-cyan-500',
    'Mobile Development': 'bg-gradient-to-r from-blue-600 to-indigo-600',
    'Backend Development': 'bg-gradient-to-r from-cyan-500 to-blue-500',
    'Frontend Development': 'bg-gradient-to-r from-sky-500 to-blue-500',
    'Full Stack Development': 'bg-gradient-to-r from-indigo-500 to-purple-500',

    // AI & Data Science  
    'AI/ML': 'bg-gradient-to-r from-purple-500 to-pink-500',
    'Data Science': 'bg-gradient-to-r from-purple-600 to-rose-600',
    'Deep Learning': 'bg-gradient-to-r from-violet-500 to-purple-500',
    'Natural Language Processing': 'bg-gradient-to-r from-fuchsia-500 to-pink-500',
    'Computer Vision': 'bg-gradient-to-r from-pink-500 to-rose-500',

    // DevOps & Cloud
    'DevOps': 'bg-gradient-to-r from-green-500 to-emerald-500',
    'Cloud Computing': 'bg-gradient-to-r from-emerald-500 to-teal-500',
    'Containerization': 'bg-gradient-to-r from-teal-500 to-cyan-500',
    'CI/CD': 'bg-gradient-to-r from-cyan-500 to-blue-500',
    'Infrastructure as Code': 'bg-gradient-to-r from-lime-500 to-green-500',

    // Data & Databases
    'Database Management': 'bg-gradient-to-r from-amber-500 to-orange-500',
    'Big Data': 'bg-gradient-to-r from-orange-500 to-red-500',
    'Data Analytics': 'bg-gradient-to-r from-yellow-500 to-amber-500',
    'Data Engineering': 'bg-gradient-to-r from-amber-400 to-orange-400',

    // Cybersecurity
    'Cybersecurity': 'bg-gradient-to-r from-red-500 to-pink-500',
    'Network Security': 'bg-gradient-to-r from-rose-500 to-pink-500',
    'Ethical Hacking': 'bg-gradient-to-r from-pink-400 to-rose-400',

    // Other Technologies
    'Blockchain': 'bg-gradient-to-r from-stone-500 to-gray-500',
    'IoT': 'bg-gradient-to-r from-neutral-500 to-stone-500',
    'Game Development': 'bg-gradient-to-r from-stone-600 to-gray-600',
    'AR/VR': 'bg-gradient-to-r from-stone-400 to-gray-400',

    // Fundamentals
    'Programming Fundamentals': 'bg-gradient-to-r from-teal-400 to-emerald-500',
    'Algorithms & Data Structures': 'bg-gradient-to-r from-emerald-400 to-green-500',
    'Software Engineering': 'bg-gradient-to-r from-cyan-400 to-blue-400',
    'System Design': 'bg-gradient-to-r from-teal-500 to-emerald-600',

    // Business & Soft Skills
    'Project Management': 'bg-gradient-to-r from-slate-500 to-gray-500',
    'UI/UX Design': 'bg-gradient-to-r from-gray-500 to-slate-500',
    'Business Analytics': 'bg-gradient-to-r from-slate-600 to-gray-600'
  };



  // ===============================
  // ADMIN TOKEN
  // ===============================
  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  // ===============================
  // FETCH ALL MATERIALS (ADMIN)
  // ===============================
  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        throw new Error("Admin access required");
      }

      const response = await axios.get('/api/admin/study-materials', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMaterials(response.data.data || []);
      setFilteredMaterials(response.data.data || []);
      updateStats(response.data.data || []);
    } catch (error) {
      console.error('Error fetching materials:', error);
      showSnackbar('Error fetching study materials', 'error');
    } finally {
      setLoading(false);
    }
  };


  // ===============================
  // UPDATE STATISTICS
  // ===============================
  const updateStats = (materialsList) => {
    const subjectCount = {};
    const categoryCount = {};
    
    materialsList.forEach(material => {
      subjectCount[material.subject] = (subjectCount[material.subject] || 0) + 1;
      if (material.category) {
        categoryCount[material.category] = (categoryCount[material.category] || 0) + 1;
      }
    });

    // Count recent uploads (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentUploads = materialsList.filter(material => 
      new Date(material.createdAt) > weekAgo
    ).length;

    setStats({
      total: materialsList.length,
      bySubject: subjectCount,
      recentUploads
    });
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // ===============================
  // FILTER MATERIALS
  // ===============================
  useEffect(() => {
    let filtered = materials;

    if (searchTerm) {
      filtered = filtered.filter(material =>
        material.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedSubject !== 'all') {
      filtered = filtered.filter(material => material.subject === selectedSubject);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(material => material.category === selectedCategory);
    }

    if (selectedUploader !== 'all') {
      filtered = filtered.filter(material => material.uploadedBy?._id === selectedUploader);
    }

    setFilteredMaterials(filtered);
  }, [searchTerm, selectedSubject, selectedCategory, selectedUploader, materials]);

  // ===============================
  // NOTIFICATION HANDLER
  // ===============================
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
    setTimeout(() => setSnackbar({ ...snackbar, open: false }), 6000);
  };

  // ===============================
  // UPLOAD MATERIAL
  // ===============================
  const handleUpload = async () => {
    if (!newMaterial.title || !newMaterial.subject) {
      showSnackbar('Please fill all required fields', 'error');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('title', newMaterial.title);
      formData.append('subject', newMaterial.subject);
      formData.append('category', newMaterial.category);
      formData.append('description', newMaterial.description);
      formData.append('link', newMaterial.link);
      
      if (newMaterial.file) {
        formData.append('file', newMaterial.file);
      }

      const token = getToken();
      const response = await axios.post('/api/admin/study-materials/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      setMaterials(prev => [response.data, ...prev]);
      setUploadDialog(false);
      setNewMaterial({ 
        title: '', 
        subject: '', 
        description: '', 
        link: '', 
        file: null,
      });
      setUploadProgress(0);
      showSnackbar('Material uploaded successfully!');
    } catch (error) {
      console.error('Error uploading material:', error);
      showSnackbar('Error uploading material', 'error');
    } finally {
      setUploading(false);
    }
  };

  // ===============================
  // UPDATE MATERIAL
  // ===============================
  const handleUpdate = async () => {
    if (!editingMaterial || !editingMaterial.title || !editingMaterial.subject) {
      showSnackbar('Please fill all required fields', 'error');
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('title', editingMaterial.title);
      formData.append('subject', editingMaterial.subject);
      formData.append('description', editingMaterial.description);
      formData.append('link', editingMaterial.link);

      
      if (editingMaterial.newFile) {
        formData.append('file', editingMaterial.newFile);
      }

      const token = getToken();
      const response = await axios.put(`/api/admin/study-materials/${editingMaterial._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setMaterials(prev => prev.map(m => 
        m._id === editingMaterial._id ? response.data : m
      ));
      setEditDialog(false);
      setEditingMaterial(null);
      showSnackbar('Material updated successfully!');
    } catch (error) {
      console.error('Error updating material:', error);
      showSnackbar('Error updating material', 'error');
    } finally {
      setUploading(false);
    }
  };

  // ===============================
  // DELETE MATERIAL
  // ===============================
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this material? This action cannot be undone.')) {
      return;
    }

    try {
      const token = getToken();
      await axios.delete(`/api/admin/study-materials/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMaterials(materials.filter(material => material._id !== id));
      showSnackbar('Material deleted successfully!');
    } catch (error) {
      console.error('Error deleting material:', error);
      showSnackbar('Error deleting material', 'error');
    }
  };

  // ===============================
  // PREVIEW MATERIAL
  // ===============================
  const handlePreview = (material) => {
    setPreviewMaterial(material);
    setPreviewDialog(true);
  };

  // ===============================
  // EDIT MATERIAL
  // ===============================
  const handleEdit = (material) => {
    setEditingMaterial({
      ...material,
      newFile: null,
      tags: material.tags || []
    });
    setEditDialog(true);
  };

  // ===============================
  // HANDLE FILE CHANGE
  // ===============================
  const handleFileChange = (event, isEdit = false) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showSnackbar('Please select a PDF file', 'error');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      showSnackbar('File size should be less than 50MB', 'error');
      return;
    }

    if (isEdit) {
      setEditingMaterial(prev => ({ ...prev, newFile: file }));
    } else {
      setNewMaterial(prev => ({ ...prev, file }));
    }
  };

  // ===============================
  // CLEAR FILTERS
  // ===============================
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSubject('all');
    setSelectedCategory('all');
    setSelectedUploader('all');
  };

  // ===============================
  // GET UNIQUE VALUES
  // ===============================
  const uniqueSubjects = [...new Set(materials.map(m => m.subject))].sort();


  // ===============================
  // GET PDF VIEWER URL
  // ===============================
  const getPdfViewerUrl = (pdfUrl) => {
    if (!pdfUrl) return "";
    return `https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`;
  };

  // ===============================
  // LOADING STATE
  // ===============================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
              <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600"></div>
            </div>
            <Shield className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Study Materials</h3>
          <p className="text-gray-500">Preparing admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Admin Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-800 to-gray-900  p-8 md:p-12 mb-10 shadow-2xl">
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">Study Materials Management</h1>
                    <p className="text-indigo-100 text-lg max-w-2xl">
                      Admin panel for managing all study materials across the platform
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setUploadDialog(true)}
                className="group flex items-center gap-3 bg-white hover:bg-gray-100 text-indigo-600 hover:text-indigo-700 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
                <span>Upload Material</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <FileText className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{stats.total}</p>
                    <p className="text-indigo-100 text-sm">Total Materials</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Users className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{uniqueSubjects.length}</p>
                    <p className="text-indigo-100 text-sm">Subjects</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Calendar className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{stats.recentUploads}</p>
                    <p className="text-indigo-100 text-sm">Recent Uploads</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-48 -translate-x-48"></div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Subject Filter */}
            <div>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Subjects</option>
                {uniqueSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <X size={16} />
              Clear Filters
            </button>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || selectedSubject !== 'all' || selectedCategory !== 'all' || selectedUploader !== 'all') && (
            <div className="flex gap-2 flex-wrap">
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-blue-200 text-blue-700 bg-blue-100 text-sm">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="hover:text-blue-900">
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedSubject !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-purple-200 text-purple-700 bg-purple-100 text-sm">
                  Subject: {selectedSubject}
                  <button onClick={() => setSelectedSubject('all')} className="hover:text-purple-900">
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-green-200 text-green-700 bg-green-100 text-sm">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')} className="hover:text-green-900">
                    <X size={12} />
                  </button>
                </span>
              )}
              {selectedUploader !== 'all' && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-orange-200 text-orange-700 bg-orange-100 text-sm">
                  Uploader: {materials.find(m => m.uploadedBy?._id === selectedUploader)?.uploadedBy?.name}
                  <button onClick={() => setSelectedUploader('all')} className="hover:text-orange-900">
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Materials Grid */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                All Study Materials
                <span className="ml-2 text-gray-500 font-normal">
                  ({filteredMaterials.length} materials)
                </span>
              </h2>
              <p className="text-gray-600">Manage and organize all study materials</p>
            </div>
            <button
              onClick={fetchMaterials}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:shadow-md"
            >
              <RefreshCw size={16} />
              <span className="text-sm font-medium">Refresh</span>
            </button>
          </div>

          {filteredMaterials.length === 0 ? (
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-32 h-32 bg-gradient-to-r from-gray-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <FileText className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No Materials Found</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {searchTerm || selectedSubject !== 'all' || selectedCategory !== 'all' || selectedUploader !== 'all'
                    ? 'No materials match your current filters. Try adjusting your search criteria.'
                    : 'No study materials have been uploaded yet. Upload the first material to get started!'
                  }
                </p>
                <button
                  onClick={() => setUploadDialog(true)}
                  className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3 justify-center">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Upload New Material
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map((material) => {
                const isExpanded = expandedId === material._id;
                const subjectBg = subjectColors[material.subject] || 'bg-gradient-to-r from-gray-500 to-slate-500';

                return (
                  <div
                    key={material._id}
                    className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl border transition-all duration-500 hover:-translate-y-2 overflow-hidden ${material.isPublic ? 'border-blue-200' : 'border-yellow-200'}`}
                  >
                    {/* Header with Status */}
                    <div className="p-6 flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${subjectBg}`}>
                            <BookOpen className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                        {material.title}
                      </h3>

                      {/* Description */}
                      <p className={`text-gray-600 text-sm leading-relaxed ${isExpanded ? "" : "line-clamp-3"} mb-4`}>
                        {material.description}
                      </p>

                      {material.description && material.description.length > 120 && (
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : material._id)}
                          className="text-blue-600 text-sm font-medium hover:underline"
                        >
                          {isExpanded ? "View Less ↑" : "View More ↓"}
                        </button>
                      )}

                      {/* Tags */}
                      {material.tags && material.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1">
                          {material.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                              #{tag}
                            </span>
                          ))}
                          {material.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                              +{material.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Links and Info */}
                    <div className="px-6 py-3 border-t bg-gray-50 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {material.link && (
                          <a
                            href={material.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-green-600 hover:text-green-800 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink size={14} />
                            Resource
                          </a>
                        )}

                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(material.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="p-4 flex gap-2">
                      <button
                        onClick={() => handlePreview(material)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Eye size={16} />
                        Preview
                      </button>
                      <button
                        onClick={() => handleEdit(material)}
                        className="flex-1 flex items-center justify-center gap-2 bg-yellow-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                      >
                        <Edit2 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(material._id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upload Dialog */}
        {uploadDialog && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-3xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Upload New Material</h2>
                    <p className="text-blue-100 text-sm">Add a new study material to the platform</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={newMaterial.title}
                    onChange={(e) => setNewMaterial(prev => ({ ...prev, title: e.target.value }))}
                    disabled={uploading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter material title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Subject *
                    </label>
                    <select
                      value={newMaterial.subject}
                      onChange={(e) => setNewMaterial(prev => ({ ...prev, subject: e.target.value }))}
                      disabled={uploading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Subject</option>
                      {Object.keys(subjectColors).map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Description
                  </label>
                  <textarea
                    value={newMaterial.description}
                    onChange={(e) => setNewMaterial(prev => ({ ...prev, description: e.target.value }))}
                    disabled={uploading}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Describe the material content..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Resource Link (Optional)
                  </label>
                  <input
                    type="url"
                    value={newMaterial.link}
                    onChange={(e) => setNewMaterial(prev => ({ ...prev, link: e.target.value }))}
                    disabled={uploading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/resource"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Upload PDF File (Optional)
                  </label>
                  <label className={`block w-full px-4 py-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:bg-blue-50'
                    } ${newMaterial.file ? 'border-green-400 bg-green-50' : 'border-gray-300'}`}>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    {newMaterial.file ? newMaterial.file.name : 'Choose PDF File'}
                    <p className="text-xs text-gray-500 mt-2">Maximum file size: 50MB</p>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={newMaterial.isPublic}
                    onChange={(e) => setNewMaterial(prev => ({ ...prev, isPublic: e.target.checked }))}
                    disabled={uploading}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isPublic" className="text-sm text-gray-700">
                    Make this material publicly accessible
                  </label>
                </div>

                {(uploadProgress > 0 || uploading) && (
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-center text-gray-600 text-sm mt-2">
                      {uploading ? `Uploading... ${uploadProgress}%` : 'Preparing upload...'}
                    </p>
                  </div>
                )}
              </div>

              <div className="px-8 py-6 border-t border-gray-200/50 bg-gray-50 rounded-b-3xl flex justify-end gap-4">
                <button
                  onClick={() => setUploadDialog(false)}
                  disabled={uploading}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!newMaterial.title || !newMaterial.subject || uploading}
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {uploading ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={18} />
                        Upload Material
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-0"></div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Dialog */}
        {editDialog && editingMaterial && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-t-3xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Edit2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Edit Material</h2>
                    <p className="text-yellow-100 text-sm">Update material details</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={editingMaterial.title}
                    onChange={(e) => setEditingMaterial(prev => ({ ...prev, title: e.target.value }))}
                    disabled={uploading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Subject *
                    </label>
                    <select
                      value={editingMaterial.subject}
                      onChange={(e) => setEditingMaterial(prev => ({ ...prev, subject: e.target.value }))}
                      disabled={uploading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {Object.keys(subjectColors).map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Description
                  </label>
                  <textarea
                    value={editingMaterial.description || ''}
                    onChange={(e) => setEditingMaterial(prev => ({ ...prev, description: e.target.value }))}
                    disabled={uploading}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Resource Link
                  </label>
                  <input
                    type="url"
                    value={editingMaterial.link || ''}
                    onChange={(e) => setEditingMaterial(prev => ({ ...prev, link: e.target.value }))}
                    disabled={uploading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Update PDF File (Optional)
                  </label>
                  <div className="space-y-2">
                    {editingMaterial.pdfUrl && (
                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-600 truncate">
                          Current: {editingMaterial.pdfUrl.split('/').pop()}
                        </span>
                      </div>
                    )}
                    <label className={`block w-full px-4 py-3 border-2 border-dashed rounded-xl text-center cursor-pointer transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:bg-blue-50'
                      } ${editingMaterial.newFile ? 'border-green-400 bg-green-50' : 'border-gray-300'}`}>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf"
                        onChange={(e) => handleFileChange(e, true)}
                        disabled={uploading}
                      />
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                      {editingMaterial.newFile ? editingMaterial.newFile.name : 'Choose new PDF file (optional)'}
                    </label>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editIsPublic"
                    checked={editingMaterial.isPublic}
                    onChange={(e) => setEditingMaterial(prev => ({ ...prev, isPublic: e.target.checked }))}
                    disabled={uploading}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="editIsPublic" className="text-sm text-gray-700">
                    Make this material publicly accessible
                  </label>
                </div>
              </div>

              <div className="px-8 py-6 border-t border-gray-200/50 bg-gray-50 rounded-b-3xl flex justify-end gap-4">
                <button
                  onClick={() => {
                    setEditDialog(false);
                    setEditingMaterial(null);
                  }}
                  disabled={uploading}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={!editingMaterial.title || !editingMaterial.subject || uploading}
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {uploading ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        Update Material
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-700 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-0"></div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview Dialog */}
        {previewDialog && previewMaterial && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl h-full flex flex-col">
              <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{previewMaterial.title}</h2>
                      <p className="text-indigo-100 text-sm">
                        {previewMaterial.subject} • {previewMaterial.category || 'No category'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewDialog(false)}
                    className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="flex-1">
                {previewMaterial.pdfUrl ? (
                  <iframe
                    src={getPdfViewerUrl(previewMaterial.pdfUrl)}
                    title={previewMaterial.title}
                    className="w-full h-full"
                    frameBorder="0"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8">
                    <FileText className="w-24 h-24 text-gray-300 mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No PDF Available</h3>
                    <p className="text-gray-600 text-center mb-8">
                      This material doesn't have a PDF file attached.
                    </p>
                    {previewMaterial.link && (
                      <a
                        href={previewMaterial.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                      >
                        <ExternalLink size={18} />
                        Visit Resource Link
                      </a>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Snackbar */}
        {snackbar.open && (
          <div className={`fixed bottom-4 right-4 p-4 rounded-xl shadow-lg flex items-center gap-3 ${snackbar.severity === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}>
            {snackbar.severity === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            {snackbar.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStudyMaterials;