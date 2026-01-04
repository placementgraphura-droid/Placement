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
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="font-bold text-2xl text-gray-900 tracking-tight">ADMIN</h1>
          <p className="text-sm text-gray-500 mt-1">Management Console</p>
        </div>

        {/* Menu Buttons */}
        <nav className="flex-1 p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={`w-full flex items-center p-3 rounded-lg mb-1 transition-all duration-200 ${
                  activePage === item.key 
                    ? "bg-gray-900 text-white shadow-sm" 
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
                onClick={() => {
                  setActivePage(item.key);
                  if (isMobile) setMobileOpen(false);
                }}
              >
                <Icon 
                  className={`mr-3 ${
                    activePage === item.key 
                      ? "text-white" 
                      : "text-gray-500"
                  }`} 
                  size={20} 
                />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}

          <div className="border-t border-gray-200 space-y-2">
            <button
              onClick={handleBackToHome}
              className="w-full flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <Home className="mr-3 text-gray-500" size={20} />
              <span className="font-medium">Back to Home</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center p-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="mr-3 text-gray-500" size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </nav>

      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
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
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileOpen(true)} 
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="text-gray-700" />
            </button>

            {/* Page Title and Breadcrumb */}
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold text-gray-900">
                {menuItems.find((m) => m.key === activePage)?.label || "Dashboard"}
              </h1>
              <span className="text-gray-400">/</span>
              <span className="text-sm text-gray-500">Admin Panel</span>
            </div>

            {/* User/Status Badge */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="text-sm text-gray-600">
                Logged in as <span className="font-semibold text-gray-900">Admin</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
          <div className="max-w-full">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;