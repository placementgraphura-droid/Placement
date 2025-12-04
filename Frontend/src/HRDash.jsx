import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  User,
  Users,
  Briefcase,
  LogOut,
  Home,
  ChevronRight,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Import your components (you'll need to create these)
import Profile from "./HrPages/Profile";
import JobPosts from "./HrPages/JobPosts";
import UsersPage from "./HrPages/Users";
import DashboardOverview from "./HrPages/DashboardOverview";

const HiringTeamDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentCandidates, setRecentCandidates] = useState([]);
  
  // ===============================
  // TOKEN
  // ===============================
  const getToken = () => {
    return localStorage.getItem("HiringTeamToken")
  };

  // ===============================
  // LOGOUT FUNCTION
  // ===============================
  const handleLogout = () => {
    localStorage.removeItem("HiringTeamToken");
    navigate("/hiring-login");
  };

  // ===============================
  // FETCH USER PROFILE
  // ===============================
  const fetchUserProfile = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token found");

      const res = await axios.get("/api/hiring/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.data);
    } catch (err) {
      console.error("Profile Load Failed", err);
    }
  };

  // ===============================
  // FETCH DASHBOARD DATA
  // ===============================
  const fetchDashboardData = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token found");

      const res = await axios.get("/api/hiring/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(res.data);
    } catch (err) {
      console.error("Dashboard API Failed", err);
      // Fallback data
      setDashboardData({
        stats: {
          totalJobs: 24,
          activeJobs: 12,
          candidates: 156,
          interviews: 45,
          pending: 27,
        },
        metrics: {
          timeToHire: 18,
          candidateSatisfaction: 4.5,
          offerAcceptanceRate: 92,
        },
        recentActivity: [
          { id: 1, action: "New candidate applied", time: "2 hours ago" },
          { id: 2, action: "Interview scheduled", time: "4 hours ago" },
          { id: 3, action: "Job posted", time: "1 day ago" },
        ],
      });
    }
  };

  // ===============================
  // FETCH RECENT JOB POSTS
  // ===============================
  const fetchRecentJobs = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get("/api/hiring/jobs/recent", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecentJobs(res.data);
    } catch (err) {
      console.error("Failed to fetch recent jobs:", err);
    }
  };

  // ===============================
  // FETCH RECENT CANDIDATES
  // ===============================
  const fetchRecentCandidates = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get("/api/hiring/candidates/recent", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecentCandidates(res.data);
    } catch (err) {
      console.error("Failed to fetch recent candidates:", err);
      // Fallback data
      setRecentCandidates([
        {
          id: 1,
          name: "Alex Johnson",
          email: "alex@example.com",
          position: "Senior Frontend Developer",
          status: "Interview",
          stage: "Technical Round",
          date: "2024-03-15",
          rating: 4.5,
          avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        {
          id: 2,
          name: "Sarah Miller",
          email: "sarah@example.com",
          position: "Product Manager",
          status: "New",
          stage: "Resume Review",
          date: "2024-03-14",
          rating: 4.2,
          avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        },
        {
          id: 3,
          name: "Michael Chen",
          email: "michael@example.com",
          position: "UX Designer",
          status: "Offer",
          stage: "Final Round",
          date: "2024-03-13",
          rating: 4.8,
          avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        },
      ]);
    }
  };

  // ===============================
  // LOAD ALL DATA
  // ===============================
  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUserProfile(),
        fetchDashboardData(),
        fetchRecentJobs(),
        fetchRecentCandidates(),
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // RESIZE LISTENER + DATA LOAD
  // ===============================
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    loadData();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ===============================
  // BACK TO HOME FUNCTION
  // ===============================
  const handleBackToHome = () => {
    navigate("/");
  };

  // ===============================
  // FORMAT DATE
  // ===============================
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // ===============================
  // GET STATUS COLOR
  // ===============================
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'interview':
      case 'offer':
        return 'bg-green-100 text-green-800';
      case 'draft':
      case 'new':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // ===============================
  // PAGE RENDERING
  // ===============================
  const renderPage = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin w-12 h-12 border-b-2 border-blue-600 rounded-full"></div>
          <p className="ml-4 text-gray-600">Loading Dashboard...</p>
        </div>
      );
    }

    switch (activePage) {
      case "profile":
        return <Profile user={user} setUser={setUser} onUpdate={fetchUserProfile} />;
      case "jobposts":
        return <JobPosts />;
      case "users":
        return <UsersPage />;
      default:
        return (
          <DashboardOverview 
            dashboardData={dashboardData} 
            user={user}
            recentJobs={recentJobs}
            recentCandidates={recentCandidates}
            onJobPostsClick={() => setActivePage("jobposts")}
            onUsersClick={() => setActivePage("users")}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
          />
        );
    }
  };

  // ===============================
  // SIDEBAR MENU
  // ===============================
  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, color: "text-blue-500" },
    { key: "profile", label: "Profile", icon: User, color: "text-green-500" },
    { key: "jobposts", label: "Job Posts", icon: Briefcase, color: "text-purple-500" },
    { key: "users", label: "Candidates", icon: Users, color: "text-indigo-500" },
  ];

  // ===============================
  // SIDEBAR COMPONENT
  // ===============================
  const Sidebar = () => {
    const currentUser = user || {
      name: "John Hiring Manager",
      role: "Senior Recruiter",
      profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    };

    return (
      <div className="w-64 bg-gray-900 text-white flex flex-col h-full">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-blue-700 to-indigo-800">
          <div className="flex items-center">
            <Briefcase className="mr-2" size={24} />
            <div>
              <h1 className="font-bold text-lg">TalentHub</h1>
              <p className="text-xs text-blue-100">Hiring Dashboard</p>
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="p-4 border-b border-gray-800 text-center">
          <img
            src={currentUser.profileImage}
            className="w-16 h-16 mx-auto rounded-full border-2 border-blue-500 shadow-lg"
            alt="Profile"
          />
          <h2 className="font-bold mt-3 text-lg">{currentUser.name}</h2>
          <p className="text-gray-300 text-sm">{currentUser.role}</p>
          {currentUser.department && (
            <p className="text-gray-400 text-xs mt-1">{currentUser.department}</p>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={`w-full flex items-center p-3 rounded-lg mb-1 transition-all ${
                  activePage === item.key 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "hover:bg-gray-800 hover:text-white"
                }`}
                onClick={() => {
                  setActivePage(item.key);
                  if (isMobile) setMobileOpen(false);
                }}
              >
                <Icon className={`mr-3 ${item.color}`} size={20} />
                <span className="font-medium">{item.label}</span>
                {activePage === item.key && (
                  <ChevronRight className="ml-auto" size={16} />
                )}
              </button>
            );
          })}

          {/* Divider */}
          <div className="my-4 border-t border-gray-800"></div>

          {/* Action Buttons */}
          <div className="mt-4 border-t border-gray-800 pt-4 space-y-2">
            <button
              className="w-full flex items-center p-3 rounded-lg hover:bg-blue-800 transition-colors bg-blue-900"
              onClick={handleBackToHome}
            >
              <Home className="mr-3 text-blue-300" size={20} />
              <span className="text-blue-300">Back to Home</span>
            </button>

            <button
              className="w-full flex items-center p-3 rounded-lg hover:bg-red-900 transition-colors text-red-300 hover:text-red-200"
              onClick={handleLogout}
            >
              <LogOut className="mr-3" size={20} />
              <span>Logout</span>
            </button>
          </div>
        </nav>


      </div>
    );
  };

  // ===============================
  // MAIN RETURN UI
  // ===============================
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <button 
                onClick={() => setMobileOpen(true)} 
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg mr-2"
              >
                <Menu />
              </button>
              <h1 className="text-xl font-bold text-gray-800">
                {menuItems.find((m) => m.key === activePage)?.label || "Dashboard"}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Removed: Search Bar */}
              
              {/* Removed: New Job Post Button */}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* User Profile */}
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden md:block">
                    <p className="text-sm font-medium text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.role}</p>
                  </div>
                  <img
                    src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-blue-500"
                  />
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default HiringTeamDashboard;