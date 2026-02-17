import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../AuthContext";
import { useData } from "../../context";
import { motion } from "framer-motion";
import axios from "axios";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Settings,
  LogOut,
  User as UserIcon,
  Bell,
  Search,
  Compass,
  Trash2,
  Check,
  Sun,
  Moon,
  X,
  Download,
  Activity,
  Clock,
  TrendingUp,
  Award as AwardIcon,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useNotification } from "../../NotificationContext";
import { useTheme } from "../../context";
import { type Course } from "../../../services/api";
import coursesApi from "../../../services/api";
import CourseCard from "../../components/CourseCard";
import CoursePlayer from "./CoursePlayer";
import MyDoubts from "./MyDoubts";
import { AnimatePresence } from "framer-motion";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  path: string;
  active: boolean;
  onClick?: () => void;
}

// Sidebar Item Component
const SidebarItem = ({
  icon: Icon,
  label,
  path,
  active,
  onClick,
}: SidebarItemProps) => (
  <Link
    to={path}
    onClick={onClick}
    className={`lms-sidebar-item group ${
      active
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40"
        : "text-slate-600 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50"
    }`}
  >
    <Icon
      size={18}
      strokeWidth={active ? 2.5 : 2}
      className={`transition-all duration-300 ${
        active ? "scale-100" : "group-hover:scale-110"
      }`}
    />
    <span className={`${active ? "font-semibold" : "font-medium"}`}>
      {label}
    </span>
  </Link>
);

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/lms" },
  { icon: BookOpen, label: "My Courses", path: "/lms/courses" },
  { icon: Compass, label: "Browse Tracks", path: "/lms/browse" },
  { icon: Award, label: "Certificates", path: "/lms/certificates" },
  { icon: HelpCircle, label: "My Doubts", path: "/lms/doubts" },
  { icon: Settings, label: "Settings", path: "/lms/settings" },
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isPlayerPage = location.pathname.includes("/player");

  if (isPlayerPage) {
    return (
      <Routes>
        <Route path="/course/:id/player" element={<CoursePlayer />} />
      </Routes>
    );
  }

  return (
    <div
      className={`flex h-screen overflow-hidden transition-colors duration-500 ${isDarkMode ? "bg-zinc-950 text-white" : "bg-white text-zinc-950"}`}
    >
      <style>{`
                * {
                    scrollbar-width: none !important;
                    -ms-overflow-style: none !important;
                }
                *::-webkit-scrollbar {
                    display: none !important;
                }
            `}</style>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 w-72 border-r z-[100] transition-all flex flex-col ${
          isDarkMode
            ? "bg-slate-950 border-slate-800/50"
            : "bg-slate-50 border-slate-300 shadow-sm"
        }`}
      >
        <div className="p-8 pb-10">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all group-hover:scale-105">
              <img
                src="/Logo2.jpeg"
                alt="WorknAI Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white font-syne uppercase">
              WorknAI
            </span>
          </Link>
        </div>

        <div className="flex-grow space-y-6">
          <div>
            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <SidebarItem
                  key={item.path}
                  {...item}
                  active={location.pathname === item.path}
                />
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800/50">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-4 px-5 py-3 rounded-xl transition-all w-full group ${
              isDarkMode
                ? "hover:bg-rose-500/10 text-slate-500 hover:text-rose-500"
                : "hover:bg-rose-100/50 text-slate-600 hover:text-rose-700"
            }`}
          >
            <LogOut
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span className="font-semibold text-sm">Exit Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`flex-grow md:ml-72 flex flex-col h-screen relative overflow-hidden transition-colors duration-500 ${
          isDarkMode ? "bg-slate-950" : "bg-slate-50/50"
        }`}
      >
        {/* Elite Header */}
        <header
          className={`h-20 flex items-center justify-between px-8 relative z-50 transition-all ${
            isDarkMode
              ? "bg-slate-950/80 border-b border-slate-800/50 backdrop-blur-xl"
              : "bg-white/90 border-b border-slate-300 shadow-sm backdrop-blur-md"
          }`}
        >
          <div className="flex-1 max-w-xl">
            <div
              className={`relative group flex items-center ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
            >
              <Search
                size={18}
                className="absolute left-3 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search for courses, lessons, topics..."
                className={`w-full h-11 pl-10 pr-4 rounded-xl text-sm border-0 focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${
                  isDarkMode
                    ? "bg-slate-900/50 border border-slate-800"
                    : "bg-slate-200/50 border border-slate-300 text-slate-950 placeholder-slate-500"
                }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <button
                className={`p-2.5 rounded-xl border transition-all relative group ${
                  isDarkMode
                    ? "text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white"
                    : "text-slate-600 border-slate-300 hover:bg-slate-100 hover:text-slate-950 shadow-sm"
                }`}
              >
                <Bell size={18} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white dark:border-slate-900" />
              </button>

              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl border transition-all ${
                  isDarkMode
                    ? "text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white"
                    : "text-slate-500 border-slate-200 hover:bg-slate-100 hover:text-slate-950 shadow-sm"
                }`}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>

            <div
              className={`h-8 w-px ${isDarkMode ? "bg-slate-800" : "bg-slate-300"}`}
            />

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p
                  className={`font-semibold text-sm ${isDarkMode ? "text-white" : "text-slate-950 font-bold"}`}
                >
                  {user?.name}
                </p>
                <p className="text-[10px] font-medium text-indigo-500 uppercase tracking-widest">
                  {user?.role === "admin"
                    ? "Systems Architect"
                    : "Lead Engineer"}
                </p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center border border-slate-800 dark:border-slate-300 shadow-lg shadow-indigo-500/10">
                <UserIcon
                  size={20}
                  className={isDarkMode ? "text-white" : "text-slate-950"}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content Area */}
        <div className="flex-grow overflow-y-auto p-6 lg:pt-10 relative z-10 scrollbar-hide">
          <div className="max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Overview />} />
              <Route path="/courses" element={<MyCourses />} />
              <Route path="/browse" element={<BrowseCourses />} />
              <Route path="/certificates" element={<Certificates />} />
              <Route path="/doubts" element={<MyDoubts />} />
              <Route path="/settings" element={<ProfileSettings />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Sub-components (could be in separate files) ---

const Overview = () => {
  const { user } = useAuth();
  const { courses } = useData();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState<Course[]>([]);

  const [certCount, setCertCount] = useState(0);
  const [courseProgress, setCourseProgress] = useState<Record<string, number>>(
    {},
  );

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user?.token) return;
      try {
        const baseUrl =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        const [myCoursesRes, progressData] = await Promise.all([
          axios.get(`${baseUrl}/api/user/my-courses`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          coursesApi.getProgress(),
        ]);

        if (myCoursesRes.data.success) {
          const owned = myCoursesRes.data.data;
          setMyCourses(owned);

          // Calculate eligible certs and individual progress
          let earned = 0;
          const progressMap: Record<string, number> = {};

          for (const course of owned) {
            try {
              const detail = await coursesApi.getCourseById(
                course.id || course._id,
              );
              const total =
                detail.syllabusPhases?.reduce(
                  (acc: number, p: any) =>
                    acc +
                    p.weeks.reduce(
                      (wAcc: number, w: any) => wAcc + w.topics.length,
                      0,
                    ),
                  0,
                ) || 0;

              const prog = progressData.find(
                (p: any) => p.courseId?.toString() === detail._id?.toString(),
              );
              const completed = prog ? new Set(prog.completedTopics).size : 0;
              const percentage =
                total > 0 ? Math.round((completed / total) * 100) : 0;

              progressMap[course.id || course._id] = percentage;

              if (total > 0 && percentage >= 90) {
                earned++;
              }
            } catch (e) {
              console.error("Stat calculation failed for course", course.id);
            }
          }
          setCertCount(earned);
          setCourseProgress(progressMap);
        }
      } catch (err) {
        console.error("Failed to load overview data", err);
      }
    };
    loadDashboardData();
  }, [user?.token]);

  // Recommended course (first one from database that isn't purchased, or just first one)
  const recommendedCourse =
    courses.find((c) => !myCourses.find((mc) => mc._id === c._id)) ||
    courses[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1600px] mx-auto space-y-10"
    >
      {/* 1. Executive Greeting */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-10">
        <div className="space-y-1">
          <h1
            className={`text-3xl md:text-4xl font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}
          >
            Welcome back, {user?.name?.split(" ")[0]}
          </h1>
          <p
            className={`text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
          >
            Your technical progression is currently at{" "}
            <span className="text-indigo-600 font-bold">78%</span>. Continue
            where you left off.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-4 py-2 rounded-xl text-xs font-semibold ${isDarkMode ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}
          >
            Personnel Status: Active
          </span>
        </div>
      </div>

      {/* 2. Statistics Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Active Courses",
            value: myCourses.length.toString(),
            icon: BookOpen,
            color: "text-indigo-600",
            bg: "bg-indigo-500/10",
          },
          {
            label: "Hours Learned",
            value: "142h",
            icon: Clock,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
          },
          {
            label: "Certificates",
            value: certCount.toString(),
            icon: AwardIcon,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Global Rank",
            value: "#08",
            icon: TrendingUp,
            color: "text-rose-500",
            bg: "bg-rose-500/10",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={`lms-card p-6 ${isDarkMode ? "lms-card-dark" : "lms-card-light"}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}
              >
                <stat.icon size={22} />
              </div>
            </div>
            <div className="space-y-1">
              <p
                className={`text-xs font-semibold ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
              >
                {stat.label}
              </p>
              <h3
                className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}
              >
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Deep Performance Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Protocol History */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3
              className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              Continue Learning
            </h3>
            <Link
              to="/lms/courses"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1 group"
            >
              View all tracks
              <ChevronRight
                size={14}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          </div>

          <div className="grid gap-4">
            {myCourses.length > 0 ? (
              myCourses.slice(0, 3).map((course) => (
                <Link
                  to={`/lms/course/${course.id || course._id}/player`}
                  key={course._id || course.id}
                  className={`lms-card p-5 flex items-center gap-6 ${isDarkMode ? "lms-card-dark" : "lms-card-light"}`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 ${
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-indigo-400"
                        : "bg-indigo-50 border-indigo-100 text-indigo-600"
                    }`}
                  >
                    <BookOpen size={24} />
                  </div>

                  <div className="flex-grow space-y-3">
                    <div className="flex flex-col gap-0.5">
                      <h4
                        className={`font-bold text-lg leading-tight transition-colors ${
                          isDarkMode ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {course.name}
                      </h4>
                      <p
                        className={`text-[10px] font-semibold uppercase tracking-widest ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
                      >
                        Technical Track • {course.status}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center pr-1">
                        <span
                          className={`text-[10px] font-bold ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
                        >
                          PROGRESSION
                        </span>
                        <span className="text-[10px] font-bold text-indigo-600">
                          {courseProgress[course.id || course._id] || 0}%
                        </span>
                      </div>
                      <div
                        className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}
                      >
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${courseProgress[course.id || course._id] || 0}%`,
                          }}
                          className="h-full bg-indigo-600 rounded-full"
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    className={`h-11 w-11 rounded-xl flex items-center justify-center transition-all ${
                      isDarkMode
                        ? "bg-slate-800 text-slate-400"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <ChevronRight size={18} />
                  </div>
                </Link>
              ))
            ) : (
              <div
                className={`py-16 text-center space-y-4 border-2 border-dashed rounded-[2rem] ${isDarkMode ? "border-slate-800" : "border-slate-300"}`}
              >
                <Activity
                  size={32}
                  className="text-slate-300 mx-auto"
                  strokeWidth={1}
                />
                <div className="space-y-1">
                  <h4
                    className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}
                  >
                    No Active Tracks
                  </h4>
                  <p className="text-slate-500 font-medium text-xs max-w-xs mx-auto">
                    You haven't enrolled in any tracks yet. Explore our courses
                    to begin.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Path Recommendation */}
        <div className="lg:col-span-4 h-full">
          {recommendedCourse && (
            <div
              className={`lms-card p-10 flex flex-col justify-between h-full relative overflow-hidden transition-all group ${
                isDarkMode
                  ? "bg-indigo-600 border-transparent text-white"
                  : "bg-slate-900 border-transparent text-white shadow-2xl shadow-indigo-200"
              }`}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32" />

              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.6)]" />
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.4em] opacity-60">
                    Recommended Path
                  </span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-3xl font-extrabold leading-tight tracking-tight">
                    Level up your skill domain.
                  </h4>
                  <p className="text-sm font-medium opacity-60 leading-relaxed">
                    Based on your activity, we suggest the{" "}
                    {recommendedCourse.name} track next.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm">
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-2">
                    FEATURED TRACK
                  </p>
                  <p className="font-bold text-lg leading-tight uppercase font-syne">
                    {recommendedCourse.name}
                  </p>
                </div>
              </div>

              <div className="relative z-10 mt-10">
                <button
                  onClick={() =>
                    navigate(
                      `/checkout/${recommendedCourse.id || recommendedCourse._id}`,
                    )
                  }
                  className="w-full py-5 bg-white text-indigo-600 rounded-xl font-bold text-sm uppercase tracking-widest transition-all hover:bg-slate-50 active:scale-95 shadow-xl"
                >
                  Enroll Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const MyCourses = () => {
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { showToast, confirm } = useNotification();

  const [courseProgress, setCourseProgress] = useState<Record<string, number>>(
    {},
  );

  const fetchMyCourses = React.useCallback(async () => {
    try {
      const baseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const [coursesRes, progressData] = await Promise.all([
        axios.get(`${baseUrl}/api/user/my-courses`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        }),
        coursesApi.getProgress(),
      ]);

      if (coursesRes.data.success) {
        const owned = coursesRes.data.data;
        setMyCourses(owned);

        const progressMap: Record<string, number> = {};
        for (const course of owned) {
          try {
            const detail = await coursesApi.getCourseById(
              course.id || course._id,
            );
            const totalTopics =
              detail.syllabusPhases?.reduce((acc: number, phase: any) => {
                const weekTotal =
                  phase.weeks?.reduce(
                    (wAcc: number, week: any) =>
                      wAcc + (week.topics?.length || 0),
                    0,
                  ) || 0;
                return acc + weekTotal;
              }, 0) || 0;

            const progress = progressData.find(
              (p: any) => p.courseId?.toString() === detail._id.toString(),
            );

            const completedCount = progress?.completedTopics
              ? new Set(progress.completedTopics).size
              : 0;

            progressMap[course.id || course._id] =
              totalTopics > 0
                ? Math.round((completedCount / totalTopics) * 100)
                : 0;
          } catch (err) {
            console.error(
              `Failed to calculate progress for ${course.id}:`,
              err,
            );
            progressMap[course.id || course._id] = 0;
          }
        }
        setCourseProgress(progressMap);
      }
    } catch (err) {
      console.error("Failed to fetch courses", err);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    if (user?.token) fetchMyCourses();
  }, [user?.token, fetchMyCourses]);

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;

    const confirmed = await confirm(
      "Final Warning",
      `You are about to permanently remove ${selectedIds.length} courses from your learning library. This action cannot be undone.`,
    );

    if (!confirmed) return;

    setDeleting(true);
    try {
      const baseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      await axios.delete(`${baseUrl}/api/user/remove-courses`, {
        data: { courseIds: selectedIds },
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      await fetchMyCourses();
      showToast(
        `${selectedIds.length} courses removed from library`,
        "success",
      );
      setSelectionMode(false);
      setSelectedIds([]);
    } catch {
      showToast("Failed to remove courses", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-[10px] font-bold uppercase tracking-[0.3em]">
        Loading library...
      </div>
    );

  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10">
        <div className="space-y-1">
          <h2
            className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}
          >
            My Learning Library
          </h2>
          <p
            className={`text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-slate-600"}`}
          >
            Track your progress and continue your professional journey.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {myCourses.length > 0 && !selectionMode && (
            <button
              onClick={() => setSelectionMode(true)}
              className={`p-3 rounded-xl transition-all border ${
                isDarkMode
                  ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-rose-500"
                  : "bg-white border-slate-300 text-slate-600 hover:text-rose-600 hover:bg-rose-50 shadow-sm"
              }`}
            >
              <Trash2 size={18} />
            </button>
          )}

          {selectionMode && (
            <div className="flex items-center gap-4 animate-in fade-in slide-in-from-right-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {selectedIds.length} SELECTED
              </span>
              <button
                onClick={() => {
                  setSelectionMode(false);
                  setSelectedIds([]);
                }}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isDarkMode
                    ? "bg-slate-800 text-slate-400 hover:text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting || selectedIds.length === 0}
                className="px-6 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all disabled:opacity-50 shadow-lg shadow-rose-600/20"
              >
                {deleting ? "Removing..." : "Remove Tracks"}
              </button>
            </div>
          )}
        </div>
      </div>

      {myCourses.length === 0 ? (
        <div
          className={`h-[50vh] flex items-center justify-center flex-col gap-8 rounded-[3rem] border-2 border-dashed ${
            isDarkMode
              ? "border-slate-800 bg-slate-900/40"
              : "border-slate-200 bg-slate-50/50"
          }`}
        >
          <div className="h-20 w-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <BookOpen size={32} className="text-slate-300" />
          </div>
          <div className="text-center space-y-2">
            <h3
              className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              No courses found
            </h3>
            <p className="text-slate-500 font-medium text-sm max-w-xs mx-auto">
              You haven't enrolled in any tracks yet. Explore our catalog to
              start learning.
            </p>
          </div>
          <Link
            to="/lms/browse"
            className="px-10 py-4 rounded-xl bg-indigo-600 text-white font-bold text-sm transition-all hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/20"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {myCourses.map((course) => {
            const isSelected = selectedIds.includes(course._id || course.id);
            const progress = courseProgress[course.id || course._id] || 0;
            return (
              <div
                key={course._id || course.id}
                onClick={() =>
                  selectionMode
                    ? toggleSelection(course._id || course.id)
                    : null
                }
                className={`lms-card flex flex-col h-full relative group ${
                  isDarkMode ? "lms-card-dark" : "lms-card-light"
                } ${isSelected ? "ring-2 ring-rose-500 border-rose-500 shadow-xl" : ""} ${
                  selectionMode ? "cursor-pointer" : ""
                }`}
              >
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={
                      course.certificateImage ||
                      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1974&auto=format&fit=crop"
                    }
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    alt={course.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />

                  {selectionMode && (
                    <div className="absolute top-4 right-4 z-20">
                      <div
                        className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-rose-600 border-rose-600 shadow-lg"
                            : "bg-white/20 backdrop-blur-md border-white/40"
                        }`}
                      >
                        {isSelected && (
                          <Check
                            size={14}
                            strokeWidth={3}
                            className="text-white"
                          />
                        )}
                      </div>
                    </div>
                  )}

                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-lg">
                      {course.status}
                    </span>
                  </div>
                </div>

                <div className="p-8 flex flex-col grow space-y-6">
                  <div className="space-y-2">
                    <h4
                      className={`font-bold text-xl leading-snug ${isDarkMode ? "text-white" : "text-slate-900"}`}
                    >
                      {course.name}
                    </h4>
                    <p
                      className={`text-xs font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                    >
                      Technical Specialization • {course.language || "English"}
                    </p>
                  </div>

                  <div className="space-y-3 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/50">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                      <span
                        className={
                          isDarkMode ? "text-slate-500" : "text-slate-400"
                        }
                      >
                        Course progress
                      </span>
                      <span className="text-indigo-600">{progress}%</span>
                    </div>
                    <div
                      className={`w-full h-2 rounded-full overflow-hidden ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-indigo-600 rounded-full"
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>

                    {!selectionMode && (
                      <Link
                        to={`/lms/course/${course.id || course._id}/player`}
                        className="w-full h-12 flex items-center justify-center rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm transition-all hover:bg-indigo-600 dark:hover:bg-indigo-600 dark:hover:text-white mt-4"
                      >
                        Continue Stream
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const BrowseCourses = () => {
  const { courses } = useData();
  const { isDarkMode } = useTheme();

  return (
    <div className="max-w-[1600px] mx-auto space-y-12">
      <div className="flex flex-col gap-2 pb-10">
        <h2
          className={`text-3xl md:text-4xl font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}
        >
          Professional Catalog
        </h2>
        <p
          className={`text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
        >
          Access high-performance industry tracks designed for engineering
          excellence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <div key={course.id || course._id} className="h-full">
            <CourseCard course={course} />
          </div>
        ))}
      </div>
    </div>
  );
};

// CertificateViewer Component
const CertificateViewer = ({
  course,
  onClose,
  isDirectDownload = false,
  downloadFormat = "pdf",
}: {
  course: any;
  onClose: () => void;
  isDirectDownload?: boolean;
  downloadFormat?: "pdf" | "png" | "jpg";
}) => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  // Calculate dates based on updatedAt
  const endDate = course.updatedAt ? new Date(course.updatedAt) : new Date();
  // const startDate = new Date(endDate); // startDate is not used in the current template
  // startDate.setMonth(startDate.getMonth() - 3);

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const CertificateContent = () => (
    <>
      {/* Decorative Elements - Premium Sweep */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-900 via-blue-800 to-transparent rounded-br-[450px] -translate-x-20 -translate-y-20 opacity-100"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-blue-900 via-blue-800 to-transparent rounded-tl-[450px] translate-x-20 translate-y-20 opacity-100"></div>

      {/* Gold Trim */}
      <div className="absolute inset-[30px] border-[1px] border-amber-500/20 rounded-[0.5rem] pointer-events-none"></div>

      {/* Background Texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#000 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Content Container */}
      <div className="relative h-full w-full bg-transparent flex flex-col items-center justify-between p-28 overflow-hidden text-zinc-950 font-sans border-[12px] border-zinc-50">
        {/* Header Logos */}
        <div className="flex flex-col items-center gap-4 relative z-10 scale-110">
          <img
            src="/Logo2.jpeg"
            alt="WorknAI"
            className="h-20 object-contain shadow-sm"
          />
          <div className="flex flex-col items-center">
            <h4 className="text-3xl font-black text-blue-900 tracking-tighter">
              WorknAI
            </h4>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.5em] -mt-1">
              Where AI Meets Your Work
            </p>
          </div>
        </div>

        {/* Main Titles */}
        <div className="text-center space-y-4 relative z-10 mt-6">
          <h1 className="text-9xl font-black text-blue-900 tracking-tight leading-none mb-2">
            CERTIFICATE
          </h1>
          <p className="text-4xl font-black text-zinc-800 tracking-[0.4em] uppercase opacity-90">
            OF INTERNSHIP
          </p>
        </div>

        {/* Body */}
        <div className="flex flex-col items-center gap-12 w-full text-center relative z-10">
          <p className="text-2xl italic font-bold text-zinc-400">
            This certificate is proudly presented to
          </p>

          <div className="w-full max-w-[90%] border-b-[6px] border-zinc-100 pb-6">
            <h3 className="text-[120px] font-black text-blue-950 uppercase tracking-tighter leading-none py-4">
              {user?.name}
            </h3>
          </div>

          <div className="max-w-[85%] space-y-8">
            <p className="text-3xl text-zinc-800 leading-relaxed font-medium">
              This is to certify that{" "}
              <span className="font-black text-zinc-950">{user?.name}</span> has
              successfully completed an internship at WorknAI as a{" "}
              <span className="font-black text-zinc-950 uppercase">
                {course.name} Intern
              </span>{" "}
              for a period of 3 months.
            </p>
            <p className="text-xl text-zinc-400 italic max-w-4xl mx-auto leading-relaxed">
              During the internship, they demonstrated exceptional proficiency
              in industry-standard tools and contributed significantly to the
              technical ecosystem.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full flex justify-between items-end mt-16 relative z-10 px-10">
          <div className="text-left">
            <p className="text-xs font-black uppercase text-zinc-400 tracking-[0.3em] mb-2">
              Issue Date
            </p>
            <p className="text-2xl font-black text-zinc-950 underline decoration-blue-600 decoration-4 underline-offset-8">
              {formatDate(endDate)}
            </p>
          </div>

          <div className="flex flex-col items-center pb-2">
            <div className="text-blue-700 font-serif italic text-6xl leading-none mb-6 h-16 flex items-center drop-shadow-sm">
              Sahil Patel
            </div>
            <div className="w-96 border-t font-bold border-zinc-200 pt-6 text-center">
              <p className="text-2xl font-black text-blue-900 leading-none">
                Mr. Sahil Patel
              </p>
              <p className="text-xs font-black text-zinc-400 uppercase tracking-[0.3em] mt-2">
                CEO Of WorknAI Technologies
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs font-black uppercase text-zinc-400 tracking-[0.3em] mb-2">
              Verification ID
            </p>
            <p className="text-2xl font-black font-mono text-zinc-950 bg-zinc-50 px-4 py-2 rounded-lg">
              {course._id?.slice(-12).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Elevated Gold Seal */}
        <div className="absolute top-20 left-20 w-40 h-40 opacity-100 filter drop-shadow-[0_20px_40px_rgba(245,158,11,0.4)]">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-200 via-amber-500 to-amber-700 rounded-full"></div>
          <div className="absolute inset-3 border-4 border-amber-100/30 rounded-full flex items-center justify-center">
            <Award className="text-amber-50" size={64} />
          </div>
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
            <div className="w-8 h-20 bg-amber-600 rounded-b-xl shadow-lg"></div>
            <div className="w-8 h-20 bg-amber-600 rounded-b-xl shadow-lg"></div>
          </div>
        </div>
      </div>
    </>
  );

  const handleDownload = async (format: "pdf" | "png" | "jpg" = "pdf") => {
    if (!certificateRef.current) return;
    setIsDownloading(true);
    showToast(`Generating ${format.toUpperCase()}...`, "info");
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: 1200,
        height: 848,
        removeContainer: true,
      });

      const fileName = `WorknAI_Certificate_${course.name.replace(/\s+/g, "_")}_${user?.name?.replace(/\s+/g, "_")}`;

      if (format === "pdf") {
        const imgData = canvas.toDataURL("image/png", 1.0);
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: [canvas.width, canvas.height],
        });
        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save(`${fileName}.pdf`);
      } else {
        const mimeType = format === "png" ? "image/png" : "image/jpeg";
        const quality = format === "jpg" ? 0.9 : 1.0;
        const imgData = canvas.toDataURL(mimeType, quality);
        const link = document.createElement("a");
        link.download = `${fileName}.${format}`;
        link.href = imgData;
        link.click();
      }
      showToast("Success! Certificate downloaded.", "success");
    } catch (err) {
      console.error(`Failed to generate ${format}`, err);
      showToast(`Failed to generate ${format}.`, "error");
    } finally {
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    if (isDirectDownload && certificateRef.current && !isDownloading) {
      // Small delay to ensure images/fonts are painted
      const timer = setTimeout(() => {
        handleDownload(downloadFormat).then(() => {
          onClose();
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isDirectDownload, isDownloading, downloadFormat, onClose]);

  if (isDirectDownload) {
    return (
      <div
        className="fixed -left-[2000px] top-0 pointer-events-none z-[-1]"
        style={{ width: "1200px", height: "848px" }}
      >
        <div
          ref={certificateRef}
          style={{
            width: "1200px",
            height: "848px",
            backgroundColor: "white",
            position: "relative",
          }}
        >
          <CertificateContent />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-zinc-950/95 backdrop-blur-3xl"
      onClick={onClose}
    >
      <motion.div
        ref={certificateRef}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative max-w-6xl w-full aspect-[1.414/1] bg-white rounded-[1rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden p-1 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <CertificateContent />
      </motion.div>

      {/* Control Bar - Outside the capture ref */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-[1100]">
        <div className="bg-white/10 backdrop-blur-3xl border border-white/20 p-2 rounded-3xl flex items-center gap-2">
          {[
            { format: "pdf" as const, label: "PDF" },
            { format: "png" as const, label: "PNG" },
            { format: "jpg" as const, label: "JPG" },
          ].map((item) => (
            <button
              key={item.format}
              onClick={() => handleDownload(item.format)}
              disabled={isDownloading}
              className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 ${
                item.format === "pdf"
                  ? "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {isDownloading ? "..." : item.label}
            </button>
          ))}
          <div className="w-px h-8 bg-white/10 mx-2"></div>
          <button
            onClick={onClose}
            className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center transition-all border border-white/20"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Certificates Component
const Certificates = () => {
  const [eligibleCourses, setEligibleCourses] = useState<any[]>([]);
  const [selectedCert, setSelectedCert] = useState<any | null>(null);
  const [downloadingCert, setDownloadingCert] = useState<any | null>(null);
  const [downloadFormat, setDownloadFormat] = useState<"pdf" | "png" | "jpg">(
    "pdf",
  );
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchAndFilterCertificates = async () => {
      if (!user?.token) {
        setLoading(false);
        return;
      }
      try {
        const baseUrl =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

        // 1. Fetch my courses and progress in parallel
        const [myCoursesRes, progressData] = await Promise.all([
          axios.get(`${baseUrl}/api/user/my-courses`, {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          coursesApi.getProgress(),
        ]);

        if (myCoursesRes.data.success) {
          const myOwnedCourses = myCoursesRes.data.data;

          const eligible = await Promise.all(
            myOwnedCourses.map(async (course: any) => {
              try {
                const detail = await coursesApi.getCourseById(
                  course.id || course._id,
                );
                if (!detail || !detail._id) return null;

                // Calculate total topics across all phases
                const totalTopics =
                  detail.syllabusPhases?.reduce((acc: number, phase: any) => {
                    const weekTotal =
                      phase.weeks?.reduce(
                        (wAcc: number, week: any) =>
                          wAcc + (week.topics?.length || 0),
                        0,
                      ) || 0;
                    return acc + weekTotal;
                  }, 0) || 0;

                // Essential Guard: If no topics exist, no certificate can exist
                if (totalTopics === 0) return null;

                // Match progress by MongoDB _id
                const progress = progressData.find(
                  (p: any) => p.courseId?.toString() === detail._id.toString(),
                );

                const completedCount = progress?.completedTopics
                  ? new Set(progress.completedTopics).size
                  : 0;

                // Essential Guard: If 0 topics completed, no certificate
                if (completedCount === 0) return null;

                const percentage = (completedCount / totalTopics) * 100;

                // Earned Proof requirement: Above 90% completion
                if (percentage >= 90 && isFinite(percentage)) {
                  return {
                    ...course,
                    percentage: Math.min(percentage, 100),
                    updatedAt: detail.updatedAt || new Date().toISOString(),
                  };
                }
              } catch (err) {
                console.error(
                  `Certificate analysis failed for ${course.id}:`,
                  err,
                );
              }
              return null;
            }),
          );

          setEligibleCourses(eligible.filter((c): c is any => c !== null));
        }
      } catch (error) {
        console.error("Failed to fetch and filter certificates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAndFilterCertificates();
  }, [user?.token]);

  if (loading)
    return (
      <div className="p-12 text-center text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        Loading certificates...
      </div>
    );

  return (
    <div className="max-w-[1600px] mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10">
        <div className="space-y-1">
          <h2
            className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}
          >
            Professional Credentials
          </h2>
          <p
            className={`text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
          >
            Access your verified certificates and track your professional
            achievements.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div
            className={`px-6 py-3 rounded-2xl border flex items-center gap-4 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}
          >
            <Award size={20} className="text-indigo-600" />
            <div>
              <p
                className={`text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
              >
                Earned certificates
              </p>
              <p
                className={`text-lg font-bold leading-none ${isDarkMode ? "text-white" : "text-slate-900"}`}
              >
                {eligibleCourses.length.toString().padStart(2, "0")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {eligibleCourses.length === 0 ? (
        <div
          className={`h-[40vh] flex items-center justify-center flex-col gap-6 rounded-[3rem] border-2 border-dashed ${isDarkMode ? "border-slate-800 bg-slate-900/40" : "border-slate-200 bg-slate-50"}`}
        >
          <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300">
            <Award size={32} />
          </div>
          <div className="text-center space-y-2">
            <h3
              className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              No certificates earned yet
            </h3>
            <p className="text-slate-500 font-medium text-sm">
              Complete at least 90% of a track to unlock your professional
              credential.
            </p>
          </div>
          <Link
            to="/lms/courses"
            className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm transition-all hover:bg-indigo-700"
          >
            Start Learning
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {eligibleCourses.map((course) => {
            const endDate = course.updatedAt
              ? new Date(course.updatedAt)
              : new Date();
            const formatDate = (date: Date) =>
              date.toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });

            return (
              <motion.div
                key={course._id || course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`lms-card p-6 flex flex-col sm:flex-row gap-8 ${
                  isDarkMode ? "lms-card-dark" : "lms-card-light"
                }`}
              >
                {/* Visual Preview */}
                <div
                  onClick={() => setSelectedCert(course)}
                  className={`aspect-[1.414/1] w-full sm:w-44 rounded-2xl overflow-hidden relative border cursor-pointer transition-all group-hover:border-indigo-500 bg-slate-950 flex items-center justify-center flex-shrink-0 ${
                    isDarkMode ? "border-slate-800" : "border-slate-100"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />
                  <Award
                    className="text-indigo-500"
                    size={40}
                    strokeWidth={1.5}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Search
                      className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      size={24}
                    />
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-grow flex flex-col justify-between py-1">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[9px] font-bold uppercase tracking-wider rounded border border-emerald-500/20">
                        Verified
                      </span>
                    </div>
                    <h4
                      className={`text-xl font-bold leading-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}
                    >
                      {course.name}
                    </h4>
                    <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-500 uppercase tracking-widest">
                      <div>
                        <p className="opacity-50 text-[7px] mb-0.5">
                          Issue date
                        </p>
                        <p
                          className={
                            isDarkMode ? "text-slate-300" : "text-slate-700"
                          }
                        >
                          {formatDate(endDate)}
                        </p>
                      </div>
                      <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
                      <div>
                        <p className="opacity-50 text-[7px] mb-0.5">
                          Credential ID
                        </p>
                        <p className="font-mono text-indigo-500">
                          {course._id?.slice(-8).toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-6">
                    <div
                      className={`flex p-1 rounded-xl border ${isDarkMode ? "bg-slate-800/50 border-slate-700" : "bg-slate-50 border-slate-100"}`}
                    >
                      {(["pdf", "png"] as const).map((f) => (
                        <button
                          key={f}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDownloadFormat(f);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                            downloadFormat === f
                              ? "bg-white dark:bg-slate-900 text-indigo-600 shadow-sm"
                              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDownloadingCert(course);
                      }}
                      className="flex-grow h-10 flex items-center justify-center bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {selectedCert && (
          <CertificateViewer
            course={selectedCert}
            onClose={() => setSelectedCert(null)}
          />
        )}
        {downloadingCert && (
          <CertificateViewer
            course={downloadingCert}
            isDirectDownload={true}
            downloadFormat={downloadFormat}
            onClose={() => setDownloadingCert(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ProfileSettings Component
const ProfileSettings = () => {
  const { user, login } = useAuth();
  const { isDarkMode } = useTheme();
  const { showToast } = useNotification();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      showToast("New passwords do not match", "error");
      return;
    }

    setLoading(true);

    try {
      const baseUrl =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const res = await axios.put(`${baseUrl}/api/auth/profile`, formData, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      if (res.data.success) {
        showToast("Profile Updated Successfully", "success");
        // Update local auth context with new data/token
        login(res.data.data);
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        showToast(err.response?.data?.message || "Update failed", "error");
      } else {
        showToast("Update failed", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-10">
      <div className="flex flex-col gap-2 pb-6 border-b border-slate-100 dark:border-slate-800/50">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-1 bg-indigo-600 rounded-full" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">
            Account Settings
          </span>
        </div>
        <h1
          className={`text-3xl font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}
        >
          Profile Information
        </h1>
        <p className="text-slate-500 font-medium text-sm">
          Update your personal details and manage security preferences.
        </p>
      </div>

      <form
        onSubmit={handleUpdate}
        className={`lms-card p-10 space-y-10 max-w-3xl transition-all ${
          isDarkMode ? "lms-card-dark" : "lms-card-light"
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full rounded-xl p-4 font-medium text-sm outline-none transition-all border ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                  : "bg-slate-50 border-slate-100 focus:border-indigo-500 focus:bg-white text-slate-900"
              }`}
            />
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={`w-full rounded-xl p-4 font-medium text-sm outline-none transition-all border ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                  : "bg-slate-50 border-slate-100 focus:border-indigo-500 focus:bg-white text-slate-900"
              }`}
            />
          </div>
        </div>

        <div className="space-y-8 pt-8 border-t border-slate-100 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
              Password Management
            </p>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">
              Current Password
            </label>
            <input
              type="password"
              placeholder="Enter current password to make changes"
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData({ ...formData, currentPassword: e.target.value })
              }
              className={`w-full rounded-xl p-4 font-medium text-sm outline-none transition-all border ${
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                  : "bg-slate-50 border-slate-100 focus:border-indigo-500 focus:bg-white text-slate-900"
              }`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">
                New Password
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                className={`w-full rounded-xl p-4 font-medium text-sm outline-none transition-all border ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                    : "bg-slate-50 border-slate-100 focus:border-indigo-500 focus:bg-white text-slate-900"
                }`}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block pl-1">
                Confirm New Password
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className={`w-full rounded-xl p-4 font-medium text-sm outline-none transition-all border ${
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white focus:border-indigo-500"
                    : "bg-slate-50 border-slate-100 focus:border-indigo-500 focus:bg-white text-slate-900"
                }`}
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            disabled={loading}
            className="px-10 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50 bg-slate-900 dark:bg-indigo-600 text-white hover:bg-slate-800 dark:hover:bg-indigo-700 shadow-lg active:scale-95"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Dashboard;
