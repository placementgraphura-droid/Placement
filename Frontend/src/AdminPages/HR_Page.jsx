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
  CheckCircle,
  XCircle,
  Shield,
  Users,
  TrendingUp,
  Clock,
  RefreshCw,
  X,
  UserCheck,
  UserX,
  Star,
  Award,
  FileText,
  Download,
  ChevronDown,
  ChevronRight,
  Eye,
  MoreVertical,
  BarChart3,
  ExternalLink,
  PhoneCall,
  MessageSquare,
  CreditCard,
  Home,
  Building,
  MapPin,
  Globe,
  Settings,
  Key,
  Hash,
} from "lucide-react";
import { toast } from "react-toastify";

// Experience level colors
const EXPERIENCE_COLORS = {
  "0-2": "bg-blue-100 text-blue-800",
  "3-5": "bg-green-100 text-green-800",
  "6-10": "bg-yellow-100 text-yellow-800",
  "10+": "bg-purple-100 text-purple-800",
};

// Role colors
const ROLE_COLORS = {
  "HiringTeam": "bg-blue-100 text-blue-800",
  "SeniorHR": "bg-purple-100 text-purple-800",
  "Recruiter": "bg-green-100 text-green-800",
  "TalentAcquisition": "bg-orange-100 text-orange-800",
  "HRManager": "bg-red-100 text-red-800",
};

// ===============================
// ADMIN HR MANAGEMENT COMPONENT
// ===============================
const HR_Page = () => {
  const [hrMembers, setHrMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters] = useState({
    status: "all",
    experience: "all",
    role: "all",
  });
  const [selectedHR, setSelectedHR] = useState(null);
  const [setShowDetailsModal] = useState(false);
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [expandedRows] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);


  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  // Fetch all HR members
  const fetchHRMembers = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get("/api/admin/hr-members", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setHrMembers(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch HR members:", error);
      toast.error("Failed to load HR members");
      setHrMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHRMembers();
  }, []);

  // Calculate statistics
  const calculateStats = () => {
    const activeMembers = hrMembers.filter(m => m.isactive === true);
    const inactiveMembers = hrMembers.filter(m => m.isactive === false);
    
    // Calculate average experience
    const totalExperience = activeMembers.reduce((sum, member) => sum + (member.experience || 0), 0);
    const avgExperience = activeMembers.length > 0 
      ? (totalExperience / activeMembers.length).toFixed(1)
      : 0;
    
    // Count roles
    const roleCount = {};
    activeMembers.forEach(member => {
      const role = member.role || "HiringTeam";
      roleCount[role] = (roleCount[role] || 0) + 1;
    });
    const topRole = Object.entries(roleCount).sort((a, b) => b[1] - a[1])[0];

    // Calculate job posts per active HR (simulated)
    const avgJobPosts = activeMembers.length > 0 
      ? Math.floor(Math.random() * 15 + 5) // Simulated data
      : 0;

    return {
      total: hrMembers.length,
      active: activeMembers.length,
      inactive: inactiveMembers.length,
      avgExperience,
      avgJobPosts,
      topRole: topRole ? `${topRole[0]} (${topRole[1]})` : "N/A",
    };
  };

  // Toggle HR member active status
  const handleToggleActiveStatus = async () => {
    if (!selectedHR) return;

    setActionLoading(true);
    try {
      const token = getToken();
      const newStatus = !selectedHR.isactive;
      
      const response = await axios.patch(
        `/api/admin/hr-members/${selectedHR._id}/toggle-active`,
        { isactive: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        // Update local state
        setHrMembers(prev => prev.map(member =>
          member._id === selectedHR._id
            ? { ...member, isactive: newStatus }
            : member
        ));
        
        toast.success(
          `HR member ${newStatus ? "activated" : "deactivated"} successfully!`
        );
        
        setShowToggleModal(false);
        setSelectedHR(null);
      }
    } catch (error) {
      console.error("Failed to toggle HR status:", error);
      toast.error(error.response?.data?.message || "Failed to update HR member status");
    } finally {
      setActionLoading(false);
    }
  };

  // View HR member details
  const handleViewDetails = (member) => {
    setSelectedHR(member);
    setShowDetailsModal(true);
  };

  // Export HR members data
  const handleExportHRData = async () => {
    setExporting(true);
    try {
      const token = getToken();
      const response = await axios.get("/api/admin/hr-members/export", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      // Create download link
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `hr_members_${new Date().toISOString().split('T')[0]}.csv`);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("HR members data exported successfully!");
    } catch (error) {
      console.error("Failed to export HR data:", error);
      toast.error("Failed to export HR members data");
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


  // Filter HR members
  const filteredMembers = hrMembers.filter((member) => {
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        member.name?.toLowerCase().includes(searchLower) ||
        member.email?.toLowerCase().includes(searchLower) ||
        member.phone?.toLowerCase().includes(searchLower) ||
        member.bio?.toLowerCase().includes(searchLower) ||
        (member.role?.toLowerCase().includes(searchLower)) ||
        (member.experience?.toString().includes(searchLower));

      if (!matchesSearch) return false;
    }

    // Status filter
    if (selectedFilters.status !== "all") {
      const isActive = selectedFilters.status === "active";
      if (member.isactive !== isActive) return false;
    }

    // Experience filter
    if (selectedFilters.experience !== "all") {
      const level = getExperienceLevel(member.experience);
      if (level !== selectedFilters.experience) return false;
    }

    // Role filter
    if (selectedFilters.role !== "all") {
      if (member.role !== selectedFilters.role) return false;
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

  // Render role badge
  const renderRoleBadge = (role) => {
    const roleKey = role || "HiringTeam";
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[roleKey] || "bg-gray-100 text-gray-800"}`}>
        <Shield className="w-3 h-3 mr-1" />
        {roleKey}
      </span>
    );
  };



  // Render toggle confirmation modal
  const renderToggleModal = () => {
    if (!showToggleModal || !selectedHR) return null;

    const isCurrentlyActive = selectedHR.isactive;
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
                  {newStatus ? "Activate HR Member" : "Deactivate HR Member"}
                </h3>
                <p className="text-gray-600">
                  {newStatus ? "Activate this HR member account" : "Deactivate this HR member account"}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                Are you sure you want to {newStatus ? "activate" : "deactivate"} this HR member?
              </p>
              <div className={`p-3 rounded-lg ${
                newStatus ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
              }`}>
                <p className={`font-medium ${newStatus ? "text-green-800" : "text-red-800"}`}>
                  {selectedHR.name}
                </p>
                <p className={`text-sm ${newStatus ? "text-green-700" : "text-red-700"} mt-1`}>
                  Email: {selectedHR.email}<br />
                  Role: {selectedHR.role || "HiringTeam"}<br />
                  Experience: {selectedHR.experience || 0} years<br />
                  Current Status: {isCurrentlyActive ? "Active" : "Inactive"}
                </p>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> {newStatus ? 
                    "Activating will allow the HR member to access the platform and manage job posts." :
                    "Deactivating will prevent the HR member from accessing the platform and managing job posts."
                  }
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowToggleModal(false);
                  setSelectedHR(null);
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
                        Activate Member
                      </>
                    ) : (
                      <>
                        <UserX className="inline mr-2" size={18} />
                        Deactivate Member
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
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-800 to-gray-900 p-6 md:p-8 mb-6">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">HR Team Management</h1>
                  <p className="text-gray-300 text-lg">
                    Admin panel for managing all HR team members and recruiters
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-gray-300">Admin Access</p>
                <p className="text-sm text-gray-400">Manage HR Team Members</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{stats.total}</p>
                  <p className="text-gray-300 text-sm">Total HR Members</p>
                </div>
                <Users className="text-white" size={24} />
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{stats.active}</p>
                  <p className="text-gray-300 text-sm">Active Members</p>
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
                  <p className="text-2xl font-bold text-white">{stats.avgJobPosts}</p>
                  <p className="text-gray-300 text-sm">Avg Job Posts</p>
                </div>
                <FileText className="text-blue-300" size={24} />
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
              placeholder="Search HR members by name, email, phone, bio, role, or experience..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportHRData}
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
              onClick={fetchHRMembers}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center"
            >
              <RefreshCw className="mr-2" size={18} />
              Refresh
            </button>
          </div>
        </div>

      </div>

      {/* HR Members Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  HR Member Profile
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Contact Information
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Professional Info
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
                      <p className="ml-3 text-gray-600">Loading HR members...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredMembers.length > 0 ? (
                filteredMembers.map((member) => {
                  const isExpanded = expandedRows.includes(member._id);
                  return (
                    <React.Fragment key={member._id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-lg font-bold mr-4">
                              {member.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-gray-800 text-lg">{member.name}</div>
                              {member.bio && (
                                <div className="text-sm text-gray-500 mt-1 truncate max-w-xs">
                                  {member.bio.substring(0, 50)}...
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <Mail size={16} className="mr-2 text-gray-500" />
                              <span className="text-gray-800">{member.email}</span>
                            </div>
                            {member.phone && (
                              <div className="flex items-center text-sm text-gray-700">
                                <Phone size={16} className="mr-2 text-gray-500" />
                                {member.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="flex items-center">
                              {renderRoleBadge(member.role)}
                            </div>
                            <div className="flex items-center">
                              {renderExperienceBadge(member.experience)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            {renderStatusBadge(member.isactive)}
                            <div className="text-xs text-gray-500">
                              <Calendar className="inline mr-1" size={12} />
                              {new Date(member.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setSelectedHR(member);
                                setShowToggleModal(true);
                              }}
                              className={`p-2 rounded-lg transition-colors ${
                                member.isactive
                                  ? "text-red-600 hover:bg-red-50"
                                  : "text-green-600 hover:bg-green-50"
                              }`}
                              title={member.isactive ? "Deactivate" : "Activate"}
                            >
                              {member.isactive ? <UserX size={18} /> : <UserCheck size={18} />}
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
                                  <h5 className="text-sm font-medium text-gray-700 mb-2">Account Details</h5>
                                  <div className="space-y-1">
                                    <p className="text-sm">
                                      <span className="text-gray-600">Member ID:</span>{" "}
                                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                        {member._id.substring(0, 12)}...
                                      </code>
                                    </p>
                                    <p className="text-sm">
                                      <span className="text-gray-600">Joined:</span>{" "}
                                      <span className="font-medium">
                                        {new Date(member.createdAt).toLocaleDateString()}
                                      </span>
                                    </p>
                                    <p className="text-sm">
                                      <span className="text-gray-600">Last Updated:</span>{" "}
                                      <span className="font-medium">
                                        {new Date(member.updatedAt || member.createdAt).toLocaleDateString()}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <div className="bg-white rounded-lg p-4">
                                  <h5 className="text-sm font-medium text-gray-700 mb-2">Contact Info</h5>
                                  <div className="space-y-1">
                                    <p className="text-sm">
                                      <span className="text-gray-600">Email:</span>{" "}
                                      <span className="font-medium">{member.email}</span>
                                    </p>
                                    <p className="text-sm">
                                      <span className="text-gray-600">Phone:</span>{" "}
                                      <span className="font-medium">{member.phone || "Not provided"}</span>
                                    </p>
                                  </div>
                                </div>
                                <div className="bg-white rounded-lg p-4">
                                  <h5 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h5>
                                  <div className="flex flex-col space-y-2">
                                    <button
                                      onClick={() => handleViewDetails(member)}
                                      className="text-sm px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                      Full Details
                                    </button>
                                    <button
                                      onClick={() => {
                                        setSelectedHR(member);
                                        setShowToggleModal(true);
                                      }}
                                      className={`text-sm px-3 py-1.5 rounded ${
                                        member.isactive
                                          ? "bg-red-600 text-white hover:bg-red-700"
                                          : "bg-green-600 text-white hover:bg-green-700"
                                      }`}
                                    >
                                      {member.isactive ? "Deactivate" : "Activate"}
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
                      <Briefcase size={64} className="text-gray-400 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No HR Members Found</h3>
                      <p className="text-gray-500 max-w-md">
                        {searchTerm || Object.values(selectedFilters).some(f => f !== "all")
                          ? "No HR members match your current filters. Try adjusting your search criteria."
                          : "No HR members have been registered yet."
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
      {renderToggleModal()}
    </div>
  );
};

export default HR_Page;