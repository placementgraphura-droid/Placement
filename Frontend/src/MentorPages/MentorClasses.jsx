import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Video,
  Calendar,
  Clock,
  BookOpen,
  Loader,
  Users,
  MapPin,
  Globe,
  GraduationCap,
  Star,
  Zap,
  Target,
  Briefcase,
  Mic,
  Award,
  PlayCircle,
  CheckCircle,
  History,
  Image,
  Upload,
  X,
  Eye
} from 'lucide-react';
import axios from 'axios';

const MentorClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [classDialog, setClassDialog] = useState({ open: false, class: null });
  const [newClass, setNewClass] = useState({
    title: '',
    category: '',
    classType: 'online',
    startTime: '',
    endTime: '',
    meetingLink: '',
    description: '',
    thumbnail: null,
    thumbnailUrl: '',
    thumbnailPreview: ''
  });
  const [activeTab, setActiveTab] = useState('upcoming'); // 'live', 'upcoming', 'past'

  // ===============================
  // TOKEN
  // ===============================
  const getToken = () => {
    return localStorage.getItem("mentorToken") || localStorage.getItem("token");
  };

  // ===============================
  // FETCH CLASSES
  // ===============================
  const fetchClasses = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        throw new Error("No token found");
      }

      const res = await axios.get("/api/mentors/classes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setClasses(res.data.classes || []);
      console.log(res.data.classes)
    } catch (err) {
      console.error("Failed to fetch classes:", err);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // PREPARE FORM DATA
  // ===============================
  const prepareFormData = (classData) => {
    const formData = new FormData();

    // Add all text fields
    formData.append('title', classData.title);
    formData.append('category', classData.category);
    formData.append('classType', classData.classType);
    formData.append('startTime', classData.startTime);
    formData.append('endTime', classData.endTime);
    formData.append('meetingLink', classData.meetingLink || '');
    formData.append('description', classData.description || '');

    // Add thumbnail if exists
    if (classData.thumbnail) {
      formData.append('thumbnail', classData.thumbnail);
    }

    // Add existing thumbnail URL if editing and no new thumbnail
    if (!classData.thumbnail && classData.thumbnailUrl) {
      formData.append('thumbnailUrl', classData.thumbnailUrl);
    }

    return formData;
  };

  // ===============================
  // CREATE CLASS
  // ===============================
  const createClass = async (classData) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No token found");
      }

      const formData = prepareFormData(classData);

      const res = await axios.post("/api/mentors/classes", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });
      return res.data;
    } catch (err) {
      console.error("Failed to create class:", err);
      throw err;
    }
  };

  // ===============================
  // UPDATE CLASS
  // ===============================
  const updateClass = async (classId, classData) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No token found");
      }

      const formData = prepareFormData(classData);

      const res = await axios.put(`/api/mentors/classes/${classId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });
      return res.data;
    } catch (err) {
      console.error("Failed to update class:", err);
      throw err;
    }
  };

  // ===============================
  // DELETE CLASS
  // ===============================
  const deleteClass = async (classId) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("No token found");
      }

      await axios.delete(`/api/mentors/classes/${classId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Failed to delete class:", err);
      throw err;
    }
  };

  // ===============================
  // HANDLE SAVE CLASS
  // ===============================
  const handleSaveClass = async () => {
    try {
      setSubmitting(true);

      if (classDialog.class) {
        const updatedClass = await updateClass(classDialog.class._id, newClass);
        setClasses((prev) =>
          prev.map((cls) =>
            cls._id === updatedClass._id ? updatedClass : cls
          )
        );
      } else {
        const createdClass = await createClass(newClass);
        setClasses((prev) => [...prev, createdClass]);
      }

      setClassDialog({ open: false, class: null });
      resetForm();
    } catch (error) {
      console.error("Error saving class:", error);
      alert("Failed to save class. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };


  const toLocalDateTimeInput = (utcDateString) => {
    if (!utcDateString) return "";

    const date = new Date(utcDateString);

    const offset = date.getTimezoneOffset(); // minutes
    const localDate = new Date(date.getTime() - offset * 60 * 1000);

    return localDate.toISOString().slice(0, 16);
  };


  // ===============================
  // HANDLE EDIT
  // ===============================
  const handleEdit = (classItem) => {
    setNewClass({
      title: classItem.title || '',
      category: classItem.category || '',
      classType: classItem.classType || 'online',
      startTime: toLocalDateTimeInput(classItem.startTime),
      endTime: toLocalDateTimeInput(classItem.endTime),
      meetingLink: classItem.meetingLink || '',
      description: classItem.description || '',
      thumbnail: null,
      thumbnailUrl: classItem.thumbnailUrl || '',
      thumbnailPreview: classItem.thumbnailUrl || ''
    });
    setClassDialog({ open: true, class: classItem });
  };

  // ===============================
  // HANDLE DELETE
  // ===============================
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this class?")) {
      try {
        await deleteClass(id);
        setClasses((prev) => prev.filter((cls) => cls._id !== id));
      } catch (error) {
        console.error("Error deleting class:", error);
        alert("Failed to delete class. Please try again.");
      }
    }
  };

  // ===============================
  // RESET FORM
  // ===============================
  const resetForm = () => {
    setNewClass({
      title: '',
      category: '',
      classType: 'online',
      startTime: '',
      endTime: '',
      meetingLink: '',
      description: '',
      thumbnail: null,
      thumbnailUrl: '',
      thumbnailPreview: ''
    });
  };

  // ===============================
  // HANDLE THUMBNAIL CHANGE
  // ===============================
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, PNG, JPG, WebP)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      setNewClass(prev => ({
        ...prev,
        thumbnail: file,
        thumbnailPreview: previewUrl,
        thumbnailUrl: '' // Clear existing URL when uploading new file
      }));
    }
  };

  // ===============================
  // REMOVE THUMBNAIL
  // ===============================
  const removeThumbnail = () => {
    if (newClass.thumbnailPreview) {
      URL.revokeObjectURL(newClass.thumbnailPreview);
    }
    setNewClass(prev => ({
      ...prev,
      thumbnail: null,
      thumbnailUrl: '',
      thumbnailPreview: ''
    }));
  };

  // ===============================
  // FORMAT DATE TIME
  // ===============================
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";

    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // ===============================
  // GET TIME UNTIL CLASS
  // ===============================
  const getTimeUntilClass = (startTime) => {
    const now = new Date();
    const classTime = new Date(startTime);
    const diff = classTime - now;

    if (diff < 0) return { text: 'Past', color: 'bg-gray-100 text-gray-800 border-gray-200' };
    if (diff < 3600000) return { text: 'Starting Soon', color: 'bg-orange-100 text-orange-800 border-orange-200' };
    if (diff < 86400000) return { text: 'Today', color: 'bg-blue-100 text-blue-800 border-blue-200' };

    const days = Math.floor(diff / 86400000);
    return { text: `In ${days} days`, color: 'bg-green-100 text-green-800 border-green-200' };
  };

  // ===============================
  // GET CATEGORY DETAILS
  // ===============================
  const getCategoryDetails = (category) => {
    const categories = {
      'CV_BUILDING': {
        label: 'CV Building',
        icon: Briefcase,
        color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-200',
        iconColor: 'text-blue-600'
      },
      'INTERVIEW_PREP': {
        label: 'Interview Prep',
        icon: Mic,
        color: 'bg-gradient-to-r from-green-500 to-emerald-500',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        borderColor: 'border-green-200',
        iconColor: 'text-green-600'
      },
      'COMBO': {
        label: 'Combo Session',
        icon: Award,
        color: 'bg-gradient-to-r from-purple-500 to-pink-500',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-200',
        iconColor: 'text-purple-600'
      }
    };

    return categories[category] || {
      label: 'General',
      icon: BookOpen,
      color: 'bg-gradient-to-r from-gray-500 to-gray-600',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-200',
      iconColor: 'text-gray-600'
    };
  };

  // ===============================
  // CATEGORIZE CLASSES
  // ===============================
  const categorizeClasses = () => {
    const now = new Date();

    return {
      live: classes.filter(classItem => {
        const start = new Date(classItem.startTime);
        const end = new Date(classItem.endTime);
        return start <= now && end >= now;
      }),
      upcoming: classes.filter(classItem => {
        const start = new Date(classItem.startTime);
        return start > now;
      }),
      past: classes.filter(classItem => {
        const end = new Date(classItem.endTime);
        return end < now;
      })
    };
  };

  // ===============================
  // USE EFFECT
  // ===============================
  useEffect(() => {
    fetchClasses();
  }, []);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (newClass.thumbnailPreview) {
        URL.revokeObjectURL(newClass.thumbnailPreview);
      }
    };
  }, [newClass.thumbnailPreview]);

  // ===============================
  // CATEGORY OPTIONS
  // ===============================
  const categoryOptions = [
    { value: 'CV_BUILDING', label: 'CV Building Masterclass', description: 'Resume writing & portfolio guidance' },
    { value: 'INTERVIEW_PREP', label: 'Interview Preparation', description: 'Mock interviews & Q&A sessions' },
    { value: 'COMBO', label: 'Combo Session', description: 'CV building + Interview prep' }
  ];

  const { live, upcoming, past } = categorizeClasses();
  const activeClasses = {
    live,
    upcoming,
    past
  }[activeTab];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
              <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-600"></div>
            </div>
            <GraduationCap className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Classes</h3>
          <p className="text-gray-500">Preparing your Mentor dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 md:p-12 mb-10 shadow-2xl">
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">Mentor Dashboard</h1>
                </div>
                <p className="text-blue-100 text-lg max-w-2xl">
                  Manage your professional development classes and guide students towards success
                </p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setClassDialog({ open: true, class: null });
                }}
                className="group flex items-center gap-3 bg-white hover:bg-gray-100 text-blue-600 hover:text-blue-700 px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
                <span>Schedule Class</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Calendar className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{classes.length}</p>
                    <p className="text-blue-100 text-sm">Total Classes</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <PlayCircle className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{live.length}</p>
                    <p className="text-blue-100 text-sm">Live Now</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <Clock className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{upcoming.length}</p>
                    <p className="text-blue-100 text-sm">Upcoming</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl">
                    <History className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-white">{past.length}</p>
                    <p className="text-blue-100 text-sm">Completed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/5 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-48 -translate-x-48"></div>
        </div>

        {/* Classes Navigation Tabs */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Classes</h2>
              <p className="text-gray-600">Manage and track all your scheduled sessions</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-2xl p-1.5 border border-gray-200 shadow-sm mb-8">
            <button
              onClick={() => setActiveTab('live')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'live'
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              <PlayCircle size={18} />
              Live Now
              {live.length > 0 && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${activeTab === 'live' ? 'bg-white/20' : 'bg-red-100 text-red-700'
                  }`}>
                  {live.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'upcoming'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              <Clock size={18} />
              Upcoming
              {upcoming.length > 0 && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${activeTab === 'upcoming' ? 'bg-white/20' : 'bg-blue-100 text-blue-700'
                  }`}>
                  {upcoming.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === 'past'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              <CheckCircle size={18} />
              Completed
              {past.length > 0 && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${activeTab === 'past' ? 'bg-white/20' : 'bg-green-100 text-green-700'
                  }`}>
                  {past.length}
                </span>
              )}
            </button>
          </div>

          {/* Tab Content */}
          {activeClasses.length === 0 ? (
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-xl border border-gray-100 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full flex items-center justify-center">
                    {activeTab === 'live' ? (
                      <PlayCircle className="w-12 h-12 text-red-600" />
                    ) : activeTab === 'upcoming' ? (
                      <Clock className="w-12 h-12 text-blue-600" />
                    ) : (
                      <History className="w-12 h-12 text-green-600" />
                    )}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {activeTab === 'live' && 'No Live Classes'}
                  {activeTab === 'upcoming' && 'No Upcoming Classes'}
                  {activeTab === 'past' && 'No Completed Classes'}
                </h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {activeTab === 'live' && 'You don\'t have any live classes right now. Check your upcoming sessions.'}
                  {activeTab === 'upcoming' && 'Schedule new classes to start teaching. Your students are waiting to learn from you!'}
                  {activeTab === 'past' && 'Your completed classes will appear here. Start teaching to build your teaching history.'}
                </p>
                {activeTab === 'upcoming' && (
                  <button
                    onClick={() => {
                      resetForm();
                      setClassDialog({ open: true, class: null });
                    }}
                    className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-3 justify-center">
                      <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                      Create New Class
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                )}
                {activeTab === 'live' && (
                  <button
                    onClick={() => setActiveTab('upcoming')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-lg"
                  >
                    View Upcoming Classes
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {activeClasses.map((classItem) => {
                const timeInfo = getTimeUntilClass(classItem.startTime);
                const categoryDetails = getCategoryDetails(classItem.category);
                const CategoryIcon = categoryDetails.icon;
                const isLive = new Date(classItem.startTime) <= new Date() && new Date(classItem.endTime) >= new Date();
                const isPast = new Date(classItem.endTime) < new Date();

                return (
                  <div
                    key={classItem._id}
                    className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl border transition-all duration-500 hover:-translate-y-2 overflow-hidden ${isLive ? 'border-red-200' : isPast ? 'border-green-200' : 'border-gray-200'
                      }`}
                  >
                    {/* Thumbnail Section */}
                    {(classItem.thumbnailUrl || categoryDetails.color) && (
                      <div className="relative h-48 overflow-hidden rounded-t-2xl">
                        {classItem.thumbnailUrl ? (
                          <img
                            src={classItem.thumbnailUrl}
                            alt={classItem.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className={`w-full h-full ${categoryDetails.color} flex items-center justify-center`}>
                            <GraduationCap className="w-16 h-16 text-white opacity-80" />
                          </div>
                        )}

                        {/* Status Badge on Thumbnail */}
                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white ${isLive ? 'bg-gradient-to-r from-red-500 to-orange-500 animate-pulse' :
                            isPast ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                              'bg-gradient-to-r from-blue-500 to-cyan-500'
                          }`}>
                          {isLive ? '● LIVE NOW' : isPast ? '✓ COMPLETED' : '↑ UPCOMING'}
                        </div>

                        {/* Category Badge on Thumbnail */}
                        <div className="absolute top-4 left-4">
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${categoryDetails.bgColor} bg-opacity-90 ${categoryDetails.textColor} text-xs font-semibold shadow-lg`}>
                            <CategoryIcon className="w-3.5 h-3.5" />
                            <span>{categoryDetails.label}</span>
                          </div>
                        </div>

                        {/* Thumbnail Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}

                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start mb-5">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {classItem.title}
                          </h3>
                          {!classItem.thumbnailUrl && (
                            <div className="flex items-center gap-3 mt-2">
                              <div className={`p-2 rounded-lg ${categoryDetails.bgColor}`}>
                                <CategoryIcon className={`w-5 h-5 ${categoryDetails.iconColor}`} />
                              </div>
                              <span className={`text-sm font-semibold ${categoryDetails.textColor}`}>
                                {categoryDetails.label}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Description */}
                      {classItem.description && (
                        <div className="mb-6">
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                            {classItem.description}
                          </p>
                        </div>
                      )}

                      {/* Time Details */}
                      <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-900">
                              {formatDateTime(classItem.startTime)}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Duration: {Math.round((new Date(classItem.endTime) - new Date(classItem.startTime)) / 60000)} mins
                            </div>
                            {!isPast && (
                              <div className={`mt-2 text-xs font-medium ${timeInfo.color.replace('bg-', 'text-').replace(' border', '')}`}>
                                {timeInfo.text}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Meeting Link for Live/Upcoming */}
                        {!isPast && classItem.meetingLink && classItem.classType === 'online' && (
                          <div className={`flex items-center gap-3 p-3 rounded-xl border ${isLive
                              ? 'bg-red-50 border-red-100'
                              : 'bg-blue-50 border-blue-100'
                            }`}>
                            <Video className={`w-4 h-4 ${isLive ? 'text-red-600' : 'text-blue-600'}`} />
                            <a
                              href={classItem.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-sm font-medium flex-1 truncate ${isLive
                                  ? 'text-red-700 hover:text-red-900'
                                  : 'text-blue-700 hover:text-blue-900'
                                } transition-colors`}
                            >
                              {isLive ? 'Join Live Session →' : 'Meeting Link →'}
                            </a>
                          </div>
                        )}

                        {/* Past Class Info */}
                        {isPast && (
                          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-green-700">Class Completed</p>
                              <p className="text-xs text-green-600 mt-1">
                                Ended on {formatDateTime(classItem.endTime)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-5 border-t border-gray-100">
                        <button
                          onClick={() => handleEdit(classItem)}
                          className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 hover:text-blue-900 px-4 py-3 rounded-lg transition-all duration-300 font-medium group/edit"
                        >
                          <Edit2 size={16} className="group-hover/edit:scale-110 transition-transform" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(classItem._id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-900 px-4 py-3 rounded-lg transition-all duration-300 font-medium group/delete"
                        >
                          <Trash2 size={16} className="group-hover/delete:scale-110 transition-transform" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Class Dialog */}
        {classDialog.open && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20">
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-3xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {classDialog.class ? 'Edit Class' : 'Create New Class'}
                    </h2>
                    <p className="text-blue-100 text-sm">
                      {classDialog.class ? 'Update your teaching session details' : 'Schedule a new professional development session'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="p-8 space-y-6">
                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Image className="w-4 h-4" />
                    Class Thumbnail (Optional)
                  </label>

                  <div className="space-y-4">
                    {/* Thumbnail Preview */}
                    {(newClass.thumbnailPreview || newClass.thumbnailUrl) && (
                      <div className="relative">
                        <div className="relative w-full h-48 md:h-56 rounded-xl overflow-hidden border border-gray-200">
                          <img
                            src={newClass.thumbnailPreview || newClass.thumbnailUrl}
                            alt="Thumbnail preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => window.open(newClass.thumbnailPreview || newClass.thumbnailUrl, '_blank')}
                              className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-700 hover:text-gray-900 hover:bg-white transition-colors"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={removeThumbnail}
                          className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <div className="text-xs text-gray-500 mt-2 text-center">
                          Click the eye icon to preview full size
                        </div>
                      </div>
                    )}

                    {/* Upload Area */}
                    {!(newClass.thumbnailPreview || newClass.thumbnailUrl) && (
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-10 h-10 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, JPEG, WebP (Max 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleThumbnailChange}
                          disabled={submitting}
                        />
                      </label>
                    )}

                    {/* Upload Button for existing thumbnail */}
                    {(newClass.thumbnailPreview || newClass.thumbnailUrl) && (
                      <label className="block">
                        <div className="flex items-center gap-3">
                          <span className="flex-1 text-sm text-gray-500">
                            Upload a different image
                          </span>
                          <div className="relative">
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              onChange={handleThumbnailChange}
                              disabled={submitting}
                              id="thumbnail-upload"
                            />
                            <label
                              htmlFor="thumbnail-upload"
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-300 ${submitting
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                }`}
                            >
                              <Image className="w-4 h-4" />
                              <span className="text-sm font-medium">Change Image</span>
                            </label>
                          </div>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Class Title *
                  </label>
                  <input
                    type="text"
                    value={newClass.title}
                    onChange={(e) =>
                      setNewClass((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="e.g., Advanced Resume Writing Workshop"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Category *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {categoryOptions.map((option) => {
                      const catDetails = getCategoryDetails(option.value);
                      const isSelected = newClass.category === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setNewClass(prev => ({ ...prev, category: option.value }))}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${isSelected
                              ? `${catDetails.bgColor} ${catDetails.borderColor} border-opacity-100 ring-2 ring-offset-2 ${catDetails.textColor.replace('text-', 'ring-')}`
                              : 'border-gray-200 hover:border-gray-300'
                            }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${isSelected ? catDetails.bgColor : 'bg-gray-100'}`}>
                              <catDetails.icon className={`w-5 h-5 ${isSelected ? catDetails.iconColor : 'text-gray-500'}`} />
                            </div>
                            <span className="font-semibold text-gray-900">{option.label}</span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Start Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={newClass.startTime}
                      onChange={(e) =>
                        setNewClass((prev) => ({ ...prev, startTime: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  {/* End Time */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      End Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={newClass.endTime}
                      onChange={(e) =>
                        setNewClass((prev) => ({ ...prev, endTime: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Meeting Link */}
                {newClass.classType === 'online' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Meeting Link
                    </label>
                    <input
                      type="url"
                      value={newClass.meetingLink}
                      onChange={(e) =>
                        setNewClass((prev) => ({ ...prev, meetingLink: e.target.value }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="https://meet.google.com/abc-def-ghi"
                    />
                    <p className="text-xs text-gray-500 mt-2">Google Meet, Zoom, or Teams link</p>
                  </div>
                )}

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    Description
                  </label>
                  <textarea
                    value={newClass.description}
                    onChange={(e) =>
                      setNewClass((prev) => ({ ...prev, description: e.target.value }))
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Describe the session agenda, key takeaways, and what students will learn..."
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="px-8 py-6 border-t border-gray-200/50 bg-gray-50 rounded-b-3xl flex justify-end gap-4">
                <button
                  onClick={() => {
                    setClassDialog({ open: false, class: null });
                    resetForm();
                  }}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-300 hover:bg-gray-100 rounded-lg"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveClass}
                  disabled={
                    !newClass.title ||
                    !newClass.category ||
                    !newClass.startTime ||
                    !newClass.endTime ||
                    submitting
                  }
                  className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {submitting ? (
                      <>
                        <Loader size={18} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        {classDialog.class ? (
                          <>
                            <Edit2 size={18} />
                            Update Class
                          </>
                        ) : (
                          <>
                            <Plus size={18} />
                            Schedule Class
                          </>
                        )}
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 disabled:opacity-0"></div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorClasses;