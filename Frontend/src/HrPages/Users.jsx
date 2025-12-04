import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  User,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  MapPin,
  Eye,
  MessageSquare,
  FileText,
  Download,
  ChevronRight,
  CheckCircle,
  Clock,
  XCircle,
  Star,
  Award,
  GraduationCap,
  Building,
} from "lucide-react";
import { toast } from "react-toastify";

const UsersPage = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    status: "all",
    stage: "all",
    department: "all",
  });

  const getToken = () => {
    return localStorage.getItem("HiringTeamToken") || localStorage.getItem("token");
  };

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get("/api/hiring/candidates", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setCandidates(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
      toast.error("Failed to load candidates");
      // Fallback data
      setCandidates([
        {
          _id: "1",
          name: "Alex Johnson",
          email: "alex@example.com",
          phone: "+1 (555) 123-4567",
          position: "Senior Frontend Developer",
          department: "Engineering",
          status: "Interview",
          stage: "Technical Round",
          rating: 4.5,
          experience: "5 years",
          location: "San Francisco, CA",
          appliedDate: "2024-03-15",
          lastContact: "2024-03-18",
          avatar: "https://randomuser.me/api/portraits/men/1.jpg",
          resumeUrl: "#",
          notes: "Strong React experience, good cultural fit",
        },
        // Add more fallback candidates...
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

//   const handleStatusChange = async (candidateId, newStatus) => {
//     try {
//       const token = getToken();
//       await axios.patch(
//         `/api/hiring/candidates/${candidateId}/status`,
//         { status: newStatus },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       toast.success("Status updated");
//       fetchCandidates();
//     } catch (error) {
//       console.error("Failed to update status:", error);
//       toast.error("Failed to update status");
//     }
//   };

  const handleDownloadResume = async (candidateId) => {
    try {
      const token = getToken();
      const response = await axios.get(`/api/hiring/candidates/${candidateId}/resume`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume-${candidateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download resume:", error);
      toast.error("Failed to download resume");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      case "interview":
        return "bg-purple-100 text-purple-800";
      case "offer":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "hired":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "new":
        return <Clock size={14} />;
      case "offer":
      case "hired":
        return <CheckCircle size={14} />;
      case "rejected":
        return <XCircle size={14} />;
      default:
        return null;
    }
  };

  const filteredCandidates = candidates.filter((candidate) => {
    // Search filter
    if (searchTerm && 
        !candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !candidate.position.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Status filter
    if (selectedFilters.status !== "all" && candidate.status !== selectedFilters.status) {
      return false;
    }

    // Stage filter
    if (selectedFilters.stage !== "all" && candidate.stage !== selectedFilters.stage) {
      return false;
    }

    // Department filter
    if (selectedFilters.department !== "all" && candidate.department !== selectedFilters.department) {
      return false;
    }

    return true;
  });

  const stats = [
    { label: "Total Candidates", value: candidates.length, color: "#09435F" },
    { label: "New Applicants", value: candidates.filter(c => c.status === "New").length, color: "#2E84AE" },
    { label: "In Interview", value: candidates.filter(c => c.status === "Interview").length, color: "#CDE7F4" },
    { label: "Avg Rating", value: (candidates.reduce((sum, c) => sum + (c.rating || 0), 0) / candidates.length || 0).toFixed(1), color: "#09435F", suffix: "/5" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-[#09435F]">Candidates</h1>
          <p className="text-gray-600">Manage and track all candidate applications</p>
        </div>
        <div className="flex space-x-2">
          <button className="flex items-center space-x-2 px-4 py-2 border border-[#2E84AE] text-[#2E84AE] rounded-lg hover:bg-[#CDE7F4] transition-colors">
            <Download size={18} />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-4"
            style={{ borderLeft: `4px solid ${stat.color}` }}
          >
            <p className="text-2xl font-bold text-[#09435F]">
              {stat.value}{stat.suffix || ""}
            </p>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search candidates by name, email, position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E84AE] focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedFilters.status}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E84AE] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="New">New</option>
              <option value="Review">Review</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Hired">Hired</option>
              <option value="Rejected">Rejected</option>
            </select>

            <select
              value={selectedFilters.stage}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, stage: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E84AE] focus:border-transparent"
            >
              <option value="all">All Stages</option>
              <option value="Resume Review">Resume Review</option>
              <option value="Phone Screen">Phone Screen</option>
              <option value="Technical Round">Technical Round</option>
              <option value="Final Round">Final Round</option>
              <option value="HR Discussion">HR Discussion</option>
            </select>

            <select
              value={selectedFilters.department}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, department: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E84AE] focus:border-transparent"
            >
              <option value="all">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Design">Design</option>
              <option value="Product">Product</option>
              <option value="Marketing">Marketing</option>
            </select>

            <button className="flex items-center px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={16} className="mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : filteredCandidates.length > 0 ? (
          filteredCandidates.map((candidate) => (
            <div key={candidate._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              {/* Candidate Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={candidate.avatar || `https://ui-avatars.com/api/?name=${candidate.name}&background=2E84AE&color=fff`}
                      alt={candidate.name}
                      className="w-16 h-16 rounded-full border-2 border-[#CDE7F4]"
                    />
                    <div>
                      <h3 className="font-bold text-lg text-[#09435F]">{candidate.name}</h3>
                      <p className="text-gray-600 text-sm flex items-center">
                        <Briefcase size={14} className="mr-1" />
                        {candidate.position}
                      </p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={`mr-1 ${
                              i < Math.floor(candidate.rating || 0)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-500 ml-1">
                          {candidate.rating?.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(candidate.status)}`}>
                    {getStatusIcon(candidate.status)}
                    <span className="ml-1">{candidate.status}</span>
                  </span>
                </div>
              </div>

              {/* Candidate Details */}
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Mail size={16} className="mr-3 text-[#2E84AE]" />
                    <span className="text-sm">{candidate.email}</span>
                  </div>
                  {candidate.phone && (
                    <div className="flex items-center text-gray-600">
                      <Phone size={16} className="mr-3 text-[#2E84AE]" />
                      <span className="text-sm">{candidate.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <MapPin size={16} className="mr-3 text-[#2E84AE]" />
                    <span className="text-sm">{candidate.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar size={16} className="mr-3 text-[#2E84AE]" />
                    <span className="text-sm">
                      Applied: {new Date(candidate.appliedDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {/* Stage Progress */}
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Current Stage: {candidate.stage}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#2E84AE] h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: candidate.stage === "Resume Review" ? "25%" :
                               candidate.stage === "Phone Screen" ? "40%" :
                               candidate.stage === "Technical Round" ? "60%" :
                               candidate.stage === "Final Round" ? "80%" :
                               candidate.stage === "HR Discussion" ? "95%" : "0%" 
                      }}
                    ></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDownloadResume(candidate._id)}
                      className="p-2 text-[#2E84AE] hover:bg-[#CDE7F4] rounded-lg transition-colors"
                      title="Download Resume"
                    >
                      <FileText size={18} />
                    </button>
                    <button
                      onClick={() => {/* View details */}}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="View Profile"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => {/* Send message */}}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Send Message"
                    >
                      <MessageSquare size={18} />
                    </button>
                  </div>
                  <button className="flex items-center text-[#2E84AE] hover:text-[#09435F]">
                    <span className="text-sm font-medium">View Details</span>
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white rounded-xl shadow-lg p-8 text-center">
            <User size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;