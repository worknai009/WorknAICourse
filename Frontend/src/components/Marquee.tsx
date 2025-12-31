import React from "react";
import { useTheme } from "../context";

const Marquee: React.FC = () => {
  const { isDarkMode } = useTheme();
  const techs = [
    "MERN Stack",
    "AI&ML",
    "Python",
    "Java FullStack",
    "UI/UX Design",
    ".NET Core",
    "Soft Skills",
    "Java",
    "SQL",
  ];

  const rgbAccents = isDarkMode
    ? ["bg-fuchsia-500", "bg-cyan-400", "bg-blue-500"]
    : ["bg-rose-500", "bg-emerald-500", "bg-blue-500"];

  return (
    <div
      className={`h-32 bg-black text-white overflow-hidden select-none border-y relative z-20 transition-colors flex items-center ${
        isDarkMode ? "border-zinc-800" : "border-white/5"
      }`}
    >
      <div className="marquee-container w-full">
        <div className="marquee-content flex gap-12 md:gap-20 text-3xl md:text-5xl lg:text-6xl font-black font-syne items-center whitespace-nowrap">
          {techs.concat(techs).map((tech, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-10 md:gap-15 lg:gap-25 group transition-colors duration-300 cursor-default ${
                isDarkMode ? "hover:text-cyan-400" : "hover:text-blue-500"
              }`}
            >
              {tech}
              <div
                className={`w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 ${
                  rgbAccents[i % 3]
                } rotate-45 shadow-[0_0_15px_rgba(255,255,255,0.2)] shrink-0`}
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marquee;
