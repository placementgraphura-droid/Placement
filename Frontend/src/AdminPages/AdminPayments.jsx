import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Filter,
  Calendar,
  User,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  DollarSign,
  CreditCard,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  FileText,
  TrendingUp,
  Users,
  Building,
  BookOpen,
  Download as DownloadIcon,
  CreditCard as CreditCardIcon,
  UserCheck,
  Percent,
  Package,
  Award,
  BarChart3,
  ExternalLink,
  FileSpreadsheet,
  File,
  Filter as FilterIcon,
  RefreshCw,
  ArrowRight,
  Copy,
  MoreVertical,
} from "lucide-react";
import { toast } from "react-toastify";

// ===============================
// ADMIN PAYMENTS COMPONENT
// ===============================
const AdminPayments = () => {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    category: "all",
    status: "all",
    packageType: "all",
    courseType: "all",
  });
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [expandedRows, setExpandedRows] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // "list" or "details"
  const [paymentStats, setPaymentStats] = useState({
    totalRevenue: 0,
    totalPurchases: 0,
    totalInterns: 0,
    avgPurchaseValue: 0,
    jobPackages: 0,
    courses: 0,
  });

  // Filter options
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "COURSE", label: "Courses" },
    { value: "JOB_PACKAGE", label: "Job Packages" },
  ];

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "SUCCESS", label: "Successful" },
    { value: "FAILED", label: "Failed" },
    { value: "PENDING", label: "Pending" },
  ];

  const packageTypeOptions = [
    { value: "all", label: "All Packages" },
    { value: "Silver", label: "Silver" },
    { value: "NON_BLUE", label: "Non-Blue" },
    { value: "BLUE", label: "Blue" },
    { value: "SUPER_BLUE", label: "Super Blue" },
  ];

  const courseTypeOptions = [
    { value: "all", label: "All Courses" },
    { value: "CV_BUILDING", label: "CV Building" },
    { value: "INTERVIEW_PREP", label: "Interview Prep" },
    { value: "COMBO", label: "Combo" },
  ];

  const getToken = () => {
    return localStorage.getItem("adminToken");
  };

  // Fetch all interns with their payment data
  const fetchInternsWithPayments = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get("/api/admin/interns/payments", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setInterns(response.data.data || []);
        calculatePaymentStats(response.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch interns with payments:", error);
      toast.error("Failed to load payment data");
      setInterns([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate payment statistics
  const calculatePaymentStats = (internsData) => {
    let totalRevenue = 0;
    let totalPurchases = 0;
    let totalJobPackages = 0;
    let totalCourses = 0;
    const purchaseValues = [];

    internsData.forEach((intern) => {
      if (intern.purchases && intern.purchases.length > 0) {
        intern.purchases.forEach((purchase) => {
          if (purchase.paymentStatus === "SUCCESS") {
            totalRevenue += purchase.amountPaid || 0;
            totalPurchases++;
            purchaseValues.push(purchase.amountPaid || 0);

            if (purchase.purchaseCategory === "JOB_PACKAGE") {
              totalJobPackages++;
            } else if (purchase.purchaseCategory === "COURSE") {
              totalCourses++;
            }
          }
        });
      }
    });

    const avgPurchaseValue = purchaseValues.length > 0 
      ? Math.round(purchaseValues.reduce((a, b) => a + b, 0) / purchaseValues.length)
      : 0;

    setPaymentStats({
      totalRevenue,
      totalPurchases,
      totalInterns: internsData.length,
      avgPurchaseValue,
      jobPackages: totalJobPackages,
      courses: totalCourses,
    });
  };

  useEffect(() => {
    fetchInternsWithPayments();
  }, []);

  // Toggle row expansion
  const toggleRowExpansion = (internId) => {
    setExpandedRows((prev) =>
      prev.includes(internId)
        ? prev.filter((id) => id !== internId)
        : [...prev, internId]
    );
  };



  // Export all payment data
  const handleExportAllPayments = async () => {
    setExporting(true);
    try {
      const token = getToken();
      const response = await axios.get("/api/admin/payments/export-all", {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      // Create download link
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `all_payments_${new Date().toISOString().split('T')[0]}.csv`);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("All payment data exported successfully!");
    } catch (error) {
      console.error("Failed to export payment data:", error);
      toast.error("Failed to export payment data");
    } finally {
      setExporting(false);
    }
  };

  // Export single intern payment data
  const handleExportInternPayments = (intern) => {
    try {
      // Create CSV data
      const headers = [
        "Intern Name",
        "Email",
        "Phone",
        "College",
        "Course",
        "Purchase Category",
        "Package/Course Type",
        "Amount Paid",
        "Currency",
        "Payment Status",
        "Payment Date",
        "Credits Given",
        "Credits Remaining",
        "Total Sessions",
        "Live Sessions",
        "Recorded Sessions",
      ];

      let csvContent = headers.join(",") + "\n";

      if (intern.purchases && intern.purchases.length > 0) {
        intern.purchases.forEach((purchase) => {
          const row = [
            `"${intern.name}"`,
            `"${intern.email}"`,
            `"${intern.phone || ""}"`,
            `"${intern.college || ""}"`,
            `"${intern.course || ""}"`,
            `"${purchase.purchaseCategory}"`,
            `"${purchase.purchaseCategory === "JOB_PACKAGE" 
              ? purchase.jobPackageDetails?.packageType || ""
              : purchase.courseDetails?.courseType || ""}"`,
            purchase.amountPaid || 0,
            `"${purchase.currency || "INR"}"`,
            `"${purchase.paymentStatus}"`,
            `"${new Date(purchase.purchasedAt).toLocaleDateString()}"`,
            purchase.jobPackageDetails?.creditsGiven || 0,
            purchase.jobPackageDetails?.creditsRemaining || 0,
            purchase.courseDetails?.totalSessions || 0,
            purchase.courseDetails?.liveSessions || 0,
            purchase.courseDetails?.recordedSessions || 0,
          ];
          csvContent += row.join(",") + "\n";
        });
      }

      // Create blob and download
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const safeName = intern.name.replace(/[^a-zA-Z0-9]/g, "_");
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${safeName}_payments.csv`);

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Payment data for ${intern.name} exported successfully!`);
    } catch (error) {
      console.error("Failed to export intern payments:", error);
      toast.error("Failed to export payment data");
    }
  };

  // Filter interns based on search and filters
  const filteredInterns = interns.filter((intern) => {
    // Search term filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        intern.name?.toLowerCase().includes(searchLower) ||
        intern.email?.toLowerCase().includes(searchLower) ||
        intern.phone?.toLowerCase().includes(searchLower) ||
        intern.college?.toLowerCase().includes(searchLower) ||
        intern.course?.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    // Check if intern has purchases
    if (!intern.purchases || intern.purchases.length === 0) {
      return selectedFilters.category === "all" && selectedFilters.status === "all";
    }

    // Filter by purchase category
    if (selectedFilters.category !== "all") {
      const hasMatchingCategory = intern.purchases.some(
        (p) => p.purchaseCategory === selectedFilters.category
      );
      if (!hasMatchingCategory) return false;
    }

    // Filter by payment status
    if (selectedFilters.status !== "all") {
      const hasMatchingStatus = intern.purchases.some(
        (p) => p.paymentStatus === selectedFilters.status
      );
      if (!hasMatchingStatus) return false;
    }

    // Filter by package type (for job packages)
    if (selectedFilters.packageType !== "all") {
      const hasMatchingPackage = intern.purchases.some(
        (p) => 
          p.purchaseCategory === "JOB_PACKAGE" &&
          p.jobPackageDetails?.packageType === selectedFilters.packageType
      );
      if (!hasMatchingPackage) return false;
    }

    // Filter by course type
    if (selectedFilters.courseType !== "all") {
      const hasMatchingCourse = intern.purchases.some(
        (p) => 
          p.purchaseCategory === "COURSE" &&
          p.courseDetails?.courseType === selectedFilters.courseType
      );
      if (!hasMatchingCourse) return false;
    }

    return true;
  });

  // Render payment status badge
  const renderPaymentStatus = (status) => {
    const config = {
      SUCCESS: { color: "bg-green-100 text-green-800", icon: <CheckCircle size={12} /> },
      FAILED: { color: "bg-red-100 text-red-800", icon: <XCircle size={12} /> },
      PENDING: { color: "bg-yellow-100 text-yellow-800", icon: <Clock size={12} /> },
    };

    const { color, icon } = config[status] || config.PENDING;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {icon}
        <span className="ml-1">{status}</span>
      </span>
    );
  };

  // Render purchase category badge
  const renderPurchaseCategory = (category) => {
    const config = {
      COURSE: { color: "bg-blue-100 text-blue-800", icon: <BookOpen size={12} />, label: "Course" },
      JOB_PACKAGE: { color: "bg-purple-100 text-purple-800", icon: <Briefcase size={12} />, label: "Job Package" },
    };

    const { color, icon, label } = config[category] || { color: "bg-gray-100 text-gray-800", icon: null, label: category };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {icon}
        <span className="ml-1">{label}</span>
      </span>
    );
  };

  // Render intern details view
  const renderInternDetailsView = () => {
    if (!selectedIntern) return null;

    const totalAmountPaid = selectedIntern.purchases?.reduce((sum, p) => sum + (p.amountPaid || 0), 0) || 0;
    const successfulPayments = selectedIntern.purchases?.filter(p => p.paymentStatus === "SUCCESS").length || 0;
    const totalCreditsGiven = selectedIntern.purchases?.reduce((sum, p) => 
      sum + (p.jobPackageDetails?.creditsGiven || 0), 0) || 0;
    const totalCreditsRemaining = selectedIntern.purchases?.reduce((sum, p) => 
      sum + (p.jobPackageDetails?.creditsRemaining || 0), 0) || 0;

    return (
      <div className="space-y-6">
        {/* Back button */}
        <button
          onClick={() => {
            setSelectedIntern(null);
            setViewMode("list");
          }}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ChevronUp size={16} className="rotate-90 mr-1" />
          Back to List
        </button>

        {/* Intern Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {selectedIntern.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{selectedIntern.name}</h2>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-gray-600 flex items-center">
                    <Mail size={14} className="mr-1" />
                    {selectedIntern.email}
                  </span>
                  <span className="text-gray-600 flex items-center">
                    <Phone size={14} className="mr-1" />
                    {selectedIntern.phone}
                  </span>
                  <span className="text-gray-600 flex items-center">
                    <Building size={14} className="mr-1" />
                    {selectedIntern.college}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleExportInternPayments(selectedIntern)}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <DownloadIcon size={18} className="mr-2" />
              Export Payments
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="flex items-center">
                <CreditCard className="text-blue-600 mr-3" size={20} />
                <div>
                  <p className="text-2xl font-bold text-gray-800">₹{totalAmountPaid.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Spent</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="flex items-center">
                <CheckCircle className="text-green-600 mr-3" size={20} />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{successfulPayments}</p>
                  <p className="text-sm text-gray-600">Successful Payments</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="flex items-center">
                <Award className="text-purple-600 mr-3" size={20} />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{totalCreditsGiven}</p>
                  <p className="text-sm text-gray-600">Total Credits</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow">
              <div className="flex items-center">
                <Percent className="text-orange-600 mr-3" size={20} />
                <div>
                  <p className="text-2xl font-bold text-gray-800">{totalCreditsRemaining}</p>
                  <p className="text-sm text-gray-600">Remaining Credits</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-4">Payment History</h3>
          {selectedIntern.purchases && selectedIntern.purchases.length > 0 ? (
            <div className="space-y-4">
              {selectedIntern.purchases
                .sort((a, b) => new Date(b.purchasedAt) - new Date(a.purchasedAt))
                .map((purchase, index) => (
                  <div key={index} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {renderPurchaseCategory(purchase.purchaseCategory)}
                          {renderPaymentStatus(purchase.paymentStatus)}
                          <span className="text-lg font-bold text-gray-800">
                            ₹{purchase.amountPaid?.toLocaleString()}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(purchase.purchasedAt).toLocaleDateString()}
                        </span>
                      </div>

                      {purchase.purchaseCategory === "COURSE" && (
                        <div className="grid grid-cols-3 gap-4 mt-3">
                          <div className="bg-blue-50 p-3 rounded">
                            <p className="text-xs text-gray-600">Course Type</p>
                            <p className="font-medium text-gray-800">{purchase.courseDetails?.courseType || "N/A"}</p>
                          </div>
                          <div className="bg-blue-50 p-3 rounded">
                            <p className="text-xs text-gray-600">Live Sessions</p>
                            <p className="font-medium text-gray-800">{purchase.courseDetails?.liveSessions || 0}</p>
                          </div>
                          <div className="bg-blue-50 p-3 rounded">
                            <p className="text-xs text-gray-600">Total Sessions</p>
                            <p className="font-medium text-gray-800">{purchase.courseDetails?.totalSessions || 0}</p>
                          </div>
                        </div>
                      )}

                      {purchase.purchaseCategory === "JOB_PACKAGE" && (
                        <div className="grid grid-cols-3 gap-4 mt-3">
                          <div className="bg-purple-50 p-3 rounded">
                            <p className="text-xs text-gray-600">Package Type</p>
                            <p className="font-medium text-gray-800">{purchase.jobPackageDetails?.packageType || "N/A"}</p>
                          </div>
                          <div className="bg-purple-50 p-3 rounded">
                            <p className="text-xs text-gray-600">Credits Given</p>
                            <p className="font-medium text-gray-800">{purchase.jobPackageDetails?.creditsGiven || 0}</p>
                          </div>
                          <div className="bg-purple-50 p-3 rounded">
                            <p className="text-xs text-gray-600">Remaining Credits</p>
                            <p className="font-medium text-gray-800">{purchase.jobPackageDetails?.creditsRemaining || 0}</p>
                          </div>
                        </div>
                      )}

                      <div className="mt-3 pt-3 border-t">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Payment ID: {purchase.paymentId || "N/A"}</span>
                          <span className="text-gray-600">Currency: {purchase.currency || "INR"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <CreditCardIcon size={48} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-700">No payment history found for this intern</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render main list view
  const renderListView = () => (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">₹{paymentStats.totalRevenue.toLocaleString()}</p>
              <p className="text-blue-100">Total Revenue</p>
            </div>
            <DollarSign size={24} />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{paymentStats.totalPurchases}</p>
              <p className="text-green-100">Total Purchases</p>
            </div>
            <CreditCardIcon size={24} />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{paymentStats.totalInterns}</p>
              <p className="text-purple-100">Total Interns</p>
            </div>
            <Users size={24} />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">₹{paymentStats.avgPurchaseValue.toLocaleString()}</p>
              <p className="text-orange-100">Avg Purchase</p>
            </div>
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      {/* Purchase Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Purchase Distribution</h3>
          <div className="flex items-center space-x-4">
            <div className="w-32 h-32 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-800">{paymentStats.jobPackages + paymentStats.courses}</p>
                  <p className="text-sm text-gray-600">Total</p>
                </div>
              </div>
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e5e7eb"
                  strokeWidth="16"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#8b5cf6"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${(paymentStats.jobPackages / (paymentStats.jobPackages + paymentStats.courses)) * 351.86} 351.86`}
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#3b82f6"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${(paymentStats.courses / (paymentStats.jobPackages + paymentStats.courses)) * 351.86} 351.86`}
                  strokeDashoffset={`-${(paymentStats.jobPackages / (paymentStats.jobPackages + paymentStats.courses)) * 351.86}`}
                />
              </svg>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
                <span className="text-gray-700">Job Packages: {paymentStats.jobPackages}</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                <span className="text-gray-700">Courses: {paymentStats.courses}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
            <RefreshCw 
              size={20} 
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={fetchInternsWithPayments}
            />
          </div>
          <div className="space-y-3">
            <button
              onClick={handleExportAllPayments}
              disabled={exporting}
              className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {exporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <Download size={18} className="mr-2" />
                  Export All Payment Data
                </>
              )}
            </button>
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedFilters({
                  category: "all",
                  status: "all",
                  packageType: "all",
                  courseType: "all",
                });
              }}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <FilterIcon size={18} className="mr-2" />
              Clear All Filters
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Interns
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Name, email, college..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purchase Category
            </label>
            <select
              value={selectedFilters.category}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, category: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Status
            </label>
            <select
              value={selectedFilters.status}
              onChange={(e) => setSelectedFilters({ ...selectedFilters, status: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Package/Course Type
            </label>
            <select
              value={
                selectedFilters.category === "COURSE" 
                  ? selectedFilters.courseType 
                  : selectedFilters.packageType
              }
              onChange={(e) => {
                if (selectedFilters.category === "COURSE") {
                  setSelectedFilters({ ...selectedFilters, courseType: e.target.value });
                } else {
                  setSelectedFilters({ ...selectedFilters, packageType: e.target.value });
                }
              }}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {selectedFilters.category === "COURSE"
                ? courseTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
                : packageTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
              }
            </select>
          </div>
        </div>
      </div>

      {/* Interns List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-400">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Intern Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Academic Info
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Payment Summary
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Last Purchase
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
                      <p className="ml-3 text-gray-600">Loading payment data...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredInterns.length > 0 ? (
                filteredInterns.map((intern) => {
                  const totalPurchases = intern.purchases?.length || 0;
                  const totalAmount = intern.purchases?.reduce((sum, p) => sum + (p.amountPaid || 0), 0) || 0;
                  const lastPurchase = intern.purchases?.[0]
                    ? new Date(intern.purchases[0].purchasedAt).toLocaleDateString()
                    : "No purchases";
                  const isExpanded = expandedRows.includes(intern._id);

                  return (
                    <React.Fragment key={intern._id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-800 text-lg">{intern.name}</div>
                            <div className="text-sm text-gray-500 mt-1 flex items-center">
                              <Mail size={14} className="mr-1" />
                              {intern.email}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone size={14} className="mr-1" />
                              {intern.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center">
                              <Building size={16} className="mr-2 text-gray-500" />
                              <span className="text-gray-800">{intern.college}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <BookOpen size={14} className="mr-1" />
                              {intern.course}
                              <span className="mx-2">•</span>
                              Year {intern.yearOfStudy}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="font-medium text-gray-800">
                              ₹{totalAmount.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {totalPurchases} purchase{totalPurchases !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="text-gray-800">{lastPurchase}</div>
                            {intern.purchases?.[0] && (
                              <div className="flex items-center space-x-2">
                                {renderPurchaseCategory(intern.purchases[0].purchaseCategory)}
                                {renderPaymentStatus(intern.purchases[0].paymentStatus)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => toggleRowExpansion(intern._id)}
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              title={isExpanded ? "Collapse" : "Expand"}
                            >
                              {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                            <button
                              onClick={() => handleExportInternPayments(intern)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Export Payments"
                            >
                              <DownloadIcon size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded Row - Purchase Details */}
                      {isExpanded && intern.purchases && intern.purchases.length > 0 && (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 bg-blue-50">
                            <div className="ml-8">
                              <h4 className="font-medium text-gray-800 mb-3">Purchase History</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {intern.purchases.map((purchase, index) => (
                                  <div key={index} className="bg-white rounded-lg p-4 shadow">
                                    <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center space-x-2">
                                        {renderPurchaseCategory(purchase.purchaseCategory)}
                                        {renderPaymentStatus(purchase.paymentStatus)}
                                      </div>
                                      <div className="text-lg font-bold text-gray-800">
                                        ₹{purchase.amountPaid?.toLocaleString()}
                                      </div>
                                    </div>
                                    <div className="text-sm text-gray-600 mb-2">
                                      {new Date(purchase.purchasedAt).toLocaleDateString()}
                                    </div>
                                    {purchase.purchaseCategory === "COURSE" && (
                                      <div className="text-sm text-gray-700">
                                        Course: {purchase.courseDetails?.courseType}<br />
                                        Sessions: {purchase.courseDetails?.liveSessions || 0} live, {purchase.courseDetails?.recordedSessions || 0} recorded
                                      </div>
                                    )}
                                    {purchase.purchaseCategory === "JOB_PACKAGE" && (
                                      <div className="text-sm text-gray-700">
                                        Package: {purchase.jobPackageDetails?.packageType}<br />
                                        Credits: {purchase.jobPackageDetails?.creditsGiven} given, {purchase.jobPackageDetails?.creditsRemaining} remaining
                                      </div>
                                    )}
                                  </div>
                                ))}
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
                      <CreditCardIcon size={64} className="text-gray-400 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No Payment Data Found</h3>
                      <p className="text-gray-500 max-w-md">
                        {searchTerm || Object.values(selectedFilters).some(f => f !== "all")
                          ? "No interns match your current filters. Try adjusting your search criteria."
                          : "No payment data found for any interns."
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
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4 md:p-6">
      {/* Admin Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 md:p-12 mb-10 shadow-2xl">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                  <CreditCardIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">Payment Management</h1>
                  <p className="text-gray-300 text-lg">
                    Admin panel for monitoring all payment transactions
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-gray-200">Admin Access</p>
                <p className="text-sm text-gray-300">View & Export Payments</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {viewMode === "list" ? renderListView() : renderInternDetailsView()}
      </div>
    </div>
  );
};

export default AdminPayments;