import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  Calendar,
  User,
  Mail,
  Phone,
  Briefcase,
  Linkedin,
  Github,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  Eye,
  Shield,
  Users,
  Award,
  TrendingUp,
  Clock,
  RefreshCw,
  X,
  Check,
  AlertCircle,
  MoreVertical,
  ExternalLink,
  UserCheck,
  UserX,
  Star,
  Globe,
  Code,
  Cpu,
  Database,
  Smartphone,
  Palette,
  Megaphone,
  Settings,
  Download,
  Plus,
  ChevronDown,
  ChevronRight,
  FileText,
  BarChart3,
} from "lucide-react";
import { toast } from "react-toastify";

// Domain icons mapping
const DOMAIN_ICONS = {
  MERN: <Code className="w-4 h-4" />,
  AI: <Cpu className="w-4 h-4" />,
  ML: <Cpu className="w-4 h-4" />,
  DevOps: <Settings className="w-4 h-4" />,
  "Full Stack": <Code className="w-4 h-4" />,
  "Frontend": <Palette className="w-4 h-4" />,
  "Backend": <Database className="w-4 h-4" />,
  "Mobile": <Smartphone className="w-4 h-4" />,
  "UI/UX": <Palette className="w-4 h-4" />,
  "Marketing": <Megaphone className="w-4 h-4" />,
  "Data Science": <Database className="w-4 h-4" />,
  "Cloud": <Globe className="w-4 h-4" />,
  "Cybersecurity": <Shield className="w-4 h-4" />,
};

// Experience level colors
const EXPERIENCE_COLORS = {
  "0-2": "bg-blue-100 text-blue-800",
  "3-5": "bg-green-100 text-green-800",
  "6-10": "bg-yellow-100 text-yellow-800",
  "10+": "bg-purple-100 text-purple-800",
};

// ===============================
// ADMIN MENTOR MANAGEMENT COMPONENT
// ===============================
const MentorPage = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    status: "all",
    experience: "all",
    domain: "all",
  });
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [expandedRows] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  // Domain options (extracted from mentors)
  const [domainOptions, setDomainOptions] = useState([]);

  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  // Fetch all mentors
  const fetchMentors = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get("/api/admin/mentors", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        const mentorsData = response.data.data || [];
        setMentors(mentorsData);
        
        // Extract unique domains for filter
        const domains = new Set();
        mentorsData.forEach(mentor => {
          if (mentor.domain && Array.isArray(mentor.domain)) {
            mentor.domain.forEach(d => domains.add(d));
          }
        });
        setDomainOptions(Array.from(domains).sort());
      }
    } catch (error) {
      console.error("Failed to fetch mentors:", error);
      toast.error("Failed to load mentors");
      setMentors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  // Calculate statistics
  const calculateStats = () => {
    const activeMentors = mentors.filter(m => m.isactive === true);
    const inactiveMentors = mentors.filter(m => m.isactive === false);
    
    // Calculate average experience
    const totalExperience = activeMentors.reduce((sum, mentor) => sum + (mentor.experience || 0), 0);
    const avgExperience = activeMentors.length > 0 
      ? (totalExperience / activeMentors.length).toFixed(1)
      : 0;
    
    // Count domains
    const domainCount = {};
    activeMentors.forEach(mentor => {
      if (mentor.domain && Array.isArray(mentor.domain)) {
        mentor.domain.forEach(d => {
          domainCount[d] = (domainCount[d] || 0) + 1;
        });
      }
    });
    const topDomain = Object.entries(domainCount).sort((a, b) => b[1] - a[1])[0];

    return {
      total: mentors.length,
      active: activeMentors.length,
      inactive: inactiveMentors.length,
      avgExperience,
      topDomain: topDomain ? `${topDomain[0]} (${topDomain[1]})` : "N/A",
    };
  };

  // Toggle mentor active status
  const handleToggleActiveStatus = async () => {
    if (!selectedMentor) return;

    setActionLoading(true);
    try {
      const token = getToken();
      const newStatus = !selectedMentor.isactive;
      
      const response = await axios.patch(
        `/api/admin/mentors/${selectedMentor._id}/toggle-active`,
        { isactive: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        // Update local state
        setMentors(prev => prev.map(mentor =>
          mentor._id === selectedMentor._id
            ? { ...mentor, isactive: newStatus }
            : mentor
        ));
        
        toast.success(
          `Mentor ${newStatus ? "activated" : "deactivated"} successfully!`
        );
        
        setShowToggleModal(false);
        setSelectedMentor(null);
      }
    } catch (error) {
      console.error("Failed to toggle mentor status:", error);
      toast.error(error.response?.data?.message || "Failed to update mentor status");
    } finally {
      setActionLoading(false);
    }
  };

  // View mentor details
  const handleViewDetails = (mentor) => {
    setSelectedMentor(mentor);
    setShowDetailsModal(true);
  };

  // Export mentors data
  const handleExportMentors = async () => {
    setExporting(true);
    try {
      const token = getToken();
      const response = await axios.get("/api/admin/mentors/export", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      // Create download link
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `mentors_${new Date().toISOString().split('T')[0]}.csv`);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Mentors data exported successfully!");
    } catch (error) {
      console.error("Failed to export mentors:", error);
      toast.error("Failed to export mentors data");
    } finally {
      setExporting(false);
    }
  };

  // Get experience level
  const getExperienceLevel = (experience) => {
    if (!experience) return "0-2";
    if (experience <= 2) return "0-2";
    if (experience <= 5) return "3-5";
    if (experience <= 10) return "6-10";
    return "10+";
  };

  // Toggle row expansion


  // Filter mentors
  const filteredMentors = mentors.filter((mentor) => {
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        mentor.name?.toLowerCase().includes(searchLower) ||
        mentor.email?.toLowerCase().includes(searchLower) ||
        mentor.phone?.toLowerCase().includes(searchLower) ||
        (mentor.domain?.some(d => d.toLowerCase().includes(searchLower))) ||
        (mentor.experience?.toString().includes(searchLower));

      if (!matchesSearch) return false;
    }

    // Status filter
    if (selectedFilters.status !== "all") {
      const isActive = selectedFilters.status === "active";
      if (mentor.isactive !== isActive) return false;
    }

    // Experience filter
    if (selectedFilters.experience !== "all") {
      const level = getExperienceLevel(mentor.experience);
      if (level !== selectedFilters.experience) return false;
    }

    // Domain filter
    if (selectedFilters.domain !== "all") {
      if (!mentor.domain || !mentor.domain.includes(selectedFilters.domain)) {
        return false;
      }
    }

    return true;
  });

  const stats = calculateStats();

  // Render status badge
  const renderStatusBadge = (isActive) => {
    return isActive ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <CheckCircle className="w-3 h-3 mr-1" />
        Active
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <XCircle className="w-3 h-3 mr-1" />
        Inactive
      </span>
    );
  };

  // Render experience badge
  const renderExperienceBadge = (experience) => {
    const level = getExperienceLevel(experience);
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${EXPERIENCE_COLORS[level]}`}>
        <Clock className="w-3 h-3 mr-1" />
        {experience || 0} years
      </span>
    );
  };

  // Render domain badges
  const renderDomainBadges = (domains) => {
    if (!domains || domains.length === 0) {
      return <span className="text-gray-400 text-sm">No domains specified</span>;
    }

    return (
      <div className="flex flex-wrap gap-1">
        {domains.slice(0, 3).map((domain, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
          >
            {DOMAIN_ICONS[domain] || <Code className="w-3 h-3 mr-1" />}
            {domain}
          </span>
        ))}
        {domains.length > 3 && (
          <span className="text-xs text-gray-500 ml-1">
            +{domains.length - 3} more
          </span>
        )}
      </div>
    );
  };

  // Render details modal
  const renderDetailsModal = () => {
    if (!showDetailsModal || !selectedMentor) return null;

    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{selectedMentor.name}</h2>
              <div className="flex items-center space-x-4 mt-1">
                {renderStatusBadge(selectedMentor.isactive)}
                {renderExperienceBadge(selectedMentor.experience)}
                <span className="text-sm text-gray-600">
                  <Calendar className="inline mr-1 w-4 h-4" />
                  Joined: {new Date(selectedMentor.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setShowDetailsModal(false);
                setSelectedMentor(null);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <User className="mr-2" size={20} />
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Mail className="text-gray-500 mr-3" size={18} />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="text-gray-800">{selectedMentor.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Phone className="text-gray-500 mr-3" size={18} />
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="text-gray-800">{selectedMentor.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Links */}
                {(selectedMentor.linkedinUrl || selectedMentor.githubUrl) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <Globe className="mr-2" size={20} />
                      Professional Links
                    </h3>
                    <div className="space-y-2">
                      {selectedMentor.linkedinUrl && (
                        <a
                          href={selectedMentor.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Linkedin className="text-blue-600 mr-3" size={18} />
                          <div>
                            <p className="text-sm text-gray-600">LinkedIn</p>
                            <p className="text-blue-600 font-medium">View Profile</p>
                          </div>
                          <ExternalLink className="ml-auto text-gray-400" size={16} />
                        </a>
                      )}
                      {selectedMentor.githubUrl && (
                        <a
                          href={selectedMentor.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Github className="text-gray-800 mr-3" size={18} />
                          <div>
                            <p className="text-sm text-gray-600">GitHub</p>
                            <p className="text-gray-800 font-medium">View Profile</p>
                          </div>
                          <ExternalLink className="ml-auto text-gray-400" size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Professional Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Briefcase className="mr-2" size={20} />
                    Professional Details
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Experience</p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xl font-bold text-gray-800">
                          {selectedMentor.experience || 0} years
                        </p>
                        {renderExperienceBadge(selectedMentor.experience)}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-2">Expertise Domains</p>
                      {selectedMentor.domain && selectedMentor.domain.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedMentor.domain.map((domain, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-100 text-blue-800"
                            >
                              {DOMAIN_ICONS[domain] || <Code className="w-4 h-4 mr-2" />}
                              {domain}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No domains specified</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <Shield className="mr-2" size={20} />
                    Account Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Role</span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm font-medium">
                        {selectedMentor.role || "mentor"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Account Status</span>
                      {renderStatusBadge(selectedMentor.isactive)}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Last Updated</span>
                      <span className="text-gray-800">
                        {new Date(selectedMentor.updatedAt || selectedMentor.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedMentor(selectedMentor);
                  setShowToggleModal(true);
                }}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedMentor.isactive
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {selectedMentor.isactive ? (
                  <>
                    <UserX className="inline mr-2" size={18} />
                    Deactivate Mentor
                  </>
                ) : (
                  <>
                    <UserCheck className="inline mr-2" size={18} />
                    Activate Mentor
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedMentor(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render toggle confirmation modal
  const renderToggleModal = () => {
    if (!showToggleModal || !selectedMentor) return null;

    const isCurrentlyActive = selectedMentor.isactive;
    const newStatus = !isCurrentlyActive;

    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                newStatus ? "bg-green-100" : "bg-red-100"
              }`}>
                {newStatus ? (
                  <UserCheck className="text-green-600" size={24} />
                ) : (
                  <UserX className="text-red-600" size={24} />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {newStatus ? "Activate Mentor" : "Deactivate Mentor"}
                </h3>
                <p className="text-gray-600">
                  {newStatus ? "Activate this mentor account" : "Deactivate this mentor account"}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                Are you sure you want to {newStatus ? "activate" : "deactivate"} this mentor?
              </p>
              <div className={`p-3 rounded-lg ${
                newStatus ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
              }`}>
                <p className={`font-medium ${newStatus ? "text-green-800" : "text-red-800"}`}>
                  {selectedMentor.name}
                </p>
                <p className={`text-sm ${newStatus ? "text-green-700" : "text-red-700"} mt-1`}>
                  Email: {selectedMentor.email}<br />
                  Experience: {selectedMentor.experience || 0} years<br />
                  Current Status: {isCurrentlyActive ? "Active" : "Inactive"}
                </p>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> {newStatus ? 
                    "Activating will allow the mentor to access the platform and mentor interns." :
                    "Deactivating will prevent the mentor from accessing the platform and mentoring interns."
                  }
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowToggleModal(false);
                  setSelectedMentor(null);
                }}
                disabled={actionLoading}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleActiveStatus}
                disabled={actionLoading}
                className={`px-4 py-2 rounded-lg text-white ${
                  newStatus 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-red-600 hover:bg-red-700"
                } disabled:opacity-50`}
              >
                {actionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline"></div>
                    {newStatus ? "Activating..." : "Deactivating..."}
                  </>
                ) : (
                  <>
                    {newStatus ? (
                      <>
                        <UserCheck className="inline mr-2" size={18} />
                        Activate Mentor
                      </>
                    ) : (
                      <>
                        <UserX className="inline mr-2" size={18} />
                        Deactivate Mentor
                      </>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-6">
      {/* Admin Header */}
<div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 md:p-12 mb-10 shadow-2xl">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">Mentor Management</h1>
                  <p className="text-gray-300 text-lg">
                    Admin panel for managing all mentors across the platform
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-gray-300">Admin Access</p>
                <p className="text-sm text-gray-400">Manage & Monitor Mentors</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{stats.total}</p>
                  <p className="text-gray-300 text-sm">Total Mentors</p>
                </div>
                <Users className="text-white" size={24} />
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{stats.active}</p>
                  <p className="text-gray-300 text-sm">Active Mentors</p>
                </div>
                <UserCheck className="text-green-300" size={24} />
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{stats.avgExperience}</p>
                  <p className="text-gray-300 text-sm">Avg Experience (yrs)</p>
                </div>
                <TrendingUp className="text-yellow-300" size={24} />
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-white">{stats.topDomain}</p>
                  <p className="text-gray-300 text-sm">Top Domain</p>
                </div>
                <Code className="text-blue-300" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search mentors by name, email, phone, domain, or experience..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportMentors}
              disabled={exporting}
              className="px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center"
            >
              {exporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2" size={18} />
                  Export Data
                </>
              )}
            </button>
            <button
              onClick={fetchMentors}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center"
            >
              <RefreshCw className="mr-2" size={18} />
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Status
            </label>
            <select
              value={selectedFilters.status}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, status: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level
            </label>
            <select
              value={selectedFilters.experience}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, experience: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Levels</option>
              <option value="0-2">0-2 years (Junior)</option>
              <option value="3-5">3-5 years (Mid-Level)</option>
              <option value="6-10">6-10 years (Senior)</option>
              <option value="10+">10+ years (Expert)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Domain Expertise
            </label>
            <select
              value={selectedFilters.domain}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, domain: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Domains</option>
              {domainOptions.map((domain) => (
                <option key={domain} value={domain}>
                  {DOMAIN_ICONS[domain] || <Code className="inline mr-1 w-4 h-4" />}
                  {domain}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Clear Filters */}
        {(searchTerm || Object.values(selectedFilters).some(f => f !== "all")) && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedFilters({
                  status: "all",
                  experience: "all",
                  domain: "all",
                });
              }}
              className="flex items-center text-sm text-gray-600 hover:text-gray-800"
            >
              <X size={14} className="mr-1" />
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Mentors Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Mentor Profile
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Expertise
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin w-8 h-8 border-b-2 border-blue-600 rounded-full"></div>
                      <p className="ml-3 text-gray-600">Loading mentors...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredMentors.length > 0 ? (
                filteredMentors.map((mentor) => {
                  const isExpanded = expandedRows.includes(mentor._id);
                  return (
                    <React.Fragment key={mentor._id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-lg font-bold mr-4">
                              {mentor.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-800 text-lg">{mentor.name}</div>
                              <div className="text-sm text-gray-500 mt-1">
                                {mentor.experience || 0} years experience
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-700">
                              <Mail size={14} className="mr-2 text-gray-500" />
                              {mentor.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-700">
                              <Phone size={14} className="mr-2 text-gray-500" />
                              {mentor.phone}
                            </div>
                            {(mentor.linkedinUrl || mentor.githubUrl) && (
                              <div className="flex items-center space-x-2 pt-1">
                                {mentor.linkedinUrl && (
                                  <a
                                    href={mentor.linkedinUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800"
                                    title="LinkedIn"
                                  >
                                    <Linkedin size={16} />
                                  </a>
                                )}
                                {mentor.githubUrl && (
                                  <a
                                    href={mentor.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-800 hover:text-gray-900"
                                    title="GitHub"
                                  >
                                    <Github size={16} />
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {renderDomainBadges(mentor.domain)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            {renderStatusBadge(mentor.isactive)}
                            {renderExperienceBadge(mentor.experience)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewDetails(mentor)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedMentor(mentor);
                                setShowToggleModal(true);
                              }}
                              className={`p-2 rounded-lg transition-colors ${
                                mentor.isactive
                                  ? "text-red-600 hover:bg-red-50"
                                  : "text-green-600 hover:bg-green-50"
                              }`}
                              title={mentor.isactive ? "Deactivate" : "Activate"}
                            >
                              {mentor.isactive ? <UserX size={18} /> : <UserCheck size={18} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded Row - Additional Details */}
                      {isExpanded && (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 bg-blue-50">
                            <div className="ml-16">
                              <h4 className="font-medium text-gray-800 mb-3">Additional Information</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white rounded-lg p-4">
                                  <h5 className="text-sm font-medium text-gray-700 mb-2">Account Info</h5>
                                  <div className="space-y-1">
                                    <p className="text-sm">
                                      <span className="text-gray-600">Role:</span>{" "}
                                      <span className="font-medium">{mentor.role || "mentor"}</span>
                                    </p>
                                    <p className="text-sm">
                                      <span className="text-gray-600">Joined:</span>{" "}
                                      <span className="font-medium">
                                        {new Date(mentor.createdAt).toLocaleDateString()}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <div className="bg-white rounded-lg p-4">
                                  <h5 className="text-sm font-medium text-gray-700 mb-2">Domains</h5>
                                  {mentor.domain && mentor.domain.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {mentor.domain.map((domain, index) => (
                                        <span
                                          key={index}
                                          className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800"
                                        >
                                          {domain}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-gray-400 text-sm">No domains specified</p>
                                  )}
                                </div>
                                <div className="bg-white rounded-lg p-4">
                                  <h5 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h5>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => handleViewDetails(mentor)}
                                      className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                      Full Details
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedMentor(mentor);
                                        setShowToggleModal(true);
                                      }}
                                      className={`text-sm px-3 py-1 rounded ${
                                        mentor.isactive
                                          ? "bg-red-600 text-white hover:bg-red-700"
                                          : "bg-green-600 text-white hover:bg-green-700"
                                      }`}
                                    >
                                      {mentor.isactive ? "Deactivate" : "Activate"}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Users size={64} className="text-gray-400 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No Mentors Found</h3>
                      <p className="text-gray-500 max-w-md">
                        {searchTerm || Object.values(selectedFilters).some(f => f !== "all")
                          ? "No mentors match your current filters. Try adjusting your search criteria."
                          : "No mentors have been registered yet."
                        }
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {renderDetailsModal()}
      {renderToggleModal()}
    </div>
  );
};

export default MentorPage;