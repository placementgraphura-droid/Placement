// components/VideoLectures.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GraduationCap, Sparkles, CheckCircle, Play, Clock, Calendar, User, BookOpen, ArrowRight, Lock } from 'lucide-react';

const VideoLectures = () => {
  const [videos, setVideos] = useState([]);
  const [planInfo, setPlanInfo] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [allowedCategories, setAllowedCategories] = useState([]);
  const [error, setError] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');

  // Fetch user's plan information
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const { data } = await axios.get('/api/payments/current-plan', {
          withCredentials: true
        });

        if (data.success && data.purchasedCourses?.length > 0) {
          // ✅ Get LAST purchased course
          const lastCourse =
            data.purchasedCourses[data.purchasedCourses.length - 1];

          setPlanInfo(lastCourse);

          const courseType = lastCourse.courseType;
          let allowed = [];

          if (courseType === "RESUME_BUILDING") {
            allowed = ["RESUME_BUILDING"];
          } else if (courseType === "INTERVIEW_PREP") {
            allowed = ["INTERVIEW_PREP"];
          } else if (courseType === "COMBO") {
            allowed = ["RESUME_BUILDING", "INTERVIEW_PREP"];
          }

          setAllowedCategories(allowed);
          setHasAccess(true);
        } else {
          setHasAccess(false);
        }
      } catch (err) {
        console.error("Error fetching plan info:", err);
        setHasAccess(false);
      } finally {
        setLoadingPlan(false);
      }
    };

    fetchPlan();
  }, []);


  // Fetch videos data from backend
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoadingVideos(true);
        const { data } = await axios.get('/api/intern/video-lectures');

        if (data.success) {
          // Filter videos based on allowed categories
          const filteredVideos = data.videos.filter(video =>
            allowedCategories.includes(video.category)
          );
          setVideos(filteredVideos);
        } else {
          setError('Failed to load video lectures');
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Error loading video lectures. Please try again.');
      } finally {
        setLoadingVideos(false);
      }
    };

    if (hasAccess && allowedCategories.length > 0) {
      fetchVideos();
    } else if (hasAccess) {
      setLoadingVideos(false);
    }
  }, [hasAccess, allowedCategories]);

  const handleWatch = (video) => {
    setSelectedVideo(video);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedVideo(null);
  };

  const handleQueryClick = () => {
    if (!selectedVideo?.queryUrl) return;

    // optional: add video title param
    const url = `${selectedVideo.queryUrl}?videoTitle=${encodeURIComponent(selectedVideo.title)}`;

    window.open(url, "_blank");
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // const getSubjectColor = (subject) => {
  //   const colors = {
  //     'Frontend': 'border-l-blue-500 bg-blue-50 text-blue-700',
  //     'Backend': 'border-l-green-500 bg-green-50 text-green-700',
  //     'Architecture': 'border-l-purple-500 bg-purple-50 text-purple-700',
  //     'Database': 'border-l-orange-500 bg-orange-50 text-orange-700',
  //     'Mobile': 'border-l-indigo-500 bg-indigo-50 text-indigo-700',
  //     'Other': 'border-l-gray-500 bg-gray-50 text-gray-700'
  //   };
  //   return colors[subject] || colors['Other'];
  // };

  const getCategoryLabel = (category) => {
    const labels = {
      'RESUME_BUILDING': 'Resume Building',
      'INTERVIEW_PREP': 'Interview Prep'
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'RESUME_BUILDING': 'bg-blue-100 text-blue-800 border-blue-200',
      'INTERVIEW_PREP': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredVideos = activeFilter === 'All'
    ? videos
    : videos.filter(video => video.category === activeFilter);

  // ⏳ While checking plan
  if (loadingPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium text-lg">Checking your subscription...</p>
        </div>
      </div>
    );
  }

  // ❌ No active plan → show upgrade screen
  if (!hasAccess) {
    const courseType = planInfo?.courseDetails?.courseType || 'No Plan';

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Premium Video Courses</h1>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-yellow-600">PREMIUM FEATURE</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              Unlock Premium Video Courses
            </h2>

            <p className="text-gray-600 text-center mb-8">
              Access expert video lectures by purchasing our career development courses.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Resume Building Masterclass</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Interview Preparation Series</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">Downloadable resources</span>
              </div>
            </div>

            {planInfo && (
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Current plan: <span className="font-semibold text-gray-700">{courseType}</span>
                </p>
                {courseType === 'No Plan' && (
                  <p className="text-sm text-red-500 mt-2">
                    You haven't purchased any course yet.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ⏳ Loading videos
  if (loadingVideos) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-12">
            <div className="h-10 bg-gray-200 rounded-lg w-64 mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-96 mb-2 animate-pulse"></div>
          </div>

          {/* Loading Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2 mb-6">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ❌ Error loading videos
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl text-red-600">⚠️</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Unable to Load Videos</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show access message when user has access but no videos in their category
  if (hasAccess && videos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-12 h-12 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              No Videos Available for Your Course
            </h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              You have access to: {allowedCategories.map(cat => getCategoryLabel(cat)).join(' & ')}
            </p>
            <p className="text-gray-500 text-sm mb-8">
              Video content for your purchased course will be available soon.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              {allowedCategories.map(category => (
                <span
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}
                >
                  {getCategoryLabel(category)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Video Lectures</h1>
                <p className="text-gray-600 mt-1">Expert-led sessions for your course</p>
              </div>
            </div>

            {/* Course Access Badge */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-gray-500">Your Access:</span>
                <div className="flex flex-wrap gap-2">
                  {allowedCategories.map(category => (
                    <span
                      key={category}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getCategoryColor(category)}`}
                    >
                      {getCategoryLabel(category)}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500">
                You can access videos from your purchased course(s) only.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Videos</p>
                    <p className="text-2xl font-bold text-gray-900">{videos.length}</p>
                  </div>
                  <Play className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Categories</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {[...new Set(videos.map(v => v.category))].length}
                    </p>
                  </div>
                  <GraduationCap className="w-8 h-8 text-green-500" />
                </div>
              </div>
            </div>

            {/* Category Filters */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveFilter('All')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeFilter === 'All'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  All Videos
                </button>
                {allowedCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeFilter === category
                      ? getCategoryColor(category).replace('bg-100', 'bg-600').replace('text-800', 'text-white')
                      : getCategoryColor(category)
                      }`}
                  >
                    {getCategoryLabel(category)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video._id}
                className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full"
              >

                {/* Thumbnail Container */}
                <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="aspect-video relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-blue-600 ml-1" />
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${getCategoryColor(video.category)} border`}>
                        {getCategoryLabel(video.category)}
                      </span>
                    </div>

                    {/* Duration */}
                    <div className="absolute bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded-lg text-sm font-medium backdrop-blur-sm">
                      {video.duration}
                    </div>
                  </div>
                </div>

                {/* Content */}
               <div className="p-5 flex flex-col flex-1">

                  <h3 className="font-bold text-gray-900 text-lg mb-3 group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>

               <p className="text-gray-600 text-sm mb-5 leading-relaxed line-clamp-2">
                 {video.description || 'No description available.'}
               </p>



                  {/* Watch Button */}
                <div className="mt-auto">
                  <button
                    onClick={() => handleWatch(video)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 group/btn shadow-md hover:shadow-lg"
                  >
                    <span>Watch Lecture</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

                </div>
              </div>
            ))}
          </div>

          {/* No Videos Message for active filter */}
          {filteredVideos.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Play className="w-12 h-12 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No Videos Found</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                {activeFilter === 'All'
                  ? "No videos available for your purchased courses yet."
                  : `No ${getCategoryLabel(activeFilter)} videos available. Try another category.`}
              </p>
              {activeFilter !== 'All' && (
                <button
                  onClick={() => setActiveFilter('All')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  View All Videos
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {showModal && selectedVideo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${getCategoryColor(selectedVideo.category)}`}>
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedVideo.title}</h2>
                  <p className="text-gray-600 mt-1">
                    {getCategoryLabel(selectedVideo.category)} • {selectedVideo.duration}
                  </p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Video Player */}
            <div className="p-6 overflow-y-auto">
              <div className="bg-black rounded-lg overflow-hidden mb-6">
                <video
                  controls
                  autoPlay
                  className="w-full aspect-video"
                  poster={selectedVideo.thumbnailUrl}
                  controlsList="nodownload"
                  disablePictureInPicture
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <source src={selectedVideo.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Video Details */}
              <div className="space-y-5">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                 <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                   {selectedVideo.description || 'No description available.'}
                 </p>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="font-semibold text-gray-700 block mb-1">Category</span>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${getCategoryColor(selectedVideo.category)}`}>
                      {getCategoryLabel(selectedVideo.category)}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="font-semibold text-gray-700 block mb-1">Duration</span>
                    <span className="text-gray-600">{selectedVideo.duration}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <span className="font-semibold text-gray-700 block mb-1">Added</span>
                    <span className="text-gray-600">{formatDate(selectedVideo.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">

              {/* Query Button */}
              {selectedVideo?.queryUrl && (
                <button
                  onClick={handleQueryClick}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Ask Query
                </button>
              )}

              {/* Close Button */}
              <button
                onClick={closeModal}
                className="bg-gray-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Close
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoLectures;