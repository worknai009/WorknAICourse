import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Instagram, Linkedin, Youtube } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: "About", path: "/about" },
    { label: "Engineering", path: "/courses" },
    { label: "Solutions", path: "/products" },
    { label: "Connect", path: "/callback" },
  ];

  const solutions = [
    { label: "Enterprise AI", path: "/products" },
    { label: "Web Core", path: "/courses" },
    { label: "Cloud Infra", path: "/courses" },
    { label: "UI Design", path: "/courses" },
  ];

  const socialLinks = [
    {
      icon: <Linkedin size={18} />,
      url: "#",
      label: "LinkedIn",
    },
    {
      icon: <Instagram size={18} />,
      url: "https://www.instagram.com/worknai_institute_center?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      label: "Instagram",
    },
    {
      icon: <Youtube size={18} />,
      url: "#",
      label: "YouTube",
    },
  ];

  return (
    <footer className="bg-zinc-950 pt-32 pb-12 px-6 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative z-10">
        {/* Top Brand Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-20 pb-16 border-b border-white/5">
          <Link to="/" className="flex items-center gap-4">
            <div className="h-16 w-16 flex items-center justify-center overflow-hidden">
              <img
                src="/Logo2.jpeg"
                alt="WorknAI"
                className="h-full w-full object-contain"
              />
            </div>
            {/* <span className="font-light text-4xl tracking-tighter leading-none">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-indigo-400 font-medium italic">
                WorknAI.
              </span>
            </span> */}
          </Link>

          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.url}
                whileHover={{ y: -5 }}
                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-300 shadow-xl"
                aria-label={social.label}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Middle Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-24">
          <div className="space-y-6">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">
              Philosophy
            </h4>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-xs">
              Architecting the next generation of digital infrastructure. We
              bridge the gap between precision engineering and vocational
              mastery.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">
              Sitemap
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-zinc-500 hover:text-white text-sm font-bold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">
              Focus
            </h4>
            <ul className="space-y-3">
              {solutions.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.path}
                    className="text-zinc-500 hover:text-white text-sm font-bold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-white font-black text-xs uppercase tracking-[0.2em]">
              Connect
            </h4>
            <div className="space-y-4">
              <div>
                <span className="text-zinc-600 block text-[9px] font-black uppercase tracking-widest mb-1">
                  Email
                </span>
                <a
                  href="mailto:info@worknai.online"
                  className="text-white text-sm font-bold hover:text-indigo-400 transition-colors"
                >
                  info@worknai.online
                </a>
              </div>
              <div>
                <span className="text-zinc-600 block text-[9px] font-black uppercase tracking-widest mb-1">
                  Headquarters
                </span>
                <p className="text-zinc-400 text-[13px] font-medium leading-relaxed">
                  Unit 101, Oxford Towers, Airport Road,
                  <br />
                  Bangalore, KA 560008
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap items-center gap-6 text-zinc-500 font-bold text-[10px] uppercase tracking-widest">
            <span>© {currentYear} WorknAI Technologies Pvt. Ltd.</span>
            <Link to="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-white">
              Privacy
            </Link>
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className="absolute bottom-[-5%] left-0 w-full pointer-events-none select-none opacity-[0.03]">
        <h2 className="text-[15vw] font-black text-white text-center tracking-tighter leading-none">
          WORKNAI
        </h2>
      </div>
    </footer>
  );
};

export default Footer;
