import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CourseCard from "../components/CourseCard";
import { useTheme } from "../context";
import gsap from "gsap";
import coursesApi from "../../services/api";
import type { Course } from "../../services/api";

type SortOption = "default" | "price-low" | "price-high" | "name-az";
type StatusFilter = "all" | "Online" | "Offline" | "Hybrid";

const Courses: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [titleReady, setTitleReady] = useState(false);
  const pageRef = useRef(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch courses from backend
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setIsLoading(true);
        setError("");

        let data: Course[];

        // Fetch based on search query or default
        if (debouncedSearch.trim()) {
          data = await coursesApi.searchCourses(debouncedSearch);
        } else {
          data = await coursesApi.getAllCourses({
            sort: "-createdAt",
            limit: 100,
          });
        }

        // Ensure we only show active courses
        const activeCourses = data.filter(
          (course) => course.isActive !== false,
        );
        setCourses(activeCourses);
      } catch (err: Error | unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch courses";
        setError(errorMessage);
        console.error("Error fetching courses:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, [debouncedSearch]);

  // GSAP animations
  useEffect(() => {
    const animationTimer = requestAnimationFrame(() => {
      setTitleReady(true);

      gsap.fromTo(
        ".course-title-char",
        {
          y: 60,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.03,
          ease: "expo.out",
        },
      );

      gsap.fromTo(
        ".courses-filter-bar",
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.4,
          ease: "power3.out",
        },
      );
    });

    return () => cancelAnimationFrame(animationTimer);
  }, []);

  // Filter and sort courses with useMemo for optimization
  const filteredCourses = useMemo(() => {
    // Ensure courses is always an array
    if (!Array.isArray(courses)) {
      return [];
    }

    let result = [...courses];

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((course) => course.status === statusFilter);
    }

    // Apply sorting
    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => a.discountedPrice - b.discountedPrice);
        break;
      case "price-high":
        result.sort((a, b) => b.discountedPrice - a.discountedPrice);
        break;
      case "name-az":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // Keep default order (from API - newest first)
        break;
    }

    return result;
  }, [courses, sortOption, statusFilter]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSortOption("default");
    setStatusFilter("all");
  };

  const titleText = "Courses";

  return (
    <div ref={pageRef} className="min-h-screen pt-32 pb-24 px-6 md:px-12">
      <section className="max-w-400 mx-auto mb-16 relative">
        <div
          className={`absolute -top-20 -left-20 w-150 h-150 blur-[180px] rounded-full opacity-10 pointer-events-none ${
            isDarkMode ? "bg-cyan-500" : "bg-blue-200"
          }`}
        />

        <div className="flex flex-col items-center text-center">
          <h1
            className={`text-6xl md:text-8xl lg:text-9xl font-syne font-light flex justify-center mb-4 tracking-tighter leading-none ${
              isDarkMode ? "text-white" : "text-black"
            }`}
          >
            {titleText.split("").map((char, i) => (
              <span
                key={i}
                className="course-title-char inline-block"
                style={{ opacity: titleReady ? undefined : 1 }}
              >
                {char}
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className={`text-lg md:text-xl font-light transition-colors max-w-2xl ${
              isDarkMode ? "text-zinc-400" : "text-zinc-600"
            }`}
          >
            Select a pathway that resonates with your professional ambition.
            Every course is audited for industrial relevance.
          </motion.p>
        </div>
      </section>

      <section className="courses-filter-bar max-w-400 mx-auto mb-16 relative z-50">
        <div
          className={`p-4 md:p-6 rounded-[2.5rem] border refractive-border liquid-glass flex flex-col lg:flex-row items-center justify-between gap-6 ${
            isDarkMode
              ? "bg-zinc-900/80 border-zinc-700/30"
              : "bg-white border-zinc-200 shadow-xl shadow-black/5"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center gap-6 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative w-full md:w-80 group">
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full py-4 px-12 rounded-2xl border-2 outline-none font-bold text-sm transition-all ${
                  isDarkMode
                    ? "bg-zinc-800 border-zinc-700 focus:border-cyan-500 text-white placeholder:text-zinc-500"
                    : "bg-zinc-50 border-zinc-200 focus:border-black text-black placeholder:text-zinc-400"
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className={`absolute right-5 top-1/2 -translate-y-1/2 ${
                    isDarkMode
                      ? "text-zinc-500 hover:text-white"
                      : "text-zinc-400 hover:text-black"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span
                className={`text-[10px] font-black uppercase tracking-widest hidden md:block ${
                  isDarkMode ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                Mode:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "All", value: "all" },
                  { label: "Online", value: "Online" },
                  { label: "Offline", value: "Offline" },
                  { label: "Hybrid", value: "Hybrid" },
                ].map((status) => (
                  <button
                    key={status.value}
                    onClick={() =>
                      setStatusFilter(status.value as StatusFilter)
                    }
                    className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      statusFilter === status.value
                        ? isDarkMode
                          ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/40"
                          : "bg-black text-white"
                        : isDarkMode
                          ? "bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700"
                          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    }`}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span
                className={`text-[10px] font-black uppercase tracking-widest hidden md:block ${
                  isDarkMode ? "text-zinc-400" : "text-zinc-600"
                }`}
              >
                Sort:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Latest", value: "default" },
                  { label: "Price ↑", value: "price-low" },
                  { label: "Price ↓", value: "price-high" },
                  { label: "A-Z", value: "name-az" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSortOption(opt.value as SortOption)}
                    className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      sortOption === opt.value
                        ? isDarkMode
                          ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/40"
                          : "bg-blue-600 text-white"
                        : isDarkMode
                          ? "bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700"
                          : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div
            className={`flex items-center gap-4 px-6 border-l ${
              isDarkMode ? "border-zinc-700" : "border-zinc-200"
            }`}
          >
            <span
              className={`text-sm font-bold italic ${
                isDarkMode ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              {filteredCourses.length}{" "}
              {filteredCourses.length === 1 ? "Course" : "Courses"}
            </span>
          </div>
        </div>
      </section>

      <section className="max-w-400 mx-auto">
        {/* Error State */}
        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-40 text-center"
          >
            <div className="w-24 h-24 mb-8 text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <h3
              className={`text-3xl font-black font-syne uppercase italic mb-2 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Error Loading Courses
            </h3>
            <p
              className={`font-medium mb-8 ${
                isDarkMode ? "text-zinc-400" : "text-zinc-600"
              }`}
            >
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                isDarkMode
                  ? "bg-cyan-500 text-white hover:bg-cyan-600"
                  : "bg-black text-white hover:bg-zinc-800"
              }`}
            >
              Retry
            </button>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`h-125 rounded-[2.5rem] animate-pulse ${
                  isDarkMode ? "bg-zinc-800" : "bg-zinc-100"
                }`}
              >
                <div className="p-8 space-y-4">
                  <div
                    className={`h-6 rounded ${
                      isDarkMode ? "bg-zinc-700" : "bg-zinc-200"
                    }`}
                  />
                  <div
                    className={`h-4 w-3/4 rounded ${
                      isDarkMode ? "bg-zinc-700" : "bg-zinc-200"
                    }`}
                  />
                  <div
                    className={`h-4 w-1/2 rounded ${
                      isDarkMode ? "bg-zinc-700" : "bg-zinc-200"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Courses Grid */}
        {!isLoading && !error && (
          <AnimatePresence mode="popLayout">
            {filteredCourses.length > 0 ? (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12"
              >
                {filteredCourses.map((course) => (
                  <motion.div
                    key={course._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                  >
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-40 text-center"
              >
                <div
                  className={`w-24 h-24 mb-8 ${
                    isDarkMode ? "text-zinc-600" : "text-zinc-300"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </div>
                <h3
                  className={`text-3xl font-black font-syne uppercase italic mb-2 ${
                    isDarkMode ? "text-white" : "text-black"
                  }`}
                >
                  No Courses Found
                </h3>
                <p
                  className={`font-medium mb-8 ${
                    isDarkMode ? "text-zinc-400" : "text-zinc-600"
                  }`}
                >
                  {searchQuery
                    ? `No courses match "${searchQuery}"`
                    : "Try adjusting your filters or check back later."}
                </p>
                <button
                  onClick={handleClearFilters}
                  className={`mt-8 px-8 py-3 rounded-full border-2 font-black text-xs uppercase tracking-widest transition-all ${
                    isDarkMode
                      ? "border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                      : "border-zinc-300 text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  Clear Filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </section>
    </div>
  );
};

export default Courses;
