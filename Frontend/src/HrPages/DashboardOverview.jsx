import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  Calendar,
  Award,
  DollarSign,
  Clock,
  BarChart,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Download,
  Eye,
  ChevronRight,
  CheckCircle,
  Clock as ClockIcon,
  XCircle,
  Star,
  Target,
} from "lucide-react";

const DashboardOverview = ({ 
  dashboardData, 
  user,
  recentJobs,
  recentCandidates,
  onJobPostsClick,
  onUsersClick,
  getStatusColor
}) => {
  const [ setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("monthly");
  const [metrics, setMetrics] = useState(null);

  const getToken = () => {
    return localStorage.getItem("HiringTeamToken") || localStorage.getItem("token");
  };

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await axios.get(`/api/hiring/metrics?range=${timeRange}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setMetrics(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
      // Fallback metrics data
      setMetrics({
        hiringTimeline: [18, 22, 15, 20, 25, 18],
        candidateSources: {
          "LinkedIn": 35,
          "Company Website": 25,
          "Referrals": 20,
          "Job Boards": 15,
          "Other": 5
        },
        monthlyHires: [5, 8, 12, 7, 15, 18],
        departmentDistribution: {
          "Engineering": 45,
          "Design": 20,
          "Product": 15,
          "Marketing": 12,
          "Sales": 8
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [timeRange]);

  const data = dashboardData || {
    stats: {
      totalJobs: 24,
      activeJobs: 12,
      candidates: 156,
      interviews: 45,
      hires: 18,
      pending: 27,
    },
    metrics: {
      timeToHire: 18,
      candidateSatisfaction: 4.5,
      offerAcceptanceRate: 92,
    },
  };

  const mainStats = [
    { 
      label: "Total Jobs", 
      value: data.stats.totalJobs, 
      change: "+12%", 
      trend: "up",
      icon: Briefcase, 
      color: "#09435F",
      bgColor: "bg-[#09435F]/10"
    },
    { 
      label: "Active Candidates", 
      value: data.stats.candidates, 
      change: "+8%", 
      trend: "up",
      icon: Users, 
      color: "#2E84AE",
      bgColor: "bg-[#2E84AE]/10"
    },
    { 
      label: "Interviews", 
      value: data.stats.interviews, 
      change: "-5%", 
      trend: "down",
      icon: Calendar, 
      color: "#CDE7F4",
      bgColor: "bg-[#CDE7F4]/20"
    },
    { 
      label: "Successful Hires", 
      value: data.stats.hires, 
      change: "+25%", 
      trend: "up",
      icon: Award, 
      color: "#09435F",
      bgColor: "bg-[#09435F]/10"
    },
  ];

  const performanceMetrics = [
    { 
      label: "Avg Time to Hire", 
      value: `${data.metrics.timeToHire} days`, 
      target: "15 days",
      icon: Clock, 
      color: "#2E84AE",
      progress: 75
    },
    { 
      label: "Offer Acceptance Rate", 
      value: `${data.metrics.offerAcceptanceRate}%`, 
      target: "90%",
      icon: Target, 
      color: "#09435F",
      progress: 92
    },
    { 
      label: "Candidate Satisfaction", 
      value: data.metrics.candidateSatisfaction, 
      target: "4.5",
      icon: Star, 
      color: "#CDE7F4",
      progress: 90
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Time Range */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-[#09435F]">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back, {user?.name}. Here's your hiring performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E84AE] focus:border-transparent"
          >
            <option value="weekly">Last 7 Days</option>
            <option value="monthly">Last 30 Days</option>
            <option value="quarterly">Last Quarter</option>
            <option value="yearly">Last Year</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download size={18} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${stat.bgColor}`} style={{ color: stat.color }}>
                  <Icon size={24} />
                </div>
                <div className={`flex items-center ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                  {stat.trend === "up" ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  <span className="text-sm font-medium ml-1">{stat.change}</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-[#09435F] mt-4">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {performanceMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${metric.color}20` }}>
                    <Icon size={20} style={{ color: metric.color }} />
                  </div>
                  <span className="ml-3 font-medium text-[#09435F]">{metric.label}</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical size={18} />
                </button>
              </div>
              <div className="flex items-baseline mb-4">
                <span className="text-3xl font-bold text-[#09435F]">{metric.value}</span>
                <span className="ml-2 text-gray-500">Target: {metric.target}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${metric.progress}%`,
                    backgroundColor: metric.color
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Jobs */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#09435F] flex items-center">
              <Briefcase className="mr-2" />
              Recent Job Posts
            </h2>
            <button 
              onClick={onJobPostsClick}
              className="text-[#2E84AE] hover:text-[#09435F] text-sm font-medium flex items-center"
            >
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {recentJobs?.slice(0, 4).map((job) => (
              <div key={job._id} className="flex items-center justify-between p-3 hover:bg-[#CDE7F4]/20 rounded-lg transition-colors">
                <div>
                  <h4 className="font-medium text-[#09435F]">{job.title}</h4>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs mr-2">{job.department}</span>
                    <span>{job.location}</span>
                    <span className="mx-2">•</span>
                    <span>{job.type}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-bold text-[#2E84AE]">{job.applicants || 0}</div>
                    <div className="text-xs text-gray-500">Applicants</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Candidates */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#09435F] flex items-center">
              <Users className="mr-2" />
              Recent Candidates
            </h2>
            <button 
              onClick={onUsersClick}
              className="text-[#2E84AE] hover:text-[#09435F] text-sm font-medium flex items-center"
            >
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {recentCandidates?.slice(0, 4).map((candidate) => (
              <div key={candidate._id} className="flex items-center p-3 hover:bg-[#CDE7F4]/20 rounded-lg transition-colors">
                <img
                  src={candidate.avatar || `https://ui-avatars.com/api/?name=${candidate.name}&background=2E84AE&color=fff`}
                  alt={candidate.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-[#09435F]">{candidate.name}</h4>
                  <p className="text-sm text-gray-500">{candidate.position}</p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                    {candidate.status}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">{candidate.stage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity and Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hiring Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#09435F] mb-6">Hiring Activity</h2>
          {metrics?.hiringTimeline && (
            <div className="h-64 flex items-end space-x-2">
              {metrics.hiringTimeline.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer"
                    style={{ 
                      height: `${(value / Math.max(...metrics.hiringTimeline)) * 100}%`,
                      backgroundColor: index % 2 === 0 ? "#2E84AE" : "#09435F"
                    }}
                    title={`${value} days`}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-br from-[#09435F] to-[#2E84AE] rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-white/10 hover:bg-white/20 p-4 rounded-lg flex flex-col items-center justify-center transition-colors">
              <Briefcase size={24} />
              <span className="mt-2 text-sm">Post New Job</span>
            </button>
            <button className="bg-white/10 hover:bg-white/20 p-4 rounded-lg flex flex-col items-center justify-center transition-colors">
              <Calendar size={24} />
              <span className="mt-2 text-sm">Schedule Interview</span>
            </button>
            <button className="bg-white/10 hover:bg-white/20 p-4 rounded-lg flex flex-col items-center justify-center transition-colors">
              <BarChart size={24} />
              <span className="mt-2 text-sm">View Reports</span>
            </button>
            <button className="bg-white/10 hover:bg-white/20 p-4 rounded-lg flex flex-col items-center justify-center transition-colors">
              <Users size={24} />
              <span className="mt-2 text-sm">Review Candidates</span>
            </button>
          </div>
          <div className="mt-6 pt-6 border-t border-white/20">
            <p className="text-sm opacity-80">Need help?</p>
            <button className="mt-2 text-sm bg-white text-[#09435F] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;