import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../context";
import { motion, AnimatePresence } from "framer-motion";
import { COURSES } from "../../constants";
import gsap from "gsap";

// Replace this with your actual Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx1QqibAjkYgFJRj9kOQeOwoF_-EupIApQp5akPUizm5XA39UEi1Fha4K4bq7stzmefew/exec";

const RequestCallback: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".callback-glow", {
        x: "random(-100, 100)",
        y: "random(-100, 100)",
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 3,
      });

      gsap.from(".form-item", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
      });
    }, containerRef);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      ctx.revert();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCourse) {
      alert("Please select a track to proceed.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      course: selectedCourse,
      slot: formData.get("slot") as string,
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("Data sent successfully:", data);

      setIsSuccess(true);
      (e.target as HTMLFormElement).reset();
      setSelectedCourse(null);
    } catch (err) {
      console.error("Error submitting form:", err);
      // Show error to user
      alert("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen lg:h-screen w-full relative flex flex-col items-center justify-center p-6 md:p-12 lg:overflow-hidden overflow-y-auto"
    >
      {/* Immersive Background */}
      <div
        className={`callback-glow absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] blur-[100px] md:blur-[150px] rounded-full opacity-10 pointer-events-none transition-colors duration-1000 ${
          isDarkMode ? "bg-cyan-500" : "bg-emerald-200"
        }`}
      ></div>
      <div
        className={`callback-glow absolute bottom-0 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] blur-[100px] md:blur-[150px] rounded-full opacity-10 pointer-events-none transition-colors duration-1000 ${
          isDarkMode ? "bg-fuchsia-500" : "bg-rose-200"
        }`}
      ></div>

      <div className="max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 relative z-10 items-center pt-24 pb-12 lg:pt-0 lg:pb-0">
        {/* Left Side: Creative Copy */}
        <div className="lg:col-span-7 space-y-6 lg:space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span
              className={`inline-block py-1.5 px-4 rounded-full text-[9px] font-black uppercase tracking-[0.3em] mb-4 border ${
                isDarkMode
                  ? "bg-zinc-900/50 border-cyan-500/30 text-cyan-400"
                  : "bg-white border-zinc-200 text-zinc-500"
              }`}
            >
              Academic Consultation
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-syne leading-[0.85] lg:leading-[0.8] tracking-tighter uppercase italic mb-6">
              Expert <br />
              <span
                className={`text-transparent bg-clip-text ${
                  isDarkMode
                    ? "bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500"
                    : "bg-gradient-to-r from-rose-500 via-emerald-500 to-blue-500"
                }`}
              >
                Guidance
              </span>
              <br /> Awaits.
            </h1>
            <p
              className={`text-base md:text-xl font-medium leading-relaxed italic border-l-4 border-cyan-500 pl-6 max-w-lg transition-colors ${
                isDarkMode ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              "Logic will get you from A to B. Imagination and skilled
              mentorship will take you everywhere."
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 md:gap-8 pt-4 max-w-sm border-t border-zinc-500/10">
            <div className="space-y-1">
              <span
                className={`text-2xl md:text-3xl font-black font-syne ${
                  isDarkMode ? "text-white" : "text-zinc-900"
                }`}
              >
                15m
              </span>
              <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-zinc-500">
                Wait Time
              </p>
            </div>
            <div className="space-y-1">
              <span
                className={`text-2xl md:text-3xl font-black font-syne ${
                  isDarkMode ? "text-white" : "text-zinc-900"
                }`}
              >
                100%
              </span>
              <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-zinc-500">
                Direct Connect
              </p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`lg:col-span-5 justify-self-end w-full max-w-lg relative p-6 md:p-8 lg:p-10 rounded-[2.5rem] md:rounded-[3.5rem] refractive-border border liquid-glass shadow-2xl overflow-visible ${
            isDarkMode
              ? "bg-zinc-950/40 border-white/5"
              : "bg-white/40 border-white/20"
          }`}
        >
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-4 lg:space-y-5 relative overflow-visible"
                exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
              >
                {/* Full Name - Lower Z-Index */}
                <div className="form-item relative z-10">
                  <label
                    className={`block text-[8px] font-black uppercase tracking-[0.3em] mb-1.5 ml-1 ${
                      isDarkMode ? "text-white" : "text-zinc-500"
                    }`}
                  >
                    Full Name
                  </label>
                  <input
                    required
                    name="name"
                    type="text"
                    placeholder="ENTER NAME"
                    className={`w-full h-12 md:h-14 px-6 rounded-xl border-2 outline-none transition-all font-bold text-xs ${
                      isDarkMode
                        ? "bg-zinc-950/50 border-zinc-800 focus:border-cyan-500/50 text-white placeholder-zinc-500"
                        : "bg-zinc-50 border-zinc-100 focus:border-black placeholder-zinc-300"
                    }`}
                  />
                </div>

                {/* Grid Row - Needs higher Z-index than items below it */}
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 gap-4 relative ${
                    isDropdownOpen ? "z-50" : "z-20"
                  }`}
                >
                  <div className="form-item">
                    <label
                      className={`block text-[8px] font-black uppercase tracking-[0.3em] mb-1.5 ml-1 ${
                        isDarkMode ? "text-white" : "text-zinc-500"
                      }`}
                    >
                      Phone
                    </label>
                    <input
                      required
                      name="phone"
                      type="tel"
                      placeholder="+91 00000 00000"
                      className={`w-full h-12 md:h-14 px-6 rounded-xl border-2 outline-none transition-all font-bold text-xs ${
                        isDarkMode
                          ? "bg-zinc-950/50 border-zinc-800 focus:border-cyan-500/50 text-white placeholder-zinc-500"
                          : "bg-zinc-50 border-zinc-100 focus:border-black placeholder-zinc-300"
                      }`}
                    />
                  </div>

                  {/* Dropdown Container - The highest Z-index */}
                  <div className="form-item relative" ref={dropdownRef}>
                    <label
                      className={`block text-[8px] font-black uppercase tracking-[0.3em] mb-1.5 ml-1 ${
                        isDarkMode ? "text-white" : "text-zinc-500"
                      }`}
                    >
                      Choose Track
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`w-full h-12 md:h-14 px-6 rounded-xl border-2 transition-all font-bold text-xs flex items-center justify-between group ${
                        isDarkMode
                          ? "bg-zinc-950/50 border-zinc-800 text-white"
                          : "bg-zinc-50 border-zinc-100 text-zinc-900"
                      } ${
                        isDropdownOpen
                          ? "border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                          : ""
                      }`}
                    >
                      <span
                        className={
                          !selectedCourse
                            ? isDarkMode
                              ? "text-zinc-500"
                              : "text-zinc-400"
                            : isDarkMode
                            ? "text-white"
                            : "text-zinc-900"
                        }
                      >
                        {selectedCourse || "SELECT TRACK"}
                      </span>
                      <motion.svg
                        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                        className={`w-3 h-3 ${
                          isDarkMode ? "text-cyan-400" : "text-zinc-400"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                        />
                      </motion.svg>
                    </button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 5, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 5, scale: 0.98 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className={`absolute left-0 right-0 mt-2 p-2 rounded-2xl border shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-3xl max-h-[220px] overflow-y-auto z-[100] ${
                            isDarkMode
                              ? "bg-zinc-900/95 border-zinc-800 shadow-cyan-950/30"
                              : "bg-white/95 border-zinc-200 shadow-black/10"
                          }`}
                        >
                          {COURSES.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setSelectedCourse(c.name);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                selectedCourse === c.name
                                  ? isDarkMode
                                    ? "bg-cyan-500 text-white"
                                    : "bg-black text-white"
                                  : isDarkMode
                                  ? "hover:bg-white/10 text-zinc-400 hover:text-white"
                                  : "hover:bg-zinc-100 text-zinc-500 hover:text-black"
                              }`}
                            >
                              {c.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Preferred Slot - Explicitly Lower Z-Index */}
                <div className="form-item relative z-0">
                  <label
                    className={`block text-[8px] font-black uppercase tracking-[0.3em] mb-1.5 ml-1 ${
                      isDarkMode ? "text-white" : "text-zinc-500"
                    }`}
                  >
                    Preferred Slot
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Morning", "Afternoon", "Evening"].map((slot) => (
                      <label key={slot} className="cursor-pointer group">
                        <input
                          type="radio"
                          name="slot"
                          value={slot}
                          className="hidden peer"
                          required
                          defaultChecked={slot === "Morning"}
                        />
                        <div
                          className={`py-3 rounded-lg border-2 text-center text-[9px] font-black uppercase tracking-widest transition-all peer-checked:border-cyan-500 peer-checked:bg-cyan-500/10 ${
                            isDarkMode
                              ? "bg-zinc-900/50 border-zinc-800 text-zinc-200"
                              : "bg-zinc-50 border-zinc-100 text-zinc-500"
                          }`}
                        >
                          {slot}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Submit Button - Explicitly Lower Z-Index */}
                <div className="form-item pt-2 relative z-0">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-5 lg:py-6 rounded-[1.5rem] md:rounded-[1.8rem] font-black text-sm lg:text-base uppercase tracking-widest transition-all transform hover:scale-[1.02] active:scale-95 shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50 ${
                      isDarkMode
                        ? "bg-cyan-500 text-white shadow-cyan-900/20"
                        : "bg-black text-white shadow-black/20"
                    }`}
                  >
                    {isSubmitting ? "Submitting..." : "Get Callback"}
                  </button>
                </div>
              </motion.form>
            ) : (
              /* Success State */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="text-center py-6 lg:py-10 relative z-10 space-y-6"
              >
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mx-auto w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-2xl"
                >
                  <svg
                    className="w-10 h-10 md:w-12 md:h-12 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>

                {/* Success Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <h3
                    className={`text-2xl md:text-3xl lg:text-4xl font-black font-syne tracking-tighter ${
                      isDarkMode ? "text-white" : "text-zinc-900"
                    }`}
                  >
                    Request Received!
                  </h3>
                  <p
                    className={`text-sm md:text-base font-medium leading-relaxed max-w-md mx-auto ${
                      isDarkMode ? "text-zinc-400" : "text-zinc-600"
                    }`}
                  >
                    Our academic team will contact you within{" "}
                    <span className="font-black text-cyan-500">24 Hours</span>{" "}
                    to discuss your journey.
                  </p>
                </motion.div>

                {/* Action Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  onClick={() => setIsSuccess(false)}
                  className={`mt-6 px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 ${
                    isDarkMode
                      ? "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-black"
                  }`}
                >
                  Submit Another Request
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Subtle Bottom Trust Signifier */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 mb-8 lg:mt-0 lg:mb-0 lg:absolute lg:bottom-8 flex items-center gap-6 md:gap-8 opacity-20 select-none pointer-events-none grayscale flex-wrap justify-center"
      >
        <div className="font-syne font-black text-lg md:text-xl tracking-tighter">
          Honesty.
        </div>
        <div className="font-syne font-black text-lg md:text-xl tracking-tighter">
          Genuinity.
        </div>
        <div className="font-syne font-black text-lg md:text-xl tracking-tighter">
          Precision.
        </div>
      </motion.div>
    </div>
  );
};

export default RequestCallback;
