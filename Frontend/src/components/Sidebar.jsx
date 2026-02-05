// components/Sidebar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  ExternalLink
} from 'lucide-react';

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
      <div className="px-3 py-3 border-y border-[#0E5C7E]/50 bg-gradient-to-r from-[#0E5C7E]/30 to-[#4FB0DA]/20 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#0E5C7E] to-[#4FB0DA] flex items-center justify-center shadow-md">
              <Package size={14} className="text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-xs">Latest Purchase</h3>
              <p className="text-[#EAF6FC]/80 text-[10px]">{timeAgo}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {isRecent && (
              <span className="text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-300 rounded-full border border-green-500/30 animate-pulse">
                NEW
              </span>
            )}
            <span className={`text-[10px] px-1.5 py-0.5 ${
              statusColor === 'green' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
              statusColor === 'red' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
              statusColor === 'yellow' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
              'bg-[#4FB0DA]/20 text-[#EAF6FC] border-[#4FB0DA]/30'
            } rounded-full border`}>
              {latestPurchase.paymentStatus || 'ACTIVE'}
            </span>
          </div>
        </div>

        {/* Purchase Info */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-semibold truncate">{purchaseTitle}</p>
              <p className="text-[#EAF6FC]/80 text-xs">{purchaseType}</p>
            </div>
            <div className="text-right">
              <p className="text-white font-bold text-sm">
                ₹{latestPurchase.amountPaid?.toLocaleString('en-IN') || '0'}
              </p>
              <p className="text-[#EAF6FC]/80 text-[10px]">Amount</p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            setActivePage(action.page);
            if (onMobileItemClick) onMobileItemClick();
          }}
          className="w-full mt-3 py-2 bg-gradient-to-r from-[#0E5C7E]/20 to-[#4FB0DA]/10 hover:from-[#0E5C7E]/30 hover:to-[#4FB0DA]/20 text-[#EAF6FC] text-xs font-bold rounded-lg border border-[#4FB0DA]/30 transition-all duration-300 flex items-center justify-center gap-2 hover:shadow"
        >
          {action.label}
          <ExternalLink size={12} />
        </button>

      </div>
    );
  };

  return (
    <div className={`h-screen flex flex-col bg-gradient-to-b from-[#0A2E40] via-[#0E5C7E] to-[#0A2E40] border-r border-[#0E5C7E]/50 transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* LOGO SECTION */}
      <div className="p-4 border-b border-[#0E5C7E]/50 bg-gradient-to-r from-[#0E5C7E] to-[#0A2E40] flex-shrink-0">
        <div className="flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl shadow-lg bg-gradient-to-br from-[#0E5C7E] to-[#4FB0DA] flex items-center justify-center border border-[#0E5C7E]">
                  <img src="/Graphura.jpg" alt="Graphura" className="w-6 h-6 rounded-lg" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border border-[#0A2E40]"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-white font-bold text-sm bg-gradient-to-r from-[#7EC9E8] to-[#EAF6FC] bg-clip-text text-transparent truncate">
                  Placement System
                </h1>
              </div>
            </div>
          ) : (
            <div className="relative mx-auto">
              <div className="w-10 h-10 rounded-xl shadow-lg bg-gradient-to-br from-[#0E5C7E] to-[#4FB0DA] flex items-center justify-center border border-[#0E5C7E]">
                <img src="/Graphura.jpg" alt="Graphura" className="w-8 h-8 rounded-lg" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border border-[#0A2E40]"></div>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-[#0E5C7E]/50 to-[#0A2E40]/30 hover:from-[#4FB0DA]/50 hover:to-[#0E5C7E]/30 text-[#EAF6FC] hover:text-white transition-all duration-300 shadow hover:shadow-md hover:scale-105 backdrop-blur-sm flex-shrink-0"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex-1 p-2 space-y-1 overflow-hidden hover:overflow-y-auto">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activePage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center p-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-[#0E5C7E]/30 to-[#4FB0DA]/20 text-[#EAF6FC] shadow shadow-[#4FB0DA]/20 border border-[#4FB0DA]/30'
                  : 'text-[#EAF6FC]/80 hover:bg-[#0E5C7E]/30 hover:text-white hover:shadow'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              {isActive && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0E5C7E]/20 to-[#4FB0DA]/10"></div>
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-0.5 h-8 bg-gradient-to-b from-[#7EC9E8] to-[#4FB0DA] rounded-r-full shadow shadow-[#4FB0DA]/50"></div>
                </>
              )}
              
              <div className={`relative ${isActive ? 'text-[#EAF6FC]' : 'text-[#EAF6FC]/80 group-hover:text-white'} transition-colors`}>
                <IconComponent size={18} />
              </div>
              
              {!collapsed && (
                <>
                  <span className="ml-3 flex-1 text-left text-xs font-medium truncate">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      item.badge === 'Live' ? 'bg-red-500/30 text-red-200 border border-red-500/30' : 
                      item.badge === 'New' ? 'bg-green-500/30 text-green-200 border border-green-500/30' : 
                      'bg-[#4FB0DA]/30 text-[#EAF6FC] border border-[#4FB0DA]/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}

              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1.5 bg-[#0A2E40] text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 border border-[#0E5C7E] backdrop-blur-sm">
                  {item.label}
                  {item.badge && (
                    <span className={`ml-1 px-1 py-0.5 rounded text-[10px] ${
                      item.badge === 'Live' ? 'bg-red-500/30 text-red-200' : 
                      item.badge === 'New' ? 'bg-green-500/30 text-green-200' : 
                      'bg-[#4FB0DA]/30 text-[#EAF6FC]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* LATEST PURCHASE SECTION */}
      {!collapsed && renderLatestPurchase()}

      {/* USER PROFILE SECTION */}
      <div className="p-3 border-t border-[#0E5C7E]/50 bg-gradient-to-t from-[#0E5C7E] to-[#0A2E40] flex-shrink-0">
        {loading ? (
          <div className="animate-pulse">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#0E5C7E]/50 rounded-full"></div>
              {!collapsed && (
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 bg-[#0E5C7E]/50 rounded w-24"></div>
                  <div className="h-2 bg-[#0E5C7E]/50 rounded w-16"></div>
                </div>
              )}
            </div>
          </div>
        ) : !collapsed ? (
          <div className="space-y-3">
            <div className="p-2.5 rounded-lg bg-gradient-to-r from-[#0E5C7E]/40 to-[#0A2E40]/30 backdrop-blur-sm border border-[#0E5C7E]/40 hover:border-[#4FB0DA]/50 transition-all duration-200">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#0E5C7E] via-[#4FB0DA] to-[#7EC9E8] rounded-full flex items-center justify-center text-white font-bold shadow-lg border border-[#0E5C7E] relative overflow-hidden">
                    {userData.profileImage ? (
                      <img src={userData.profileImage} alt="profile" className="rounded-full w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm">{getInitials(userData.name)}</span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border border-[#0A2E40]"></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-xs truncate">{userData.name}</p>
                  <p className="text-[#EAF6FC]/80 text-[10px] truncate">{userData.email}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className={`bg-gradient-to-r ${latestPurchase ? 'from-[#0E5C7E]/40 to-[#4FB0DA]/30 text-[#EAF6FC] border-[#4FB0DA]/30' : 'from-gray-700/30 to-slate-700/30 text-gray-300 border-gray-600/30'} px-1.5 py-0.5 rounded-full text-[10px] font-bold border`}>
                      {latestPurchase ? 'Premium' : 'Free'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-center p-2 rounded-lg bg-gradient-to-r from-red-900/20 to-pink-900/10 hover:from-red-900/30 hover:to-pink-900/20 text-red-300 hover:text-red-200 transition-all duration-200 group border border-red-800/20 hover:border-red-700/40"
            >
              <LogOut size={16} className="text-red-300" />
              <span className="ml-2 text-xs font-bold">Logout</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="relative flex justify-center group">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1a83b0] via-[#35bcf6] to-[#7EC9E8] rounded-full flex items-center justify-center text-white font-bold shadow-lg border border-[#0E5C7E] relative overflow-hidden">
                {userData.profileImage ? (
                  <img src={userData.profileImage} alt="profile" className="rounded-full w-full h-full object-cover" />
                ) : (
                  <span className="text-sm">{getInitials(userData.name)}</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10"></div>
              </div>
              
              <div className="absolute left-full ml-2 px-2 py-1.5 bg-[#145a7d] text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 border border-[#0E5C7E] backdrop-blur-sm">
                <div className="font-bold text-white">{userData.name}</div>
                <div className="text-[#EAF6FC]/80 text-[10px] mt-0.5">{userData.email}</div>
                <div className="flex items-center gap-1 mt-1.5">
                  {stats.activeCredits > 0 && (
                    <div className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                      {stats.activeCredits} credits
                    </div>
                  )}
                  {latestPurchase && (
                    <div className="bg-[#4FB0DA]/20 text-[#EAF6FC] px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                      Premium
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-center p-2 rounded-lg bg-gradient-to-r from-red-900/20 to-pink-900/10 hover:from-red-900/30 hover:to-pink-900/20 text-red-300 hover:text-red-200 transition-all duration-200 group relative"
            >
              <LogOut size={16} />
              <div className="absolute left-full ml-2 px-2 py-1.5 bg-[#0d4c6b] text-white text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-50 border border-[#0E5C7E] backdrop-blur-sm">
                Logout
              </div>
            </button>
          </div>
        )}
      </div>

      {/* LOGOUT CONFIRMATION MODAL */}
    {showLogoutConfirm && (
      <div className="fixed inset-0 z-[9999] w-screen h-screen flex items-center justify-center bg-black/60 backdrop-blur-sm">

        <div className="relative bg-gradient-to-br from-[#0A2E40] via-[#0E5C7E] to-[#0A2E40] p-6 rounded-2xl shadow-2xl border border-[#0E5C7E] max-w-xs w-full mx-auto">

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow">
                <LogOut size={20} className="text-white" />
              </div>
            </div>

            <h3 className="text-white text-lg font-bold mb-2">Confirm Logout</h3>
            <p className="text-[#EAF6FC]/80 text-xs">
              Are you sure you want to logout?
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowLogoutConfirm(false)}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#0E5C7E] to-[#0A2E40] hover:from-[#4FB0DA] hover:to-[#0E5C7E] text-white rounded-lg font-medium transition-all duration-200 border border-[#0E5C7E] hover:border-[#4FB0DA] text-sm"
            >
              Cancel
            </button>

            <button
              onClick={handleLogout}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 via-red-600 to-pink-600 hover:from-red-600 hover:via-red-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all duration-200 shadow shadow-red-500/20 text-sm"
            >
              Logout
            </button>
          </div>

        </div>
      </div>
    )}
    </div>
  );
};

export default Sidebar;