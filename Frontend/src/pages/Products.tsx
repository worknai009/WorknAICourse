import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  QrCode,
  ArrowRight,
  Globe,
  Monitor,
  Database,
  Lock,
  Cpu,
  Layers,
  ShieldCheck,
} from "lucide-react";
import { useTheme } from "../context";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Products: React.FC = () => {
  const { isDarkMode } = useTheme();
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reveals = document.querySelectorAll(".reveal");
      reveals.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: () => el.classList.add("active"),
          once: true,
        });
      });

      gsap.to(".product-glow", {
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

  return (
    <div ref={containerRef} className="relative overflow-hidden min-h-screen">
      {/* Background Grid */}
      <div
        className={`fixed inset-0 blueprint-grid pointer-events-none -z-20 transition-colors duration-700 ${
          isDarkMode ? "text-zinc-800 opacity-40" : "text-zinc-300 opacity-50"
        }`}
      />

      {/* Dynamic Background Accents */}
      <div
        className={`product-glow absolute top-0 left-0 w-[600px] h-[600px] blur-[150px] rounded-full opacity-10 pointer-events-none transition-colors duration-1000 ${
          isDarkMode ? "bg-cyan-500" : "bg-blue-300"
        }`}
      />
      <div
        className={`product-glow absolute bottom-0 right-0 w-[600px] h-[600px] blur-[150px] rounded-full opacity-10 pointer-events-none transition-colors duration-1000 ${
          isDarkMode ? "bg-fuchsia-500" : "bg-rose-300"
        }`}
      />

      <div className="relative z-10 pt-40 pb-32">
        {/* Engineering Hero Section */}
        <section className="px-6 mb-32 reveal">
          <div className="max-w-400 mx-auto text-left">
            <h1 className="text-6xl md:text-8xl font-black font-syne tracking-tighter leading-[0.85] uppercase mb-12">
              <span
                className={`block transition-colors duration-500 ${isDarkMode ? "text-white" : "text-black"}`}
              >
                Our
              </span>
              <span
                className="block italic transition-all duration-500"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, #00E5FF 0%, #2D9CFF 30%, #7B61FF 55%, #C44CFF 75%, #FF2CDF 100%)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 10px rgba(0,229,255,0.35))",
                }}
              >
                Products.
              </span>
            </h1>

            <p
              className={`text-xl md:text-2xl font-medium max-w-3xl leading-relaxed mb-16 transition-colors duration-500 ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}
            >
              Excellence in workforce scalability and healthcare logistics. Our
              proprietary protocols drive uncompromising operational
              transparency for enterprise partners.
            </p>

            <Link
              to="/callback"
              className={`inline-flex items-center gap-4 px-12 py-6 rounded-3xl font-black text-sm uppercase tracking-widest transition-all duration-300 hover:scale-105 shadow-2xl ${
                isDarkMode
                  ? "bg-white text-black hover:bg-zinc-100 shadow-white/10"
                  : "bg-black text-white hover:bg-zinc-800 shadow-black/30"
              }`}
            >
              Connect Now
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>

        {/* Product Modules */}
        <section className="px-6 mb-40">
          <div className="max-w-400 mx-auto space-y-48">
            {/* SmartHRMS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center reveal">
              <div className="lg:col-span-6 space-y-8">
                <div>
                  <span className="text-emerald-500 font-black text-[10px] tracking-[0.5em] uppercase mb-4 block">
                    Product_01 / HRMS
                  </span>
                  <h2
                    className={`text-5xl md:text-7xl font-black font-syne tracking-tighter leading-none mb-8 transition-colors duration-500 ${isDarkMode ? "text-white" : "text-black"}`}
                  >
                    Smart<span className="italic text-emerald-500">HRMS</span>.
                  </h2>
                  <p
                    className={`text-lg md:text-xl font-medium leading-relaxed mb-10 transition-colors duration-500 ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}
                  >
                    A high-precision workforce orchestration engine. Eliminate
                    metadata fragmentation and automate workforce compliance
                    through AI-validated telemetry.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-12">
                  <SpecItem
                    icon={<Monitor size={20} />}
                    label="UI Telemetry"
                    desc="Real-time multi-node tracking"
                    isDarkMode={isDarkMode}
                  />
                  <SpecItem
                    icon={<Database size={20} />}
                    label="Sync Layer"
                    desc="Delta-change replication"
                    isDarkMode={isDarkMode}
                  />
                  <SpecItem
                    icon={<Lock size={20} />}
                    label="Security"
                    desc="Zero-Trust access"
                    isDarkMode={isDarkMode}
                  />
                  <SpecItem
                    icon={<Cpu size={20} />}
                    label="Computation"
                    desc="Automated payroll"
                    isDarkMode={isDarkMode}
                  />
                </div>

                <a
                  href="https://worknaihrms.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group inline-flex items-center gap-4 px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl hover:-translate-y-1 ${
                    isDarkMode
                      ? "bg-zinc-900 text-emerald-400 border border-emerald-900/30 hover:bg-zinc-800"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100"
                  }`}
                >
                  Initialize Portal
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </a>
              </div>

              <div className="lg:col-span-6">
                <div
                  className={`relative p-2 rounded-[3.5rem] border transition-all duration-500 overflow-hidden group ${
                    isDarkMode
                      ? "bg-zinc-950/40 border-white/5"
                      : "bg-white/40 border-black/5"
                  } refractive-border liquid-glass shadow-2xl`}
                >
                  <img
                    src="/HRMS.png"
                    alt="SmartHRMS Interface"
                    className="w-full h-auto rounded-[3rem] transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div
                    className={`absolute bottom-10 right-10 p-6 rounded-2xl backdrop-blur-xl border shadow-2xl transition-colors duration-500 ${
                      isDarkMode
                        ? "bg-black/60 border-white/10"
                        : "bg-white/80 border-black/5"
                    }`}
                  >
                    <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">
                      Live Efficiency
                    </div>
                    <div
                      className={`text-4xl font-black font-syne tracking-tighter ${isDarkMode ? "text-white" : "text-black"}`}
                    >
                      99.8%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Raktdaan */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center reveal">
              <div className="lg:col-span-6 lg:order-2 space-y-8">
                <div>
                  <span className="text-rose-500 font-black text-[10px] tracking-[0.5em] uppercase mb-4 block">
                    Product_02 / Logistics
                  </span>
                  <h2
                    className={`text-5xl md:text-7xl font-black font-syne tracking-tighter leading-none mb-8 transition-colors duration-500 ${isDarkMode ? "text-white" : "text-black"}`}
                  >
                    Rakt<span className="italic text-rose-500">daan</span>.
                  </h2>
                  <p
                    className={`text-lg md:text-xl font-medium leading-relaxed mb-10 transition-colors duration-500 ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}
                  >
                    A critical regional mesh network for healthcare logistics.
                    Synchronizing life-critical supply chains through real-time
                    elastic demand protocols and secure donor verification.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-12">
                  <SpecItem
                    icon={<Globe size={20} />}
                    label="Mesh Network"
                    desc="Global node sync"
                    isDarkMode={isDarkMode}
                  />
                  <SpecItem
                    icon={<QrCode size={20} />}
                    label="Zero-ID"
                    desc="Secure registration"
                    isDarkMode={isDarkMode}
                  />
                  <SpecItem
                    icon={<Activity size={20} />}
                    label="Telemetry"
                    desc="Supply tracking"
                    isDarkMode={isDarkMode}
                  />
                  <SpecItem
                    icon={<ShieldCheck size={20} />}
                    label="Trust"
                    desc="Immutable logs"
                    isDarkMode={isDarkMode}
                  />
                </div>

                <a
                  href="https://raktdaan.online/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group inline-flex items-center gap-4 px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl hover:-translate-y-1 ${
                    isDarkMode
                      ? "bg-zinc-900 text-rose-400 border border-rose-900/30 hover:bg-zinc-800"
                      : "bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100"
                  }`}
                >
                  Deploy Module
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </a>
              </div>

              <div className="lg:col-span-6 lg:order-1">
                <div
                  className={`relative p-2 rounded-[3.5rem] border transition-all duration-500 overflow-hidden group ${
                    isDarkMode
                      ? "bg-zinc-950/40 border-white/5"
                      : "bg-white/40 border-black/5"
                  } refractive-border liquid-glass shadow-2xl`}
                >
                  <img
                    src="/raktdaan.png"
                    alt="Raktdaan Module"
                    className="w-full h-auto rounded-[3rem] transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Industrial Partnerships Section */}
        <section
          className={`py-40 px-6 border-y transition-colors duration-700 ${
            isDarkMode
              ? "bg-zinc-950/50 border-white/5"
              : "bg-blue-50/50 border-black/5"
          }`}
        >
          <div className="max-w-400 mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
              <div className="lg:col-span-5 reveal">
                <span
                  className={`font-black text-[10px] tracking-[0.5em] uppercase mb-6 block ${isDarkMode ? "text-cyan-400" : "text-indigo-600"}`}
                >
                  Enterprise Capability
                </span>
                <h2
                  className={`text-5xl md:text-7xl font-black font-syne tracking-tighter leading-[0.85] uppercase mb-10 transition-colors duration-500 ${isDarkMode ? "text-white" : "text-black"}`}
                >
                  Bespoke <br />
                  <span
                    className={`italic transition-colors duration-500 ${isDarkMode ? "text-cyan-400" : "text-indigo-600"}`}
                  >
                    Architectures
                  </span>
                  .
                </h2>
                <p
                  className={`text-xl font-medium leading-relaxed mb-12 max-w-sm transition-colors duration-500 ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}
                >
                  We specialize in high-concurrency protocols and
                  industrial-grade integration for businesses requiring
                  zero-bypass digital environments.
                </p>
              </div>

              <div className="lg:col-span-7 space-y-4">
                <CapabilityStrip
                  index="01"
                  icon={<Layers size={24} />}
                  title="Architectural Integration"
                  desc="Synchronizing our modular protocols with your existing legacy environment through custom-built API bridges."
                  isDarkMode={isDarkMode}
                />
                <CapabilityStrip
                  index="02"
                  icon={<Cpu size={24} />}
                  title="Custom Protocol Logic"
                  desc="Developing unique computational workflows tailored to your specific workforce compliance and enterprise logistics."
                  isDarkMode={isDarkMode}
                />
                <CapabilityStrip
                  index="03"
                  icon={<Monitor size={24} />}
                  title="White-Label Deployment"
                  desc="Full systemic deployment under your corporate brand, including local server maintenance and 24/7 dedicated support."
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-40 px-6 reveal">
          <div
            className={`max-w-400 mx-auto rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden border shadow-2xl transition-all duration-500 ${
              isDarkMode
                ? "bg-zinc-950/60 border-white/10"
                : "bg-white/60 border-black/5 shadow-zinc-200"
            } refractive-border liquid-glass`}
          >
            <div className="relative z-10">
              <h2
                className={`text-4xl md:text-6xl font-black font-syne mb-8 tracking-tighter leading-none transition-colors duration-500 ${isDarkMode ? "text-white" : "text-black"}`}
              >
                Initialize <br /> Inquiry_
              </h2>
              <p
                className={`text-lg font-medium max-w-xl mx-auto mb-12 transition-colors duration-500 ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}
              >
                Our architectural lead is available for a deep-dive session
                regarding structural integration and custom compliance logic.
              </p>
              <Link
                to="/callback"
                className={`inline-flex items-center gap-4 px-12 py-6 rounded-3xl font-black text-sm uppercase tracking-widest transition-all duration-300 hover:scale-105 shadow-2xl ${
                  isDarkMode
                    ? "bg-cyan-500 text-white hover:bg-cyan-400 shadow-cyan-900/40"
                    : "bg-black text-white hover:bg-zinc-800 shadow-black/40"
                }`}
              >
                Start Conversation
                <ArrowRight size={20} />
              </Link>
            </div>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] blueprint-grid pointer-events-none" />
          </div>
        </section>
      </div>
    </div>
  );
};

const SpecItem = ({ icon, label, desc, isDarkMode }: any) => (
  <div className="flex gap-4 group">
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 shadow-lg ${
        isDarkMode
          ? "bg-zinc-900 border-white/5 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-white"
          : "bg-white border-black/5 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
      }`}
    >
      {icon}
    </div>
    <div>
      <div
        className={`font-black text-xs mb-0.5 tracking-tight transition-colors duration-500 ${isDarkMode ? "text-white" : "text-black"}`}
      >
        {label}
      </div>
      <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
        {desc}
      </div>
    </div>
  </div>
);

const CapabilityStrip = ({ index, icon, title, desc, isDarkMode }: any) => (
  <div
    className={`p-8 rounded-3xl border transition-all duration-500 flex gap-8 items-start relative overflow-hidden group refractive-border liquid-glass ${
      isDarkMode
        ? "bg-zinc-950/40 border-white/5 hover:bg-zinc-900/60"
        : "bg-white/40 border-black/5 hover:bg-white/80"
    }`}
  >
    <div
      className={`absolute top-0 left-0 w-1 h-0 transition-all duration-500 ${isDarkMode ? "bg-cyan-500 group-hover:h-full" : "bg-indigo-600 group-hover:h-full"}`}
    />
    <div
      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shrink-0 ${
        isDarkMode ? "bg-zinc-900 text-cyan-400" : "bg-zinc-100 text-indigo-600"
      }`}
    >
      {icon}
    </div>
    <div>
      <h3
        className={`text-2xl font-black font-syne mb-2 tracking-tight transition-colors duration-500 ${isDarkMode ? "text-white" : "text-black"}`}
      >
        {title}
      </h3>
      <p
        className={`text-base font-medium leading-relaxed transition-colors duration-500 ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}
      >
        {desc}
      </p>
    </div>
    <span
      className={`absolute top-8 right-8 text-4xl font-black italic opacity-5 transition-opacity duration-500 ${isDarkMode ? "text-white group-hover:opacity-10" : "text-black group-hover:opacity-10"}`}
    >
      {index}
    </span>
  </div>
);

export default Products;
