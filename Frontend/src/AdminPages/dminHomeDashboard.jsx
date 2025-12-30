import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
  ComposedChart
} from "recharts";
import {
  Users,
  Briefcase,
  UserCheck,
  Building,
  TrendingUp,
  DollarSign,
  Calendar,
  PieChart as PieChartIcon,
  Download,
  MoreVertical,
  ChevronUp,
  ChevronDown
} from "lucide-react";

const AdminDashboardHome = () => {
  // ===== STATES =====
  const [stats, setStats] = useState({
    interns: 0,
    jobs: 0,
    mentors: 0,
    hr: 0,
  });
  const [growthRate] = useState({
    interns: 12.5,
    jobs: 8.2,
    mentors: 5.7,
    hr: 15.3
  });
  const [setPurchaseGrowth] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [weeklyJobs, setWeeklyJobs] = useState([]);
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState({ mentors: [], hrs: [] });
  const [revenueStats, setRevenueStats] = useState({
    total: 0,
    change: 0,
    chartData: []
  });

  const getToken = () => localStorage.getItem("adminToken");

  // Mock data for demonstration
  const mockData = {
    purchaseGrowth: [
      { month: 'Jan', count: 120 },
      { month: 'Feb', count: 200 },
      { month: 'Mar', count: 180 },
      { month: 'Apr', count: 280 },
      { month: 'May', count: 320 },
      { month: 'Jun', count: 400 },
    ],
    revenueData: [
      { month: 'Jan', amount: 45000 },
      { month: 'Feb', amount: 52000 },
      { month: 'Mar', amount: 48000 },
      { month: 'Apr', amount: 62000 },
      { month: 'May', amount: 75000 },
      { month: 'Jun', amount: 89000 },
    ],
    weeklyJobs: [
      { week: 'Week 1', count: 45 },
      { week: 'Week 2', count: 52 },
      { week: 'Week 3', count: 48 },
      { week: 'Week 4', count: 65 },
    ],
    plans: [
      { plan: 'Basic', count: 45, value: 299 },
      { plan: 'Pro', count: 28, value: 599 },
      { plan: 'Enterprise', count: 12, value: 999 },
    ]
  };


  const checkAuth = () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      window.location.replace('/admin-login');
      return false;
    }
    return true;
  };


  // ===== USE EFFECT =====
  useEffect(() => {
    if (!checkAuth()) return;
    fetchDashboardStats();
    fetchPurchaseGrowth();
    fetchRevenue();
    fetchWeeklyJobs();
    fetchPlansData();
    fetchUsersData();
  }, []);

  // ============================
  // FETCH GENERAL STATISTICS
  // ============================
  const fetchDashboardStats = async () => {
    try {
      const token = getToken();
      const response = await axios.get("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (err) {
      console.log("Error loading stats", err);
      // Use mock data for demo
      setStats({ interns: 1245, jobs: 342, mentors: 89, hr: 45 });
    }
  };

  // ============================
  // FETCH MONTHLY PURCHASE GROWTH
  // ============================
  const fetchPurchaseGrowth = async () => {
    try {
      const token = getToken();
      const res = await axios.get("/api/admin/purchases/monthly", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPurchaseGrowth(res.data.months);
    } catch (err) {
      console.log("Growth error:", err);
      setPurchaseGrowth(mockData.purchaseGrowth);
    }
  };

  // ============================
  // FETCH MONTHLY REVENUE
  // ============================
  const fetchRevenue = async () => {
    try {
      const token = getToken();
      const res = await axios.get("/api/admin/revenue-monthly", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRevenueData(res.data);
      setRevenueStats({
        total: 245000,
        change: 12.5,
        chartData: mockData.revenueData
      });
    } catch (err) {
      console.log("Revenue error:", err);
      setRevenueData(mockData.revenueData);
    }
  };

  // ============================
  // FETCH WEEKLY JOBS POSTED
  // ============================
  const fetchWeeklyJobs = async () => {
    try {
      const token = getToken();
      const res = await axios.get("/api/admin/jobs-weekly", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWeeklyJobs(res.data);
    } catch (err) {
      console.log("Jobs error:", err);
      setWeeklyJobs(mockData.weeklyJobs);
    }
  };

  // ============================
  // FETCH PLANS PIE CHART DATA
  // ============================
  const fetchPlansData = async () => {
    try {
      const token = getToken();
      const res = await axios.get("/api/admin/plans", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlans(res.data);
    } catch (err) {
      console.log("Plans error:", err);
      setPlans(mockData.plans);
    }
  };

  // ============================
  // FETCH MENTORS + HRS LIST
  // ============================
  const fetchUsersData = async () => {
    try {
      const token = getToken();
      const res = await axios.get("/api/admin/users-list", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.log("User list error:", err);
      // Mock data
      setUsers({
        mentors: [
          { name: "Alex Johnson", role: "Senior Mentor", experience: 8, phone: "+1-234-567-8901", createdAt: "2023-01-15" },
          { name: "Sarah Miller", role: "Tech Mentor", experience: 5, phone: "+1-234-567-8902", createdAt: "2023-03-20" },
          { name: "David Chen", role: "Career Coach", experience: 7, phone: "+1-234-567-8903", createdAt: "2023-05-10" },
        ],
        hrs: [
          { name: "Michael Brown", role: "HR Manager", experience: 10, phone: "+1-234-567-8904", createdAt: "2023-02-01" },
          { name: "Emma Wilson", role: "Recruiter", experience: 4, phone: "+1-234-567-8905", createdAt: "2023-04-15" },
        ]
      });
    }
  };

  // Custom Tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-800 dark:text-gray-200">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // =============== UI RETURN ======================
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* ======================= HEADER ======================= */}

      {/* ======================= TOP CARDS ======================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Interns"
          value={stats.interns.toLocaleString()}
          icon={<Users size={24} />}
          growth={growthRate.interns}
          color="blue"
        />
        <StatCard
          title="Jobs Posted"
          value={stats.jobs.toLocaleString()}
          icon={<Briefcase size={24} />}
          growth={growthRate.jobs}
          color="purple"
        />
        <StatCard
          title="Active Mentors"
          value={stats.mentors.toLocaleString()}
          icon={<UserCheck size={24} />}
          growth={growthRate.mentors}
          color="green"
        />
        <StatCard
          title="Hiring Team"
          value={stats.hr.toLocaleString()}
          icon={<Building size={24} />}
          growth={growthRate.hr}
          color="red"
        />
      </div>


      {/* ======================= MAIN CHARTS SECTION ======================= */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">

        {/* REVENUE AREA CHART */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Revenue Overview</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Monthly revenue in USD</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7A5CFF" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#7A5CFF" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280' }}
                tickFormatter={(value) => `$${(value / 1000)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#7A5CFF"
                strokeWidth={3}
                fill="url(#revenueGradient)"
                activeDot={{ r: 8, strokeWidth: 2, fill: '#7A5CFF' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* ======================= SECONDARY CHARTS ======================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* PLANS DISTRIBUTION */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Plans Distribution</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Subscription plans purchased</p>
            </div>
            <PieChartIcon className="text-purple-500" size={24} />
          </div>

          <div className="flex flex-col lg:flex-row items-center">
            <div className="w-full lg:w-2/5">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={plans}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="count"
                    stroke="white"
                    strokeWidth={2}
                  >
                    {plans.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={['#7A5CFF', '#39D0FF', '#4ADE80'][index % 3]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full lg:w-3/5 lg:pl-8">
              {plans.map((plan, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: ['#7A5CFF', '#39D0FF', '#4ADE80'][index % 3] }}
                    />
                    <span className="font-medium text-gray-900 dark:text-white">{plan.plan}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900 dark:text-white">{plan.count} Purchased</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* WEEKLY JOBS CHART */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Weekly Jobs</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">New job postings</p>
            </div>
            <Briefcase className="text-blue-500" size={24} />
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyJobs}>
              <defs>
                <linearGradient id="weeklyJobsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#39D0FF" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#7A5CFF" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="week"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                fill="url(#weeklyJobsGradient)"
                radius={[8, 8, 8, 8]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-4 text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {weeklyJobs.reduce((sum, week) => sum + week.count, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total jobs this month</div>
          </div>
        </div>
      </div>

      {/* ======================= USER TABLE ======================= */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Team Members</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Mentors & Hiring Team</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 text-left">
                <th className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                <th className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Role</th>
                <th className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Experience</th>
                <th className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Phone</th>
                <th className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Joined</th>
                <th className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {[...users.mentors, ...users.hrs].map((user, i) => (
                <tr
                  key={i}
                  className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold mr-3">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{user.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{user.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.role.includes('Mentor')
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                        <div
                          className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                          style={{ width: `${Math.min(user.experience * 10, 100)}%` }}
                        />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{user.experience} yrs</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-700 dark:text-gray-300">{user.phone || "—"}</td>
                  <td className="py-4 px-6 text-gray-700 dark:text-gray-300">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const bgColorClasses = {
  blue: {
    card: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20",
    icon: "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg",
    ring: "ring-blue-100 dark:ring-blue-900/30",
    text: "text-blue-600"
  },
  purple: {
    card: "bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20",
    icon: "bg-gradient-to-br from-purple-500 to-violet-500 text-white shadow-lg",
    ring: "ring-purple-100 dark:ring-purple-900/30",
    text: "text-purple-600"
  },
  green: {
    card: "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20",
    icon: "bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-lg",
    ring: "ring-emerald-100 dark:ring-emerald-900/30",
    text: "text-emerald-600"
  },
  red: {
    card: "bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20",
    icon: "bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg",
    ring: "ring-rose-100 dark:ring-rose-900/30",
    text: "text-rose-600"
  },
};



// =============== STAT CARD COMPONENT ===============
// =============== STAT CARD COMPONENT ===============
const StatCard = ({ title, value, icon, color }) => {
  const theme = bgColorClasses[color];

  return (
    <div
      className={`p-6 rounded-2xl shadow-sm ring-1 ${theme.ring} ${theme.card} transition-all duration-300 hover:shadow-md hover:scale-[1.02]`}
    >
      <div className="flex items-center justify-between">
        
        {/* TEXT */}
        <div className="flex-1">
          <p className={`text-sm font-semibold ${theme.text} dark:${theme.text}/80 mb-1`}>
            {title}
          </p>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {value}
          </h2>

        </div>

        {/* ICON */}
        <div
          className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center ${theme.icon} shadow-lg ml-4`}
        >
          {React.cloneElement(icon, { size: 28 })}
        </div>
      </div>
    </div>
  );
};


export default AdminDashboardHome;