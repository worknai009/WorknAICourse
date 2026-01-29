import { useState, useEffect } from "react";
import {
  MessageSquare,
  CheckCircle,
  Search,
  User,
  Clock,
  Loader2,
} from "lucide-react";
import api from "../services/api";

export interface Doubt {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  courseId: {
    _id: string;
    name: string;
  };
  topicId: string;
  topicTitle: string;
  query: string;
  status: "pending" | "resolved";
  response?: string;
  mentorId?: string;
  createdAt: string;
}

const DoubtsPage = () => {
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "resolved">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");

  useEffect(() => {
    fetchDoubts();
  }, []);

  const fetchDoubts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/doubts");
      setDoubts(res.data);
    } catch (err) {
      console.error("Failed to fetch doubts", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (doubtId: string) => {
    if (!responseText.trim()) return;
    try {
      await api.patch(`/doubts/${doubtId}/resolve`, { response: responseText });
      // Update local state
      setDoubts((prev) =>
        prev.map((d) =>
          d._id === doubtId
            ? { ...d, status: "resolved", response: responseText }
            : d,
        ),
      );
      setResolvingId(null);
      setResponseText("");
    } catch (err) {
      console.error("Failed to resolve doubt", err);
    }
  };

  const filteredDoubts = doubts.filter((doubt) => {
    const matchesFilter = filter === "all" || doubt.status === filter;
    const matchesSearch =
      doubt.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doubt.topicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doubt.courseId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h2 className="text-4xl font-bold">Doubt Management</h2>
        <p className="text-gray-400 mt-2">View and resolve student queries.</p>
      </header>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center">
        <div className="flex items-center gap-2">
          {[
            { id: "all", label: "All Queries" },
            { id: "pending", label: "Pending" },
            { id: "resolved", label: "Resolved" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${
                filter === tab.id
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search doubts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white/5 border border-white/10 focus:border-blue-500 outline-none text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      ) : filteredDoubts.length > 0 ? (
        <div className="space-y-4">
          {filteredDoubts.map((doubt) => (
            <div
              key={doubt._id}
              className="p-6 rounded-2xl border border-white/10 bg-[#0a0a0a]"
            >
              <div className="flex flex-col lg:flex-row gap-6 lg:items-start justify-between">
                <div className="space-y-4 flex-grow">
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                        doubt.status === "resolved"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-orange-500/10 text-orange-500"
                      }`}
                    >
                      {doubt.status}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(doubt.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">
                      {doubt.topicTitle}
                    </h3>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                      {doubt.courseId?.name}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl text-sm leading-relaxed bg-white/5 text-gray-300">
                    {doubt.query}
                  </div>

                  {doubt.userId && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white/10 text-gray-400">
                        <User size={12} />
                      </div>
                      <span className="text-sm text-gray-500">
                        {doubt.userId.name}{" "}
                        <span className="text-gray-600">
                          ({doubt.userId.email})
                        </span>
                      </span>
                    </div>
                  )}

                  {doubt.status === "resolved" && (
                    <div className="mt-4 pl-4 border-l-2 border-emerald-500">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-2">
                        Mentor Response
                      </p>
                      <p className="text-sm text-gray-300">{doubt.response}</p>
                    </div>
                  )}
                </div>

                {/* Action Area */}
                <div className="lg:w-80 shrink-0">
                  {doubt.status === "pending" &&
                    (resolvingId === doubt._id ? (
                      <div className="space-y-3 animate-in fade-in slide-in-from-right-4">
                        <textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Type your explanation here..."
                          className="w-full h-32 p-3 rounded-xl resize-none text-sm outline-none bg-white/5 border border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleResolve(doubt._id)}
                            className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-widest rounded-lg"
                          >
                            Send Response
                          </button>
                          <button
                            onClick={() => {
                              setResolvingId(null);
                              setResponseText("");
                            }}
                            className="px-4 py-2 border border-white/10 text-gray-400 hover:bg-white/5 rounded-lg text-xs font-bold uppercase tracking-widest"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setResolvingId(doubt._id)}
                        className="w-full py-3 rounded-xl border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-blue-500 hover:bg-blue-500/10 flex items-center justify-center gap-2 transition-all"
                      >
                        <MessageSquare size={16} />
                        <span className="text-xs font-bold uppercase tracking-widest">
                          Resolve Query
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 opacity-50 text-gray-500">
          <CheckCircle size={48} className="mb-4 text-gray-600" />
          <p className="text-sm font-bold uppercase tracking-widest">
            No doubts found
          </p>
        </div>
      )}
    </div>
  );
};

export default DoubtsPage;
