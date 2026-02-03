import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Plus,
  Trash2,
  Play,
  Edit3,
  Upload,
  Image,
  X,
  Clock,
  Calendar,
  FileVideo,
  Eye,
  FileText,
  Briefcase,
  Shield,
  Search,
  Filter,
  Download,
  BarChart3,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

const AdminVideoLectures = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    duration: '',
    category: '',
    videoFile: null,
    thumbnailFile: null
  });
  const [editingVideo, setEditingVideo] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    byCategory: {},
    recentUploads: 0
  });

  // Category definitions with colors and icons
  const categories = {
    'CV_BUILDING': {
      label: 'CV Building',
      color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      icon: FileText,
      description: 'Resume creation and enhancement tips'
    },
    'INTERVIEW_PREP': {
      label: 'Interview Preparation',
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      icon: Briefcase,
      description: 'Interview techniques and practice'
    },
  };

  // ===============================
  // ADMIN TOKEN
  // ===============================
  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  // ===============================
  // FETCH ALL VIDEOS (ADMIN)
  // ===============================
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        throw new Error("Admin access required");
      }

      const res = await axios.get("/api/admin/videos", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const normalized = (res.data.videos || []).map(video => ({
        ...video,
        id: video._id,
        formattedDate: new Date(video.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }));
      
      setVideos(normalized);
      setFilteredVideos(normalized);
      updateStats(normalized);
    } catch (err) {
      console.error("Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // UPDATE STATISTICS
  // ===============================
  const updateStats = (videosList) => {
    const categoryCount = {};
    
    videosList.forEach(video => {
      categoryCount[video.category] = (categoryCount[video.category] || 0) + 1;
    });

    // Count recent uploads (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentUploads = videosList.filter(video => 
      new Date(video.createdAt) > weekAgo
    ).length;

    setStats({
      total: videosList.length,
      byCategory: categoryCount,
      recentUploads
    });
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // ===============================
  // FILTER VIDEOS
  // ===============================


  // ===============================
  // UPLOAD VIDEO
  // ===============================
  const handleUpload = async () => {
    if (!newVideo.title || !newVideo.category || !newVideo.duration || !newVideo.videoFile) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('title', newVideo.title);
      formData.append('description', newVideo.description);
      formData.append('duration', newVideo.duration);
      formData.append('category', newVideo.category);
      
      if (newVideo.videoFile) formData.append('video', newVideo.videoFile);
      if (newVideo.thumbnailFile) formData.append('thumbnail', newVideo.thumbnailFile);

      const token = getToken();
      const response = await axios.post('/api/admin/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });

      // Add formatted date to new video
      const newVideoWithDate = {
        ...response.data,
        id: response.data._id,
        formattedDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      };

      setVideos(prev => [...prev, newVideoWithDate]);
      setUploadDialog(false);
      resetForm();
      alert('Video uploaded successfully!');
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  // ===============================
  // UPDATE VIDEO
  // ===============================
  const handleUpdate = async () => {
    if (!editingVideo || !editingVideo.title || !editingVideo.category || !editingVideo.duration) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setEditing(true);
      const formData = new FormData();
      formData.append('title', editingVideo.title);
      formData.append('description', editingVideo.description);
      formData.append('duration', editingVideo.duration);
      formData.append('category', editingVideo.category);
      
      if (editingVideo.videoFile) formData.append('video', editingVideo.videoFile);
      if (editingVideo.thumbnailFile) formData.append('thumbnail', editingVideo.thumbnailFile);

      const token = getToken();
      const response = await axios.put(
        `/api/admin/videos/${editingVideo.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update video in state
      const updatedVideo = {
        ...response.data,
        id: response.data._id,
        formattedDate: new Date(response.data.updatedAt || response.data.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      };

      setVideos(prev => prev.map(video =>
        video.id === editingVideo.id ? updatedVideo : video
      ));
      setEditDialog(false);
      setEditingVideo(null);
      alert('Video updated successfully!');
    } catch (error) {
      console.error('Error updating video:', error);
      alert('Failed to update video');
    } finally {
      setEditing(false);
    }
  };

  // ===============================
  // DELETE VIDEO
  // ===============================
  const handleDelete = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      const token = getToken();
      await axios.delete(`/api/admin/videos/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setVideos(prev => prev.filter(video => video.id !== videoId));
      alert('Video deleted successfully!');
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Failed to delete video');
    }
  };

  // ===============================
  // PREVIEW VIDEO FUNCTION
  // ===============================
  const openPreview = (video) => {
    setCurrentVideo(video);
    setPreviewDialog(true);
    setPlaying(true);
  };

  const closePreview = () => {
    setPreviewDialog(false);
    setCurrentVideo(null);
    setPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      videoRef.current.load();
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(error => {
          console.error('Error playing video:', error);
          alert('Error playing video. Please check the video file.');
        });
      } else {
        videoRef.current.pause();
      }
    }
  };

  // ===============================
  // OPEN EDIT DIALOG
  // ===============================
  const openEditDialog = (video) => {
    setEditingVideo({
      ...video,
      videoFile: null,
      thumbnailFile: null
    });
    setEditDialog(true);
  };

  // ===============================
  // RESET FORM
  // ===============================
  const resetForm = () => {
    setNewVideo({
      title: '',
      description: '',
      duration: '',
      category: '',
      videoFile: null,
      thumbnailFile: null
    });
  };

  // ===============================
  // HANDLE FILE CHANGE
  // ===============================
  const handleFileChange = (field, file, isEdit = false) => {
    if (isEdit) {
      setEditingVideo(prev => ({
        ...prev,
        [field]: file
      }));
    } else {
      setNewVideo(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  // ===============================
  // FORM VALIDATION
  // ===============================
  const isFormValid = (formData) => {
    return formData.title &&
      formData.category &&
      formData.duration &&
      (formData === newVideo ? formData.videoFile : true);
  };

  // ===============================
  // GET CATEGORY INFO
  // ===============================
  const getCategoryInfo = (categoryKey) => {
    return categories[categoryKey] || categories.GENERAL;
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
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Video Lectures</h3>
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
                    <FileVideo className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white">Video Lectures Management</h1>
                    <p className="text-indigo-100 text-lg max-w-2xl">
                      Admin panel for managing all video lectures across the platform
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setUploadDialog(true)}
                className="group flex items-center gap-3 bg-white hover:bg-gray-100 text-indigo-600 hover:text-indigo-700 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
                <span>Upload Video</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <FileVideo className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{stats.total}</p>
                    <p className="text-indigo-100 text-sm">Total Videos</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <BarChart3 className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{Object.keys(stats.byCategory).length}</p>
                    <p className="text-indigo-100 text-sm">Categories</p>
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


        {/* Videos Grid */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                All Video Lectures
                <span className="ml-2 text-gray-500 font-normal">
                  ({filteredVideos.length} videos)
                </span>
              </h2>
              <p className="text-gray-600">Manage and organize all video lectures</p>
            </div>
          </div>

          {filteredVideos.length === 0 ? (
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-32 h-32 bg-gradient-to-r from-gray-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <FileVideo className="w-12 h-12 text-gray-400" />
                </div>
                <button
                  onClick={() => setUploadDialog(true)}
                  className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-3 justify-center">
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                    Upload New Video
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredVideos.map((video) => {
                const categoryInfo = getCategoryInfo(video.category);
                const CategoryIcon = categoryInfo.icon;
                
                return (
                  <div key={video.id} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl border transition-all duration-500 hover:-translate-y-2 overflow-hidden border-gray-200">
                    {/* Thumbnail Section */}
                    <div className="relative h-48 overflow-hidden rounded-t-2xl">
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`w-full h-full ${categoryInfo.color} flex items-center justify-center`}>
                          <FileVideo className="w-16 h-16 text-white opacity-80" />
                        </div>
                      )}
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${categoryInfo.bgColor} bg-opacity-90 ${categoryInfo.textColor} text-xs font-semibold shadow-lg`}>
                          <CategoryIcon className="w-3.5 h-3.5" />
                          <span>{categoryInfo.label}</span>
                        </div>
                      </div>
                      
                      {/* Duration Badge */}
                      <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{video.duration}</span>
                      </div>
                      
                      {/* Play Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                        <button 
                          onClick={() => openPreview(video)}
                          className="bg-white/90 hover:bg-white rounded-full p-4 transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <Play className="h-6 w-6 text-gray-800 fill-current" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                        {video.title}
                      </h3>
                      
                      {/* Description */}
                      {video.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                          {video.description}
                        </p>
                      )}
                      
                      {/* Date */}
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{video.formattedDate}</span>
                        </div>
                        <button 
                          onClick={() => openPreview(video)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Preview</span>
                        </button>
                      </div>
                    </div>
                    
                    {/* Admin Actions */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-2">
                      <button
                        onClick={() => openPreview(video)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        <Play size={16} />
                        Play
                      </button>
                      <button
                        onClick={() => openEditDialog(video)}
                        className="flex-1 flex items-center justify-center gap-2 bg-yellow-600 text-white px-3 py-2.5 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                      >
                        <Edit3 size={16} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(video.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-3 py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors"
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
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-3xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Upload New Video</h2>
                    <p className="text-blue-100 text-sm">Add a new video lecture to the platform</p>
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
                    value={newVideo.title}
                    onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                    disabled={uploading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter video title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Category *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(categories).map(([key, category]) => {
                      const CategoryIcon = category.icon;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setNewVideo(prev => ({ ...prev, category: key }))}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${newVideo.category === key
                              ? `${category.bgColor} ${category.borderColor} border-opacity-100 ring-2 ring-offset-2 ${category.textColor.replace('text-', 'ring-')}`
                              : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${newVideo.category === key ? category.bgColor : 'bg-gray-100'}`}>
                              <CategoryIcon className={`w-5 h-5 ${newVideo.category === key ? category.textColor : 'text-gray-500'}`} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{category.label}</p>
                              <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Description
                  </label>
                  <textarea
                    value={newVideo.description}
                    onChange={(e) => setNewVideo(prev => ({ ...prev, description: e.target.value }))}
                    disabled={uploading}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Describe what students will learn from this video..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Duration (HH:MM) *
                  </label>
                  <input
                    type="text"
                    value={newVideo.duration}
                    onChange={(e) => setNewVideo(prev => ({ ...prev, duration: e.target.value }))}
                    disabled={uploading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="15:30"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Video File *
                    </label>
                    <label className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:bg-blue-50'
                      } ${newVideo.videoFile ? 'border-green-400 bg-green-50' : 'border-gray-300'}`}>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange('videoFile', e.target.files[0])}
                        disabled={uploading}
                        className="hidden"
                      />
                      <Upload className="w-10 h-10 text-gray-400 mb-3" />
                      {newVideo.videoFile ? newVideo.videoFile.name : 'Click to upload video file'}
                      <p className="text-xs text-gray-500 mt-2">MP4, MOV, AVI, etc. (Max 100MB)</p>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Thumbnail Image
                    </label>
                    <label className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:bg-blue-50'
                      } ${newVideo.thumbnailFile ? 'border-green-400 bg-green-50' : 'border-gray-300'}`}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('thumbnailFile', e.target.files[0])}
                        disabled={uploading}
                        className="hidden"
                      />
                      <Image className="w-10 h-10 text-gray-400 mb-3" />
                      {newVideo.thumbnailFile ? newVideo.thumbnailFile.name : 'Click to upload thumbnail'}
                      <p className="text-xs text-gray-500 mt-2">JPG, PNG, WebP (Max 5MB)</p>
                    </label>
                  </div>
                </div>
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
                  disabled={!isFormValid(newVideo) || uploading}
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
                        Upload Video
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Dialog */}
        {editDialog && editingVideo && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-yellow-600 to-amber-600 rounded-t-3xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Edit3 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Edit Video</h2>
                    <p className="text-yellow-100 text-sm">Update video lecture details</p>
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
                    value={editingVideo.title}
                    onChange={(e) => setEditingVideo(prev => ({ ...prev, title: e.target.value }))}
                    disabled={editing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                    placeholder="Enter video title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Category *
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(categories).map(([key, category]) => {
                      const CategoryIcon = category.icon;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setEditingVideo(prev => ({ ...prev, category: key }))}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${editingVideo.category === key
                              ? `${category.bgColor} ${category.borderColor} border-opacity-100 ring-2 ring-offset-2 ${category.textColor.replace('text-', 'ring-')}`
                              : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${editingVideo.category === key ? category.bgColor : 'bg-gray-100'}`}>
                              <CategoryIcon className={`w-5 h-5 ${editingVideo.category === key ? category.textColor : 'text-gray-500'}`} />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{category.label}</p>
                              <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Description
                  </label>
                  <textarea
                    value={editingVideo.description}
                    onChange={(e) => setEditingVideo(prev => ({ ...prev, description: e.target.value }))}
                    disabled={editing}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                    placeholder="Describe what students will learn from this video..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Duration (HH:MM) *
                  </label>
                  <input
                    type="text"
                    value={editingVideo.duration}
                    onChange={(e) => setEditingVideo(prev => ({ ...prev, duration: e.target.value }))}
                    disabled={editing}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="15:30"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Replace Video File (Optional)
                    </label>
                    <label className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${editing ? 'opacity-50 cursor-not-allowed' : 'hover:border-yellow-400 hover:bg-yellow-50'
                      } ${editingVideo.videoFile ? 'border-green-400 bg-green-50' : 'border-gray-300'}`}>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange('videoFile', e.target.files[0], true)}
                        disabled={editing}
                        className="hidden"
                      />
                      <Upload className="w-10 h-10 text-gray-400 mb-3" />
                      {editingVideo.videoFile ? editingVideo.videoFile.name : 'Click to replace video file'}
                      <p className="text-xs text-gray-500 mt-2">MP4, MOV, AVI, etc. (Max 100MB)</p>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Replace Thumbnail (Optional)
                    </label>
                    <label className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${editing ? 'opacity-50 cursor-not-allowed' : 'hover:border-yellow-400 hover:bg-yellow-50'
                      } ${editingVideo.thumbnailFile ? 'border-green-400 bg-green-50' : 'border-gray-300'}`}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('thumbnailFile', e.target.files[0], true)}
                        disabled={editing}
                        className="hidden"
                      />
                      <Image className="w-10 h-10 text-gray-400 mb-3" />
                      {editingVideo.thumbnailFile ? editingVideo.thumbnailFile.name : 'Click to replace thumbnail'}
                      <p className="text-xs text-gray-500 mt-2">JPG, PNG, WebP (Max 5MB)</p>
                    </label>
                  </div>
                </div>

                {editingVideo.thumbnailUrl && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Current Thumbnail
                    </label>
                    <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={editingVideo.thumbnailUrl}
                        alt="Current thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="px-8 py-6 border-t border-gray-200/50 bg-gray-50 rounded-b-3xl flex justify-end gap-4">
                <button
                  onClick={() => {
                    setEditDialog(false);
                    setEditingVideo(null);
                  }}
                  disabled={editing}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={!isFormValid(editingVideo) || editing}
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {editing ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit3 size={18} />
                        Update Video
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-700 to-amber-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview Dialog */}
        {previewDialog && currentVideo && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-gray-800 to-gray-900 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Preview Video</h2>
                      <p className="text-gray-300 text-sm">{currentVideo.title}</p>
                    </div>
                  </div>
                  <button
                    onClick={closePreview}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-8">
                <div className="relative bg-black rounded-xl overflow-hidden mb-6">
                  <video
                    ref={videoRef}
                    src={currentVideo.videoUrl}
                    className="w-full h-auto max-h-[60vh]"
                    controls
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onEnded={() => setPlaying(false)}
                  >
                    Your browser does not support the video tag.
                  </video>
                  
                  {!playing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <button
                        onClick={togglePlay}
                        className="bg-white/90 hover:bg-white rounded-full p-6 transform transition-transform hover:scale-110 shadow-2xl"
                      >
                        <Play className="h-10 w-10 text-gray-800 fill-current" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentVideo.title}</h3>
                    {currentVideo.description && (
                      <p className="text-gray-600 mb-4">{currentVideo.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-semibold text-gray-900">{currentVideo.duration}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Upload Date</p>
                          <p className="font-semibold text-gray-900">{currentVideo.formattedDate}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <FileVideo className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-sm text-gray-500">Category</p>
                          <p className="font-semibold text-gray-900">{getCategoryInfo(currentVideo.category).label}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 border-t border-gray-200/50 bg-gray-50 rounded-b-3xl flex justify-end gap-4">
                <button
                  onClick={closePreview}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300 hover:bg-gray-100 rounded-lg"
                >
                  Close Preview
                </button>
                <button
                  onClick={() => {
                    closePreview();
                    openEditDialog(currentVideo);
                  }}
                  className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium transition-colors duration-300 rounded-lg"
                >
                  Edit Video
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVideoLectures;