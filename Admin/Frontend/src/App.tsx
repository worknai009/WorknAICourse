import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  LogOut,
  Loader2,
  IndianRupee,
  MessageSquare,
} from "lucide-react";
import api from "./services/api";
import { useAuth } from "./context/AuthContext";
import CourseList from "./components/CourseList";
import UserList from "./components/UserList";
import RevenuePage from "./components/RevenuePage";
import DoubtsPage from "./components/DoubtsPage";
import SettingsPage from "./components/SettingsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

interface DashboardStats {
  totalUsers: number;
  activeCourses: number;
  totalRevenue: number;
}

interface Activity {
  id: string;
  type: string;
  message: string;
  time: string;
}

function App() {
  const { user, loading: authLoading, logout } = useAuth();
  const [authView, setAuthView] = useState<"login" | "signup">("login");
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "users" | "courses" | "revenue" | "doubts" | "settings"
  >("dashboard");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && activeTab === "dashboard") {
      fetchDashboardData();
    }
  }, [activeTab, user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/stats");
      setStats(res.data.stats);
      setRecentActivity(res.data.recentActivity);
    } catch (err: any) {
      console.error("Error fetching stats", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to connect to Admin API",
      );
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (!user) {
    return authView === "login" ? (
      <LoginPage onSwitch={() => setAuthView("signup")} />
    ) : (
      <SignupPage onSwitch={() => setAuthView("login")} />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            <header className="mb-10">
              <h2 className="text-4xl font-bold">Dashboard Overview</h2>
              <p className="text-gray-400 mt-2">
                Welcome back to the WorknAI administrative portal.
              </p>
            </header>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="animate-spin text-blue-500" size={40} />
              </div>
            ) : error ? (
              <div className="p-10 border border-red-500/20 bg-red-500/5 rounded-2xl flex flex-col items-center gap-4">
                <p className="text-red-500 font-medium">Error: {error}</p>
                <button
                  onClick={fetchDashboardData}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg text-sm transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard
                    title="Total Users"
                    value={stats?.totalUsers.toString() || "0"}
                    change="Registered students"
                  />
                  <StatCard
                    title="Active courses"
                    value={stats?.activeCourses.toString() || "0"}
                    change="Published online"
                  />
                  <StatCard
                    title="Revenue"
                    value={`₹${stats?.totalRevenue.toLocaleString() || "0"}`}
                    change="Total gross sales"
                  />
                </div>

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-xl">
                    <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                      {recentActivity.length > 0 ? (
                        recentActivity.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-center gap-4 text-sm border-b border-white/5 pb-4 last:border-0 hover:bg-white/[0.02] p-2 rounded-lg transition-colors"
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${activity.type === "user" ? "bg-blue-500" : "bg-green-500"}`}
                            />
                            <span className="text-gray-400">
                              {activity.message}
                            </span>
                            <span className="ml-auto text-[10px] uppercase text-gray-500 font-mono">
                              {new Date(activity.time).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600 italic">
                          No recent activity found.
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-xl">
                    <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setActiveTab("courses")}
                        className="p-6 bg-white/5 hover:bg-white/10 rounded-2xl text-center transition-all border border-white/5 hover:border-blue-500/30 group"
                      >
                        <BookOpen className="mx-auto mb-2 text-gray-500 group-hover:text-blue-500 transition-colors" />
                        <span className="font-bold text-sm">
                          Manage Courses
                        </span>
                      </button>
                      <button
                        onClick={() => setActiveTab("users")}
                        className="p-6 bg-white/5 hover:bg-white/10 rounded-2xl text-center transition-all border border-white/5 hover:border-blue-500/30 group"
                      >
                        <Users className="mx-auto mb-2 text-gray-500 group-hover:text-blue-500 transition-colors" />
                        <span className="font-bold text-sm">Manage Users</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        );
      case "courses":
        return <CourseList />;
      case "users":
        return <UserList />;
      case "revenue":
        return <RevenuePage />;
      case "settings":
        return <SettingsPage />;
      case "doubts":
        return <DoubtsPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex font-['Inter']">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 p-6 flex flex-col fixed h-full bg-black z-20">
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tighter">
            Admin <span className="text-blue-500">Panel</span>
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <NavItem
            icon={<Users size={20} />}
            label="Users"
            active={activeTab === "users"}
            onClick={() => setActiveTab("users")}
          />
          <NavItem
            icon={<BookOpen size={20} />}
            label="Courses"
            active={activeTab === "courses"}
            onClick={() => setActiveTab("courses")}
          />
          <NavItem
            icon={<IndianRupee size={20} />}
            label="Revenue"
            active={activeTab === "revenue"}
            onClick={() => setActiveTab("revenue")}
          />
          <NavItem
            icon={<MessageSquare size={20} />}
            label="Doubts"
            active={activeTab === "doubts"}
            onClick={() => setActiveTab("doubts")}
          />
          <NavItem
            icon={<Settings size={20} />}
            label="Settings"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
        </nav>

        <div className="pt-6 border-t border-white/10">
          <NavItem
            icon={<LogOut size={20} />}
            label="Logout"
            onClick={logout}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col ml-64 min-h-screen">
        <div className="p-10 max-w-7xl w-full mx-auto">{renderContent()}</div>
      </main>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  onClick,
}: {
  icon: any;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${active ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </div>
  );
}

function StatCard({
  title,
  value,
  change,
}: {
  title: string;
  value: string;
  change: string;
}) {
  return (
    <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-xl hover:border-white/20 transition-all">
      <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
      <div className="text-4xl font-bold mt-2 tracking-tight">{value}</div>
      <p className="text-green-500 text-xs mt-2 font-medium bg-green-500/10 inline-block px-2 py-1 rounded">
        {change}
      </p>
    </div>
  );
}

export default App;
