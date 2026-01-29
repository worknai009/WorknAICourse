import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Play,
  Check,
  Clock,
  ArrowLeft,
  FileText,
  Download,
  ExternalLink,
  FileArchive,
  MessageSquare,
  Send,
  HelpCircle,
  Award,
  CheckCircle,
  Trash2,
  Activity,
} from "lucide-react";
import { useAuth } from "../../AuthContext";
import coursesApi, { type CourseDetail } from "../../../services/api";
import Hls from "hls.js";
import { useRef } from "react";
import { useTheme } from "../../context";
import { useNotification } from "../../NotificationContext";

const VideoPlayer: React.FC<{
  src: string;
  onProgress: React.Dispatch<React.SetStateAction<number>>;
}> = ({ src, onProgress }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [effectiveSrc, setEffectiveSrc] = useState(src);
  const [useIframe, setUseIframe] = useState(false);

  useEffect(() => {
    let currentSrc = src;
    let isIframe = src.includes("youtube.com") || src.includes("youtu.be");

    if (src.includes("player.cloudinary.com/embed")) {
      try {
        const urlObj = new URL(src);
        const cloudName = urlObj.searchParams.get("cloud_name");
        const publicId = urlObj.searchParams.get("public_id");
        if (cloudName && publicId) {
          currentSrc = `https://res.cloudinary.com/${cloudName}/video/upload/${publicId}.mp4`;
          isIframe = false;
        } else {
          isIframe = true;
        }
      } catch (e) {
        isIframe = true;
      }
    }

    setEffectiveSrc(currentSrc);
    setUseIframe(isIframe);
  }, [src]);

  const isHls = effectiveSrc.includes(".m3u8");

  useEffect(() => {
    if (useIframe || !videoRef.current || !effectiveSrc || isHls === false)
      return;

    const video = videoRef.current;
    let hls: Hls;

    if (isHls && Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(effectiveSrc);
      hls.attachMedia(video);
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [effectiveSrc, useIframe, isHls]);

  if (!src) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-100 text-zinc-400 gap-4">
        <Play size={48} className="opacity-20 text-zinc-900" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
          Video Content Not Available
        </p>
      </div>
    );
  }

  // Timer for iframe content (fallback since we can't easily track playback time cross-origin)
  useEffect(() => {
    if (useIframe) {
      const interval = setInterval(() => {
        onProgress((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [useIframe, onProgress]);

  if (useIframe) {
    let embedUrl = effectiveSrc;
    const isYouTube =
      effectiveSrc.includes("youtube.com") || effectiveSrc.includes("youtu.be");

    if (isYouTube && !effectiveSrc.includes("/embed/")) {
      let videoId = "";
      if (effectiveSrc.includes("v="))
        videoId = effectiveSrc.split("v=")[1]?.split("&")[0];
      else if (effectiveSrc.includes("youtu.be/"))
        videoId = effectiveSrc.split("youtu.be/")[1]?.split("?")[0];
      else if (effectiveSrc.includes("/shorts/"))
        videoId = effectiveSrc.split("/shorts/")[1]?.split("?")[0];
      if (videoId)
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
    }

    return (
      <iframe
        key={embedUrl}
        className="w-full h-full"
        src={embedUrl}
        title="Video Player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    );
  }

  return (
    <video
      key={effectiveSrc}
      ref={videoRef}
      src={!isHls ? effectiveSrc : undefined}
      className="w-full h-full bg-black"
      controls
      controlsList="nodownload"
      onContextMenu={(e) => e.preventDefault()}
      playsInline
      onTimeUpdate={(e) => onProgress(e.currentTarget.currentTime)}
    />
  );
};

const CoursePlayer = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<{
    id: string;
    title: string;
    url: string;
  } | null>(null);
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>([]);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<
    "overview" | "resources" | "doubts"
  >("overview");
  const [doubtText, setDoubtText] = useState("");
  const [isSubmittingDoubt, setIsSubmittingDoubt] = useState(false);
  const [showDoubtSuccess, setShowDoubtSuccess] = useState(false);
  const [watchTime, setWatchTime] = useState(0);
  const { showToast } = useNotification();

  const courseTopicIds = React.useMemo(() => {
    const ids = new Set<string>();
    course?.syllabusPhases?.forEach((phase) => {
      phase.weeks?.forEach((week) => {
        week.topics?.forEach((topic) => {
          if (topic._id) ids.add(topic._id.toString());
        });
      });
    });
    return ids;
  }, [course]);

  const totalTopicsCount = courseTopicIds.size;
  const completedInThisCourse = completedTopicIds.filter((id) =>
    courseTopicIds.has(id.toString()),
  );
  const uniqueCompletedCount = new Set(completedInThisCourse).size;
  const completionPercent =
    totalTopicsCount > 0
      ? Math.min(
          100,
          Math.round((uniqueCompletedCount / totalTopicsCount) * 100),
        )
      : 0;

  const getStreamUrl = (topic: any) => {
    if (!topic) return "";
    return topic.video?.url || topic.videoUrl || "";
  };

  useEffect(() => {
    const loadInitialData = async () => {
      if (!courseId) return;
      try {
        const courseData = await coursesApi.getCourseById(courseId);
        setCourse(courseData);

        try {
          const progressData = await coursesApi.getProgress();
          const courseProgress = progressData.find(
            (p: any) => p.courseId.toString() === courseData._id.toString(),
          );
          if (courseProgress) {
            setCompletedTopicIds(
              courseProgress.completedTopics.map((tid: any) => tid.toString()),
            );
          }
        } catch (pErr) {
          console.error("Progress fetch failed", pErr);
        }

        const firstTopic =
          courseData.syllabusPhases?.[0]?.weeks?.[0]?.topics?.[0];
        if (firstTopic) {
          setActiveVideo({
            id: firstTopic._id || "",
            title: firstTopic.name,
            url: getStreamUrl(firstTopic),
          });
          setWatchTime(0);
        }
      } catch (err) {
        console.error("Failed to load course data", err);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [courseId]);

  const handleToggleComplete = async () => {
    if (!course || !activeVideo?.id) return;

    // Check if already completed
    const isCompleted = completedTopicIds.includes(activeVideo.id);

    if (isCompleted) {
      // Handle Uncomplete (Undo)
      try {
        await coursesApi.removeProgress(course._id, activeVideo.id);
        setCompletedTopicIds((prev) =>
          prev.filter((tid) => tid !== activeVideo.id),
        );
        showToast("Lesson marked as uncomplete.", "success");
      } catch (err) {
        console.error("Failed to remove progress", err);
        showToast("Failed to undo progress.", "error");
      }
      return;
    }

    // Handle Complete (Mark as Done)
    if (watchTime < 600) {
      const remaining = Math.ceil((600 - watchTime) / 60);
      showToast(
        `Please watch for at least ${remaining} more minute${remaining !== 1 ? "s" : ""} to complete this lesson.`,
        "error",
      );
      return;
    }

    try {
      setCompletedTopicIds((prev) => [...prev, activeVideo.id]);
      await coursesApi.updateProgress(course._id, activeVideo.id);
    } catch (err) {
      console.error("Failed to update progress", err);
      // Revert optimistic update
      setCompletedTopicIds((prev) =>
        prev.filter((tid) => tid !== activeVideo.id),
      );
    }
  };

  const handleSubmitDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtText.trim() || !activeVideo || !course) return;

    setIsSubmittingDoubt(true);
    try {
      await coursesApi.submitDoubt({
        courseId: course._id,
        topicId: activeVideo.id,
        topicTitle: activeVideo.title,
        query: doubtText,
      });
      showToast(
        "Query submitted successfully. Our mentors will respond shortly.",
        "success",
      );
      setDoubtText("");
      setShowDoubtSuccess(true);
      setTimeout(() => setShowDoubtSuccess(false), 5000);
    } catch (err: any) {
      showToast(
        err.message || "Failed to submit query. Please try again.",
        "error",
      );
    } finally {
      setIsSubmittingDoubt(false);
    }
  };

  if (loading)
    return (
      <div
        className={`h-screen flex items-center justify-center transition-colors ${isDarkMode ? "bg-black" : "bg-white"}`}
      >
        <div className="flex flex-col items-center gap-6">
          <div
            className={`w-10 h-10 border-4 border-t-zinc-900 rounded-full animate-spin ${isDarkMode ? "border-zinc-800" : "border-zinc-100"}`}
          />
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">
            Loading Course Content...
          </span>
        </div>
      </div>
    );

  if (!course)
    return (
      <div
        className={`h-screen flex flex-col items-center justify-center gap-6 transition-colors ${isDarkMode ? "bg-black text-white" : "bg-white text-zinc-950"}`}
      >
        <div className="text-zinc-900 font-black uppercase text-sm tracking-widest">
          Course Not Found
        </div>
        <button
          onClick={() => navigate("/lms/courses")}
          className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );

  return (
    <div
      className={`fixed inset-0 z-[200] flex flex-col transition-colors duration-500 ${isDarkMode ? "bg-black text-white" : "bg-white text-zinc-950"}`}
    >
      {/* Professional Header - Control Center */}
      <header
        className={`h-20 border-b flex items-center justify-between px-6 lg:px-10 relative z-50 transition-colors ${
          isDarkMode
            ? "bg-slate-950 border-slate-800/50 shadow-2xl shadow-black"
            : "bg-white border-slate-100 shadow-sm"
        }`}
      >
        <div className="flex items-center gap-8 relative z-10">
          <Link
            to="/lms/courses"
            className="flex items-center gap-4 shrink-0 group"
          >
            <div
              className={`h-10 w-10 rounded-xl border flex items-center justify-center transition-all group-hover:scale-105 duration-500 ${
                isDarkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-slate-950 border-slate-900 shadow-lg shadow-slate-900/20"
              }`}
            >
              <img
                src="/Logo2.jpeg"
                alt="Logo"
                className={`w-full h-full object-contain ${!isDarkMode ? "invert" : ""}`}
              />
            </div>
            <div className="flex flex-col">
              <h1
                className={`font-bold text-lg tracking-tight font-syne uppercase leading-none ${isDarkMode ? "text-white" : "text-slate-900"}`}
              >
                WorknAI
              </h1>
              <span className="text-[9px] font-bold uppercase tracking-widest text-indigo-600 mt-1">
                Learning Portal
              </span>
            </div>
          </Link>
          <div
            className={`h-8 w-px ${isDarkMode ? "bg-slate-800" : "bg-slate-100"} hidden sm:block mx-1`}
          />
          <button
            onClick={() => navigate("/lms/courses")}
            className={`p-2.5 rounded-xl transition-all flex items-center gap-3 group/exit ${
              isDarkMode
                ? "text-slate-400 hover:text-white hover:bg-slate-900"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <ArrowLeft
              size={18}
              strokeWidth={2}
              className="group-hover/exit:-translate-x-1 transition-transform"
            />
            <span className="text-xs font-semibold hidden lg:block">
              Exit Player
            </span>
          </button>
        </div>

        <div className="flex items-center gap-12 relative z-10">
          <div
            className={`hidden xl:flex flex-col text-right pr-10 border-r ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}
          >
            <p
              className={`text-[9px] font-bold uppercase tracking-widest mb-1 leading-none ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
            >
              NOW WATCHING
            </p>
            <h2
              className={`font-semibold text-sm truncate max-w-[200px] ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}
            >
              {course?.name}
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-6">
            <div className="text-right">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 leading-none">
                COURSE PROGRESS
              </p>
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-32 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shrink-0">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionPercent}%` }}
                    className="h-full bg-indigo-600 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.3)]"
                  />
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                  {completionPercent}%
                </span>
              </div>
            </div>
          </div>

          <div className="h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center overflow-hidden border border-slate-800 shadow-xl group cursor-pointer active:scale-95 transition-all">
            <span className="font-bold text-xs text-white">
              {user?.name?.[0]}
            </span>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-grow overflow-hidden">
        <main
          className={`flex-grow overflow-y-auto scrollbar-hide lg:border-r transition-colors ${isDarkMode ? "bg-black border-white/5" : "bg-white border-zinc-100"}`}
          style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
        >
          <div className="max-w-6xl mx-auto p-6 lg:p-10 space-y-10">
            <div
              className={`aspect-video rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 relative group transition-all duration-700 ${
                isDarkMode
                  ? "bg-zinc-950 ring-white/10"
                  : "bg-zinc-950 shadow-zinc-200/50"
              }`}
            >
              {activeVideo && (
                <VideoPlayer
                  src={activeVideo.url}
                  onProgress={(t) => {
                    if (typeof t === "function") setWatchTime(t);
                    else setWatchTime(t);
                  }}
                />
              )}
            </div>

            <div className="space-y-10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-4">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 leading-none">
                      Active Lesson
                    </p>
                  </div>
                  <h3
                    className={`text-2xl lg:text-3xl font-extrabold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}
                  >
                    {activeVideo?.title || "Loading Lesson..."}
                  </h3>
                  <div
                    className={`flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="opacity-60" />~ 45 MINS
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-200 dark:bg-slate-800" />
                    <span>Core Technical Domain</span>
                  </div>
                </div>

                <button
                  onClick={handleToggleComplete}
                  className={`px-8 py-4 rounded-xl text-xs font-bold transition-all duration-300 active:scale-95 shrink-0 shadow-lg ${
                    activeVideo?.id &&
                    completedTopicIds.includes(activeVideo.id)
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-rose-600 dark:hover:bg-rose-600 dark:hover:text-white"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20"
                  }`}
                >
                  {activeVideo?.id &&
                  completedTopicIds.includes(activeVideo.id) ? (
                    <span className="flex items-center gap-2">
                      <Trash2 size={16} strokeWidth={2} /> Mark Uncomplete
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CheckCircle size={16} strokeWidth={2} /> Mark as Complete
                    </span>
                  )}
                </button>
              </div>

              <div className="pt-4">
                <div
                  className={`flex gap-10 border-b overflow-x-auto scrollbar-hide ${isDarkMode ? "border-slate-800/50" : "border-slate-100"}`}
                >
                  {(["overview", "resources", "doubts"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 text-xs font-bold uppercase tracking-wider transition-all relative shrink-0 ${activeTab === tab ? (isDarkMode ? "text-white" : "text-slate-900") : "text-slate-400 hover:text-indigo-600"}`}
                    >
                      <div className="flex items-center gap-2.5">
                        {tab === "doubts" && (
                          <MessageSquare size={16} strokeWidth={2} />
                        )}
                        {tab === "resources" && (
                          <FileArchive size={16} strokeWidth={2} />
                        )}
                        {tab === "overview" && (
                          <Activity size={16} strokeWidth={2} />
                        )}
                        <span className="capitalize">{tab}</span>
                      </div>
                      {activeTab === tab && (
                        <motion.div
                          layoutId="tabUnderlinePlayer"
                          className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-indigo-600"
                        />
                      )}
                    </button>
                  ))}
                </div>
                <div className="py-10">
                  {activeTab === "overview" ? (
                    <div className="space-y-8 animate-in fade-in duration-500">
                      <div className="max-w-3xl">
                        <p
                          className={`text-sm font-medium leading-relaxed ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}
                        >
                          This comprehensive lesson covers core concepts,
                          practical methodologies, and real-world implementation
                          strategies designed to build your technical expertise.
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                        <div
                          className={`lms-card p-8 ${isDarkMode ? "lms-card-dark" : "lms-card-light"}`}
                        >
                          <h4 className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-6">
                            Key Learning Objectives
                          </h4>
                          <ul
                            className={`space-y-4 text-sm font-medium ${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
                          >
                            <li className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                              Technical Architecture & Design
                            </li>
                            <li className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                              Operational Best Practices
                            </li>
                            <li className="flex items-center gap-3">
                              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                              Professional Implementation
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : activeTab === "resources" ? (
                    <div className="space-y-6 animate-in fade-in duration-500">
                      {course.resources && course.resources.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {course.resources.map((res, index) => {
                            const getIcon = () => {
                              switch (res.type) {
                                case "pdf":
                                  return (
                                    <FileText
                                      size={20}
                                      className="text-rose-500"
                                    />
                                  );
                                case "zip":
                                  return (
                                    <FileArchive
                                      size={20}
                                      className="text-amber-500"
                                    />
                                  );
                                case "link":
                                  return (
                                    <ExternalLink
                                      size={20}
                                      className="text-indigo-500"
                                    />
                                  );
                                default:
                                  return (
                                    <Download
                                      size={20}
                                      className="text-slate-500"
                                    />
                                  );
                              }
                            };
                            return (
                              <a
                                key={index}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`lms-card p-6 flex items-center justify-between ${isDarkMode ? "lms-card-dark" : "lms-card-light"}`}
                              >
                                <div className="flex items-center gap-4">
                                  <div
                                    className={`p-3 rounded-xl ${isDarkMode ? "bg-slate-800" : "bg-slate-50"}`}
                                  >
                                    {getIcon()}
                                  </div>
                                  <div>
                                    <h5
                                      className={`text-sm font-bold ${isDarkMode ? "text-slate-100" : "text-slate-900"}`}
                                    >
                                      {res.title}
                                    </h5>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                      {res.type} document
                                    </p>
                                  </div>
                                </div>
                                <Download
                                  size={18}
                                  className="text-slate-300"
                                />
                              </a>
                            );
                          })}
                        </div>
                      ) : (
                        <div
                          className={`p-16 rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center text-center gap-4 ${isDarkMode ? "border-slate-800" : "border-slate-100"}`}
                        >
                          <Download size={40} className="text-slate-200" />
                          <p className="text-xs font-bold text-slate-400">
                            No additional resources available for this lesson.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div
                        className={`p-10 rounded-[2.5rem] border ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-100 shadow-sm"}`}
                      >
                        <div className="flex items-start gap-8">
                          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-xl shadow-indigo-600/20 text-white">
                            <HelpCircle size={28} strokeWidth={2} />
                          </div>
                          <div className="space-y-1 pt-1">
                            <h4
                              className={`text-xl font-bold tracking-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}
                            >
                              Technical Support
                            </h4>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-xl">
                              Submit your technical queries. Our mentors
                              typically respond with clarifications within 12
                              hours.
                            </p>
                          </div>
                        </div>

                        <form
                          onSubmit={handleSubmitDoubt}
                          className="mt-10 space-y-6"
                        >
                          <div className="relative">
                            <textarea
                              value={doubtText}
                              onChange={(e) => setDoubtText(e.target.value)}
                              placeholder="Describe your technical inquiry..."
                              className={`w-full h-40 rounded-2xl p-6 text-sm font-medium outline-none transition-all resize-none border ${
                                isDarkMode
                                  ? "bg-slate-950 border-slate-800 focus:border-indigo-600 text-white placeholder:text-slate-600"
                                  : "bg-white border-slate-200 focus:border-indigo-600 text-slate-900 placeholder:text-slate-300"
                              }`}
                            />
                            <div className="absolute bottom-6 right-8 text-[9px] font-bold text-indigo-500 uppercase tracking-widest">
                              LESSON: {activeVideo?.title}
                            </div>
                          </div>
                          <div className="flex justify-end items-center gap-6">
                            {showDoubtSuccess && (
                              <motion.div
                                initial={{ x: 10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 flex items-center gap-2"
                              >
                                <CheckCircle size={14} />
                                <span>Query Transmitted</span>
                              </motion.div>
                            )}
                            <button
                              disabled={isSubmittingDoubt || !doubtText.trim()}
                              className={`flex items-center gap-3 px-8 py-3.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 ${
                                isSubmittingDoubt || !doubtText.trim()
                                  ? "bg-slate-100 text-slate-400"
                                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/20"
                              }`}
                            >
                              {isSubmittingDoubt
                                ? "Submitting..."
                                : "Submit Inquiry"}
                              <Send size={14} strokeWidth={2} />
                            </button>
                          </div>
                        </form>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                          {
                            label: "Avg. Response",
                            value: "12 Hours",
                            icon: Clock,
                          },
                          {
                            label: "Status",
                            value: "Online",
                            icon: Check,
                          },
                          {
                            label: "Mentor Tier",
                            value: "Expert",
                            icon: Award,
                          },
                        ].map((item, i) => (
                          <div
                            key={i}
                            className={`p-6 rounded-2xl border flex items-center gap-4 ${isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100 shadow-sm"}`}
                          >
                            <div className="text-indigo-600">
                              <item.icon size={24} strokeWidth={2} />
                            </div>
                            <div>
                              <p
                                className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${isDarkMode ? "text-slate-500" : "text-slate-400"}`}
                              >
                                {item.label}
                              </p>
                              <p
                                className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}
                              >
                                {item.value}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        <aside
          className={`w-full lg:w-[400px] flex flex-col h-full border-l shadow-2xl transition-all duration-500 ${isDarkMode ? "bg-slate-900 border-slate-800 shadow-black" : "bg-white border-slate-100 shadow-2xl shadow-slate-200/50"}`}
        >
          <div
            className={`p-8 border-b transition-colors ${isDarkMode ? "bg-slate-950/20 border-slate-800" : "bg-white border-slate-100"}`}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest mb-5 leading-none text-indigo-600">
              Course Syllabus
            </p>
            <div
              className={`flex items-center justify-between text-xs font-bold leading-none ${isDarkMode ? "text-white" : "text-slate-900"}`}
            >
              <span>
                {uniqueCompletedCount} / {totalTopicsCount} Lessons
              </span>
              <span className="text-indigo-500 font-bold">
                {Math.round(
                  (uniqueCompletedCount / (totalTopicsCount || 1)) * 100,
                )}
                % Complete
              </span>
            </div>
          </div>

          <div
            className="flex-grow overflow-y-auto scrollbar-hide pb-24"
            style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
          >
            {course.syllabusPhases?.map((phase, pIdx) => (
              <div
                key={pIdx}
                className={`transition-colors border-b ${isDarkMode ? "border-slate-800/50" : "border-slate-100"}`}
              >
                <button
                  onClick={() =>
                    setExpandedPhase(expandedPhase === pIdx ? null : pIdx)
                  }
                  className={`w-full p-6 flex items-start gap-4 transition-all duration-300 ${expandedPhase === pIdx ? (isDarkMode ? "bg-slate-800/50" : "bg-slate-50/50") : "hover:bg-slate-50/30"}`}
                >
                  <div
                    className={`mt-1 transition-transform duration-300 ${expandedPhase === pIdx ? "rotate-180" : ""}`}
                  >
                    <ChevronDown
                      size={14}
                      strokeWidth={2}
                      className="text-slate-400"
                    />
                  </div>
                  <div className="text-left">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1 leading-none">
                      Phase {pIdx + 1}
                    </p>
                    <h4
                      className={`text-sm font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}
                    >
                      {phase.title}
                    </h4>
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {expandedPhase === pIdx && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      {phase.weeks.map((week, wIdx) => (
                        <div key={wIdx} className="space-y-px">
                          {week.topics.map((topic, tIdx) => {
                            const isCompleted = topic._id
                              ? completedTopicIds.includes(topic._id)
                              : false;
                            const isActive = activeVideo?.id === topic._id;
                            return (
                              <button
                                key={tIdx}
                                onClick={() =>
                                  setActiveVideo({
                                    id: topic._id || "",
                                    title: topic.name,
                                    url: getStreamUrl(topic),
                                  })
                                }
                                className={`w-full px-8 py-3.5 flex items-center gap-4 transition-all group relative ${isActive ? (isDarkMode ? "bg-indigo-600/10" : "bg-indigo-50") : "hover:bg-slate-50/50"}`}
                              >
                                {isActive && (
                                  <motion.div
                                    layoutId="activeTopicCue"
                                    className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 shadow-[2px_0_10px_rgba(79,70,229,0.5)]"
                                  />
                                )}
                                <div
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-300 ${isActive ? "bg-indigo-600 border-indigo-500 text-white shadow-lg" : isCompleted ? "bg-emerald-500 text-white border-emerald-400" : isDarkMode ? "bg-slate-800 border-slate-700 text-slate-500" : "bg-white border-slate-200 text-slate-300"}`}
                                >
                                  {isCompleted ? (
                                    <Check size={12} strokeWidth={3} />
                                  ) : (
                                    <Play size={10} strokeWidth={3} />
                                  )}
                                </div>
                                <div className="flex-grow text-left">
                                  <p
                                    className={`text-xs font-bold transition-colors ${isActive ? "text-indigo-600" : isDarkMode ? "text-slate-300" : "text-slate-700"}`}
                                  >
                                    {topic.name}
                                  </p>
                                  <p
                                    className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${isCompleted ? "text-emerald-500" : "text-slate-400 opacity-60"}`}
                                  >
                                    {isCompleted ? "Completed" : "Pending"}
                                  </p>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CoursePlayer;
