
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../context';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

interface Props {
  type: 'signin' | 'signup';
}

const Auth: React.FC<Props> = ({ type }) => {
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".auth-glow", {
        x: "random(-100, 100)",
        y: "random(-100, 100)",
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 2
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      alert("Welcome to the WorknAI community!");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div
      ref={containerRef}
      className="h-screen relative flex flex-col items-center justify-center p-4 md:p-6 pt-20 md:pt-32 overflow-hidden"
    >
      {/* Dynamic Background Accents */}
      <div className={`auth-glow absolute top-0 left-0 w-[500px] h-[500px] blur-[150px] rounded-full opacity-10 pointer-events-none transition-colors duration-1000 ${isDarkMode ? 'bg-cyan-500' : 'bg-blue-200'}`}></div>
      <div className={`auth-glow absolute bottom-0 right-0 w-[500px] h-[500px] blur-[150px] rounded-full opacity-10 pointer-events-none transition-colors duration-1000 ${isDarkMode ? 'bg-fuchsia-500' : 'bg-rose-200'}`}></div>

      {/* Horizontal Auth Card */}
      <motion.div
        key={type}
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`relative z-10 w-full max-w-[1000px] flex flex-col md:flex-row rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden refractive-border liquid-glass border shadow-2xl max-h-[80vh] md:max-h-[75vh] ${isDarkMode ? 'bg-zinc-950/40 border-white/5' : 'bg-white/40 border-white/20'
          }`}
      >
        {/* Left Side: Branding/Visual */}
        <div className={`hidden md:flex md:w-5/12 p-8 lg:p-12 flex-col justify-between relative overflow-hidden border-r ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
          <div className="relative z-10 space-y-6">
            <div>
              <h2 className="text-3xl lg:text-5xl font-black font-syne tracking-tighter leading-[0.9] uppercase italic mb-4">
                {type === 'signin' ? 'ELEVATE \nYOUR \nLOGIC.' : 'JOIN \nTHE \nELITE.'}
              </h2>
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-[9px] max-w-[200px]">
                {type === 'signin' ? 'Resume your learning track and access workspace.' : 'Register for verified tracks and mentorship.'}
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
                  <img src="/Logo2.jpeg" alt="WorknAI Official Brand" className="w-full h-full object-contain" />
                </div>
              </Link>
            </motion.div>
          </div>

          <div className="absolute -bottom-10 -left-10 w-48 h-48 opacity-10 pointer-events-none">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="fill-current text-indigo-500">
              <path d="M44.7,-76.4C58.1,-69.2,69.2,-58.1,76.4,-44.7C83.6,-31.3,86.9,-15.7,85.6,-0.7C84.3,14.2,78.4,28.4,70.2,40.8C61.9,53.2,51.3,63.8,38.9,72C26.5,80.2,12.3,86,0.3,85.5C-11.7,85,-23.4,78.2,-35.3,70C-47.2,61.8,-59.3,52.2,-68.5,40.1C-77.7,28,-83.9,13.4,-84.5,-0.3C-85,-14.1,-79.8,-27.1,-71.4,-38.5C-62.9,-49.9,-51.2,-59.7,-38.4,-67.2C-25.5,-74.7,-12.8,-79.9,1.4,-82.3C15.6,-84.7,31.3,-83.7,44.7,-76.4Z" transform="translate(100 100)" />
            </svg>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-6 md:p-10 lg:p-12 flex flex-col justify-center overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-xl font-black font-syne uppercase tracking-tight italic">
              {type === 'signin' ? 'Student Sign In' : 'New Enrollment'}
            </h3>
            <div className={`w-10 h-1 mt-2 rounded-full bg-gradient-to-r ${isDarkMode ? 'from-cyan-400 to-blue-500' : 'from-blue-600 to-emerald-500'}`}></div>
          </div>

          <div className="space-y-4 md:space-y-5">
            <button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className={`group relative overflow-hidden w-full h-14 md:h-16 flex items-center justify-center gap-3 rounded-[1.2rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all transform hover:scale-[1.01] active:scale-95 border-2 ${isDarkMode ? 'bg-zinc-900/50 border-white/5 hover:border-cyan-500/30' : 'bg-white/50 border-black/5 hover:border-black'
                }`}
            >
              {isLoading ? (
                <span className={`animate-spin h-5 w-5 border-2 rounded-full border-t-transparent ${isDarkMode ? 'border-cyan-400' : 'border-black'}`}></span>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </svg>
                  Google Login
                </>
              )}
            </button>

            <div className="flex items-center gap-4">
              <div className="flex-grow h-[1px] bg-zinc-500/10"></div>
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.3em]">OR EMAIL</span>
              <div className="flex-grow h-[1px] bg-zinc-500/10"></div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:gap-4">
              <div>
                <label className="block text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1.5 ml-1">Email</label>
                <input
                  type="email"
                  placeholder="LEARNER@WORKNAI.TECH"
                  className={`w-full h-12 md:h-14 px-5 rounded-[1rem] border-2 outline-none transition-all font-bold text-xs ${isDarkMode
                    ? 'bg-zinc-950/50 border-zinc-800 focus:border-cyan-500/50 text-white placeholder-zinc-800'
                    : 'bg-zinc-50 border-zinc-100 focus:border-black placeholder-zinc-300'
                    }`}
                />
              </div>
              <div>
                <label className="block text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1.5 ml-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`w-full h-12 md:h-14 px-5 rounded-[1rem] border-2 outline-none transition-all font-bold text-xs ${isDarkMode
                    ? 'bg-zinc-950/50 border-zinc-800 focus:border-cyan-500/50 text-white placeholder-zinc-800'
                    : 'bg-zinc-50 border-zinc-100 focus:border-black placeholder-zinc-300'
                    }`}
                />
              </div>

              <button className={`w-full py-4 md:py-5 mt-2 rounded-[1.2rem] font-black text-xs md:text-sm uppercase tracking-widest transition-all transform hover:scale-[1.01] active:scale-95 shadow-xl ${isDarkMode
                ? 'bg-cyan-500 text-white hover:bg-cyan-400 shadow-cyan-900/20'
                : 'bg-black text-white hover:bg-zinc-800 shadow-black/20'
                }`}>
                {type === 'signin' ? 'Verify & Enter' : 'Start Education'}
              </button>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-2 px-1">
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest text-center sm:text-left">
                {type === 'signin' ? "No account?" : "Already enrolled?"}
                <Link
                  to={type === 'signin' ? '/signup' : '/signin'}
                  className={`ml-2 font-black transition-colors ${isDarkMode ? 'text-cyan-400 hover:text-white' : 'text-blue-600 hover:text-black'}`}
                >
                  {type === 'signin' ? 'Apply' : 'Login'}
                </Link>
              </p>
              {type === 'signin' && (
                <a href="#" className="text-[8px] font-black text-zinc-400 hover:text-zinc-600 dark:hover:text-white uppercase tracking-widest transition-colors">Forgot Password?</a>
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
          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-cyan-500/20' : 'bg-green-100'}`}>
            <svg className={`w-2 h-2 ${isDarkMode ? 'text-cyan-400' : 'text-green-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">Secure Enrollment</span>
        </div>
        <div className="w-px h-3 bg-zinc-500/20"></div>
        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">Verified Certification</span>
      </motion.div>
    </div>
  );
};

export default Auth;
