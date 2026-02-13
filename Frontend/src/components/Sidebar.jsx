// components/Sidebar.js
// components/Sidebar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { createPortal } from "react-dom";

import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  BookOpen, 
  Video, 
  Users, 
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Package,
  ExternalLink,
  Home
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
const Sidebar = ({ activePage, setActivePage, collapsed, setCollapsed, onMobileItemClick }) => {
  const [userData, setUserData] = useState({
    name: 'Loading...',
    profileImage: null,
    email: '',
    purchases: [],
    creditsRemaining: 0
  });

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [latestPurchaseVisible] = useState(true);
    const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'profile', label: 'Profile', icon: User, badge: null },
    { id: 'jobs', label: 'Jobs', icon: Briefcase, badge: null },
    { id: 'study-material', label: 'Study Material', icon: BookOpen , badge: null },
    { id: 'video-lectures', label: 'Video Lectures', icon: Video, badge: null },
    { id: 'classes', label: 'Classes', icon: Users, badge: null },
    { id: 'payments', label: 'Payments', icon: CreditCard, badge: null }
  ];

  const checkAuth = () => {
    const token = localStorage.getItem('interToken');
    if (!token) {
      window.location.replace('/intern-login');
      return false;
    }
    return true;
  };

  const handleLogout = () => {
    localStorage.removeItem('interToken');
    sessionStorage.clear();
    window.location.replace('/intern-login');
  };

 const handleBackToHome = () => {
    navigate("/");
  };

  const fetchUserProfile = async () => {
    try {
      if (!checkAuth()) return;

      setLoading(true);
      const token = localStorage.getItem('interToken');

      const response = await axios.get('/api/intern/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = response.data;
      
      let totalCreditsRemaining = 0;
      if (data.purchases) {
        data.purchases.forEach(purchase => {
          if (purchase.purchaseCategory === 'JOB_PACKAGE' && 
              purchase.jobPackageDetails && 
              purchase.jobPackageDetails.creditsRemaining) {
            totalCreditsRemaining += purchase.jobPackageDetails.creditsRemaining;
          }
        });
      }

      setUserData({
        name: data.name || 'User',
        profileImage: data.profileImage,
        email: data.email || '',
        purchases: data.purchases || [],
        creditsRemaining: totalCreditsRemaining,
        skills: data.skills || [],
        college: data.college || ''
      });
    } catch (error) {
      console.error('Profile fetch error:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    checkAuth();
    fetchUserProfile();
  }, []);

  const handleItemClick = (pageId) => {
    setActivePage(pageId);
    if (onMobileItemClick) onMobileItemClick();
  };

  // Get latest purchase (newest by date)
  const getLatestPurchase = () => {
    if (!userData.purchases || userData.purchases.length === 0) {
      return null;
    }
    
    // Sort purchases by date (newest first)
    const sortedPurchases = [...userData.purchases].sort((a, b) => 
      new Date(b.purchasedAt) - new Date(a.purchasedAt)
    );
    
    return sortedPurchases[0];
  };

  const calculateStats = () => {
    const stats = {
      totalPurchases: userData.purchases?.length || 0,
      totalCourses: userData.purchases?.filter(p => p.purchaseCategory === 'COURSE').length || 0,
      totalJobPackages: userData.purchases?.filter(p => p.purchaseCategory === 'JOB_PACKAGE').length || 0,
      activeCredits: userData.creditsRemaining || 0
    };

    return stats;
  };

  const stats = calculateStats();
  const latestPurchase = getLatestPurchase();

  // Get purchase type label
  const getPurchaseTypeLabel = (purchase) => {
    if (!purchase) return '';
    
    if (purchase.purchaseCategory === 'COURSE') {
      return 'Course';
    } else if (purchase.purchaseCategory === 'JOB_PACKAGE') {
      return 'Job Package';
    }
    
    return 'Purchase';
  };

  // Get purchase title
  const getPurchaseTitle = (purchase) => {
    if (!purchase) return '';
    
    if (purchase.purchaseCategory === 'COURSE' && purchase.courseDetails?.courseType) {
      return purchase.courseDetails.courseType.replace('_', ' ');
    } else if (purchase.purchaseCategory === 'JOB_PACKAGE' && purchase.jobPackageDetails?.packageType) {
      return purchase.jobPackageDetails.packageType;
    }
    
    return 'Package';
  };

  // Check if purchase is recent (within 7 days)
  const isRecentPurchase = (purchase) => {
    if (!purchase || !purchase.createdAt) return false;
    const purchaseDate = new Date(purchase.createdAt);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return purchaseDate > sevenDaysAgo;
  };

  // Get time ago text
  const getTimeAgo = (date) => {
    if (!date) return '';
    const now = new Date();
    const purchaseDate = new Date(date);
    const diffMs = now - purchaseDate;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Get purchase status color
  const getStatusColor = (purchase) => {
    if (!purchase) return 'blue';
    
    if (purchase.paymentStatus === 'FAILED') return 'red';
    if (purchase.paymentStatus === 'PENDING') return 'yellow';
    if (purchase.paymentStatus === 'SUCCESS') return 'green';
    
    return 'blue';
  };

  // Get purchase action
  const getPurchaseAction = (purchase) => {
    if (!purchase) return { label: 'View', page: 'payments' };
    
    if (purchase.purchaseCategory === 'COURSE') {
      return { label: 'Go to Classes', page: 'classes' };
    } else if (purchase.purchaseCategory === 'JOB_PACKAGE') {
      return { label: 'Go to Jobs', page: 'jobs' };
    }
    
    return { label: 'View Details', page: 'payments' };
  };

  const renderLatestPurchase = () => {
    if (loading || !latestPurchase || !latestPurchaseVisible) return null;

    const purchaseType = getPurchaseTypeLabel(latestPurchase);
    const purchaseTitle = getPurchaseTitle(latestPurchase);
    const timeAgo = getTimeAgo(latestPurchase.createdAt);
    const isRecent = isRecentPurchase(latestPurchase);
    const statusColor = getStatusColor(latestPurchase);
    const action = getPurchaseAction(latestPurchase);

    return (
      <div className="mx-3 my-3 px-4 py-4
        rounded-2xl
        bg-white/40
        backdrop-blur-xl
        border border-white/30
        shadow-lg">

        {/* Header */}
       <div className="flex items-center justify-between mb-3">
         <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#0E5C7E] to-[#4FB0DA] flex items-center justify-center shadow-md">
             <Package size={14} className="text-white" />
           </div>
           <div>
             <h3 className="text-gray-800 font-bold text-xs">Latest Purchase</h3>
             <p className="text-gray-500 text-[10px]">{timeAgo}</p>
           </div>
         </div>

         <div className="flex items-center gap-1">
           {isRecent && (
             <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full border border-green-500/30 animate-pulse">
               NEW
             </span>
           )}

           <span
             className={`text-[10px] px-1.5 py-0.5 ${
               statusColor === "green"
                 ? "bg-green-100 text-black border-green-400/40"
                 : statusColor === "red"
                 ? "bg-red-100 text-black border-red-400/40"
                 : statusColor === "yellow"
                 ? "bg-yellow-100 text-black border-yellow-400/40"
                 : "bg-[#4FB0DA]/20 text-black border-[#4FB0DA]/30"
             } rounded-full border`}
           >
             {latestPurchase.paymentStatus || "ACTIVE"}
           </span>
         </div>
       </div>

       {/* Purchase Info */}
       <div className="space-y-2">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-black text-sm font-semibold truncate">{purchaseTitle}</p>
             <p className="text-gray-700 text-xs">{purchaseType}</p>
           </div>

           <div className="text-right">
             <p className="text-black font-bold text-sm">
               ₹{latestPurchase.amountPaid?.toLocaleString("en-IN") || "0"}
             </p>
             <p className="text-gray-600 text-[10px]">Amount</p>
           </div>
         </div>
       </div>

       {/* Action Button */}
       <button
         onClick={() => {
           setActivePage(action.page);
           if (onMobileItemClick) onMobileItemClick();
         }}
         className="w-full mt-3 py-2 bg-gradient-to-r from-[#0E5C7E]/20 to-[#4FB0DA]/10 hover:from-[#0E5C7E]/30 hover:to-[#4FB0DA]/20 text-black text-xs font-bold rounded-lg border border-[#4FB0DA]/30 transition-all duration-300 flex items-center justify-center gap-2 hover:shadow"
       >
         {action.label}
         <ExternalLink size={12} />
       </button>


      </div>
    );
  };

  return (
    <div
      className={`h-screen flex flex-col bg-[#DFE1FF] border-r border-white/40 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* LOGO SECTION */}
      <div className="p-5 flex-shrink-0">
        <div className="flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <img
                src="/Graphura.jpg"
                alt="Graphura"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h1 className="text-black font-semibold text-sm">Graphura</h1>
                <p className="text-xs text-gray-700">Placement System</p>
              </div>
            </div>
          ) : (
            <img
              src="/Graphura.jpg"
              alt="Graphura"
              className="w-10 h-10 rounded-full object-cover mx-auto"
            />
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg bg-white/40 hover:bg-white text-gray-700 transition"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex-1 px-3 space-y-2 overflow-hidden hover:overflow-y-auto">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center p-3 rounded-xl transition-all text-sm ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-white/40"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <IconComponent size={18} />

              {!collapsed && (
                <>
                  <span className="ml-3 flex-1 text-left font-medium">
                    {item.label}
                  </span>

                  {item.badge && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/40">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* KEEP YOUR EXISTING FUNCTION */}
      {!collapsed && renderLatestPurchase()}

      {/* USER PROFILE SECTION */}
      <div className="p-4 flex-shrink-0">
        {loading ? (
          <div className="animate-pulse flex items-center gap-3">
            <div className="w-10 h-10 bg-white/40 rounded-full"></div>
            {!collapsed && (
              <div className="space-y-2">
                <div className="h-3 w-24 bg-white/40 rounded"></div>
                <div className="h-2 w-16 bg-white/30 rounded"></div>
              </div>
            )}
          </div>
        ) : !collapsed ? (
          <div className="bg-white/60 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                {userData.profileImage ? (
                  <img
                    src={userData.profileImage}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold">
                    {getInitials(userData.name)}
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-black">
                  {userData.name}
                </p>
                <p className="text-xs text-gray-600">Learner</p>
              </div>
            </div>

            {/* BACK TO HOME */}
            <button
             onClick={handleBackToHome}
            className="w-full flex items-center justify-center gap-2 text-sm
            text-gray-700 mb-3">
              <Home size={16} />
              Back to Home
            </button>

            {/* LOGOUT */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            >
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>

      {/* LOGOUT MODAL (UNCHANGED LOGIC, ONLY LIGHT UI) */}
      {showLogoutConfirm &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60">
            <div className="bg-white p-6 rounded-2xl w-[280px] text-center shadow-xl">
              <h3 className="text-lg font-semibold mb-2">Confirm Logout</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to logout?
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2 rounded-lg bg-gray-200"
                >
                  Cancel
                </button>

                <button
                  onClick={handleLogout}
                  className="flex-1 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                >
                  Logout
                </button>
              </div>
            </div>
        </div>,
        document.body
      )}
    </div>
  );

};

export default Sidebar;