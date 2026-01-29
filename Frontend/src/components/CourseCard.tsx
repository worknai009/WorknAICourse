import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTheme } from "../context";

import type { Course } from "../../services/api";
import { getCourseStatuses } from "../../services/api";

interface Props {
  course: Course;
}

const CourseCard: React.FC<Props> = ({ course }) => {
  const { isDarkMode } = useTheme();
  const [imageError, setImageError] = useState(false);

  // Calculate discount percentage
  const discountPercent =
    course.originalPrice > course.discountedPrice
      ? Math.round(
          ((course.originalPrice - course.discountedPrice) /
            course.originalPrice) *
            100,
        )
      : 0;

  // Calculate GST and total price
  const gst = Math.round(course.discountedPrice * 0.18);
  const totalPrice = course.discountedPrice + gst;

  // Determine if it's a high discount (for badge)
  const isHighDiscount = discountPercent >= 40;

  // Fallback image
  const fallbackImage =
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2000&auto=format&fit=crop";

  // Use certificate image from database, or fallback if not available or error occurred
  const cardImage =
    !imageError && course.certificateImage
      ? course.certificateImage
      : fallbackImage;

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group flex flex-col h-full rounded-[2.5rem] overflow-hidden border-2 transition-all duration-500 hover:shadow-2xl ${
        isDarkMode
          ? "bg-zinc-900/30 border-zinc-800 hover:border-cyan-500/50 hover:shadow-cyan-950/20"
          : "bg-white border-zinc-100 hover:border-black hover:shadow-black/10"
      }`}
    >
      {/* Course Image Section */}
      <div className="relative h-72 overflow-hidden m-3 rounded-[1.8rem]">
        <img
          src={cardImage}
          alt={course.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          onError={handleImageError}
        />
        <div
          className={`absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        ></div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          {/* High Discount Badge */}
          {isHighDiscount && (
            <span
              className={`text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg ${
                isDarkMode ? "bg-cyan-600" : "bg-emerald-500"
              }`}
            >
              Best Value
            </span>
          )}

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <span
              className={`text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg ${
                isDarkMode ? "bg-fuchsia-600" : "bg-rose-500"
              }`}
            >
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Bottom Info - Status and Language */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
          <div className="flex flex-wrap gap-1">
            {getCourseStatuses(course).map((status) => (
              <span
                key={status}
                className={`px-3 py-1.5 text-white text-[10px] font-black rounded-full uppercase tracking-widest ${
                  status === "Online"
                    ? isDarkMode
                      ? "bg-cyan-700"
                      : "bg-blue-600"
                    : status === "Offline"
                      ? isDarkMode
                        ? "bg-fuchsia-700"
                        : "bg-rose-600"
                      : isDarkMode
                        ? "bg-purple-700"
                        : "bg-purple-600"
                }`}
              >
                {status} Mode
              </span>
            ))}
          </div>
          <span className="px-3 py-1.5 bg-black/50 backdrop-blur-md text-white text-[10px] font-black rounded-full uppercase tracking-widest">
            {course.language}
          </span>
        </div>
      </div>

      {/* Course Content Section */}
      <div className="px-8 pb-8 pt-4 flex flex-col grow">
        <div className="flex justify-between items-start mb-4">
          <h3
            className={`text-2xl font-bold font-syne leading-tight tracking-tight group-hover:text-cyan-400 transition-colors ${
              isDarkMode ? "text-zinc-100" : "text-zinc-900"
            }`}
          >
            {course.name}
          </h3>
        </div>

        {/* Description (truncated) */}
        <p
          className={`text-sm mb-6 line-clamp-2 ${
            isDarkMode ? "text-zinc-400" : "text-zinc-600"
          }`}
        >
          {course.description}
        </p>

        {/* Pricing and CTA Section */}
        <div className="space-y-6 mt-auto">
          {/* Pricing Card */}
          <div
            className={`p-5 rounded-2xl border transition-colors ${
              isDarkMode
                ? "bg-zinc-950/80 border-zinc-800 group-hover:border-cyan-500/20"
                : "bg-zinc-50 border-zinc-100 group-hover:border-blue-500/30"
            }`}
          >
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
                  Course Fee
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-3xl font-black ${
                      isDarkMode ? "text-white" : "text-zinc-900"
                    }`}
                  >
                    ₹{course.discountedPrice.toLocaleString("en-IN")}
                  </span>
                  {course.originalPrice !== course.discountedPrice && (
                    <span
                      className={`text-sm line-through decoration-2 ${
                        isDarkMode
                          ? "text-zinc-600 decoration-fuchsia-500/50"
                          : "text-zinc-400 decoration-rose-500/50"
                      }`}
                    >
                      ₹{course.originalPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>

              {/* Discount Badge */}
              {discountPercent > 0 && (
                <div
                  className={`text-white text-[10px] font-black px-2 py-1 rounded-md mb-1 ${
                    isDarkMode ? "bg-cyan-600" : "bg-emerald-500"
                  }`}
                >
                  SAVE {discountPercent}%
                </div>
              )}
            </div>

            {/* GST and Total */}
            <div
              className={`pt-3 border-t border-dashed flex justify-between items-center ${
                isDarkMode ? "border-zinc-800" : "border-zinc-200"
              }`}
            >
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest italic">
                Incl. 18% GST (₹{gst.toLocaleString("en-IN")})
              </span>
              <span
                className={`text-xs font-black ${
                  isDarkMode ? "text-cyan-400" : "text-emerald-500"
                }`}
              >
                Total: ₹{totalPrice.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          {/* CTA Buttons Section */}
          <div className="flex flex-col gap-3">
            <Link
              to={`/checkout/${course.id || course._id}`}
              className={`group/btn relative overflow-hidden flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all ${
                isDarkMode
                  ? "bg-white text-black hover:bg-cyan-500 shadow-lg shadow-white/5"
                  : "bg-indigo-600 text-white hover:bg-black shadow-xl shadow-indigo-500/20"
              }`}
            >
              <span className="relative z-10 tracking-widest">Enroll Now</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4 relative z-10"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                />
              </svg>
            </Link>

            <Link
              to={`/course/${course.id || course._id}`}
              className={`group/btn relative overflow-hidden flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all border-2 ${
                isDarkMode
                  ? "border-zinc-800 text-zinc-400 hover:border-white/20 hover:text-white"
                  : "border-zinc-100 text-zinc-500 hover:border-black hover:text-black"
              }`}
            >
              <span className="relative z-10 tracking-widest">
                View Curriculum
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-4 h-4 relative z-10 transform group-hover/btn:translate-x-1 transition-transform"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;
