import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  User,
  Mail,
  Phone,
  Calendar,
  RefreshCw,
  GraduationCap,
  MapPin,
  Eye,
  MessageSquare,
  FileText,
  ExternalLink,
  Github,
  Linkedin,
  Award,
  Star,
  Briefcase,
  Users,
  TrendingUp,
  BookOpen,
  Globe,
  Code,
  Sparkles,
  ThumbsUp,
  ChevronRight,
  X,
  Download,
  Share2,
  Bookmark,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  MoreVertical,
  AlertCircle,
  Shield,
  Target,
  Zap,
  Heart,
  UserCog
} from "lucide-react";
import { toast } from "react-toastify";

const AdminInternsPage = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    domain: "all",
    yearOfStudy: "all",
    planCategory: "all",
    status: "all"
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");

  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  const fetchInterns = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get("/api/admin/interns", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setInterns(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch interns:", error);
      toast.error("Failed to load interns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  const openProfileModal = (intern) => {
    setSelectedIntern(intern);
    setActiveTab("profile");
    setShowProfileModal(true);
  };

  const toggleUserStatus = async (internId, currentStatus) => {
    try {
      const token = getToken();
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      
      await axios.patch(
        `/api/admin/interns/${internId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`User marked as ${newStatus}`);
      fetchInterns();
      
      // Update selected intern if modal is open
      if (selectedIntern && selectedIntern._id === internId) {
        setSelectedIntern({ ...selectedIntern, status: newStatus });
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update status");
    }
  };

  const getPlanColor = (plan) => {
    switch (plan?.toUpperCase()) {
      case "PLATINUM":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
      case "GOLD":
        return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white";
      case "SILVER":
        return "bg-gradient-to-r from-gray-400 to-blue-400 text-white";
      default:
        return "bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700";
    }
  };

  const getPlanIcon = (plan) => {
    switch (plan?.toUpperCase()) {
      case "PLATINUM":
        return <Sparkles size={14} />;
      case "GOLD":
        return <Award size={14} />;
      case "SILVER":
        return <Award size={14} />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status) => {
    const isActive = status === "active";
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
        isActive 
          ? "bg-green-100 text-green-800" 
          : "bg-red-100 text-red-800"
      }`}>
        {isActive ? (
          <>
            <CheckCircle size={12} className="mr-1" />
            Active
          </>
        ) : (
          <>
            <XCircle size={12} className="mr-1" />
            Inactive
          </>
        )}
      </span>
    );
  };

  const getDomainIcon = (domain) => {
    switch (domain?.toLowerCase()) {
      case "web development":
        return <Globe size={16} className="text-blue-500" />;
      case "mobile development":
        return <Code size={16} className="text-green-500" />;
      case "data science":
        return <TrendingUp size={16} className="text-purple-500" />;
      case "machine learning":
        return <Sparkles size={16} className="text-pink-500" />;
      case "ui/ux design":
        return <Users size={16} className="text-yellow-500" />;
      default:
        return <Briefcase size={16} className="text-gray-500" />;
    }
  };

  const filteredInterns = interns.filter((intern) => {
    if (searchTerm && 
        !intern.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !intern.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !intern.college.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !intern.domain.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    if (selectedFilters.domain !== "all" && intern.domain !== selectedFilters.domain) {
      return false;
    }

    if (selectedFilters.yearOfStudy !== "all" && intern.yearOfStudy !== parseInt(selectedFilters.yearOfStudy)) {
      return false;
    }

    if (selectedFilters.planCategory !== "all" && intern.planCategory !== selectedFilters.planCategory) {
      return false;
    }

    if (selectedFilters.status !== "all" && intern.status !== selectedFilters.status) {
      return false;
    }

    return true;
  });

  const stats = [
    { 
      label: "Total Interns", 
      value: interns.length, 
      color: "#09435F",
      icon: <Users className="text-[#09435F]" size={24} />
    },
    { 
      label: "Active Users", 
      value: interns.filter(i => i.status === "active").length, 
      color: "#10B981",
      icon: <CheckCircle className="text-[#10B981]" size={24} />
    },
    { 
      label: "Avg Rating", 
      value: (interns.reduce((sum, i) => {
        const feedbacks = i.hiringTeamFeedback || [];
        const mentorFeedbacks = i.mentorFeedback || [];
        const allFeedbacks = [...feedbacks, ...mentorFeedbacks];
        const avg = allFeedbacks.length > 0 
          ? allFeedbacks.reduce((s, f) => s + f.rating, 0) / allFeedbacks.length 
          : 0;
        return sum + avg;
      }, 0) / interns.filter(i => (i.hiringTeamFeedback?.length || 0) + (i.mentorFeedback?.length || 0) > 0).length || 0).toFixed(1), 
      color: "#F59E0B", 
      suffix: "/5",
      icon: <Star className="text-[#F59E0B]" size={24} />
    },
    { 
      label: "Total Feedbacks", 
      value: interns.reduce((sum, i) => sum + (i.hiringTeamFeedback?.length || 0) + (i.mentorFeedback?.length || 0), 0), 
      color: "#8B5CF6",
      icon: <MessageSquare className="text-[#8B5CF6]" size={24} />
    },
  ];

  const SkillBadge = ({ skill }) => (
    <span className="px-3 py-1.5 bg-gradient-to-r from-[#CDE7F4] to-[#E3F2FD] text-[#09435F] text-xs font-medium rounded-full border border-[#2E84AE]/20">
      {skill.name}
    </span>
  );

  const FeedbackCard = ({ feedback, type }) => (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                type === 'hiring' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {type === 'hiring' ? (
                  <>
                    <Users size={12} className="mr-1" />
                    Hiring Team
                  </>
                ) : (
                  <>
                    <UserCog size={12} className="mr-1" />
                    Mentor
                  </>
                )}
              </span>
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={`mr-1 ${
                    i < feedback.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm font-medium text-gray-700 ml-2">
                {feedback.rating}/5
              </span>
            </div>
          </div>
          
          <p className="text-sm text-gray-900 mb-3">{feedback.comment}</p>
          
          {feedback.improvementSuggestions && (
            <div className="mt-3 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
              <p className="text-xs font-semibold text-yellow-800 mb-1 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                Improvement Suggestions:
              </p>
              <p className="text-sm text-yellow-700">{feedback.improvementSuggestions}</p>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          By: {feedback.givenBy?.name || (type === 'hiring' ? "Hiring Team" : "Mentor")}
        </span>
        <span className="text-xs text-gray-500">
          {new Date(feedback.date || feedback.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </span>
      </div>
    </div>
  );

  const LoadingCard = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
            <div className="flex space-x-1">
              {[1,2,3].map((i) => (
                <div key={i} className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-16"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#09435F] to-[#2E84AE] bg-clip-text text-transparent">
            Admin Talent Pool
          </h1>
          <p className="text-gray-600 mt-2">View and manage all interns</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={fetchInterns}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-[#2E84AE] to-[#09435F] text-white rounded-xl hover:shadow-lg transition-all duration-300"
          >
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-5 border border-gray-100 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-[#09435F]">
                  {stat.value}{stat.suffix || ""}
                </p>
                <p className="text-gray-600 text-sm mt-1">{stat.label}</p>
              </div>
              <div className="p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white shadow-inner">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, college, skills, or domain..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2E84AE] focus:border-transparent shadow-sm transition-all duration-300"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={selectedFilters.yearOfStudy}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, yearOfStudy: e.target.value })}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2E84AE] focus:border-transparent shadow-sm"
            >
              <option value="all">🎓 All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>

            <select
              value={selectedFilters.planCategory}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, planCategory: e.target.value })}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2E84AE] focus:border-transparent shadow-sm"
            >
              <option value="all">💎 All Plans</option>
              <option value="NONE">Basic</option>
              <option value="Silver">Silver</option>
              <option value="NON_BLUE">Non-Blue</option>
              <option value="BLUE">Blue</option>
              <option value="SUPER_BLUE">Super Blue</option>
            </select>

            <select
              value={selectedFilters.status}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, status: e.target.value })}
              className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2E84AE] focus:border-transparent shadow-sm"
            >
              <option value="all">📊 All Status</option>
              <option value="active">✅ Active</option>
              <option value="inactive">⛔ Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => <LoadingCard key={index} />)
        ) : filteredInterns.length > 0 ? (
          filteredInterns.map((intern) => (
            <div 
              key={intern._id} 
              className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden"
            >
              {/* Status Indicator */}
              <div className={`h-1 ${intern.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
              
              <div className="p-6">
                {/* Intern Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img
                        src={intern.profileImage || `https://ui-avatars.com/api/?name=${intern.name}&background=2E84AE&color=fff&bold=true`}
                        alt={intern.name}
                        className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg"
                      />
                      <div className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-full shadow-lg">
                        {getDomainIcon(intern.domain)}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-xl text-[#09435F] group-hover:text-[#2E84AE] transition-colors">
                          {intern.name}
                        </h3>
                        {getStatusBadge(intern.status)}
                      </div>
                      <p className="text-gray-600 text-sm flex items-center mt-1">
                        <GraduationCap size={14} className="mr-2" />
                        {intern.college}
                      </p>
                      <div className="flex items-center mt-2">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getPlanColor(intern.planCategory)}`}>
                          {getPlanIcon(intern.planCategory)}
                          <span className="ml-1.5">{intern.planCategory || "Basic"}</span>
                        </span>
                        <span className="ml-3 text-xs text-gray-500">
                          {intern.jobCredits || 0} credits
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Combined Rating */}
                <div className="mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`mr-1 ${
                          i < Math.floor(
                            (intern.hiringTeamFeedback?.length || 0) + (intern.mentorFeedback?.length || 0) > 0
                              ? [...(intern.hiringTeamFeedback || []), ...(intern.mentorFeedback || [])]
                                  .reduce((sum, f) => sum + f.rating, 0) / 
                                ((intern.hiringTeamFeedback?.length || 0) + (intern.mentorFeedback?.length || 0))
                              : 0
                          )
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      {(intern.hiringTeamFeedback?.length || 0) + (intern.mentorFeedback?.length || 0) > 0
                        ? ([...(intern.hiringTeamFeedback || []), ...(intern.mentorFeedback || [])]
                            .reduce((sum, f) => sum + f.rating, 0) / 
                           ((intern.hiringTeamFeedback?.length || 0) + (intern.mentorFeedback?.length || 0))).toFixed(1)
                        : "No ratings"}
                      <span className="text-gray-400 ml-1">
                        ({(intern.hiringTeamFeedback?.length || 0) + (intern.mentorFeedback?.length || 0)} feedbacks)
                      </span>
                    </span>
                  </div>
                  <div className="flex space-x-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Users size={12} className="mr-1" />
                      Hiring: {intern.hiringTeamFeedback?.length || 0}
                    </span>
                    <span className="flex items-center">
                      <UserCog size={12} className="mr-1" />
                      Mentor: {intern.mentorFeedback?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-700">
                    <Mail size={14} className="mr-3 text-[#2E84AE]" />
                    <span className="text-sm truncate">{intern.email}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <GraduationCap size={14} className="mr-3 text-[#2E84AE]" />
                    <span className="text-sm">{intern.course} • Year {intern.yearOfStudy}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Briefcase size={14} className="mr-3 text-[#2E84AE]" />
                    <span className="text-sm">{intern.domain}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Top Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {intern.skills?.slice(0, 4).map((skill, index) => (
                      <SkillBadge key={index} skill={skill} />
                    ))}
                    {intern.skills?.length > 4 && (
                      <span className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                        +{intern.skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openProfileModal(intern)}
                      className="flex items-center space-x-2 px-4 py-2.5 bg-white border border-gray-200 text-[#2E84AE] rounded-xl hover:bg-gray-50 hover:shadow-lg transition-all duration-300"
                    >
                      <Eye size={16} />
                      <span className="text-sm font-medium">View Profile</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="inline-flex p-4 bg-gradient-to-r from-[#CDE7F4] to-[#E3F2FD] rounded-2xl mb-6">
              <User size={48} className="text-[#2E84AE]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No interns found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedFilters({ 
                  domain: "all", 
                  yearOfStudy: "all", 
                  planCategory: "all",
                  status: "all" 
                });
              }}
              className="px-6 py-3 bg-gradient-to-r from-[#2E84AE] to-[#09435F] text-white rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* View Profile Modal */}
      {showProfileModal && selectedIntern && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-gradient-to-r from-[#09435F] via-[#2E84AE] to-[#CDE7F4]">
              <div className="flex justify-between items-center p-4">
                <div className="flex items-center space-x-3">
                  <h2 className="text-xl font-bold text-white">Intern Profile</h2>
                  {getStatusBadge(selectedIntern.status)}
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleUserStatus(selectedIntern._id, selectedIntern.status)}
                    className={`px-4 py-2 rounded-xl font-medium ${
                      selectedIntern.status === 'active'
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {selectedIntern.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="p-2 bg-white/20 backdrop-blur-sm rounded-xl text-white hover:bg-white/30 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/20">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`px-6 py-3 font-medium text-sm transition-colors ${
                    activeTab === "profile"
                      ? "text-white border-b-2 border-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <User size={16} className="inline mr-2" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("feedbacks")}
                  className={`px-6 py-3 font-medium text-sm transition-colors ${
                    activeTab === "feedbacks"
                      ? "text-white border-b-2 border-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <MessageSquare size={16} className="inline mr-2" />
                  Feedbacks ({(selectedIntern.hiringTeamFeedback?.length || 0) + (selectedIntern.mentorFeedback?.length || 0)})
                </button>
                <button
                  onClick={() => setActiveTab("activity")}
                  className={`px-6 py-3 font-medium text-sm transition-colors ${
                    activeTab === "activity"
                      ? "text-white border-b-2 border-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <Zap size={16} className="inline mr-2" />
                  Activity
                </button>
              </div>
            </div>
            
            <div className="px-8 pb-8">
              {/* Profile Tab Content */}
              {activeTab === "profile" && (
                <div className="mt-6">
                  {/* Profile Header */}
                  <div className="flex items-end justify-between mb-8">
                    <div className="flex items-end space-x-6">
                      <img
                        src={selectedIntern.profileImage || `https://ui-avatars.com/api/?name=${selectedIntern.name}&background=2E84AE&color=fff&bold=true&size=128`}
                        alt={selectedIntern.name}
                        className="w-32 h-32 rounded-2xl border-4 border-white shadow-2xl"
                      />
                      <div>
                        <h2 className="text-3xl font-bold text-[#09435F] mb-2">{selectedIntern.name}</h2>
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex items-center px-4 py-2 rounded-full font-bold ${getPlanColor(selectedIntern.planCategory)}`}>
                            {getPlanIcon(selectedIntern.planCategory)}
                            <span className="ml-2">{selectedIntern.planCategory || "Basic"}</span>
                          </span>
                          <span className="text-gray-600">
                            <GraduationCap size={16} className="inline mr-2" />
                            {selectedIntern.college}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                      {/* About */}
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-[#09435F] mb-4 flex items-center">
                          <User size={20} className="mr-2" />
                          About
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Course</p>
                            <p className="font-medium text-[#09435F]">{selectedIntern.course}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Year of Study</p>
                            <p className="font-medium text-[#09435F]">Year {selectedIntern.yearOfStudy}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Domain</p>
                            <p className="font-medium text-[#09435F]">{selectedIntern.domain}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Credits Available</p>
                            <p className="font-medium text-[#09435F]">{selectedIntern.jobCredits || 0}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Joined Date</p>
                            <p className="font-medium text-[#09435F]">
                              {new Date(selectedIntern.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                            <p className="font-medium text-[#09435F]">
                              {new Date(selectedIntern.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-[#09435F] mb-4">Skills</h3>
                        <div className="flex flex-wrap gap-3">
                          {selectedIntern.skills?.map((skill, index) => (
                            <span
                              key={index}
                              className="px-4 py-2 bg-gradient-to-r from-[#CDE7F4] to-[#E3F2FD] text-[#09435F] rounded-xl font-medium"
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                      {/* Contact Info */}
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-[#09435F] mb-4">Contact</h3>
                        <div className="space-y-4">
                          <div className="flex items-center">
                            <Mail size={18} className="text-[#2E84AE] mr-3" />
                            <span className="text-gray-700">{selectedIntern.email}</span>
                          </div>
                          {selectedIntern.phone && (
                            <div className="flex items-center">
                              <Phone size={18} className="text-[#2E84AE] mr-3" />
                              <span className="text-gray-700">{selectedIntern.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Social Links */}
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg">
                        <h3 className="text-xl font-bold text-[#09435F] mb-4">Profiles</h3>
                        <div className="space-y-3">
                          {selectedIntern.githubUrl && (
                            <a
                              href={selectedIntern.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors"
                            >
                              <div className="flex items-center">
                                <Github size={18} className="mr-3" />
                                <span>GitHub</span>
                              </div>
                              <ExternalLink size={16} />
                            </a>
                          )}
                          {selectedIntern.linkedinUrl && (
                            <a
                              href={selectedIntern.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                            >
                              <div className="flex items-center">
                                <Linkedin size={18} className="mr-3" />
                                <span>LinkedIn</span>
                              </div>
                              <ExternalLink size={16} />
                            </a>
                          )}
                          {selectedIntern.resumeUrl && (
                            <a
                              href={selectedIntern.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                            >
                              <div className="flex items-center">
                                <FileText size={18} className="mr-3" />
                                <span>View Resume</span>
                              </div>
                              <ExternalLink size={16} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Feedbacks Tab Content */}
              {activeTab === "feedbacks" && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-[#09435F]">All Feedbacks</h3>
                      <p className="text-gray-600">View all feedbacks received by this intern</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Hiring Team Feedbacks */}
                    {(selectedIntern.hiringTeamFeedback?.length || 0) > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-[#09435F] mb-4 flex items-center">
                          <Users size={18} className="mr-2" />
                          Hiring Team Feedbacks ({selectedIntern.hiringTeamFeedback?.length || 0})
                        </h4>
                        <div className="space-y-4">
                          {selectedIntern.hiringTeamFeedback?.map((feedback, index) => (
                            <FeedbackCard key={index} feedback={feedback} type="hiring" />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mentor Feedbacks */}
                    {(selectedIntern.mentorFeedback?.length || 0) > 0 && (
                      <div>
                        <h4 className="text-lg font-semibold text-[#09435F] mb-4 flex items-center">
                          <UserCog size={18} className="mr-2" />
                          Mentor Feedbacks ({selectedIntern.mentorFeedback?.length || 0})
                        </h4>
                        <div className="space-y-4">
                          {selectedIntern.mentorFeedback?.map((feedback, index) => (
                            <FeedbackCard key={index} feedback={feedback} type="mentor" />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* No Feedbacks */}
                    {(selectedIntern.hiringTeamFeedback?.length || 0) === 0 && (selectedIntern.mentorFeedback?.length || 0) === 0 && (
                      <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl">
                        <MessageSquare size={48} className="text-gray-300 mx-auto mb-4" />
                        <h4 className="text-xl font-semibold text-gray-700 mb-2">No feedback yet</h4>
                        <p className="text-gray-500 mb-6">No one has provided feedback for this intern yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Activity Tab Content */}
              {activeTab === "activity" && (
                <div className="mt-6">
                  <h3 className="text-2xl font-bold text-[#09435F] mb-6">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-100">
                          <div className="flex items-center mb-2">
                            <Heart size={18} className="text-red-500 mr-2" />
                            <span className="font-semibold text-gray-700">Hiring Team Feedbacks</span>
                          </div>
                          <p className="text-3xl font-bold text-[#09435F]">{selectedIntern.hiringTeamFeedback?.length || 0}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100">
                          <div className="flex items-center mb-2">
                            <UserCog size={18} className="text-purple-500 mr-2" />
                            <span className="font-semibold text-gray-700">Mentor Feedbacks</span>
                          </div>
                          <p className="text-3xl font-bold text-[#09435F]">{selectedIntern.mentorFeedback?.length || 0}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100">
                          <div className="flex items-center mb-2">
                            <BookOpen size={18} className="text-green-500 mr-2" />
                            <span className="font-semibold text-gray-700">Purchases</span>
                          </div>
                          <p className="text-3xl font-bold text-[#09435F]">{selectedIntern.purchases?.length || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-200">
                <div className="flex space-x-3">
                  <button
                    onClick={() => toggleUserStatus(selectedIntern._id, selectedIntern.status)}
                    className={`px-6 py-3 rounded-xl font-medium ${
                      selectedIntern.status === 'active'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {selectedIntern.status === 'active' ? 'Deactivate User' : 'Activate User'}
                  </button>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminInternsPage;