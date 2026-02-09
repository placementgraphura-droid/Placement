import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  User,
  Users,
  BookOpen,
  Video,
  Calendar,
  Menu,
  GraduationCap,
  TrendingUp,
  Home,
  FileText,
  Eye,
  Download,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Profile from "./MentorPages/MentorProfile";
import StudyMaterials from "./MentorPages/MentorStudyMaterial";
import VideoLectures from "./MentorPages/MentorVideoLectures";
import Classes from "./MentorPages/MentorClasses";
import MentorUsers from "./MentorPages/MentorUser";
import axios from "axios";

const formattedDate = new Date().toLocaleDateString("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});


const MentorDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [mentor, setMentor] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [recentMaterials, setRecentMaterials] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);

  // ===============================
  // TOKEN
  // ===============================
  const getToken = () => {
    return localStorage.getItem("mentorToken") || localStorage.getItem("token");
  };

  // ===============================
  // LOGOUT FUNCTION
  // ===============================
  const handleLogout = () => {
    // Clear all tokens and user data from localStorage
    localStorage.removeItem("mentorToken");

      // Redirect to home page
    navigate("/mentor-login");
  };

  // ===============================
  // FETCH MENTOR PROFILE
  // ===============================
  const fetchMentorProfile = async () => {
    try {
      const token = getToken();
      
      if (!token) {
        throw new Error("No token found");
      }

      const res = await axios.get("/api/mentors/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMentor(res.data);
    } catch (err) {
      console.error("Profile Load Failed → Using fallback", err);
    }
  };

  // ===============================
  // FETCH DASHBOARD DATA
  // ===============================
  const fetchDashboardData = async () => {
    try {
      const token = getToken();
      
      if (!token) {
        throw new Error("No token found");
      }

      const res = await axios.get("/api/mentors/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(res.data);
    } catch (err) {
      console.error("Dashboard API Failed → Using fallback", err);
    }
  };

  // ===============================
  // FETCH RECENT STUDY MATERIALS
  // ===============================
  const fetchRecentMaterials = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get("/api/mentor/study-materials", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Get recent 5 materials
      const recent = res.data.data?.slice(0, 5) || [];
      setRecentMaterials(recent);
    } catch (err) {
      console.error("Failed to fetch recent materials:", err);
      // Fallback data
    }
  };

  // ===============================
  // FETCH RECENT USERS
  // ===============================
  const fetchRecentUsers = async () => {
    try {
      const token = getToken();
      if (!token) return;

      const res = await axios.get("/api/mentors/interns", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Get recent 5 users
      const recent = res.data.interns?.slice(0, 5) || [];
      setRecentUsers(recent);
    } catch (err) {
      console.error("Failed to fetch recent users:", err);
      // Fallback data
    }
  };

  // ===============================
  // LOAD ALL DATA
  // ===============================
  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchMentorProfile(), 
        fetchDashboardData(),
        fetchRecentMaterials(),
        fetchRecentUsers()
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
  // PAGE RENDERING
  // ===============================
  const renderPage = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin w-12 h-12 border-b-2 border-blue-600 rounded-full"></div>
          <p className="ml-4 text-gray-600">Loading...</p>
        </div>
      );
    }

    const currentMentor = mentor 

    switch (activePage) {
      case "profile":
        return <Profile mentor={currentMentor} setMentor={setMentor} onUpdate={fetchMentorProfile} />;

      case "materials":
        return <StudyMaterials />;

      case "videos":
        return <VideoLectures />;

      case "classes":
        return <Classes />;

      case "users":
        return <MentorUsers />;

      default:
        return (
          <DashboardOverview 
            dashboardData={dashboardData} 
            mentor={currentMentor}
            recentMaterials={recentMaterials}
            recentUsers={recentUsers}
            onMaterialClick={() => setActivePage("materials")}
            onUsersClick={() => setActivePage("users")}
            formatDate={formatDate}
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
    { key: "users", label: "Users", icon: Users, color: "text-indigo-500" },
    { key: "materials", label: "Study Materials", icon: BookOpen, color: "text-red-500" },
    { key: "videos", label: "Video Lectures", icon: Video, color: "text-purple-500" },
    { key: "classes", label: "Classes", icon: Calendar, color: "text-cyan-500" },
  ];

  // ===============================
  // SIDEBAR COMPONENT
  // ===============================
  const Sidebar = () => {
    const currentMentor = mentor || {
    };

    return (
    <div
      className="w-64 h-full flex flex-col
      bg-[#DFE1FF]
      text-gray-800 rounded-r-3xl shadow-xl overflow-hidden"
    >

        <div className="px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <GraduationCap className="text-black" size={22} />
            </div>
            <div>
              <h1 className="font-semibold text-lg tracking-wide">MentorPro</h1>
              <p className="text-xs text-gray-600">Education Platform</p>
            </div>
          </div>
        </div>


        {/* Profile Summary */}
       <div className="px-6 py-4 text-center">
         <img
           src={
             currentMentor.profileImage ||
             `https://ui-avatars.com/api/?name=${currentMentor.name}&background=6366f1&color=fff`
           }
           className="w-16 h-16 mx-auto rounded-2xl border border-indigo-400 shadow-md"
           alt="Profile"
         />

         <h2 className="mt-3 font-medium text-black">{currentMentor.name}</h2>
         <p className="text-xs text-gray-600">
           {currentMentor.experience} yrs experience
         </p>

         <div className="flex justify-center mt-3 gap-2 flex-wrap">
           {currentMentor.domain?.slice(0, 2).map((d, i) => (
             <span
               key={i}
               className="text-xs px-3 py-1 rounded-full
               bg-indigo-500/20 text-indigo-700"
             >
               {d}
             </span>
           ))}
         </div>
       </div>


        {/* Navigation */}
       <nav className="flex-1 px-4 py-2 space-y-1">
         {menuItems.map((item) => {
           const Icon = item.icon;
           const isActive = activePage === item.key;

           return (
             <button
               key={item.key}
               onClick={() => {
                 setActivePage(item.key);
                 if (isMobile) setMobileOpen(false);
               }}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                 ${
                isActive
                  ? "bg-[#8B88FF] text-white shadow-md"
                  : "hover:bg-indigo-100 text-gray-700"

                 }`}
             >
               <Icon
                 size={20}
                 className={isActive ? "text-white" : "text-indigo-600"}
               />
               <span className="text-sm font-medium">{item.label}</span>
             </button>
           );
         })}


          {/* Action Buttons */}
          <div className="mt-6 p-3 rounded-2xl bg-white/10 backdrop-blur-md space-y-3 shadow-inner">

            {/* Back to Home */}
            <button
              onClick={handleBackToHome}
              className="w-full flex items-center justify-center gap-2
              bg-white text-gray-800 font-medium
              px-4 py-3 rounded-xl shadow
              hover:bg-gray-100 transition"
            >
              <Home size={18} />
              <span className="text-sm">Back to Home</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2
              bg-gradient-to-r from-indigo-500 to-purple-600
              text-white font-medium
              px-4 py-3 rounded-xl shadow-lg
              hover:opacity-90 transition"
            >
              <LogOut size={18} />
              <span className="text-sm">Logout</span>
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
       <header className="bg-[#f8f9fd] border-none">
         <div className="flex items-center justify-between px-6 py-4">

           {/* Left: Menu + Welcome + Title */}
           <div className="flex items-start gap-4">
             <button
               onClick={() => setMobileOpen(true)}
               className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition mt-1"
             >
               <Menu size={20} />
             </button>

             <div>
{/*                <p className="text-sm text-gray-500 mb-1"> */}
{/*                  Welcome back,{" "} */}
{/*                  <span className="font-medium text-gray-700"> */}
{/*                    Mentor👋 */}
{/*                  </span> */}
{/*                </p> */}

               <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                 {menuItems?.find((m) => m.key === activePage)?.label || "Dashboard"}
               </h1>

               <p className="text-lg font-medium text-gray-600 mt-2">
                 {formattedDate}
               </p>
             </div>
           </div>

           {/* Right: Actions */}
           <div className="flex items-center gap-4">
             {mentor && (
               <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl shadow-sm">
                 <img
                   src={
                     mentor.profileImage ||
                     `https://ui-avatars.com/api/?name=${mentor.name}&background=6366f1&color=fff`
                   }
                   alt="Profile"
                   className="w-8 h-8 rounded-full"
                 />
                 <div className="hidden sm:block">
                   <p className="text-sm font-medium text-gray-800">
                     {mentor.name}
                   </p>
                   <p className="text-xs text-gray-400">Admin</p>
                 </div>
               </div>
             )}
           </div>

         </div>
       </header>



        <main className="flex-1 overflow-auto p-4 md:p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

// ======================================================
// DASHBOARD OVERVIEW COMPONENT (Updated with Recent Materials & Users)
// ======================================================
const DashboardOverview = ({ 
  dashboardData, 
  mentor, 
  recentMaterials, 
  recentUsers, 
  onMaterialClick, 
  onUsersClick,
  formatDate 
}) => {
  const data = dashboardData || {
    stats: { 
      students: 10, 
      materials: 8, 
      videos: 12, 
      classes: 6, 
      users: 25,
      interns: 15 
    },
  };

  const stats = [
    { label: "Interns", value: data.stats.interns || data.stats.students, icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Materials", value: data.stats.materials, icon: BookOpen, color: "text-green-500", bg: "bg-green-50" },
    { label: "Videos", value: data.stats.videos, icon: Video, color: "text-yellow-500", bg: "bg-yellow-50" },
    { label: "Classes", value: data.stats.classes, icon: Calendar, color: "text-red-500", bg: "bg-red-50" },
    { label: "Total Users", value: data.stats.users, icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 rounded-xl text-white">
        <h1 className="text-3xl font-bold">Welcome, {mentor.name} 👋</h1>
        <p className="opacity-75">Here's your performance overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div className={`p-4 ${s.bg} rounded-xl shadow hover:shadow-md transition-shadow`} key={i}>
              <Icon className={s.color} size={22} />
              <h2 className="text-3xl font-bold mt-2">{s.value}</h2>
              <p className="text-gray-500 text-sm">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Study Materials */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <BookOpen className="text-red-500 mr-2" /> Recent Study Materials
            </h2>
            <button 
              onClick={onMaterialClick}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </button>
          </div>

          {recentMaterials && recentMaterials.length > 0 ? (
            <div className="space-y-3">
              {recentMaterials.map((material) => (
                <div key={material._id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{material.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{material.subject}</span>
                        <span className="text-xs text-gray-500">
                          {formatDate(material.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-500">No study materials uploaded yet</p>
              <button 
                onClick={onMaterialClick}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Upload your first material
              </button>
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <Users className="text-indigo-500 mr-2" /> Recent Users
            </h2>
            <button 
              onClick={onUsersClick}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </button>
          </div>

          {recentUsers && recentUsers.length > 0 ? (
            <div className="space-y-3">
              {recentUsers.map((user) => (
                <div key={user._id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <img
                      src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <div className="flex items-center mt-1 space-x-3">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {user.college}
                        </span>
                        <span className="text-xs text-gray-500">
                          Year {user.yearOfStudy}
                        </span>
                      </div>
                      {user.domain && (
                        <span className="inline-block mt-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                          {user.domain}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="mx-auto text-gray-400 mb-2" size={32} />
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;