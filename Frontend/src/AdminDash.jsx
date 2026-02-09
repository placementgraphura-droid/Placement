import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Video,
  Briefcase,
  Shield,
  CreditCard,
  Settings,
  Menu,
  Home,
  LogOut,
  BarChart3,
  FileText,
  PlayCircle,
  ShoppingBag,
  UserCog,
  Building
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Import admin pages
import AdminUsers from "./AdminPages/AdminUsers";
import AdminCourses from "./AdminPages/AdminCourses";
import AdminMaterials from "./AdminPages/AdminMaterials";
import AdminVideos from "./AdminPages/AdminVideos";
import AdminJobs from "./AdminPages/AdminJobs";
import AdminPayments from "./AdminPages/AdminPayments";
import AdminDashboardHome from "./AdminPages/dminHomeDashboard"
import Mentor from "./AdminPages/MentorPage";
import HRPage from "./AdminPages/HR_Page";


const formattedDate = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "2-digit",
  month: "short",
  year: "numeric",
}).format(new Date());


const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile] = useState(false);
  const navigate = useNavigate();



  // ============================
  // LOGOUT FUNCTION
  // ============================
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  // ============================
  // BACK TO HOME
  // ============================
  const handleBackToHome = () => {
    navigate("/");
  };

  // ============================
  // PAGE RENDERING
  // ============================
  const renderPage = () => {
    switch (activePage) {  
      case "users":
        return <AdminUsers />;
      case "classes":
        return <AdminCourses />;
      case "materials":
        return <AdminMaterials />;
      case "videos":
        return <AdminVideos />;
      case "jobs":
        return <AdminJobs />;
      case "payments":
        return <AdminPayments />;
      case "mentors":
        return <Mentor />;
      case "hr_team":
        return <HRPage />;
      default:
        case "Dashboard":
        return <AdminDashboardHome />;
    }
  };

  // ============================
  // ADMIN SIDEBAR MENU
  // ============================
  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: BarChart3 },
    { key: "users", label: "Users", icon: Users },
    { key: "classes", label: "Classes", icon: BookOpen },
    { key: "materials", label: "Study Materials", icon: FileText },
    { key: "videos", label: "Video Library", icon: PlayCircle },
    { key: "jobs", label: "Jobs", icon: Briefcase },
    { key: "payments", label: "Payments", icon: CreditCard },
    { key: "mentors", label: "Mentors", icon: UserCog },
    { key: "hr_team", label: "HR Team", icon: Building },
  ];

  // ============================
  // SIDEBAR COMPONENT
  // ============================
const Sidebar = () => {
  return (
   <div className="w-64 bg-[#DFE1FF] border-r border-white/10
   text-gray-300 flex flex-col h-full
   rounded-tr-3xl rounded-br-3xl overflow-hidden">



      {/* Sidebar Header */}
      <div className="p-6">
        <img
          src="/GraphuraLogo.jpg"
          alt="Graphura Logo"
          className="h-10 w-auto object-contain"
        />
       <p className="text-xs text-gray-600 mt-1">

          Admin Management
        </p>
      </div>

      {/* Menu Buttons */}
      <nav className="flex-1 px-3 flex flex-col">
        {/* MENU ITEMS */}
        <div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-2
                transition-all duration-200 ${
                  activePage === item.key
                    ? "bg-[#5B35CD] text-white shadow-sm"
                    : "hover:bg-[#5B35CD]/10 text-gray-600"
                }`}

                onClick={() => {
                  setActivePage(item.key);
                  if (isMobile) setMobileOpen(false);
                }}
              >
                <span
                  className={`p-2 rounded-lg transition-all duration-200 ${
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

              </button>
            );
          })}
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

      </nav>

    </div>
  );
};



  return (
    <div className="flex h-screen bg-[#f3f4f9]">

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative`}
      >
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#f3f4f9] p-3">

       {/* Top Bar */}
      <header>

         <div className="flex items-center justify-between px-8 py-7">


           {/* Left Section */}
           <div className="flex items-center gap-4">
             <button
               onClick={() => setMobileOpen(true)}
               className="md:hidden p-2 rounded-lg hover:bg-gray-200 transition"
             >
               <Menu size={20} />
             </button>

             <div>
               <p className="text-sm text-gray-500 mb-1">
                 Welcome back,{" "}
                 <span className="font-medium text-gray-700">
                   Admin 👋
                 </span>
               </p>

               <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                 {menuItems.find((m) => m.key === activePage)?.label || "Dashboard"}
               </h1>

               <p className="text-lg font-medium text-gray-600 mt-2">
                 {formattedDate}
               </p>
             </div>
           </div>


           <div className="hidden md:flex items-center gap-3">
             <span className="text-sm text-gray-600">
               Logged in as <span className="font-semibold text-gray-900">Admin</span>
             </span>
             <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
           </div>

         </div>
       </header>



        {/* Content */}
        <main className="flex-1 overflow-auto mt-3 rounded-2xl">

          <div className="max-w-full">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;