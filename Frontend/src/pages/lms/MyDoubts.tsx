import { useState, useEffect } from "react";
import {
  CheckCircle,
  HelpCircle,
  Clock,
  ChevronDown,
  Activity,
  Globe,
} from "lucide-react";
import { useTheme } from "../../context";
import coursesApi, { type Doubt } from "../../../services/api";
import { motion, AnimatePresence } from "framer-motion";

const MyDoubts = () => {
  const { isDarkMode } = useTheme();
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetchMyDoubts();
  }, []);

  const fetchMyDoubts = async () => {
    try {
      setLoading(true);
      const data = await coursesApi.getMyDoubts();
      setDoubts(data);
    } catch (err) {
      console.error("Failed to fetch my doubts", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8">
      <div className="flex flex-col gap-3 pb-6 border-b border-zinc-100">
        <div className="flex items-center gap-3">
          <div className="w-6 h-1 bg-indigo-600 rounded-full" />
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-600">
            Technical Support Ledger
          </span>
        </div>
        <h2
          className={`text-3xl md:text-4xl font-black tracking-tight uppercase font-syne ${isDarkMode ? "text-white" : "text-zinc-950"}`}
        >
          My Queries
        </h2>
        <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest max-w-xl">
          Track the status of authorized technical inquiries and mentor
          resolutions.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-zinc-50 rounded-full border-t-indigo-600 animate-spin" />
            <Activity
              className="absolute inset-0 m-auto text-indigo-600 animate-pulse"
              size={16}
            />
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">
            Accessing Registry...
          </p>
        </div>
      ) : doubts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {doubts.map((doubt, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={doubt._id}
              className={`rounded-[1.5rem] border transition-all duration-500 overflow-hidden ${
                isDarkMode
                  ? "bg-zinc-900 border-white/5"
                  : "bg-white border-zinc-100 hover:shadow-xl hover:shadow-zinc-200/40"
              }`}
            >
              {/* Summary Row */}
              <div
                onClick={() => toggleExpand(doubt._id)}
                className={`p-6 cursor-pointer flex items-center justify-between transition-colors ${expandedId === doubt._id ? "bg-zinc-50/50" : "hover:bg-zinc-50/30"}`}
              >
                <div className="flex items-center gap-6">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
                      doubt.status === "resolved"
                        ? "bg-emerald-500/10 text-emerald-500 shadow-emerald-500/10"
                        : "bg-amber-500/10 text-amber-500 shadow-amber-500/10"
                    }`}
                  >
                    {doubt.status === "resolved" ? (
                      <CheckCircle size={20} />
                    ) : (
                      <Clock size={20} />
                    )}
                  </div>
                  <div>
                    <h3
                      className={`text-lg font-black font-syne uppercase tracking-tight mb-1 ${isDarkMode ? "text-white" : "text-zinc-950"}`}
                    >
                      {doubt.topicTitle}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${
                          doubt.status === "resolved"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {doubt.status === "resolved"
                          ? "Validated"
                          : "Active Session"}
                      </span>
                      <div className="w-1 h-1 rounded-full bg-zinc-200" />
                      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest whitespace-nowrap">
                        {doubt.courseId?.name}
                      </span>
                      <div className="w-1 h-1 rounded-full bg-zinc-200" />
                      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">
                        {new Date(doubt.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center border border-zinc-100 text-zinc-400 transition-all duration-500 ${expandedId === doubt._id ? "bg-zinc-950 text-white rotate-180" : ""}`}
                >
                  <ChevronDown size={18} />
                </div>
              </div>

              {/* Details (Collapsible) */}
              <AnimatePresence>
                {expandedId === doubt._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div
                      className={`p-6 pt-0 border-t ${isDarkMode ? "border-white/5" : "border-zinc-50"}`}
                    >
                      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">
                            Industrial Inquiry
                          </p>
                          <div
                            className={`p-6 rounded-[1.5rem] text-xs font-bold leading-relaxed border ${isDarkMode ? "bg-zinc-950 border-white/5 text-zinc-300" : "bg-zinc-50 border-zinc-100 text-zinc-700"}`}
                          >
                            {doubt.query}
                          </div>
                        </div>

                        {doubt.status === "resolved" && doubt.response ? (
                          <div className="space-y-3">
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-500">
                              Authorized Resolution
                            </p>
                            <div
                              className={`p-6 rounded-[1.5rem] text-xs font-bold leading-relaxed border-2 ${isDarkMode ? "bg-emerald-500/5 border-emerald-500/20 text-zinc-200" : "bg-emerald-50 border-emerald-100 text-zinc-800 shadow-xl shadow-emerald-500/5"}`}
                            >
                              <div className="flex gap-4">
                                <Globe
                                  size={16}
                                  className="text-emerald-500 shrink-0"
                                />
                                <p>{doubt.response}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-8 rounded-[1.5rem] border-2 border-dashed border-zinc-100 opacity-60">
                            <Activity
                              className="text-zinc-200 mb-3 animate-pulse"
                              size={24}
                            />
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400 text-center">
                              Session Active • Awaiting Mentor Authorization
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 space-y-6 rounded-[2.5rem] border-2 border-dashed border-zinc-100">
          <div className="w-16 h-16 rounded-xl bg-zinc-50 flex items-center justify-center text-zinc-200 border-2 border-zinc-100">
            <HelpCircle size={32} />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-xl font-black font-syne uppercase tracking-tight text-zinc-300">
              No Registry Entries
            </h3>
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-400">
              Initialize a support session during track playback.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDoubts;
