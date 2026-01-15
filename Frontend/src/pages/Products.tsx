import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ShieldCheck,
  MapPin,
  Activity,
  QrCode,
  ArrowRight,
  ExternalLink, // New icon for buttons
} from "lucide-react";
import { useTheme } from "../context";

gsap.registerPlugin(ScrollTrigger);

const Products: React.FC = () => {
  const { isDarkMode } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reveals = document.querySelectorAll(".reveal");
      reveals.forEach((el) => {
        ScrollTrigger.create({
          trigger: el as HTMLElement,
          start: "top 85%",
          onEnter: () => el.classList.add("active"),
          once: true,
        });
      });

      gsap.from(".hero-line", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: "power4.out",
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative min-h-screen" ref={containerRef}>
      {/* Background Grid */}
      <div
        className={`fixed inset-0 blueprint-grid pointer-events-none -z-20 transition-colors duration-700 ${
          isDarkMode ? "text-zinc-800 opacity-40" : "text-zinc-300 opacity-50"
        }`}
      />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 lg:px-20 relative">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-[12vw] lg:text-[7vw] font-black font-syne leading-[0.8] tracking-tighter mb-12">
            <span
              className={`block hero-line ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Our
            </span>
            <span className="block hero-line text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500">
              Products
            </span>
          </h1>
          <p
            className={`max-w-2xl text-xl font-medium hero-line ${
              isDarkMode ? "text-zinc-400" : "text-zinc-600"
            }`}
          >
            High-performance vocational systems engineered for the Founding 100.
            Standardizing excellence through digital protocols.
          </p>
        </div>
      </section>

      {/* PROJECT 01: SmartHRMS (LIME GREEN) */}
      <section className="py-24 px-6 lg:px-20 border-t border-zinc-500/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 reveal">
            <div className="flex items-center gap-3 mb-6">
              <div className="px-3 py-1 bg-lime-500 text-black text-[10px] font-black uppercase tracking-widest rounded-sm">
                Product 1
              </div>
              <div className="h-px w-20 bg-lime-500/30" />
            </div>
            <h2
              className={`text-6xl md:text-8xl font-syne mb-6 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Smart<span className="text-lime-500">HRMS</span>
            </h2>
            <p
              className={`text-2xl font-light mb-10 ${
                isDarkMode ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Cloud-based workforce solution seeking 100% transparency via AI
              validation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              <ProjectFeature
                icon={<ShieldCheck className="text-lime-500" size={24} />}
                title="Biometric AI"
                text="Deep-learning facial recognition prevents proxy-based attendance fraud."
              />
              <ProjectFeature
                icon={<MapPin className="text-lime-500" size={24} />}
                title="GPS Geofencing"
                text="Strict 3-Kilometer radius validation using Google Maps Platform."
              />
            </div>
            <div
              className={`p-8 rounded-3xl border mb-10 ${
                isDarkMode
                  ? "bg-zinc-900/50 border-zinc-800"
                  : "bg-white border-zinc-200"
              }`}
            >
              <div className="space-y-6">
                <MetricBar
                  label="Attendance Fraud Reduction"
                  value="98%"
                  color="bg-lime-500"
                />
                <MetricBar
                  label="Payroll Speed Improvement"
                  value="90%"
                  color="bg-cyan-500"
                />
              </div>
            </div>

            {/* BUTTON FOR PROJECT 1 */}
            <a
              href="https://worknaihrms.online"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-lg uppercase tracking-tighter transition-all duration-300 hover:scale-105 shadow-xl ${
                isDarkMode
                  ? "bg-lime-500 text-black hover:bg-lime-400 shadow-lime-500/20"
                  : "bg-black text-white hover:bg-zinc-800 shadow-black/20"
              }`}
            >
              Access HRMS Portal
              <ExternalLink size={20} />
            </a>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-4 bg-lime-500/10 blur-3xl rounded-full" />
            <div
              className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-500 ${
                isDarkMode
                  ? "border-zinc-800 shadow-2xl"
                  : "border-zinc-200 shadow-xl"
              }`}
            >
              <img
                src="/HRMS.png"
                alt="HRMS Interface"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT 02: Blood Donation (ROSE RED) */}
      <section className="py-24 px-6 lg:px-20 border-t border-zinc-500/10 bg-zinc-950/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 reveal">
            <div className="flex items-center gap-3 mb-6">
              <div className="px-3 py-1 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-sm">
                Product 2
              </div>
              <div className="h-px w-20 bg-rose-500/30" />
            </div>
            <h2
              className={`text-6xl md:text-8xl font-syne mb-6 ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              <span className="text-rose-500">Blood</span>Donation
            </h2>
            <p
              className={`text-2xl font-light mb-10 ${
                isDarkMode ? "text-zinc-300" : "text-zinc-700"
              }`}
            >
              Real-time command center replacing legacy manual paperwork with
              digital flows.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              <ProjectFeature
                icon={<QrCode className="text-rose-500" size={24} />}
                title="Instant Sync"
                text="Unique QR-based donor registration updates metrics in under 1 second."
              />
              <ProjectFeature
                icon={<Activity className="text-rose-500" size={24} />}
                title="Live Analytics"
                text="Track units collected and donor eligibility status with zero latency."
              />
            </div>
            <div
              className={`p-8 rounded-3xl border mb-10 ${
                isDarkMode
                  ? "bg-zinc-900/50 border-zinc-800"
                  : "bg-white border-zinc-200"
              }`}
            >
              <div className="space-y-6">
                <MetricBar
                  label="Paperwork Elimination"
                  value="100%"
                  color="bg-rose-500"
                />
                <MetricBar
                  label="Reporting Accuracy"
                  value="99%"
                  color="bg-rose-400"
                />
              </div>
            </div>

            {/* BUTTON FOR PROJECT 2 */}
            <a
              href="https://raktdaan.online/"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-3 px-10 py-5 rounded-2xl font-black text-lg uppercase tracking-tighter transition-all duration-300 hover:scale-105 shadow-xl ${
                isDarkMode
                  ? "bg-rose-600 text-white hover:bg-rose-500 shadow-rose-500/20"
                  : "bg-black text-white hover:bg-zinc-800 shadow-black/20"
              }`}
            >
              View Product
              <ExternalLink size={20} />
            </a>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="absolute -inset-4 bg-rose-500/10 blur-3xl rounded-full" />
            <div
              className={`relative rounded-2xl border-2 overflow-hidden transition-all duration-500 group ${
                isDarkMode
                  ? "bg-black border-zinc-800 shadow-2xl"
                  : "bg-white border-zinc-200 shadow-xl"
              }`}
            >
              <div className="lg:col-span-5 relative">
                <div className="absolute -inset-4 bg-lime-500/10 blur-3xl rounded-full" />
                <div
                  className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-500 ${
                    isDarkMode
                      ? "border-zinc-800 shadow-2xl"
                      : "border-zinc-200 shadow-xl"
                  }`}
                >
                  <img
                    src="/raktdaan.png"
                    alt="HRMS Interface"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6">
        <div
          className={`max-w-4xl mx-auto rounded-[3.5rem] p-12 lg:p-24 text-center relative overflow-hidden border-4 transition-all duration-500 ${
            isDarkMode
              ? "bg-black border-cyan-500/30 shadow-[0_0_100px_rgba(6,182,212,0.1)]"
              : "bg-zinc-900 border-zinc-200 shadow-2xl"
          }`}
        >
          <h2 className="text-4xl md:text-7xl font-light font-syne tracking-tighter text-white mb-8">
            Ready to <br /> Build the{" "}
            <span className="text-cyan-400">Future?</span>
          </h2>
          <Link
            to="/callback"
            className="group inline-flex items-center gap-3 px-12 py-6 bg-white text-black rounded-2xl font-black text-xl uppercase tracking-tighter hover:scale-105 transition-all"
          >
            Get in Touch
            <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

// Helper Components
const ProjectFeature = ({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) => {
  const { isDarkMode } = useTheme();
  return (
    <div
      className={`p-6 rounded-2xl border transition-all duration-300 hover:border-zinc-500/30 ${
        isDarkMode
          ? "bg-zinc-900/40 border-zinc-800"
          : "bg-zinc-50 border-zinc-200"
      }`}
    >
      <div className="mb-4">{icon}</div>
      <h4
        className={`font-black uppercase text-sm mb-2 ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        {title}
      </h4>
      <p className="text-xs leading-relaxed text-zinc-500">{text}</p>
    </div>
  );
};

const MetricBar = ({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) => {
  const { isDarkMode } = useTheme();
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <span
          className={`text-[10px] font-black uppercase tracking-widest ${
            isDarkMode ? "text-zinc-500" : "text-zinc-400"
          }`}
        >
          {label}
        </span>
        <span
          className={`text-lg font-black font-syne ${
            isDarkMode ? "text-white" : "text-black"
          }`}
        >
          {value}
        </span>
      </div>
      <div
        className={`h-3 w-full rounded-full overflow-hidden ${
          isDarkMode ? "bg-zinc-800" : "bg-zinc-100"
        }`}
      >
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: value }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
};

export default Products;
