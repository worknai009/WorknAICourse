import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "../context";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import coursesApi from "../../services/api";
import { useNotification } from "../NotificationContext";

interface Props {
  type: "signin" | "signup";
}

const Auth: React.FC<Props> = ({ type }) => {
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useNotification();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".auth-glow", {
        x: "random(-100, 100)",
        y: "random(-100, 100)",
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 2,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.email ||
      !formData.password ||
      (type === "signup" && !formData.name)
    ) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    setIsLoading(true);
    try {
      let response;
      if (type === "signup") {
        response = await coursesApi.register(formData);
        showToast("Account created successfully! Welcome aboard.", "success");
      } else {
        response = await coursesApi.login({
          email: formData.email,
          password: formData.password,
        });
        showToast("Logged in successfully. Welcome back!", "success");
      }

      if (response && response.token) {
        login({
          _id: response._id,
          name: response.name,
          email: response.email,
          role: response.role,
          token: response.token,
        });
        navigate("/lms");
      }
    } catch (error: any) {
      showToast(
        error.message || "Authentication failed. Please try again.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      ref={containerRef}
      className="h-screen relative flex flex-col items-center justify-center p-4 md:p-6 pt-20 md:pt-32 overflow-hidden"
    >
      {/* Dynamic Background Accents */}
      <div
        className={`auth-glow absolute top-0 left-0 w-[500px] h-[500px] blur-[150px] rounded-full opacity-10 pointer-events-none transition-colors duration-1000 ${isDarkMode ? "bg-cyan-500" : "bg-blue-200"}`}
      ></div>
      <div
        className={`auth-glow absolute bottom-0 right-0 w-[500px] h-[500px] blur-[150px] rounded-full opacity-10 pointer-events-none transition-colors duration-1000 ${isDarkMode ? "bg-fuchsia-500" : "bg-rose-200"}`}
      ></div>

      {/* Horizontal Auth Card */}
      <motion.div
        key={type}
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`relative z-10 w-full max-w-[1000px] flex flex-col md:flex-row rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden refractive-border liquid-glass border shadow-2xl max-h-[80vh] md:max-h-[75vh] ${
          isDarkMode
            ? "bg-zinc-950/40 border-white/5"
            : "bg-white/60 border-zinc-300 shadow-zinc-200/50"
        }`}
      >
        {/* Left Side: Branding/Visual */}
        <div
          className={`hidden md:flex md:w-5/12 p-8 lg:p-12 flex-col justify-between relative overflow-hidden border-r ${isDarkMode ? "border-white/5" : "border-black/5"}`}
        >
          <div className="relative z-10 space-y-6">
            <div>
              <h2 className="text-3xl lg:text-5xl font-black font-syne tracking-tighter leading-[0.9] uppercase italic mb-4">
                {type === "signin"
                  ? "ELEVATE \nYOUR \nLOGIC."
                  : "JOIN \nTHE \nELITE."}
              </h2>
              <p className="text-zinc-600 font-bold uppercase tracking-widest text-[9px] max-w-[200px]">
                {type === "signin"
                  ? "Resume your learning track and access workspace."
                  : "Register for verified tracks and mentorship."}
              </p>
            </div>

            {/* Official Logo Integration */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/" className="flex items-center gap-4 group">
                <div className="h-14 w-14 rounded-2xl bg-zinc-900/10 dark:bg-zinc-100/10 p-2 overflow-hidden transition-transform group-hover:scale-110">
                  <img
                    src="/Logo2.jpeg"
                    alt="WorknAI Official Brand"
                    className="w-full h-full object-contain"
                  />
                </div>
              </Link>
            </motion.div>
          </div>

          <div className="absolute -bottom-10 -left-10 w-48 h-48 opacity-10 pointer-events-none">
            <svg
              viewBox="0 0 200 200"
              xmlns="http://www.w3.org/2000/svg"
              className="fill-current text-indigo-500"
            >
              <path
                d="M44.7,-76.4C58.1,-69.2,69.2,-58.1,76.4,-44.7C83.6,-31.3,86.9,-15.7,85.6,-0.7C84.3,14.2,78.4,28.4,70.2,40.8C61.9,53.2,51.3,63.8,38.9,72C26.5,80.2,12.3,86,0.3,85.5C-11.7,85,-23.4,78.2,-35.3,70C-47.2,61.8,-59.3,52.2,-68.5,40.1C-77.7,28,-83.9,13.4,-84.5,-0.3C-85,-14.1,-79.8,-27.1,-71.4,-38.5C-62.9,-49.9,-51.2,-59.7,-38.4,-67.2C-25.5,-74.7,-12.8,-79.9,1.4,-82.3C15.6,-84.7,31.3,-83.7,44.7,-76.4Z"
                transform="translate(100 100)"
              />
            </svg>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-6 md:p-10 lg:p-12 flex flex-col justify-center overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-xl font-black font-syne uppercase tracking-tight italic text-zinc-950 dark:text-white">
              {type === "signin" ? "Student Sign In" : "New Enrollment"}
            </h3>
            <div
              className={`w-10 h-1 mt-2 rounded-full bg-gradient-to-r ${isDarkMode ? "from-cyan-400 to-blue-500" : "from-blue-600 to-emerald-600"}`}
            ></div>
          </div>
          <div className="space-y-4 md:space-y-5">
            <form
              onSubmit={handleAuth}
              className="grid grid-cols-1 gap-3 md:gap-4"
            >
              {type === "signup" && (
                <div>
                  <label className="block text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1.5 ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="YOUR NAME"
                    className={`w-full h-12 md:h-14 px-5 rounded-[1rem] border-2 outline-none transition-all font-bold text-xs ${
                      isDarkMode
                        ? "bg-zinc-950/50 border-zinc-800 focus:border-cyan-500/50 text-white placeholder-zinc-800"
                        : "bg-zinc-50 border-zinc-200 focus:border-black placeholder-zinc-400 text-zinc-950"
                    }`}
                  />
                </div>
              )}
              <div>
                <label className="block text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1.5 ml-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="LEARNER@WORKNAI.TECH"
                  className={`w-full h-12 md:h-14 px-5 rounded-[1rem] border-2 outline-none transition-all font-bold text-xs ${
                    isDarkMode
                      ? "bg-zinc-950/50 border-zinc-800 focus:border-cyan-500/50 text-white placeholder-zinc-800"
                      : "bg-zinc-50 border-zinc-200 focus:border-black placeholder-zinc-400 text-zinc-950"
                  }`}
                />
              </div>
              <div>
                <label className="block text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1.5 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full h-12 md:h-14 px-5 rounded-[1rem] border-2 outline-none transition-all font-bold text-xs ${
                    isDarkMode
                      ? "bg-zinc-950/50 border-zinc-800 focus:border-cyan-500/50 text-white placeholder-zinc-800"
                      : "bg-zinc-50 border-zinc-200 focus:border-black placeholder-zinc-400 text-zinc-950"
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 md:py-5 mt-2 rounded-[1.2rem] font-black text-xs md:text-sm uppercase tracking-widest transition-all transform hover:scale-[1.01] active:scale-95 shadow-xl ${
                  isDarkMode
                    ? "bg-cyan-500 text-white hover:bg-cyan-400 shadow-cyan-900/20"
                    : "bg-black text-white hover:bg-zinc-800 shadow-black/20"
                } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isLoading
                  ? "Processing..."
                  : type === "signin"
                    ? "Verify & Enter"
                    : "Start Education"}
              </button>
            </form>

            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-2 px-1">
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest text-center sm:text-left">
                {type === "signin" ? "No account?" : "Already enrolled?"}
                <Link
                  to={type === "signin" ? "/signup" : "/signin"}
                  className={`ml-2 font-black transition-colors ${isDarkMode ? "text-cyan-400 hover:text-white" : "text-blue-600 hover:text-black"}`}
                >
                  {type === "signin" ? "Apply" : "Login"}
                </Link>
              </p>
              {type === "signin" && (
                <a
                  href="#"
                  className="text-[8px] font-black text-zinc-400 hover:text-zinc-600 dark:hover:text-white uppercase tracking-widest transition-colors"
                >
                  Forgot Password?
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Trust Badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 flex items-center gap-4 md:gap-6 relative z-10"
      >
        <div className="flex items-center gap-1.5">
          <div
            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${isDarkMode ? "bg-cyan-500/20" : "bg-green-100"}`}
          >
            <svg
              className={`w-2 h-2 ${isDarkMode ? "text-cyan-400" : "text-green-600"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">
            Secure Enrollment
          </span>
        </div>
        <div className="w-px h-3 bg-zinc-500/20"></div>
        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">
          Verified Certification
        </span>
      </motion.div>
    </div>
  );
};

export default Auth;
