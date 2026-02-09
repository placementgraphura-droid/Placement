import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard,
  User,
  Users,
  Briefcase,
  LogOut,
  Home,
  ChevronRight,
  Menu,
  LayoutDashboardIcon,
  TrendingUp,
  TrendingDown,
  Calendar,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Eye,
  CheckCircle,
  Clock as ClockIcon,
  XCircle,
  Star,
  Target,
  RefreshCw,
  GraduationCap,
} from "lucide-react";

// Import your page components (you'll need to create these)
import Profile from "./HrPages/Profile";
import JobPosts from "./HrPages/JobPosts";
import UsersPage from "./HrPages/Users";

const formattedDate = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "2-digit",
  month: "short",
  year: "numeric",
}).format(new Date());

const HiringTeamDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [allJobs, setAllJobs] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]);
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentCandidates, setRecentCandidates] = useState([]);

  // ===============================
  // TOKEN & NAVIGATION
  // ===============================
  const getToken = () => {
    return localStorage.getItem("HiringTeamToken");
  };

  const handleLogout = () => {
    localStorage.removeItem("HiringTeamToken");
    navigate("/hiring-team-login");
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  // ===============================
  // DATA FETCHING
  // ===============================
  const fetchUserProfile = async () => {
    try {
      const token = getToken();
      if (!token) {
        navigate("/hiring-team-login");
        return;
      }
      const res = await axios.get("/api/hiring/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setUser(res.data.data);
      }
    } catch (err) {
      console.error("Profile Load Failed", err);
    }
  };

  const fetchAllJobs = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get("/api/hiring/jobs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        const jobs = res.data.data || [];
        setAllJobs(jobs);
        // Get only 5 most recent jobs for display
        setRecentJobs(jobs.slice(0, 5));
      }
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setAllJobs([]);
      setRecentJobs([]);
    }
  };

  const fetchAllCandidates = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get("/api/hiring/interns", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        const interns = res.data.data || [];
        const candidates = interns.map(intern => ({
          _id: intern._id,
          name: intern.name,
          avatar: intern.profileImage,
          position: intern.domain,
          college: intern.college,
          status: "New",
          stage: "Resume Review",
          email: intern.email,
          appliedDate: intern.createdAt,
          rating: intern.hiringTeamFeedback?.length > 0
            ? (intern.hiringTeamFeedback.reduce((sum, f) => sum + f.rating, 0) / intern.hiringTeamFeedback.length).toFixed(1)
            : "No rating"
        }));
        setAllCandidates(candidates);
        // Get only 5 most recent candidates for display
        setRecentCandidates(candidates.slice(0, 5));
      }
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
      setAllCandidates([]);
      setRecentCandidates([]);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchUserProfile(),
        fetchAllJobs(),
        fetchAllCandidates(),
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // USE EFFECTS
  // ===============================
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    loadData();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
      case "new":
      case "active":
        return "bg-green-100 text-green-800";
      case "closed":
      case "rejected":
        return "bg-red-100 text-red-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      case "interview":
        return "bg-purple-100 text-purple-800";
      case "hired":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
      case "active":
        return <CheckCircle size={14} />;
      case "closed":
        return <XCircle size={14} />;
      case "new":
        return <ClockIcon size={14} />;
      default:
        return null;
    }
  };

  const mainStats = [
    {
      label: "Total Jobs",
      value: allJobs.length,
      icon: Briefcase,
      color: "#6366F1", // indigo
      bgColor: "bg-indigo-500/10",
      hover: "hover:bg-indigo-50",
      onClick: () => setActivePage("jobposts")
    },
    {
      label: "Total Candidates",
      value: allCandidates.length,
      icon: Users,
      color: "#8B5CF6", // violet
      bgColor: "bg-violet-500/10",
      hover: "hover:bg-violet-50",
      onClick: () => setActivePage("users")
    },
    {
      label: "Open Positions",
      value: allJobs.filter(j => j.status === "Open").length,
      icon: Award,
      color: "#84CC16",
      bgColor: "bg-lime-500/10",
      hover: "hover:bg-lime-50"
    },
    {
      label: "Top Rated",
      value: allCandidates.filter(c => c.rating && c.rating > 4).length,
      icon: Star,
      color: "#F59E0B", // amber highlight
      bgColor: "bg-amber-500/10",
      hover: "hover:bg-amber-50"
    },
  ];

  const renderPage = () => {
    if (loading && activePage === "dashboard") {
      return (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-64 mt-2 animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
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
        return renderDashboard();
    }
  };

  const renderDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Header with Time Range */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div>
              <p className="text-lg text-gray-500 mb-1">
                            Welcome back, {user?.name || "Hiring Manager"}👋
                          </p>
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">Dashboard </h1>
              <p className=" text-lg font-medium text-gray-600 mt-2">
                             {formattedDate}
                           </p>

          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={loadData}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 cursor-pointer transition-colors"
            >
              <RefreshCw size={18} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Main Stats - Showing ALL data counts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mainStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                onClick={stat.onClick}
                className={`group bg-white rounded-2xl p-6 border border-gray-200/50
                shadow-[0_8px_20px_rgba(0,0,0,0.08)]
                hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)]
                hover:-translate-y-1
                transition-all duration-300 cursor-pointer focus:outline-none ${stat.hover || ""}`}

              >
                <div className="flex items-center justify-between">
                  <div
                    className={` p-3 rounded-xl ${stat.bgColor} transition-transform duration-300 group-hover:scale-110 `}
                    style={{ color: stat.color }}
                  >
                    <Icon size={24} />
                  </div>
                </div>
                <h3
                  className="text-3xl font-bold mt-5"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </h3>
                <p className="text-gray-500 mt-1 font-medium">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Recent Jobs & Candidates - Showing only 5 each */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Jobs - Showing 5 only */}
         <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_10px_25px_rgba(0,0,0,0.08)] p-6">


            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Job Posts
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Showing {recentJobs.length} of {allJobs.length} total jobs
                </p>
              </div>

              <button
                onClick={() => setActivePage("jobposts")}
                className="text-sm font-medium text-indigo-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
              >
                View All <ChevronRight size={16} />
              </button>
            </div>

            <div className="space-y-3">
              {recentJobs.length > 0 ? (
                recentJobs.map((job) => (
                  <div
                    key={job._id}
                    className="flex items-center justify-between p-3 rounded-xl transition-all hover:bg-gray-50"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {job.title}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <span className="px-2 py-1 bg-gray-100 rounded-md text-xs mr-2">
                          {job.department || "General"}
                        </span>
                        <span>{job.location || "Remote"}</span>
                        <span className="mx-2">•</span>
                        <span>{job.type || "Full-time"}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-semibold text-indigo-500">
                          {job.applicants || 0}
                        </div>
                        <div className="text-xs text-gray-400">
                          Applicants
                        </div>
                      </div>

                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {getStatusIcon(job.status)}
                        <span className="ml-1">{job.status || "Open"}</span>
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <Briefcase className="mx-auto text-gray-300 mb-3" size={40} />
                  <p className="text-gray-500">No job posts yet</p>
                  <button
                    onClick={() => setActivePage("jobposts")}
                    className="mt-3 text-sm font-medium text-indigo-500 hover:text-indigo-600 transition-colors"
                  >
                    Create your first job post
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recent Candidates - Showing 5 only */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_10px_25px_rgba(0,0,0,0.08)] p-6">


            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Interns
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Showing {recentCandidates.length} of {allCandidates.length} total interns
                </p>
              </div>

              <button
                onClick={() => setActivePage("users")}
                className="text-sm font-medium text-indigo-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
              >
                View All <ChevronRight size={16} />
              </button>
            </div>

            <div className="space-y-3">
              {recentCandidates.length > 0 ? (
                recentCandidates.map((candidate) => (
                  <div
                    key={candidate._id}
                    className="flex items-center p-3 rounded-xl transition-all hover:bg-gray-50"
                  >
                    <img
                      src={candidate.avatar || `https://ui-avatars.com/api/?name=${candidate.name}&background=6366F1&color=fff`}
                      alt={candidate.name}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />

                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {candidate.name}
                      </h4>

                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <GraduationCap size={14} className="mr-1 text-gray-400" />
                        <span>{candidate.college || "Unknown College"}</span>
                        <span className="mx-2">•</span>
                        <span>{candidate.position || "Intern"}</span>
                      </div>

                      {candidate.rating && candidate.rating !== "No rating" && (
                        <div className="flex items-center mt-1">
                          <Star size={12} className="text-amber-400 fill-amber-400 mr-1" />
                          <span className="text-xs text-gray-600">
                            {candidate.rating}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                        {getStatusIcon(candidate.status)}
                        <span className="ml-1">{candidate.status}</span>
                      </span>

                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(candidate.appliedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <User className="mx-auto text-gray-300 mb-3" size={40} />
                  <p className="text-gray-500">No interns registered yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, bg: "bg-indigo-500" }, // main brand
    { key: "profile", label: "Profile", icon: User, bg: "bg-rose-500" }, // warm contrast
    { key: "jobposts", label: "Job Posts", icon: Briefcase, bg: "bg-amber-500" }, // yellow/orange
    { key: "users", label: "Candidates", icon: Users, bg: "bg-emerald-500" }, // fresh green
  ];

  const Sidebar = () => {
    const currentUser = user || {
      name: "John Hiring Manager",
      role: "Senior Recruiter",
      profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
    };

    return (
      <div className="w-64 bg-[#DFE1FF] text-white flex flex-col h-full">

        {/* HEADER + PROFILE COMBINED (Dribbble Style) */}
        <div className="px-4 pt-6 pb-5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm">
              <img
                src="/Graphura.jpg"
                alt="Graphura Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-gray-900 font-semibold text-lg leading-none">
                Graphura
              </h1>
              <p className="text-xs text-gray-600 mt-1">
                Hiring Dashboard
              </p>
            </div>
          </div>
          {/* Profile Card */}

        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col justify-between p-3">
          <div className="w-full">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    setActivePage(item.key);
                    if (isMobile) setMobileOpen(false);
                  }}
                    className={`group w-full my-3 flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      activePage === item.key
                        ? "bg-[#5B35CD] shadow-sm"
                        : "hover:bg-[#5B35CD]/10"
                    }`}

                >
                  <span
                     className={`p-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
                       activePage === item.key
                         ? "text-white"
                         : "text-gray-600 group-hover:text-[#5B35CD]"
                     }`}
                   >
                     <Icon size={18} />
                   </span>


                   <span
                     className={`font-medium transition-colors ${
                       activePage === item.key
                         ? "text-white"
                         : "text-gray-600 group-hover:text-[#5B35CD]"
                     }`}
                   >
                     {item.label}
                   </span>

                 {/* ARROW */}
                  {activePage === item.key && (
                    <ChevronRight className="ml-auto text-white" size={16} />
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <div className="rounded-2xl p-4 flex items-center gap-3">
                                      <img
                                        src={currentUser.profileImage}
                                        alt="Profile"
                                        className="w-12 h-12 rounded-full object-cover"
                                      />

                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                          {currentUser.name}
                                        </p>

                                        <p className="text-xs text-gray-500 truncate">
                                          {currentUser.role}
                                        </p>

                                        {currentUser.department && (
                                          <p className="text-xs text-gray-400 truncate">
                                            {currentUser.department}
                                          </p>
                                        )}
                                      </div>
                                    </div>

             {/* BOTTOM AXIOM STYLE CARD */}
                    <div className="pt-4 mt-4">
                      <div className="rounded-2xl p-4 bg-white shadow-sm">



                        <div className="space-y-2">
                          <button
                            onClick={handleBackToHome}
                            className="w-full flex items-center justify-center gap-2 bg-white text-gray-700
                            rounded-xl py-2 text-sm font-medium hover:bg-gray-50 transition"
                          >
                            <Home size={16} />
                            Back to Home
                          </button>

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 bg-[#6c63ff]
                            text-white rounded-xl py-2 text-sm font-medium hover:opacity-90 transition"
                          >
                            <LogOut size={16} />
                            Logout
                          </button>
                        </div>
                      </div>
                    </div>

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
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:relative`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default HiringTeamDashboard;