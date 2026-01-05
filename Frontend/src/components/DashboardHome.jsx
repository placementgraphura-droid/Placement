// components/DashboardHome.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Briefcase,
  GraduationCap,
  Users,
  UserCheck,
  Calendar,
  MapPin,
  DollarSign,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Star,
  MessageSquare,
  Target,
  Award,
  Lightbulb,
  Clock,
  Building,
  FileText,
  CheckCircle,
  XCircle,
  ChevronRight,
  Sparkles,
  BookOpen,
  TrendingUp as TrendingUpIcon,
  Zap,
  Package,
  Shield,
  Rocket
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardHome = () => {
  const [stats, setStats] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [error, setError] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [planInfo, setPlanInfo] = useState(null);
  const [purchaseType, setPurchaseType] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const { data } = await axios.get('/api/payments/current-plan');

        if (!data?.success) {
          setHasAccess(false);
          return;
        }

        setPlanInfo(data);

        const hasCourseAccess = Array.isArray(data.purchasedCourses) && data.purchasedCourses.length > 0;
        const hasJobAccess = typeof data.jobCredits === 'number' && data.jobCredits > 0;

        const hasAccess = hasCourseAccess || hasJobAccess;

        setHasAccess(hasAccess);

        if (hasCourseAccess) {
          setPurchaseType('COURSE');
        } else if (hasJobAccess) {
          setPurchaseType('JOB_PACKAGE');
        } else {
          setPurchaseType(null);
        }

        if (hasAccess) {
          await fetchDashboardData();
        }

      } catch (err) {
        console.error('Error fetching plan info:', err);
        setHasAccess(false);
      } finally {
        setLoading(false);
        setLoadingPlan(false);
      }
    };

    fetchPlan();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsResponse, jobsResponse, feedbackResponse] = await Promise.all([
        axios.get('/api/intern/dashboard-stats'),
        axios.get('/api/intern/recent-job-posts'),
        axios.get('/api/intern/recent-feedback')
      ]);

      setStats(processStatsData(statsResponse.data));
      setRecentJobs(processJobsData(jobsResponse.data));
      setRecentFeedback(processFeedbackData(feedbackResponse.data));

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');

      setStats([]);
      setRecentJobs([]);
      setRecentFeedback([]);
    } finally {
      setLoading(false);
    }
  };

  const processStatsData = (data) => {
    const statsArray = [
      {
        title: 'Jobs Applied',
        value: data.jobsApplied || '0',
        icon: Briefcase,
        color: 'bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200',
        iconColor: 'text-blue-600',
        textColor: 'text-blue-800',
        tooltip: 'Total number of internship applications submitted',
      },
      {
        title: 'Mentor Feedback',
        value: data.mentorFeedbackCount || '0',
        subtitle: 'Reviews received',
        icon: UserCheck,
        color: 'bg-gradient-to-r from-[#4FB0DA]/20 to-[#4FB0DA]/10 border border-[#4FB0DA]/30',
        iconColor: 'text-[#0E5C7E]',
        textColor: 'text-[#0A2E40]',
        tooltip: 'Feedback received from assigned mentors',
        trend: data.mentorFeedbackTrend
      },
      {
        title: 'Hiring Feedback',
        value: data.hiringFeedbackCount || '0',
        subtitle: 'From applications',
        icon: Users,
        color: 'bg-gradient-to-r from-[#7EC9E8]/20 to-[#7EC9E8]/10 border border-[#7EC9E8]/30',
        iconColor: 'text-[#0E5C7E]',
        textColor: 'text-[#0A2E40]',
        tooltip: 'Feedback from companies on your applications',
        trend: data.hiringFeedbackTrend
      },
    ];

    if (data.interviewsScheduled || data.interviewsScheduled === 0) {
      statsArray.push({
        title: 'Interviews',
        value: data.interviewsScheduled,
        subtitle: 'Scheduled',
        icon: Target,
        color: 'bg-gradient-to-r from-red-50 to-red-100 border border-red-200',
        iconColor: 'text-red-600',
        textColor: 'text-red-800',
        tooltip: 'Upcoming interviews',
        trend: data.interviewsTrend
      });
    }

    return statsArray;
  };

  const processJobsData = (jobs) => {
    return jobs.map(job => ({
      title: job.title,
      company: job.company,
      status: job.status,
      date: formatDate(job.appliedDate || job.createdAt),
      id: job.id || job._id,
      location: job.location,
      type: job.type,
      salary: job.salaryRange,
      applicationStatus: job.applicationStatus,
      nextStep: job.nextStep,
      deadline: job.deadline ? formatDate(job.deadline) : null,
      skills: job.requiredSkills || [],
      description: job.description,
      remote: job.remote || false,
      duration: job.duration
    }));
  };


  const processFeedbackData = (feedback) => {
    const allFeedback = [];

    if (feedback.mentorFeedback && Array.isArray(feedback.mentorFeedback)) {
      feedback.mentorFeedback.forEach(item => {
        allFeedback.push({
          type: 'mentor',
          comment: item.comment,
          rating: item.rating,
          date: formatDate(item.date || item.createdAt),
          id: item._id || item.id,
          improvementSuggestions: item.improvementSuggestions,
          provider: item.provider || 'Mentor',
          providerRole: 'Technical Mentor',
          category: 'technical',
          strengths: item.strengths || [],
          areasForImprovement: item.areasForImprovement || [],
          actionableItems: item.actionableItems || [],
          followUpRequired: item.followUpRequired,
          sentiment: item.sentiment
        });
      });
    }

    if (feedback.hiringTeamFeedback && Array.isArray(feedback.hiringTeamFeedback)) {
      feedback.hiringTeamFeedback.forEach(item => {
        allFeedback.push({
          type: 'hiring',
          comment: item.comment,
          rating: item.rating,
          date: formatDate(item.date || item.createdAt),
          id: item._id || item.id,
          improvementSuggestions: item.improvementSuggestions,
          provider: item.provider || 'Hiring Team',
          providerRole: 'Recruiter/Hiring Manager',
          category: 'recruitment',
          strengths: item.strengths || [],
          areasForImprovement: item.areasForImprovement || [],
          actionableItems: item.actionableItems || [],
          followUpRequired: item.followUpRequired,
          sentiment: item.sentiment,
          company: item.company
        });
      });
    }

    if (Array.isArray(feedback)) {
      feedback.forEach(item => {
        allFeedback.push({
          type: item.type || 'general',
          comment: item.comment,
          rating: item.rating,
          date: formatDate(item.date || item.createdAt),
          id: item._id || item.id,
          improvementSuggestions: item.improvementSuggestions,
          provider: item.provider || 'System',
          providerRole: item.providerRole || 'Feedback Provider',
          category: item.category || 'general',
          strengths: item.strengths || [],
          areasForImprovement: item.areasForImprovement || [],
          actionableItems: item.actionableItems || [],
          followUpRequired: item.followUpRequired,
          sentiment: item.sentiment
        });
      });
    }

    return allFeedback.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Recently';

      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        if (diffHours === 0) {
          const diffMinutes = Math.floor(diffTime / (1000 * 60));
          return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
        }
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      }
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
      }
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: diffDays > 365 ? 'numeric' : undefined
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Recently';
    }
  };

  const getPurchaseTypeLabel = (type) => {
    switch (type) {
      case 'COURSE':
        return 'Career Course';
      case 'JOB_PACKAGE':
        return 'Job Package';
      default:
        return 'Premium Package';
    }
  };

  const getPurchaseDescription = (type) => {
    switch (type) {
      case 'COURSE':
        return 'You have access to career development courses and mentorship';
      case 'JOB_PACKAGE':
        return 'You have access to job applications and feedback services';
      default:
        return 'You have premium access to all features';
    }
  };

  const handleRefresh = () => {
    if (hasAccess) {
      fetchDashboardData();
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
        <span className="ml-2 text-xs text-gray-500">({rating}/5)</span>
      </div>
    );
  };

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'applied':
        return { color: 'bg-blue-100 text-blue-800 border border-blue-200', icon: FileText };
      case 'reviewed':
        return { color: 'bg-yellow-100 text-yellow-800 border border-yellow-200', icon: Clock };
      case 'shortlisted':
        return { color: 'bg-purple-100 text-purple-800 border border-purple-200', icon: Award };
      case 'interview':
        return { color: 'bg-indigo-100 text-indigo-800 border border-indigo-200', icon: Users };
      case 'accepted':
        return { color: 'bg-green-100 text-green-800 border border-green-200', icon: CheckCircle };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800 border border-red-200', icon: XCircle };
      default:
        return { color: 'bg-gray-100 text-gray-800 border border-gray-200', icon: FileText };
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return 'text-green-600 bg-green-50 border border-green-200';
      case 'negative':
        return 'text-red-600 bg-red-50 border border-red-200';
      case 'neutral':
        return 'text-gray-600 bg-gray-50 border border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border border-gray-200';
    }
  };

  if (loading || loadingPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EAF6FC] via-[#F0F9FF] to-[#EAF6FC] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-[#7EC9E8]/30 rounded-full"></div>
            <div className="absolute top-0 left-0 w-24 h-24 border-4 border-[#0E5C7E] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-6 text-[#0A2E40] font-medium text-lg">Loading your dashboard...</p>
          <p className="text-[#0E5C7E]/80 text-sm mt-2">Getting everything ready for you</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EAF6FC] via-[#F0F9FF] to-[#EAF6FC] flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg border border-[#7EC9E8]/30 overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-[#0E5C7E] via-[#4FB0DA] to-[#0E5C7E] flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="relative z-10 text-center">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-white/30">
                <GraduationCap className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white">Welcome to InternFlow</h1>
              <p className="text-[#EAF6FC] text-lg mt-2">Your journey to career success starts here</p>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              <span className="text-lg font-semibold text-[#0A2E40]">Unlock Premium Features</span>
            </div>

            <h2 className="text-2xl font-bold text-[#0A2E40] text-center mb-6">
              Choose Your Success Package
            </h2>

            <p className="text-[#0E5C7E] text-center mb-10 text-lg">
              Get personalized mentorship, job opportunities, and career guidance tailored for your success
            </p>

            {/* Package Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
              {/* Course Package */}
              <div className="group bg-gradient-to-br from-[#EAF6FC] to-[#F0F9FF] border-2 border-[#7EC9E8] rounded-2xl p-6 hover:border-[#0E5C7E] hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-[#0E5C7E] to-[#4FB0DA] rounded-xl shadow">
                    <GraduationCap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0A2E40]">Career Course</h3>
                    <p className="text-[#0E5C7E] text-sm font-medium">CV Building • Interview Prep</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-[#0A2E40]">Expert-led video courses</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-[#0A2E40]">Live mentorship sessions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-[#0A2E40]">Personalized feedback</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-[#0A2E40]">Career development tools</span>
                  </li>
                </ul>
              </div>

              {/* Job Package */}
              <div className="group bg-gradient-to-br from-[#EAF6FC] to-[#F0F9FF] border-2 border-[#7EC9E8] rounded-2xl p-6 hover:border-[#0E5C7E] hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-gradient-to-r from-[#0E5C7E] to-[#4FB0DA] rounded-xl shadow">
                    <Package className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0A2E40]">Job Package</h3>
                    <p className="text-[#0E5C7E] text-sm font-medium">Applications • Interviews • Feedback</p>
                  </div>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-[#0A2E40]">Premium job listings</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-[#0A2E40]">Guaranteed applications</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-[#0A2E40]">Interview preparation</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-[#0A2E40]">Hiring team feedback</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAF6FC] via-[#F0F9FF] to-[#EAF6FC] p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-[#0E5C7E] to-[#4FB0DA] rounded-xl shadow">
                <TrendingUpIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#0A2E40]">
                  Dashboard Overview
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#EAF6FC] to-[#7EC9E8]/20 border border-[#7EC9E8] rounded-full">
                    <Zap className="w-4 h-4 text-[#0E5C7E]" />
                    <span className="text-sm font-semibold text-[#0A2E40]">
                      {getPurchaseTypeLabel(purchaseType)} Active
                    </span>
                  </div>
                  <p className="text-[#0E5C7E] text-sm">
                    {getPurchaseDescription(purchaseType)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#7EC9E8] rounded-xl hover:bg-[#EAF6FC] transition-all duration-300 hover:shadow disabled:opacity-50"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''} text-[#0E5C7E]`} />
              <span className="text-sm font-medium text-[#0A2E40]">Refresh</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-3" size={20} />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl shadow border border-[#7EC9E8]/30 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <Icon size={24} className={stat.iconColor} />
                  </div>
                  {stat.trend && (
                    <div className={`text-xs px-2.5 py-1.5 rounded-full ${stat.trend > 0 ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
                      <TrendingUp className={`w-3 h-3 inline mr-1 ${stat.trend > 0 ? '' : 'rotate-180'}`} />
                      {stat.trend > 0 ? '+' : ''}{stat.trend}%
                    </div>
                  )}
                </div>
                <p className="text-3xl font-bold text-[#0A2E40]">{stat.value}</p>
                <p className="text-sm font-medium text-[#0E5C7E] mt-1">{stat.title}</p>
                <p className="text-xs text-[#0E5C7E]/70 mt-2">{stat.subtitle}</p>
              </div>
            );
          })}
        </div>

        {/* Package Information Banner */}
        <div className="mb-8 bg-gradient-to-r from-[#0E5C7E] to-[#4FB0DA] rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                {purchaseType === 'COURSE' ? (
                  <GraduationCap className="w-8 h-8 text-white" />
                ) : (
                  <Package className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Your {getPurchaseTypeLabel(purchaseType)} is Active
                </h3>
                <p className="text-[#EAF6FC] mt-1">
                  {purchaseType === 'COURSE'
                    ? 'Access expert courses and mentorship to boost your career'
                    : 'Apply to premium jobs and get detailed feedback from hiring teams'}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(purchaseType === 'COURSE' ? '/courses' : '/jobs')}
              className="group flex items-center gap-2 bg-white text-[#0E5C7E] hover:bg-[#EAF6FC] px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow hover:shadow-lg"
            >
              {purchaseType === 'COURSE' ? 'Explore Courses' : 'Browse Jobs'}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Recent Applications */}
          <div className="bg-white rounded-2xl shadow border border-[#7EC9E8]/30 overflow-hidden">
            <div className="p-5 md:p-6 border-b border-[#7EC9E8]/20 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <Briefcase size={22} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#0A2E40]">Recent Applications</h2>
                  <p className="text-sm text-[#0E5C7E]/80">Your latest job applications</p>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6">
              {recentJobs.length > 0 ? (
                <div className="space-y-4">
                  {recentJobs.slice(0, 4).map((job, index) => {
                    const StatusIcon = getStatusConfig(job.status).icon;
                    const statusColor = getStatusConfig(job.status).color;

                    return (
                      <div
                        key={job.id || index}
                        className="group bg-white rounded-xl border border-[#7EC9E8]/20 p-4 hover:shadow-lg transition-all duration-300 hover:border-[#4FB0DA]"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-[#0A2E40] text-lg group-hover:text-[#0E5C7E] transition-colors">
                                {job.title}
                              </h3>
                              {job.remote && (
                                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded-full font-medium border border-green-200">
                                  Remote
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-[#0E5C7E]">
                              <div className="flex items-center gap-1.5">
                                <Building size={14} />
                                <span className="font-medium">{job.company}</span>
                              </div>
                              {job.location && (
                                <div className="flex items-center gap-1.5">
                                  <MapPin size={14} />
                                  <span>{job.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusColor} shadow-sm`}>
                            <StatusIcon size={14} />
                            <span className="text-xs font-semibold capitalize">{job.status}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                          {job.type && (
                            <div className="flex items-center gap-2 text-sm text-[#0E5C7E]">
                              <Briefcase size={14} className="text-[#0E5C7E]/60" />
                              <span>{job.type}</span>
                            </div>
                          )}
                          {job.salary && (
                            <div className="flex items-center gap-2 text-sm text-[#0E5C7E]">
                              <DollarSign size={14} className="text-[#0E5C7E]/60" />
                              <span>{job.salary}</span>
                            </div>
                          )}
                          {job.duration && (
                            <div className="flex items-center gap-2 text-sm text-[#0E5C7E]">
                              <Calendar size={14} className="text-[#0E5C7E]/60" />
                              <span>{job.duration}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-[#0E5C7E]">
                            <Clock size={14} className="text-[#0E5C7E]/60" />
                            <span>{job.date}</span>
                          </div>
                        </div>

                        {job.skills && job.skills.length > 0 && (
                          <div className="mt-4">
                            <div className="flex flex-wrap gap-1.5">
                              {job.skills.slice(0, 3).map((skill, idx) => (
                                <span key={idx} className="text-xs px-2.5 py-1 bg-[#EAF6FC] text-[#0A2E40] rounded-lg font-medium border border-[#7EC9E8]/30">
                                  {skill}
                                </span>
                              ))}
                              {job.skills.length > 3 && (
                                <span className="text-xs px-2.5 py-1 text-[#0E5C7E]/60 bg-[#F0F9FF] rounded-lg">
                                  +{job.skills.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {job.nextStep && (
                          <div className="mt-4 pt-4 border-t border-[#7EC9E8]/20">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-[#0E5C7E]/60">Next step:</span>
                              <span className="text-sm font-medium text-[#0E5C7E]">{job.nextStep}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="mx-auto w-20 h-20 bg-[#EAF6FC] rounded-full flex items-center justify-center mb-4 border border-[#7EC9E8]/30">
                    <Briefcase size={32} className="text-[#4FB0DA]" />
                  </div>
                  <h3 className="text-xl font-medium text-[#0A2E40] mb-2">No applications yet</h3>
                  <p className="text-[#0E5C7E]/80 mb-6 max-w-md mx-auto">
                    Start applying to internships to track your progress and get feedback
                  </p>
                  <button
                    onClick={() => navigate('/jobs')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0E5C7E] to-[#4FB0DA] text-white rounded-xl font-semibold hover:from-[#0A2E40] hover:to-[#0E5C7E] transition-all duration-300 transform hover:scale-105 shadow"
                  >
                    <Briefcase size={18} />
                    Browse Jobs
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Feedback */}
          <div className="bg-white rounded-2xl shadow border border-[#7EC9E8]/30 overflow-hidden">
            <div className="p-5 md:p-6 border-b border-[#7EC9E8]/20 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-r from-[#EAF6FC] to-[#7EC9E8]/20 rounded-xl border border-[#7EC9E8]/30">
                  <MessageSquare size={22} className="text-[#0E5C7E]" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#0A2E40]">Recent Feedback</h2>
                  <p className="text-sm text-[#0E5C7E]/80">From mentors and hiring teams</p>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6">
              {recentFeedback.length > 0 ? (
                <div className="space-y-4">
                  {recentFeedback.slice(0, 4).map((feedback, index) => (
                    <div
                      key={feedback.id || index}
                      className="bg-white rounded-xl border border-[#7EC9E8]/20 p-4 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl ${feedback.type === 'mentor' ? 'bg-[#EAF6FC] border border-[#7EC9E8]/30' : 'bg-gradient-to-r from-[#F0F9FF] to-[#EAF6FC] border border-[#7EC9E8]/30'}`}>
                          {feedback.type === 'mentor' ? (
                            <UserCheck size={20} className="text-[#0E5C7E]" />
                          ) : (
                            <Users size={20} className="text-[#0E5C7E]" />
                          )}
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-[#0A2E40]">
                                  {feedback.provider}
                                </h4>
                                {feedback.sentiment && (
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getSentimentColor(feedback.sentiment)}`}>
                                    {feedback.sentiment}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#0E5C7E]/80">{feedback.providerRole}</p>
                            </div>
                          </div>

                          <div className="mb-3">
                            {renderStars(feedback.rating)}
                          </div>

                          <p className="text-sm text-[#0A2E40] mb-4 line-clamp-2">
                            {feedback.comment}
                          </p>

                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-[#0E5C7E]/60 flex items-center gap-1">
                                <Clock size={12} />
                                {feedback.date}
                              </span>
                              {feedback.company && (
                                <span className="text-xs text-[#0E5C7E] flex items-center gap-1">
                                  <Building size={12} />
                                  {feedback.company}
                                </span>
                              )}
                            </div>
                          </div>

                          {feedback.improvementSuggestions && (
                            <div className="mt-3 pt-3 border-t border-[#7EC9E8]/20">
                              <div className="flex items-center gap-2 mb-1">
                                <Lightbulb size={14} className="text-yellow-500" />
                                <span className="text-xs font-medium text-[#0A2E40]">Suggestions:</span>
                              </div>
                              <p className="text-xs text-[#0E5C7E] line-clamp-1">
                                {feedback.improvementSuggestions}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="mx-auto w-20 h-20 bg-[#EAF6FC] rounded-full flex items-center justify-center mb-4 border border-[#7EC9E8]/30">
                    <MessageSquare size={32} className="text-[#4FB0DA]" />
                  </div>
                  <h3 className="text-xl font-medium text-[#0A2E40] mb-2">No feedback yet</h3>
                  <p className="text-[#0E5C7E]/80 mb-6 max-w-md mx-auto">
                    {purchaseType === 'COURSE'
                      ? 'Complete course assignments to receive mentor feedback'
                      : 'Apply to jobs to receive feedback from hiring teams'}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => navigate('/feedback')}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0E5C7E] to-[#4FB0DA] text-white rounded-xl font-semibold hover:from-[#0A2E40] hover:to-[#0E5C7E] transition-all duration-300 shadow"
                    >
                      <MessageSquare size={18} />
                      View Feedback Center
                    </button>
                    {purchaseType === 'JOB_PACKAGE' && (
                      <button
                        onClick={() => navigate('/jobs')}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#0E5C7E] to-[#4FB0DA] text-white rounded-xl font-semibold hover:from-[#0A2E40] hover:to-[#0E5C7E] transition-all duration-300 shadow"
                      >
                        <Briefcase size={18} />
                        Apply to Jobs
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;