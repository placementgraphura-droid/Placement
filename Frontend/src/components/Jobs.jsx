// components/InternJobs.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Download,
  FileText,
  Upload,
  User,
  Mail,
  Phone,
  GraduationCap,
  Building,
  Award,
  Star,
  X,
  AlertCircle,
  Lock,
  Users,
  BookOpen,
  Target,
  BriefcaseBusiness,
  Check,
  Shield,
  Crown,
  Zap
} from 'lucide-react';
import { toast } from 'react-toastify';

const InternJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const [applyingJob, setApplyingJob] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationForm, setApplicationForm] = useState(null);
  const [applicationData, setApplicationData] = useState({});
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [planInfo, setPlanInfo] = useState({
    hasJobPackage: false,
    jobPackageType: null,
    maxPackageLPA: null,
    creditsRemaining: 0,
    creditsGiven: 0,
    totalJobPackages: 0,
    activeJobPackage: null
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    jobType: 'all',
    location: 'all',
    workMode: 'all',
    minStipend: '',
    maxStipend: '',
    experienceLevel: 'all'
  });



  // Fetch current plan info from Intern schema
  useEffect(() => {
const fetchPlan = async () => {
  setLoadingPlan(true);
  try {
    const token = localStorage.getItem('interToken');
    const { data } = await axios.get('/api/intern/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (data) {
      // 1️⃣ Get all successful job packages (sorted by date)
      const jobPurchases = (data.purchases || [])
        .filter(p =>
          p.purchaseCategory === 'JOB_PACKAGE' &&
          p.paymentStatus === 'SUCCESS'
        )
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      // 2️⃣ LAST (latest) package
      const activeJobPackage =
        jobPurchases.length > 0
          ? jobPurchases[jobPurchases.length - 1]
          : null;

          console.log(activeJobPackage)

      setPlanInfo({
        hasJobPackage: !!activeJobPackage,
        jobPackageType: activeJobPackage?.jobPackageDetails?.packageType || null,
        maxPackageLPA: activeJobPackage?.jobPackageDetails?.maxPackageLPA || null,
        creditsRemaining: activeJobPackage?.jobPackageDetails?.creditsRemaining || 0,
        creditsGiven: activeJobPackage?.jobPackageDetails?.creditsGiven || 0,
        totalJobPackages: jobPurchases.length,
        activeJobPackage
      });
    }
  } catch (err) {
    console.error('Error fetching plan info:', err);
    setPlanInfo({
      hasJobPackage: false,
      jobPackageType: null,
      maxPackageLPA: null,
      creditsRemaining: 0,
      creditsGiven: 0,
      totalJobPackages: 0,
      activeJobPackage: null
    });
  } finally {
    setLoadingPlan(false);
  }
};

    fetchPlan();
  }, []);

  // Fetch jobs from API
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('interToken');
      const response = await axios.get('/api/hiring/jobs', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          status: 'Open',
          isActive: true
        }
      });

      if (response.data.success) {
        const activeJobs = response.data.data.filter(job =>
          job.status === 'Open' && job.isActive
        );

        // Sort jobs by package eligibility for the user
        const sortedJobs = activeJobs.map(job => {
          const jobMaxSalary = job.salary?.max || 0;
          const jobAnnualSalary = jobMaxSalary; // Convert monthly to annual
          const isEligibleByPackage = (planInfo.maxPackageLPA * 100000) // Convert LPA to rupees
            ? jobAnnualSalary <= (planInfo.maxPackageLPA * 100000) // Convert LPA to rupees
            : false;

          return {
            ...job,
            isEligibleByPackage,
            annualSalary: jobAnnualSalary
          };
        }).sort((a, b) => {
          // Sort by package eligibility first
          if (a.isEligibleByPackage && !b.isEligibleByPackage) return -1;
          if (!a.isEligibleByPackage && b.isEligibleByPackage) return 1;

          // Then by salary (higher first)
          return (b.salary?.max || 0) - (a.salary?.max || 0);
        });

        setJobs(sortedJobs);
        setFilteredJobs(sortedJobs);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      toast.error('Failed to load jobs');
      setJobs([]);
      setFilteredJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch application status
  const fetchApplicationStatus = async () => {
    try {
      const token = localStorage.getItem('interToken');
      const response = await axios.get('/api/intern/jobs/applied', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const appliedJobIds = response.data.data.appliedJobs || [];
        setAppliedJobs(appliedJobIds);
      }
    } catch (error) {
      console.error('Failed to fetch application status:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchApplicationStatus();
  }, [planInfo]);

  // Filter and search jobs
  useEffect(() => {
    let result = jobs;

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(job =>
        job.title?.toLowerCase().includes(searchLower) ||
        job.companyName?.toLowerCase().includes(searchLower) ||
        job.description?.toLowerCase().includes(searchLower) ||
        job.qualifications?.toLowerCase().includes(searchLower) ||
        (job.requiredSkills && job.requiredSkills.some(skill =>
          skill.toLowerCase().includes(searchLower)
        ))
      );
    }

    // Apply filters
    if (filters.jobType !== 'all') {
      result = result.filter(job => job.jobType === filters.jobType);
    }

    if (filters.location !== 'all') {
      if (filters.location === 'remote') {
        result = result.filter(job => job.workMode === 'Remote');
      } else if (filters.location === 'hybrid') {
        result = result.filter(job => job.workMode === 'Hybrid');
      } else {
        result = result.filter(job => job.location?.toLowerCase().includes(filters.location.toLowerCase()));
      }
    }

    if (filters.workMode !== 'all') {
      result = result.filter(job => job.workMode === filters.workMode);
    }

    if (filters.minStipend) {
      result = result.filter(job => {
        const minSalary = job.salary?.min || 0;
        return minSalary >= parseInt(filters.minStipend);
      });
    }

    if (filters.maxStipend) {
      result = result.filter(job => {
        const maxSalary = job.salary?.max || Infinity;
        return maxSalary <= parseInt(filters.maxStipend);
      });
    }

    if (filters.experienceLevel !== 'all') {
      result = result.filter(job => {
        const minExp = job.experienceRequired?.min || 0;
        if (filters.experienceLevel === 'fresher') return minExp === 0;
        if (filters.experienceLevel === '0-2') return minExp <= 2;
        if (filters.experienceLevel === '2-5') return minExp >= 2 && minExp <= 5;
        if (filters.experienceLevel === '5+') return minExp >= 5;
        return true;
      });
    }

    setFilteredJobs(result);
    setCurrentPage(1);
  }, [searchTerm, filters, jobs]);

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  // Check if user can apply to a job based on package LPA limit
  const canApply = (job) => {
    if (appliedJobs.includes(job._id)) return false;
    if (!planInfo.hasJobPackage) return false;
    if (planInfo.creditsRemaining <= 0) return false;

    // Check if job salary is within package LPA limit
    const jobMaxSalary = job.salary?.max || 0;
    const jobAnnualSalary = jobMaxSalary; // Convert monthly to annual

    // If no max package LPA (unlimited), allow all jobs
    if (planInfo.maxPackageLPA === null) return true;

    // Convert LPA to rupees (1 LPA = 100,000 rupees)
    const maxPackageRupees = planInfo.maxPackageLPA * 100000;

    return jobAnnualSalary <= maxPackageRupees;
  };

  // Handle view job details
  const handleViewJobDetails = (job) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  // Handle apply button click
  const handleApplyClick = async (job) => {
    // Check if already applied
    if (appliedJobs.includes(job._id)) {
      toast.info("You have already applied for this job");
      return;
    }

    // Check if can apply
    if (!canApply(job)) {
      if (!planInfo.hasJobPackage) {
        toast.error("Please purchase a job package to apply for jobs");
      } else if (planInfo.creditsRemaining <= 0) {
        toast.error("You have no job credits remaining");
      } else {
        const jobAnnualSalary = (job.salary?.max || 0);
        const maxAllowed = planInfo.maxPackageLPA * 100000;
        toast.error(`This job's salary (₹${jobAnnualSalary.toLocaleString()}/year) exceeds your package limit (₹${maxAllowed.toLocaleString()}/year)`);
      }
      return;
    }

    // Check if job is still open
    if (job.status !== 'Open' || !job.isActive) {
      toast.error("This job is no longer accepting applications");
      return;
    }

    setApplyingJob(job);

    try {
      const token = localStorage.getItem("interToken");
      const { data } = await axios.get(
        `/api/intern/jobs/${job._id}/application-form`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        const form = data.data;
        setApplicationForm(form);

        // Initialize form values
        const initialData = {};

        // Add basic required fields
        initialData.full_name = "";
        initialData.email = "";
        initialData.mobile_number = "";
        initialData.resume = null;
        initialData.cover_letter = "";

        // Initialize custom fields
        form.customFields?.forEach((field) => {
          switch (field.fieldType) {
            case "checkbox":
              initialData[field.fieldKey] = field.defaultValue || [];
              break;
            case "file":
              initialData[field.fieldKey] = field.defaultValue || null;
              break;
            default:
              initialData[field.fieldKey] = field.defaultValue || "";
          }
        });

        setApplicationData(initialData);
        setShowApplicationForm(true);
        setShowJobDetails(false);
      }
    } catch (error) {
      console.error("Failed to fetch application form:", error);
      toast.error("Failed to load application form");
      setApplyingJob(null);
    }
  };

  // Handle form field change
  const handleFormChange = (fieldKey, value) => {
    setApplicationData(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  // Handle file upload
  const handleFileUpload = async (fieldKey, file, maxSizeMB = 5, allowedTypes = ['pdf', 'doc', 'docx']) => {
    if (!file) return;

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size should be less than ${maxSizeMB}MB`);
      return;
    }

    // Validate file type
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      toast.error(`Please upload ${allowedTypes.join(', ').toUpperCase()} files only`);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('interToken');
      const response = await axios.post('/api/intern/upload/resume', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setApplicationData(prev => ({
          ...prev,
          [fieldKey]: response.data.fileUrl
        }));
        toast.success('File uploaded successfully');
      }
    } catch (error) {
      console.error('File upload failed:', error);
      toast.error('Failed to upload file');
    }
  };

  // Submit application form
  const handleSubmitApplication = async () => {
    if (!applyingJob) return;

    // Validate required fields
    const requiredFields = applicationForm?.customFields?.filter(field => field.required) || [];
    const missingFields = [];

    // Check basic required fields
    if (!applicationData.full_name?.trim()) missingFields.push('Full Name');
    if (!applicationData.email?.trim()) missingFields.push('Email');
    if (!applicationData.mobile_number?.trim()) missingFields.push('Mobile Number');
    if (!applicationData.resume) missingFields.push('Resume');

    // Check custom required fields
    requiredFields.forEach(field => {
      const value = applicationData[field.fieldKey];
      if (!value || (Array.isArray(value) && value.length === 0) || value.toString().trim() === '') {
        missingFields.push(field.label);
      }
    });

    if (missingFields.length > 0) {
      toast.error(`Please fill in required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicationData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Validate mobile number
    const mobileRegex = /^\d{10}$/;
    if (!mobileRegex.test(applicationData.mobile_number)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      const token = localStorage.getItem('interToken');
      const response = await axios.post(
        `/api/intern/jobs/${applyingJob._id}/apply`,
        {
          formData: applicationData,
          jobId: applyingJob._id
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success('Application submitted successfully!');

        // Update local state
        setAppliedJobs(prev => [...prev, applyingJob._id]);
        setPlanInfo(prev => ({
          ...prev,
          creditsRemaining: prev.creditsRemaining - 1
        }));

        // Close form
        setShowApplicationForm(false);
        setApplyingJob(null);
        setApplicationData({});
        setApplicationForm(null);

        // Refresh jobs to update applied status
        fetchJobs();
        fetchApplicationStatus();
      }
    } catch (error) {
      console.error('Failed to submit application:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    }
  };

  // Render application form modal
  const renderApplicationForm = () => {
    if (!showApplicationForm || !applicationForm || !applyingJob) return null;

    return (
      <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[150vh] overflow-y-auto">
          {/* Form Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Apply for {applyingJob.title}</h2>
              <p className="text-gray-600">{applyingJob.companyName} • {applyingJob.location}</p>
              <div className="flex items-center mt-2 text-sm">
                <Shield size={16} className="text-blue-600 mr-1" />
                <span className="text-blue-600">
                  Package: {planInfo.jobPackageType} •
                  <span className="ml-2 font-semibold">Credits left: {planInfo.creditsRemaining}</span>
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setShowApplicationForm(false);
                setApplyingJob(null);
                setApplicationData({});
                setApplicationForm(null);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-8">
            {/* Job Summary */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Job Summary</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="font-medium">Position:</span> {applyingJob.title}</div>
                <div><span className="font-medium">Company:</span> {applyingJob.companyName}</div>
                <div><span className="font-medium">Location:</span> {applyingJob.location}</div>
                <div><span className="font-medium">Type:</span> {applyingJob.jobType}</div>
                <div><span className="font-medium">Mode:</span> {applyingJob.workMode}</div>
                <div><span className="font-medium">Monthly Salary:</span> ₹{applyingJob.salary?.min || 'Not Given'} - ₹{applyingJob.salary?.max || 'Not Given'}</div>
                <div className="col-span-2">
                  <span className="font-medium">Annual Salary:</span>
                  <span className={`ml-2 font-bold ${canApply(applyingJob) ? 'text-green-600' : 'text-red-600'
                    }`}>
                    ₹{((applyingJob.salary?.max || 0)).toLocaleString()}
                  </span>
                  {planInfo.maxPackageLPA !== null && (
                    <span className="text-gray-600 ml-2">
                      (Package Limit: ₹{(planInfo.maxPackageLPA * 100000).toLocaleString()}/year)
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Custom Fields Section */}
            {applicationForm.customFields && applicationForm.customFields.length > 0 && (
              <div className="border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h3>
                <div className="space-y-6">
                  {applicationForm.customFields
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((field, index) => (
                      <div key={index} className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                          {field.label} {field.required && <span className="text-red-500">*</span>}
                          {field.placeholder && (
                            <span className="text-xs text-gray-500 ml-2">({field.placeholder})</span>
                          )}
                        </label>

                        {renderFieldInput(field)}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Package Usage Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="text-yellow-600 mr-2 mt-0.5" size={18} />
                <div className="text-sm text-yellow-700">
                  <p className="font-medium mb-2">Using Job Credits:</p>
                  <ul className="space-y-1">
                    <li className="flex items-start">
                      <Check size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                      This application will use 1 job credit from your {planInfo.jobPackageType} package
                    </li>
                    <li className="flex items-start">
                      <Check size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                      Credits remaining after this application: {planInfo.creditsRemaining - 1}
                    </li>
                    <li className="flex items-start">
                      <Check size={14} className="mr-2 mt-0.5 flex-shrink-0" />
                      Job must be within your package salary limit of ₹{(planInfo.maxPackageLPA * 100000).toLocaleString()}/year
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Form Footer */}
          <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <div className="flex items-center">
                <Lock size={14} className="mr-1" />
                Your application data is secure and encrypted
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowApplicationForm(false);
                  setApplyingJob(null);
                  setApplicationData({});
                  setApplicationForm(null);
                }}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitApplication}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
                disabled={applyingJob === null}
              >
                <CheckCircle size={18} className="mr-2" />
                Submit Application (Use 1 Credit)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render field input based on type
  const renderFieldInput = (field) => {
    const value = applicationData[field.fieldKey] || field.defaultValue || '';
    const validation = field.validation || {};

    switch (field.fieldType) {
      case 'text':
      case 'email':
      case 'phone':
      case 'url':
      case 'number':
        return (
          <input
            type={field.fieldType === 'number' ? 'number' : 'text'}
            value={value}
            onChange={(e) => handleFormChange(field.fieldKey, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            min={validation.minValue}
            max={validation.maxValue}
            minLength={validation.minLength}
            maxLength={validation.maxLength}
            pattern={validation.regex}
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleFormChange(field.fieldKey, e.target.value)}
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            minLength={validation.minLength}
            maxLength={validation.maxLength}
            required={field.required}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleFormChange(field.fieldKey, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={field.required}
          >
            <option value="">Select an option</option>
            {field.options?.map((option, idx) => (
              <option key={idx} value={option.value}>{option.label}</option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <label key={idx} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name={field.fieldKey}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleFormChange(field.fieldKey, e.target.value)}
                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  required={field.required}
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'file':
        return (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
            {value ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="text-green-600 mr-2" size={20} />
                  <div>
                    <span className="text-sm font-medium">File uploaded</span>
                    <p className="text-xs text-gray-500">Click replace to upload a new file</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleFormChange(field.fieldKey, '')}
                    className="text-red-600 text-sm hover:text-red-800"
                  >
                    Remove
                  </button>
                  <label className="cursor-pointer text-blue-600 text-sm hover:text-blue-800">
                    Replace
                    <input
                      type="file"
                      accept={validation.fileTypes?.map(t => `.${t}`).join(',') || ".pdf,.doc,.docx"}
                      className="hidden"
                      onChange={(e) => handleFileUpload(
                        field.fieldKey,
                        e.target.files[0],
                        validation.maxFileSizeMB || 5,
                        validation.fileTypes || ['pdf', 'doc', 'docx']
                      )}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                  Choose File
                  <input
                    type="file"
                    accept={validation.fileTypes?.map(t => `.${t}`).join(',') || ".pdf,.doc,.docx"}
                    className="hidden"
                    onChange={(e) => handleFileUpload(
                      field.fieldKey,
                      e.target.files[0],
                      validation.maxFileSizeMB || 5,
                      validation.fileTypes || ['pdf', 'doc', 'docx']
                    )}
                    required={field.required}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Max size: {validation.maxFileSizeMB || 5}MB •
                  Allowed: {validation.fileTypes?.join(', ')?.toUpperCase() || "PDF, DOC, DOCX"}
                </p>
              </div>
            )}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleFormChange(field.fieldKey, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={field.required}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleFormChange(field.fieldKey, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
            required={field.required}
          />
        );
    }
  };

  // Render job details modal
  const renderJobDetails = () => {
    if (!showJobDetails || !selectedJob) return null;

    const jobMaxSalary = selectedJob.salary?.max || 0;
    const jobAnnualSalary = jobMaxSalary * 12;
    const canApplyJob = canApply(selectedJob);

    return (
      <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Modal Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                <p className="text-lg text-blue-600 font-medium mt-1">{selectedJob.companyName}</p>
              </div>
              <button
                onClick={() => {
                  setShowJobDetails(false);
                  setSelectedJob(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            {/* Job Quick Info */}
            <div className="flex flex-wrap gap-4 mt-4 text-sm">
              <div className="flex items-center text-gray-600">
                <MapPin size={16} className="mr-2" />
                {selectedJob.location}
              </div>
              <div className="flex items-center text-gray-600">
                <Briefcase size={16} className="mr-2" />
                {selectedJob.jobType}
              </div>
              <div className="flex items-center text-gray-600">
                <Clock size={16} className="mr-2" />
                {selectedJob.workMode}
              </div>
              <div className="flex items-center text-gray-600">
                <DollarSign size={16} className="mr-2" />
                ₹{selectedJob.salary?.min || 'Not Given'} - ₹{selectedJob.salary?.max || 'Not Given'} / month
              </div>
              <div className="flex items-center text-gray-600">
                <Users size={16} className="mr-2" />
                {selectedJob.totalVacancies} vacancy{selectedJob.totalVacancies !== 1 ? 'ies' : ''}
              </div>
              {selectedJob.applicationDeadline && (
                <div className="flex items-center text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  Apply Before: {new Date(selectedJob.applicationDeadline).toDateString()}
                </div>
              )}
            </div>

            {/* Package Eligibility Banner */}
            {planInfo.hasJobPackage && (
              <div className={`mt-4 p-3 rounded-lg ${canApplyJob ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <div className="flex items-center">
                  {canApplyJob ? (
                    <CheckCircle size={20} className="text-green-600 mr-2" />
                  ) : (
                    <AlertCircle size={20} className="text-red-600 mr-2" />
                  )}
                  <div>
                    <span className={`font-medium ${canApplyJob ? 'text-green-700' : 'text-red-700'}`}>
                      {canApplyJob ? 'Eligible for your package' : 'Not eligible for your package'}
                    </span>
                    <p className="text-sm mt-1">
                      Annual Salary: ₹{jobAnnualSalary.toLocaleString()}
                      {planInfo.maxPackageLPA !== null && (
                        <span className="ml-2">
                          • Your Package Limit: ₹{(planInfo.maxPackageLPA * 100000).toLocaleString()}/year
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">
            {/* Job Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <BookOpen size={18} className="mr-2" />
                Job Description
              </h3>
              <div className="prose max-w-none text-gray-700">
                {selectedJob.description.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-3">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Qualifications */}
            {selectedJob.qualifications && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <GraduationCap size={18} className="mr-2" />
                  Qualifications
                </h3>
                <div className="prose max-w-none text-gray-700">
                  {selectedJob.qualifications.split('\n').map((line, idx) => (
                    <p key={idx} className="mb-1">{line}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Required Skills */}
            {selectedJob.requiredSkills && selectedJob.requiredSkills.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <Target size={18} className="mr-2" />
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.requiredSkills.map((skill, idx) => (
                    <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Experience Required */}
            {(selectedJob.experienceRequired?.min || selectedJob.experienceRequired?.max) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <BriefcaseBusiness size={18} className="mr-2" />
                  Experience Required
                </h3>
                <div className="text-gray-700">
                  {selectedJob.experienceRequired.min === 0 && !selectedJob.experienceRequired.max ? (
                    "Freshers can apply"
                  ) : (
                    <>
                      {selectedJob.experienceRequired.min}
                      {selectedJob.experienceRequired.max ?
                        ` - ${selectedJob.experienceRequired.max} years` :
                        '+ years'
                      }
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Package Details */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <Shield size={18} className="mr-2 text-blue-600" />
                Package & Eligibility
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{planInfo.creditsRemaining}</div>
                  <div className="text-sm text-gray-600">Credits Left</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">
                    {planInfo.jobPackageType || 'None'}
                  </div>
                  <div className="text-sm text-gray-600">Package Type</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">
                    {planInfo.maxPackageLPA !== null ? `₹${(planInfo.maxPackageLPA * 100000).toLocaleString()}` : 'Unlimited'}
                  </div>
                  <div className="text-sm text-gray-600">Annual Limit</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-orange-600">
                    {canApplyJob ? 'Yes' : 'No'}
                  </div>
                  <div className="text-sm text-gray-600">Can Apply</div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Posted on {new Date(selectedJob.createdAt).toLocaleDateString()}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowJobDetails(false);
                  setSelectedJob(null);
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowJobDetails(false);
                  handleApplyClick(selectedJob);
                }}
                disabled={appliedJobs.includes(selectedJob._id) || !canApplyJob}
                className={`px-4 py-2 rounded-lg font-medium flex items-center ${appliedJobs.includes(selectedJob._id)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : !planInfo.hasJobPackage
                      ? 'bg-red-100 text-red-400 cursor-not-allowed'
                      : !canApplyJob
                        ? 'bg-yellow-100 text-yellow-600 cursor-not-allowed'
                        : planInfo.creditsRemaining <= 0
                          ? 'bg-orange-100 text-orange-600 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
              >
                {appliedJobs.includes(selectedJob._id) ? (
                  <>
                    <CheckCircle size={16} className="mr-2" />
                    Already Applied
                  </>
                ) : !planInfo.hasJobPackage ? (
                  <>
                    <Lock size={16} className="mr-2" />
                    No Package
                  </>
                ) : !canApplyJob ? (
                  <>
                    <AlertCircle size={16} className="mr-2" />
                    Salary Exceeds Limit
                  </>
                ) : planInfo.creditsRemaining <= 0 ? (
                  <>
                    <XCircle size={16} className="mr-2" />
                    No Credits Left
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} className="mr-2" />
                    Apply Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render job card
  const renderJobCard = (job) => {
    const isApplied = appliedJobs.includes(job._id);
    const canApplyJob = canApply(job);
    const jobMaxSalary = job.salary?.max || 0;
    const jobAnnualSalary = jobMaxSalary;
    const packageLimit = planInfo.maxPackageLPA ? planInfo.maxPackageLPA * 100000 : null;

    return (
      <div key={job._id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                {job.isEligibleByPackage && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    <Check size={12} className="mr-1" />
                    Eligible
                  </span>
                )}
              </div>
              <p className="text-lg text-blue-600 font-medium">{job.companyName}</p>
            </div>
            {isApplied && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <CheckCircle size={14} className="mr-1" />
                Applied
              </span>
            )}
          </div>

          {/* Job Details Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div className="flex items-center text-gray-600">
              <MapPin size={14} className="mr-2" />
              <span className="truncate">{job.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Briefcase size={14} className="mr-2" />
              {job.jobType}
            </div>
            <div className="flex items-center text-gray-600">
              <Clock size={14} className="mr-2" />
              {job.workMode}
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign size={14} className="mr-2" />
              ₹{job.salary?.min || 'Not Given'} - ₹{job.salary?.max || 'Not Given'}
            </div>
          </div>

          {/* Package Eligibility Info */}
          {planInfo.hasJobPackage && packageLimit !== null && (
            <div className={`mb-4 p-2.5 rounded-lg text-sm ${job.isEligibleByPackage
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
              <div className="flex items-center">
                {job.isEligibleByPackage ? (
                  <Check size={14} className="mr-2" />
                ) : (
                  <AlertCircle size={14} className="mr-2" />
                )}
                <span>
                  {job.isEligibleByPackage
                    ? 'Eligible for your package'
                    : 'Exceeds your package limit'
                  }
                </span>
              </div>
              <div className="text-xs mt-1 flex justify-between">
                <span>Annual: ₹{jobAnnualSalary.toLocaleString()}</span>
                <span>Limit: ₹{packageLimit.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Description Preview */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {job.description.substring(0, 120)}...
          </p>

          {/* Skills */}
          {job.requiredSkills && job.requiredSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {job.requiredSkills.slice(0, 3).map((skill, index) => (
                <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  {skill}
                </span>
              ))}
              {job.requiredSkills.length > 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-600">
                  +{job.requiredSkills.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t">
            <button
              onClick={() => handleViewJobDetails(job)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center hover:underline"
            >
              <Eye size={14} className="mr-1.5" />
              View Details
            </button>

            <div className="flex items-center space-x-2">
              {!planInfo.hasJobPackage && (
                <span className="text-xs text-red-600 flex items-center">
                  <Lock size={12} className="mr-1" />
                  No Package
                </span>
              )}
              {planInfo.hasJobPackage && !job.isEligibleByPackage && (
                <span className="text-xs text-yellow-600 flex items-center">
                  <AlertCircle size={12} className="mr-1" />
                  Salary Limit
                </span>
              )}
              <button
                onClick={() => handleApplyClick(job)}
                disabled={isApplied || !canApplyJob}
                className={`px-5 py-2 rounded-lg font-medium transition-colors flex items-center text-sm ${isApplied
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : !canApplyJob
                      ? 'bg-red-50 text-red-400 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
              >
                {isApplied ? (
                  <>
                    <CheckCircle size={14} className="mr-1.5" />
                    Applied
                  </>
                ) : !canApplyJob ? (
                  <>
                    <Lock size={14} className="mr-1.5" />
                    Cannot Apply
                  </>
                ) : (
                  'Apply Now'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Get package icon based on type
  const getPackageIcon = (type) => {
    switch (type) {
      case 'SUPER_BLUE': return <Crown size={20} className="text-purple-500" />;
      case 'BLUE': return <Zap size={20} className="text-blue-500" />;
      case 'NON_BLUE': return <Briefcase size={20} className="text-green-500" />;
      case 'Silver': return <Shield size={20} className="text-gray-500" />;
      default: return <Shield size={20} className="text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Available Internships & Jobs</h1>
          <div className="flex flex-col md:flex-row md:items-center justify-between mt-4 space-y-3 md:space-y-0">
            <div className="text-gray-600">
              {loadingPlan ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Loading package info...
                </div>
              ) : planInfo.hasJobPackage ? (
                <div className="flex items-center">
                  {getPackageIcon(planInfo.jobPackageType)}
                  <span className="ml-2 font-medium">
                    {planInfo.jobPackageType} Package •
                    <span className="ml-2 text-blue-600">{planInfo.creditsRemaining} Credits Left</span>
                    {planInfo.maxPackageLPA !== null && (
                      <span className="ml-2 text-green-600">
                        • Limit: ₹{(planInfo.maxPackageLPA * 100000).toLocaleString()}/year
                      </span>
                    )}
                  </span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <AlertCircle size={18} className="mr-2" />
                  <span>
                    No active job package •
                    <a href="/pricing" className="underline font-medium ml-1">Purchase a package to apply</a>
                  </span>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600 bg-white px-3 py-1.5 rounded-lg border">
              Applied: <span className="font-semibold">{appliedJobs.length}</span> jobs
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search jobs by title, company, skills, qualifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Filter size={16} className="mr-2" />
              <span>{filteredJobs.length} jobs found</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <select
                value={filters.jobType}
                onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Types</option>
                <option value="Internship">Internship</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contract">Contract</option>
                <option value="Freelance">Freelance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Mode</label>
              <select
                value={filters.workMode}
                onChange={(e) => setFilters({ ...filters, workMode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="all">All Modes</option>
                <option value="Onsite">Onsite</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Salary (₹)</label>
              <input
                type="number"
                placeholder="Min"
                value={filters.minStipend}
                onChange={(e) => setFilters({ ...filters, minStipend: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Salary (₹)</label>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxStipend}
                onChange={(e) => setFilters({ ...filters, maxStipend: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setFilters({
                  jobType: 'all',
                  location: 'all',
                  workMode: 'all',
                  minStipend: '',
                  maxStipend: '',
                  experienceLevel: 'all'
                })}
                className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Job Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-blue-600">{filteredJobs.length}</div>
            <div className="text-xs md:text-sm text-gray-600">Available Jobs</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-green-600">
              {filteredJobs.filter(job => job.isEligibleByPackage).length}
            </div>
            <div className="text-xs md:text-sm text-gray-600">Eligible Jobs</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-purple-600">{planInfo.creditsRemaining}</div>
            <div className="text-xs md:text-sm text-gray-600">Credits Left</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-orange-600">{appliedJobs.length}</div>
            <div className="text-xs md:text-sm text-gray-600">Applied Jobs</div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-3 md:p-4 text-center">
            <div className="text-xl md:text-2xl font-bold text-red-600">
              {planInfo.totalJobPackages}
            </div>
            <div className="text-xs md:text-sm text-gray-600">Active Packages</div>
          </div>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredJobs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8">
              {currentJobs.map(renderJobCard)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col md:flex-row items-center justify-between mt-8 space-y-4 md:space-y-0">
                <div className="text-sm text-gray-600">
                  Showing {Math.min(indexOfFirstJob + 1, filteredJobs.length)} to {Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} jobs
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`px-3 py-1 rounded-lg text-sm ${currentPage === idx + 1
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {idx + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({
                  jobType: 'all',
                  location: 'all',
                  workMode: 'all',
                  minStipend: '',
                  maxStipend: '',
                  experienceLevel: 'all'
                });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Package Upgrade Banner (if no package) */}
        {!loadingPlan && !planInfo.hasJobPackage && (
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-4 md:p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg md:text-xl font-bold mb-2">🚀 Get Job Application Credits</h3>
                <p className="opacity-90 text-sm md:text-base">Purchase a job package to start applying for jobs with credit-based system!</p>
                <div className="mt-3 text-sm">
                  <div className="flex items-center mb-1">
                    <Check size={16} className="mr-2" />
                    Apply to jobs within your package salary limit
                  </div>
                  <div className="flex items-center mb-1">
                    <Check size={16} className="mr-2" />
                    Credits don't expire - use them anytime
                  </div>
                  <div className="flex items-center">
                    <Check size={16} className="mr-2" />
                    Higher packages = higher salary limits
                  </div>
                </div>
              </div>
              <a
                href="/pricing"
                className="inline-block px-5 py-2.5 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-center text-sm md:text-base mt-4 md:mt-0"
              >
                View Packages
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Application Form Modal */}
      {renderApplicationForm()}

      {/* Job Details Modal */}
      {renderJobDetails()}
    </div>
  );
};

export default InternJobs;