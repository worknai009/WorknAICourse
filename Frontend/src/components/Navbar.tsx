import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context";
import { motion } from "framer-motion";

const Navbar: React.FC = () => {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Contact", path: "/callback" },
    { name: "Products", path: "/products" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full z-100 p-4 pointer-events-none">
      <div className="max-w-350 mx-auto flex items-center justify-between">
        {/* Logo/Branding */}
        <Link
          to="/"
          className={`flex items-center gap-2 pointer-events-auto group transition-all duration-500 ${
            isScrolled ? "scale-90" : "scale-100"
          }`}
        >
          <div
            className={`h-12 w-12 rounded-xl flex items-center justify-center overflow-hidden ${
              isDarkMode
                ? "bg-white text-black"
                : "bg-black text-white shadow-xl shadow-black/20"
            }`}
          >
            <img
              src="/Logo2.jpeg"
              alt="WorknAI Logo"
              className="h-full w-full object-cover"
            />
          </div>
          <span
            className="edu-header font-bold font-syne text-2xl"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #00E5FF 0%, #2D9CFF 30%, #7B61FF 55%, #C44CFF 75%, #FF2CDF 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
              filter:
                "drop-shadow(0 0 10px rgba(0,229,255,0.35)) drop-shadow(0 0 18px rgba(196,76,255,0.35))",
            }}
          >
            WorknAI
          </span>
        </Link>

        {/* Navigation Links */}
        <div
          className={`hidden lg:flex items-center gap-1 p-1 rounded-full border pointer-events-auto transition-all duration-500 shadow-xl ${
            isDarkMode
              ? "bg-zinc-900/80 border-white/10 shadow-black/40"
              : "bg-white/90 border-zinc-200 shadow-zinc-200/50"
          } ${isScrolled ? "scale-95" : "scale-100"}`}
        >
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-6 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
                  active
                    ? isDarkMode
                      ? "text-white"
                      : "text-zinc-900"
                    : "text-zinc-500 hover:text-zinc-400"
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                {active && (
                  <motion.div
                    layoutId="nav-pill"
                    className={`absolute inset-0 rounded-full ${
                      isDarkMode ? "bg-zinc-800" : "bg-zinc-100"
                    }`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Actions */}
        <div
          className={`flex items-center gap-2 pointer-events-auto transition-all duration-500 ${
            isScrolled ? "scale-95" : "scale-100"
          }`}
        >
          {/* <button
            onClick={toggleTheme}
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
            className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all border ${
              isDarkMode
                ? "border-white/10 text-white hover:bg-white/5"
                : "border-zinc-200 text-zinc-900 hover:bg-zinc-100 shadow-sm"
            }`}
          >
            {isDarkMode ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 5a7 7 0 100 14 7 7 0 000-14z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button> */}

          <Link
            to="/signin"
            className={`px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${
              isDarkMode
                ? "bg-white text-black hover:bg-zinc-200 shadow-xl shadow-black/20"
                : "bg-black text-white hover:bg-zinc-800 shadow-xl shadow-black/20"
            }`}
          >
            Login
          </Link>

          {/* Mobile Menu Button */}
          <button
            aria-label="Open mobile menu"
            className={`lg:hidden w-11 h-11 flex items-center justify-center rounded-xl border ${
              isDarkMode
                ? "border-white/10 text-white"
                : "border-zinc-200 text-black shadow-sm"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className={`absolute top-1/2 left-0 w-full h-1px -z-10 transition-opacity duration-700 ${
          isScrolled ? "opacity-10" : "opacity-0"
        } ${isDarkMode ? "bg-white" : "bg-black"}`}
      />
    </nav>
  );
};

export default Navbar;
