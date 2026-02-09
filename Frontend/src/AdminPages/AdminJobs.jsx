import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Briefcase,
  DollarSign,
  Users,
  Eye,
  Palette,
  Megaphone,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  User,
  Mail,
  Phone,
  Home,
  Globe,
  Hash,
  BookOpen,
  Award,
  FileText,
  Upload,
  Link,
  Code,
  Target,
  Building,
  GraduationCap,
  BriefcaseIcon,
  Star,
  Languages,
  FileCheck,
  FolderOpen,
  Percent,
  ChevronDown,
  Type,
  GripVertical,
  Save,
  Settings,
  Heart,
  Check,
  File,
  Image,
  FileUp,
  ExternalLink,
  MessageSquare,
  CreditCard,
  Users as UsersIcon,
  Bell,
  ArrowRight,
  ArrowLeft,
  HelpCircle,
  Sparkles,
  Zap,
  Wand2,
  ChevronRight,
  Shield,
  Clock,
  Download,
  FileSpreadsheet,
  Layers,
  Smartphone,
  Mail as MailIcon,
  UserCheck,
  Bookmark,
  TrendingUp,
  Copy,
  MoreVertical,
  Download as DownloadIcon,
  Share2,
} from "lucide-react";
import { toast } from "react-toastify";

// ===============================
// ADMIN JOB POSTS COMPONENT
// ===============================
const AdminJobPosts = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Admin-specific state
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewMode, setViewMode] = useState(""); // "details", "form", "applicants"
  const [exporting, setExporting] = useState(false);

  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  const fetchJobs = async () => {   
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get("/api/admin/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setJobs(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      toast.error("Failed to load jobs");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ===============================
  // API CALL FUNCTIONS (ADMIN)
  // ===============================
  
  // View Job Details
  const handleViewJob = async (jobId) => {
    try {
      const token = getToken();
      const response = await axios.get(`/api/admin/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setSelectedJob(response.data.data);
        setViewMode("details");
        setShowViewModal(true);
      }
    } catch (error) {
      console.error("Failed to fetch job details:", error);
      toast.error("Failed to load job details");
    }
  };

  // Delete Job
  const handleDeleteJob = async () => {
    if (!selectedJob) return;

    try {
      const token = getToken();
      const response = await axios.delete(`/api/admin/jobs/${selectedJob._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success("Job deleted successfully");
        setShowDeleteModal(false);
        setSelectedJob(null);
        fetchJobs();
      }
    } catch (error) {
      console.error("Failed to delete job:", error);
      toast.error(error.response?.data?.message || "Failed to delete job");
    }
  };

  // Export All Job Data
  const handleExportJobData = async (job) => {
    setExporting(true);
    try {
      const token = getToken();
      const response = await axios.get(
        `/api/admin/jobs/${job._id}/export-all`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      // Create safe filename
      const safeJobTitle = job.title
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .replace(/\s+/g, "_")
        .toLowerCase();

      // Create download link
      const blob = new Blob([response.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${safeJobTitle}_job_data.zip`);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Job data exported successfully!");
    } catch (error) {
      console.error("Failed to export job data:", error);
      toast.error("Failed to export job data");
    } finally {
      setExporting(false);
    }
  };

  // Export Applicants
  const handleExportApplicants = async (job) => {
    try {
      const token = getToken();
      const response = await axios.get(
        `/api/admin/jobs/${job._id}/export-applicants`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const safeJobTitle = job.title
        .replace(/[^a-zA-Z0-9-_ ]/g, "")
        .replace(/\s+/g, "_")
        .toLowerCase();

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `applicants_${safeJobTitle}.csv`);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Applicants exported successfully!");
    } catch (error) {
      console.error("Failed to export applicants:", error);
      toast.error("Failed to export applicants");
    }
  };

  // ===============================
  // MODAL COMPONENTS (ADMIN)
  // ===============================
  
  // View Job Modal (Admin) - Enhanced with more details
  const renderViewModal = () => {
    if (!showViewModal || !selectedJob) return null;

    const tabs = [
      { id: "details", label: "Job Details", icon: <Briefcase size={18} /> },
      { id: "form", label: "Application Form", icon: <FileSpreadsheet size={18} /> },
      { id: "applicants", label: "Applicants", icon: <Users size={18} /> },
    ];

    // Format date safely
    const formatDate = (dateString) => {
      if (!dateString) return "Not specified";
      try {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (error) {
        return "Invalid date",error;
      }
    };

    // Format salary range
    const formatSalary = () => {
      if (!selectedJob.salary) return "Not specified";
      const { min, max, currency, isNegotiable } = selectedJob.salary;
      let salaryText = "";
      
      if (min) salaryText += `${currency || '₹'}${min}`;
      if (max) salaryText += ` - ${currency || '₹'}${max}`;
      if (!min && !max) salaryText = "Not specified";
      if (isNegotiable) salaryText += " (Negotiable)";
      
      return salaryText;
    };

    // Format experience
    const formatExperience = () => {
      if (!selectedJob.experienceRequired) return "Not specified";
      const { min, max } = selectedJob.experienceRequired;
      if (min === 0 && (!max || max === null)) return "Fresher";
      if (min && max) return `${min} - ${max} years`;
      if (min) return `${min}+ years`;
      return "Not specified";
    };

    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{selectedJob.title}</h2>
              <div className="flex items-center space-x-4 mt-1">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  selectedJob.status === "Open" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {selectedJob.status === "Open" ? (
                    <CheckCircle size={14} className="mr-1" />
                  ) : (
                    <XCircle size={14} className="mr-1" />
                  )}
                  {selectedJob.status}
                </span>
                <span className="text-sm text-gray-600">
                  <Building size={14} className="inline mr-1" />
                  {selectedJob.companyName || "Unknown Company"}
                </span>
                <span className="text-sm text-gray-600">
                  <Calendar size={14} className="inline mr-1" />
                  Posted: {formatDate(selectedJob.createdAt)}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleExportJobData(selectedJob)}
                disabled={exporting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
              >
                {exporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <DownloadIcon size={18} className="mr-2" />
                    Export All
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedJob(null);
                  setViewMode("details");
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b px-6">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id)}
                  className={`flex items-center px-4 py-3 border-b-2 text-sm font-medium transition-colors ${
                    viewMode === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.icon}
                  <span className="ml-2">{tab.label}</span>
                  {tab.id === "applicants" && selectedJob.applicantsCount > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                      {selectedJob.applicantsCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {viewMode === "details" && (
              <div className="space-y-8">
                {/* Quick Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center">
                      <Briefcase className="text-blue-600 mr-3" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Job Type</p>
                        <p className="font-semibold text-gray-800">{selectedJob.jobType || "Not specified"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <div className="flex items-center">
                      <Clock className="text-green-600 mr-3" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Experience</p>
                        <p className="font-semibold text-gray-800">{formatExperience()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <div className="flex items-center">
                      <DollarSign className="text-purple-600 mr-3" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Salary Range</p>
                        <p className="font-semibold text-gray-800">{formatSalary()}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <div className="flex items-center">
                      <Users className="text-orange-600 mr-3" size={20} />
                      <div>
                        <p className="text-sm text-gray-600">Total Applicants</p>
                        <p className="font-semibold text-gray-800">{selectedJob.applicantsCount || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Location & Work Mode */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <MapPin className="mr-2" size={18} />
                        Location & Work Setup
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <MapPin size={16} className="text-gray-500 mr-2" />
                            <span className="text-gray-700">Location</span>
                          </div>
                          <span className="font-medium text-gray-800">{selectedJob.location || "Not specified"}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <Globe size={16} className="text-gray-500 mr-2" />
                            <span className="text-gray-700">Work Mode</span>
                          </div>
                          <span className="font-medium text-gray-800">{selectedJob.workMode || "Not specified"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Vacancies & Deadline */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <Bell className="mr-2" size={18} />
                        Job Specifications
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <UsersIcon size={16} className="text-gray-500 mr-2" />
                            <span className="text-gray-700">Total Vacancies</span>
                          </div>
                          <span className="font-medium text-gray-800">{selectedJob.totalVacancies || 1}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <Calendar size={16} className="text-gray-500 mr-2" />
                            <span className="text-gray-700">Application Deadline</span>
                          </div>
                          <span className="font-medium text-gray-800">
                            {selectedJob.applicationDeadline 
                              ? formatDate(selectedJob.applicationDeadline)
                              : "Not specified"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Required Skills */}
                    {selectedJob.requiredSkills && selectedJob.requiredSkills.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <Code className="mr-2" size={18} />
                          Required Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedJob.requiredSkills.map((skill, index) => (
                            <span key={index} className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Job Description */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <FileText className="mr-2" size={18} />
                        Job Description
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {selectedJob.description ? (
                          <div className="prose max-w-none">
                            {selectedJob.description.split('\n').map((paragraph, index) => (
                              <p key={index} className="text-gray-700 mb-3">
                                {paragraph}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 italic">No description provided</p>
                        )}
                      </div>
                    </div>

                    {/* Qualifications */}
                    {selectedJob.qualifications && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                          <GraduationCap className="mr-2" size={18} />
                          Qualifications
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="prose max-w-none">
                            {selectedJob.qualifications.split('\n').map((qual, index) => (
                              <p key={index} className="text-gray-700 mb-2 flex items-start">
                                <span className="text-blue-500 mr-2">•</span>
                                {qual}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional Info */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                        <Settings className="mr-2" size={18} />
                        Additional Information
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Job ID:</span>
                          <span className="font-mono text-sm text-gray-800">{selectedJob._id}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Updated:</span>
                          <span className="text-gray-800">{formatDate(selectedJob.updatedAt || selectedJob.createdAt)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Job Status:</span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            selectedJob.status === "Open" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {selectedJob.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {viewMode === "form" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Application Form Configuration</h3>
                    <p className="text-gray-600">Fields that candidates will fill out when applying</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {selectedJob.customFields?.length || 0} custom fields configured
                  </span>
                </div>

                {selectedJob.customFields && selectedJob.customFields.length > 0 ? (
                  <div className="space-y-4">
                    {/* Form Fields Preview */}
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-800 text-white px-4 py-3">
                        <h4 className="font-medium">Form Preview</h4>
                      </div>
                      <div className="p-6 space-y-4">
                        {selectedJob.customFields
                          .sort((a, b) => (a.order || 0) - (b.order || 0))
                          .map((field, index) => (
                            <div key={index} className="space-y-2">
                              <label className="block text-sm font-medium text-gray-700">
                                {field.label} {field.required && <span className="text-red-500">*</span>}
                                <span className="ml-2 text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                  {field.fieldType}
                                </span>
                              </label>
                              
                              {/* Render input based on field type */}
                              {field.fieldType === "text" && (
                                <input
                                  type="text"
                                  placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                  disabled
                                />
                              )}
                              
                              {field.fieldType === "email" && (
                                <input
                                  type="email"
                                  placeholder="email@example.com"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                  disabled
                                />
                              )}

                              {field.fieldType === "phone" && (
                                <input
                                  type="tel"
                                  placeholder="+91 9876543210"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                  disabled
                                />
                              )}

                              {field.fieldType === "textarea" && (
                                <textarea
                                  placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
                                  rows="3"
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                  disabled
                                />
                              )}

                              {field.fieldType === "select" && field.options && (
                                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg" disabled>
                                  <option value="">{field.placeholder || `Select ${field.label.toLowerCase()}`}</option>
                                  {field.options.map((opt, idx) => (
                                    <option key={idx} value={opt.value}>{opt.label}</option>
                                  ))}
                                </select>
                              )}

                              {field.fieldType === "file" && (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                  <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                                  <p className="text-sm text-gray-600">{field.placeholder || `Upload ${field.label.toLowerCase()}`}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Max size: {field.validation?.maxFileSizeMB || 2}MB • 
                                    Formats: {field.validation?.fileTypes?.join(", ") || "PDF, DOCX"}
                                  </p>
                                </div>
                              )}

                              {field.fieldType === "radio" && field.options && (
                                <div className="space-y-2">
                                  {field.options.map((opt, idx) => (
                                    <div key={idx} className="flex items-center">
                                      <input type="radio" className="mr-2" disabled />
                                      <label className="text-sm text-gray-700">{opt.label}</label>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Fields Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-3">Form Summary</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{selectedJob.customFields.length}</div>
                          <div className="text-sm text-gray-600">Total Fields</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {selectedJob.customFields.filter(f => f.required).length}
                          </div>
                          <div className="text-sm text-gray-600">Required Fields</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {selectedJob.customFields.filter(f => f.fieldType === "file").length}
                          </div>
                          <div className="text-sm text-gray-600">File Uploads</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {selectedJob.customFields.filter(f => ["select", "radio", "checkbox"].includes(f.fieldType)).length}
                          </div>
                          <div className="text-sm text-gray-600">Choice Fields</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileSpreadsheet size={48} className="mx-auto mb-3" />
                    <p>No custom form fields configured for this job</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Candidates will only see basic application fields
                    </p>
                  </div>
                )}
              </div>
            )}

            {viewMode === "applicants" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">Job Applicants</h3>
                    <p className="text-gray-600">
                      Total applicants: <span className="font-semibold">{selectedJob.applicantsCount || 0}</span>
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleExportApplicants(selectedJob)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <DownloadIcon size={18} className="mr-2" />
                      Export CSV
                    </button>
                  </div>
                </div>

                {selectedJob.applicantsCount > 0 ? (
                  <div className="bg-white border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Applicant Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Phone
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Applied Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {/* Note: This would be populated with real applicant data */}
                          <tr>
                            <td colSpan="6" className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center">
                                <Users size={48} className="text-gray-400 mb-4" />
                                <h4 className="text-lg font-medium text-gray-700 mb-2">Applicant Data</h4>
                                <p className="text-gray-500 max-w-md">
                                  To view detailed applicant information and manage applications, 
                                  please use the Export button to download the complete applicant data.
                                </p>
                                <p className="text-sm text-gray-400 mt-3">
                                  The CSV export includes all applicant details, application responses, and uploaded documents.
                                </p>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Users size={64} className="mx-auto text-gray-400 mb-4" />
                    <h4 className="text-xl font-semibold text-gray-700 mb-2">No Applicants Yet</h4>
                    <p className="text-gray-500 max-w-md mx-auto">
                      This job post has not received any applications yet. 
                      Applicants will appear here once they start applying.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Job ID: <span className="font-mono">{selectedJob._id}</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedJob(null);
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

  // Delete Confirmation Modal (same as before)
  const renderDeleteModal = () => {
    if (!showDeleteModal || !selectedJob) return null;

    return (
      <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <Trash2 className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Delete Job Post</h3>
                <p className="text-gray-600">This action cannot be undone</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete this job post?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="font-medium text-red-800">{selectedJob.title}</p>
                <p className="text-sm text-red-600 mt-1">
                  Company: {selectedJob.companyName}<br />
                  Applicants: {selectedJob.applicantsCount || 0}<br />
                  Status: {selectedJob.status}
                </p>
              </div>
              
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This will permanently delete:
                </p>
                <ul className="text-sm text-yellow-700 mt-1 ml-4 list-disc">
                  <li>The job posting</li>
                  <li>All applicant data</li>
                  <li>Application form configuration</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedJob(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteJob}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ===============================
  // MAIN RENDER
  // ===============================
  const filteredJobs = jobs.filter((job) => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        job.title?.toLowerCase().includes(searchLower) ||
        job.description?.toLowerCase().includes(searchLower) ||
        job.companyName?.toLowerCase().includes(searchLower) ||
        job.location?.toLowerCase().includes(searchLower) ||
        job.jobType?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const stats = [
    { 
      label: "Total Jobs", 
      value: jobs.length, 
      color: "#09435F",
      icon: <Briefcase className="text-white" size={20} />
    },
    { 
      label: "Active Jobs", 
      value: jobs.filter(j => j.status === "Open").length, 
      color: "#2E84AE",
      icon: <CheckCircle className="text-white" size={20} />
    },
    { 
      label: "Total Applicants", 
      value: jobs.reduce((sum, job) => sum + (job.applicantsCount || 0), 0), 
      color: "#CDE7F4",
      icon: <Users className="text-blue-800" size={20} />
    },
    { 
      label: "Avg Applicants/Job", 
      value: Math.round(jobs.reduce((sum, job) => sum + (job.applicantsCount || 0), 0) / Math.max(jobs.length, 1)), 
      color: "#09435F",
      icon: <TrendingUp className="text-white" size={20} />
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-6">
      {/* Admin Header */}
       <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 md:p-12 mb-10 shadow-2xl">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">Job Posts Management</h1>
                  <p className="text-gray-300 text-lg">
                    Admin panel for monitoring all job posts across the platform
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-gray-300">Admin Access</p>
                <p className="text-sm text-gray-400">View & Export Only</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20"
                style={{ borderLeftColor: stat.color, borderLeftWidth: '4px' }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-gray-300 text-sm">{stat.label}</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: stat.color + '30' }}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search jobs by title, description, company, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Job Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Company & Location
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Applicants
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Admin Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin w-8 h-8 border-b-2 border-blue-600 rounded-full"></div>
                      <p className="ml-3 text-gray-600">Loading jobs...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-800 text-lg hover:text-blue-600 cursor-pointer" onClick={() => handleViewJob(job._id)}>
                          {job.title}
                        </div>
                        <div className="text-sm text-gray-500 mt-1 flex items-center">
                          <Briefcase size={14} className="mr-1" />
                          {job.jobType}
                          <span className="mx-2">•</span>
                          <Clock size={14} className="mr-1" />
                          {job.experienceRequired?.min || 0} - {job.experienceRequired?.max || "Any"} years
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Building size={16} className="mr-2 text-gray-500" />
                          <span className="font-medium text-gray-800">{job.companyName}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin size={14} className="mr-1" />
                          {job.location}
                          <span className="mx-2">•</span>
                          <Globe size={14} className="mr-1" />
                          {job.workMode}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          job.status === "Open" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {job.status === "Open" ? (
                            <CheckCircle size={14} className="mr-1" />
                          ) : (
                            <XCircle size={14} className="mr-1" />
                          )}
                          {job.status}
                        </span>
                        {job.applicationDeadline && (
                          <div className="text-xs text-gray-500 flex items-center">
                            <Calendar size={12} className="mr-1" />
                            Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="relative">
                          <Users size={20} className="text-blue-600" />
                          {job.applicantsCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {job.applicantsCount}
                            </span>
                          )}
                        </div>
                        <div className="ml-3">
                          <div className="font-medium">{job.applicantsCount || 0}</div>
                          <div className="text-xs text-gray-500">applicants</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-800">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewJob(job._id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        
                        {job.applicantsCount > 0 && (
                          <button
                            onClick={() => handleExportApplicants(job)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Export Applicants"
                          >
                            <DownloadIcon size={18} />
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setSelectedJob(job);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Job"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Briefcase size={64} className="text-gray-400 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No Jobs Found</h3>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {renderViewModal()}
      
      {/* Delete Modal */}
      {renderDeleteModal()}
    </div>
  );
};

export default AdminJobPosts;