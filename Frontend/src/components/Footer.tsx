import React from "react";
import { useTheme } from "../context";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  const { isDarkMode } = useTheme();

  const navigation = [
    { label: "Browse Courses", path: "/courses" },
    { label: "Request Consultation", path: "/callback" },
    { label: "Student Login", path: "/signin" },
  ];

  const socials = [
    {
      name: "LinkedIn",
      url: "#",
      icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/worknai_institute_center?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      icon: "M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zm8.75 2a1 1 0 110 2 1 1 0 010-2zM12 7a5 5 0 110 10 5 5 0 010-10zm0 1.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z",
    },
  ];

  return (
    <footer
      className={`relative pt-24 pb-12 px-6 md:px-12 border-t overflow-hidden ${
        isDarkMode ? "bg-zinc-950 border-zinc-900" : "bg-white border-zinc-100"
      }`}
    >
      {/* 1. TOP SECTION: THE MISSION & NEWSLETTER */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 mb-20 items-center">
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <img
              src="Logo2.jpeg"
              alt="WorknAI Company Logo"
              className="w-20 h-20 rounded-2xl"
            />
          </div>
          <p
            className={`text-xl md:text-2xl font-light leading-tight max-w-lg transition-colors ${
              isDarkMode ? "text-zinc-400" : "text-zinc-500"
            }`}
          >
            High-performance career pivots built on{" "}
            <span className={isDarkMode ? "text-white" : "text-zinc-900"}>
              honesty
            </span>{" "}
            and technical{" "}
            <span className={isDarkMode ? "text-white" : "text-zinc-900"}>
              precision
            </span>
            .
          </p>
        </div>
      </div>

      {/* 2. MIDDLE SECTION: LINK COLUMNS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-24 border-y py-20 border-zinc-500/10">
        <div className="space-y-8">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
            Learning Center
          </h4>
          <ul className="space-y-4">
            {navigation.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className="text-sm font-medium hover:opacity-50 transition-opacity"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-8">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
            Connect With Us
          </h4>
          <div className="flex gap-4">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
                  isDarkMode
                    ? "border-zinc-800 hover:bg-white hover:text-black"
                    : "border-zinc-100 hover:bg-black hover:text-white"
                }`}
                aria-label={social.name}
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d={social.icon} />
                </svg>
              </a>
            ))}
          </div>
          <p className="text-xs font-medium text-zinc-500">
            WorknAI Technologies India Pvt Ltd <br />
            Unit 101, Oxford Towers, Airport Road, Bangalore, Karnataka 560008{" "}
            <br />
            info@worknai.online
          </p>
        </div>

        <div className="space-y-8">
          <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
            Legal
          </h4>
          <ul className="space-y-4">
            <li>
              <a
                href="#"
                className="text-sm font-medium hover:opacity-50 transition-opacity"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-sm font-medium hover:opacity-50 transition-opacity"
              >
                Refund
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* 3. BOTTOM SECTION: COPYRIGHT & WATERMARK */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 mb-20">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
          © {new Date().getFullYear()} WorknAI Technologies / All Rights
          Reserved
        </p>
      </div>

      {/* ELEGANT BRAND WATERMARK */}
      <div className="absolute -bottom-10 left-0 w-full pointer-events-none select-none opacity-[0.03] overflow-hidden whitespace-nowrap">
        <h2
          className={`font-syne font-extrabold text-[22vw] leading-none uppercase tracking-tighter ${
            isDarkMode ? "text-white" : "text-black"
          }`}
          style={{ WebkitTextStroke: "2px currentColor", color: "transparent" }}
        >
          WORKNAI TECHNOLOGIES
        </h2>
      </div>

      {/* BIG BOLD WORKNAI TYPOGRAPHY */}
      <div className="relative z-10 mt-20 text-center pointer-events-none select-none">
        <div
          className="massive-text font-syne font-black transition-colors duration-500"
          style={{
            fontSize: "clamp(6rem, 20vw, 12rem)",
            lineHeight: "0.9",
            backgroundImage:
              "linear-gradient(90deg, #00E5FF 0%, #2D9CFF 30%, #7B61FF 55%, #C44CFF 75%, #FF2CDF 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent",
            filter:
              "drop-shadow(0 0 10px rgba(0,229,255,0.35)) drop-shadow(0 0 18px rgba(196,76,255,0.35))",
            opacity: isDarkMode ? "0.05" : "0.07",
          }}
        >
          WorknAI
        </div>
      </div>
    </footer>
  );
};

export default Footer;
