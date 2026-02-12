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
  Briefcase
} from 'lucide-react';

const MentorVideoLectures = () => {
  const [videos, setVideos] = useState([]);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [loading, setLoading] = useState(false);
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

  // Category definitions with colors and icons
  const categories = {
    'RESUME_BUILDING': {
      label: 'Resume Building',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: FileText,
      description: 'Resume creation and enhancement tips'
    },
    'INTERVIEW_PREP': {
      label: 'Interview Preparation',
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: Briefcase,
      description: 'Interview techniques and practice'
    }
  };

  // Fetch videos on component mount
  useEffect(() => {
    fetchVideos();
  }, []);

  // API function to fetch videos
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/mentors/videos");
      const normalized = res.data.videos.map(video => ({
        ...video,
        id: video._id,
        // Format the date for display
        formattedDate: new Date(video.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      }));
      setVideos(normalized);
    } catch (err) {
      console.error("Error fetching videos:", err);
    } finally {
      setLoading(false);
    }
  };

  // API function to upload video
  const handleUpload = async () => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('title', newVideo.title);
      formData.append('description', newVideo.description);
      formData.append('duration', newVideo.duration);
      formData.append('category', newVideo.category);
      if (newVideo.videoFile) formData.append('video', newVideo.videoFile);
      if (newVideo.thumbnailFile) formData.append('thumbnail', newVideo.thumbnailFile);

      const response = await axios.post('/api/mentors/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
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

  // API function to update video
  const handleUpdate = async () => {
    try {
      setEditing(true);
      const formData = new FormData();
      formData.append('title', editingVideo.title);
      formData.append('description', editingVideo.description);
      formData.append('duration', editingVideo.duration);
      formData.append('category', editingVideo.category);
      if (editingVideo.videoFile) formData.append('video', editingVideo.videoFile);
      if (editingVideo.thumbnailFile) formData.append('thumbnail', editingVideo.thumbnailFile);

      const response = await axios.put(
        `/api/mentors/videos/${editingVideo.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true
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

  // API function to delete video
  const handleDelete = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      await axios.delete(`/api/mentors/videos/${videoId}`, 
        { withCredentials: true }
      );

      setVideos(prev => prev.filter(video => video.id !== videoId));
      alert('Video deleted successfully!');
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Failed to delete video');
    }
  };

  // Preview video function
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

  // Open edit dialog with video data
  const openEditDialog = (video) => {
    setEditingVideo({
      ...video,
      videoFile: null,
      thumbnailFile: null
    });
    setEditDialog(true);
  };

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

  const isFormValid = (formData) => {
    return formData.title &&
      formData.category &&
      formData.duration &&
      (!uploadDialog || formData.videoFile); // Only require video file for upload
  };

  const getCategoryInfo = (categoryKey) => {
    return categories[categoryKey] || {
      label: categoryKey,
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: FileVideo
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your video lectures...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Career Preparation Videos
            </h1>
            <p className="text-gray-600 mt-2">Help students prepare for their careers with educational content</p>
          </div>
          <button
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl flex items-center space-x-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            onClick={() => setUploadDialog(true)}
          >
            <Plus className="h-5 w-5" />
            <span className="font-semibold">Upload Video</span>
          </button>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {videos.map((video) => {
            const categoryInfo = getCategoryInfo(video.category);
            const CategoryIcon = categoryInfo.icon;
            
            return (
              <div key={video.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 overflow-hidden transform hover:-translate-y-1">
                <div className="relative">
                  <img
                    src={video.thumbnailUrl || '/placeholder-thumbnail.jpg'}
                    alt={video.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1.5 text-xs font-semibold rounded-full border backdrop-blur-sm ${categoryInfo.color} flex items-center space-x-1`}>
                      <CategoryIcon className="h-3 w-3" />
                      <span>{categoryInfo.label}</span>
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <button 
                      onClick={() => openPreview(video)}
                      className="bg-white/90 hover:bg-white rounded-full p-4 transform scale-90 group-hover:scale-100 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <Play className="h-6 w-6 text-gray-800 fill-current" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{video.duration}</span>
                  </div>
                </div>
                
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  )}
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
                
                <div className="px-5 py-4 bg-gray-50/80 border-t border-gray-100 flex justify-between items-center">
                  <button 
                    onClick={() => openPreview(video)}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                  >
                    <Play className="h-4 w-4" />
                    <span className="font-medium">Play</span>
                  </button>
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => openEditDialog(video)}
                      className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-all duration-200 transform hover:scale-110"
                      title="Edit video"
                    >
                      <Edit3 className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(video.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-110"
                      title="Delete video"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {videos.length === 0 && !loading && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-full p-8 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
              <FileVideo className="h-16 w-16 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No video lectures yet</h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Start by uploading career preparation videos for students
            </p>
            <button
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl inline-flex items-center space-x-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-semibold"
              onClick={() => setUploadDialog(true)}
            >
              <Plus className="h-6 w-6" />
              <span>Upload Your First Video</span>
            </button>
          </div>
        )}

        {/* Upload Dialog */}
        {uploadDialog && (
          <div className="fixed inset-0 backdrop-blur-md bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform animate-scale-in">
              <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Upload Career Video</h2>
                  <p className="text-gray-600 text-sm mt-1">Help students with career preparation</p>
                </div>
                <button
                  onClick={() => setUploadDialog(false)}
                  className="text-gray-400 hover:text-gray-600 transition duration-200 p-2 hover:bg-white rounded-lg"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={newVideo.title}
                    onChange={(e) => setNewVideo(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Enter video title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(categories).map(([key, category]) => {
                      const CategoryIcon = category.icon;
                      return (
                        <label
                          key={key}
                          className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                            newVideo.category === key
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="category"
                            value={key}
                            checked={newVideo.category === key}
                            onChange={(e) => setNewVideo(prev => ({ ...prev, category: e.target.value }))}
                            className="sr-only"
                          />
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${category.color.split(' ')[0]}`}>
                              <CategoryIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{category.label}</p>
                              <p className="text-xs text-gray-500">{category.description}</p>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newVideo.description}
                    onChange={(e) => setNewVideo(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Describe what students will learn from this video..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (HH:MM) *</label>
                  <input
                    type="text"
                    value={newVideo.duration}
                    onChange={(e) => setNewVideo(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="15:30"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Video File *</label>
                    <label className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition duration-200 bg-gray-50 hover:bg-blue-50/50">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange('videoFile', e.target.files[0])}
                        className="hidden"
                      />
                      <Upload className="h-10 w-10 text-gray-400 mb-3" />
                      <span className="text-sm text-gray-600 text-center font-medium">
                        {newVideo.videoFile ? (
                          <span className="text-green-600">{newVideo.videoFile.name}</span>
                        ) : (
                          'Click to upload video file'
                        )}
                      </span>
                      <span className="text-xs text-gray-400 mt-2">MP4, MOV, AVI, etc.</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Thumbnail Image *</label>
                    <label className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition duration-200 bg-gray-50 hover:bg-blue-50/50">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('thumbnailFile', e.target.files[0])}
                        className="hidden"
                      />
                      <Image className="h-10 w-10 text-gray-400 mb-3" />
                      <span className="text-sm text-gray-600 text-center font-medium">
                        {newVideo.thumbnailFile ? (
                          <span className="text-green-600">{newVideo.thumbnailFile.name}</span>
                        ) : (
                          'Click to upload thumbnail'
                        )}
                      </span>
                      <span className="text-xs text-gray-400 mt-2">JPG, PNG, WebP, etc.</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 border-t border-gray-200 flex justify-end space-x-4 bg-gray-50 rounded-b-2xl">
                <button
                  onClick={() => setUploadDialog(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!isFormValid(newVideo) || uploading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center space-x-2 font-semibold shadow-lg"
                >
                  {uploading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <span>{uploading ? 'Uploading...' : 'Upload Video'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

         {/* Preview Dialog */}
               {previewDialog && currentVideo && (
                 <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                   <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">

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
              
              <div className="p-6">
                <div className="relative bg-black rounded-xl overflow-hidden group">
                  <video
                    ref={videoRef}
                    src={currentVideo.videoUrl}
                    className="w-full h-auto max-h-[60vh]"
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onEnded={() => setPlaying(false)}
                    controls
                    onClick={togglePlay}
                  >
                    Your browser does not support the video tag.
                  </video>
                  
                  {!playing && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-all duration-300">
                      <button
                        onClick={togglePlay}
                        className="bg-white/90 hover:bg-white rounded-full p-6 transition-all duration-300 shadow-2xl transform hover:scale-110 backdrop-blur-sm"
                      >
                        <Play className="h-12 w-12 text-gray-800 fill-current" />
                      </button>
                    </div>
                  )}
                </div>
                
                {!currentVideo.videoUrl && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
                      <p className="text-yellow-800 text-sm">
                        Video URL not available. Please check if the video is properly uploaded.
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {currentVideo.description || 'No description provided.'}
                  </p>
                </div>
                
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{currentVideo.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{currentVideo.formattedDate}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  Use the video player controls to play, pause, and adjust volume
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Dialog */}
        {editDialog && editingVideo && (
          <div className="fixed inset-0 backdrop-blur-md bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto transform animate-scale-in">
              <div className="px-8 py-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-2xl">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Edit Video</h2>
                  <p className="text-gray-600 text-sm mt-1">Update your video content</p>
                </div>
                <button
                  onClick={() => setEditDialog(false)}
                  className="text-gray-400 hover:text-gray-600 transition duration-200 p-2 hover:bg-white rounded-lg"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={editingVideo.title}
                    onChange={(e) => setEditingVideo(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                    placeholder="Enter video title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(categories).map(([key, category]) => {
                      const CategoryIcon = category.icon;
                      return (
                        <label
                          key={key}
                          className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                            editingVideo.category === key
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="category"
                            value={key}
                            checked={editingVideo.category === key}
                            onChange={(e) => setEditingVideo(prev => ({ ...prev, category: e.target.value }))}
                            className="sr-only"
                          />
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${category.color.split(' ')[0]}`}>
                              <CategoryIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{category.label}</p>
                              <p className="text-xs text-gray-500">{category.description}</p>
                            </div>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editingVideo.description}
                    onChange={(e) => setEditingVideo(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                    placeholder="Describe what students will learn from this video..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (HH:MM) *</label>
                  <input
                    type="text"
                    value={editingVideo.duration}
                    onChange={(e) => setEditingVideo(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200"
                    placeholder="15:30"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Video File (Optional)</label>
                    <label className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 transition duration-200 bg-gray-50 hover:bg-green-50/50">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => handleFileChange('videoFile', e.target.files[0], true)}
                        className="hidden"
                      />
                      <Upload className="h-10 w-10 text-gray-400 mb-3" />
                      <span className="text-sm text-gray-600 text-center font-medium">
                        {editingVideo.videoFile ? (
                          <span className="text-green-600">{editingVideo.videoFile.name}</span>
                        ) : (
                          'Click to change video file'
                        )}
                      </span>
                      <span className="text-xs text-gray-400 mt-2">Leave empty to keep current</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Thumbnail Image (Optional)</label>
                    <label className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 transition duration-200 bg-gray-50 hover:bg-green-50/50">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('thumbnailFile', e.target.files[0], true)}
                        className="hidden"
                      />
                      <Image className="h-10 w-10 text-gray-400 mb-3" />
                      <span className="text-sm text-gray-600 text-center font-medium">
                        {editingVideo.thumbnailFile ? (
                          <span className="text-green-600">{editingVideo.thumbnailFile.name}</span>
                        ) : (
                          'Click to change thumbnail'
                        )}
                      </span>
                      <span className="text-xs text-gray-400 mt-2">Leave empty to keep current</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 border-t border-gray-200 flex justify-end space-x-4 bg-gray-50 rounded-b-2xl">
                <button
                  onClick={() => setEditDialog(false)}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 font-medium transition duration-200"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  disabled={!isFormValid(editingVideo) || editing}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 flex items-center space-x-2 font-semibold shadow-lg"
                >
                  {editing && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  <span>{editing ? "Updating..." : "Update Video"}</span>
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorVideoLectures;