import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Bot,
    Plus,
    Search,
    Calendar,
    Filter,
    ArrowUpDown,
    RefreshCw,
    Briefcase,
    CheckCircle2,
    Clock3,
    Star,
    TrendingUp,
    Info,
    FileText,
} from "lucide-react";

type HistoryItem = {
    session_id: number;
    overall_score: number;
    date: string;
    // optional fields if your API returns them
    duration?: number;
    status?: string;
};

export default function InterviewHistory() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadHistory();
    }, []);

    async function loadHistory() {
        try {
            setLoading(true);
            const response = await axios.get(
                "http://127.0.0.1:8000/api/v1/interview-monitor/history",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setHistory(response.data || []);
        } catch (error) {
            console.error(error);
            setHistory([]);
        } finally {
            setLoading(false);
        }
    }

    // Derived stats
    const totalInterviews = history.length;
    const completed = history.length; // assuming all returned are completed
    const avgDuration = 0; // replace if API provides duration
    const bestScore =
        history.length > 0
            ? Math.max(...history.map((h) => h.overall_score)).toFixed(1)
            : "-";
    const latestScore =
        history.length > 0
            ? history[0].overall_score.toFixed(1)
            : "-";

    // Filtered list
    const filtered = history.filter((item) => {
        if (!search) return true;
        return (
            String(item.session_id).includes(search) ||
            item.date.toLowerCase().includes(search.toLowerCase())
        );
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f0f4fa] flex items-center justify-center">
                <div className="text-gray-500 text-lg">Loading Interview History...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f0f4fa]">
            {/* ================= HEADER ================= */}
            <header className="bg-white border-b border-gray-200/70">
                <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                            <Bot className="text-white" size={22} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                                Interview History
                            </h1>
                            <p className="text-sm text-gray-500">
                                View and manage your past AI interviews
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm transition"
                    >
                        <Plus size={16} />
                        New Interview
                    </button>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
                {/* ========== SUMMARY CARDS ========== */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                    {/* Total Interviews */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Briefcase size={20} className="text-blue-600" />
                            </div>
                            <p className="text-[13px] text-gray-500 font-medium">Total Interviews</p>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">{totalInterviews}</h2>
                        <p className="text-xs text-gray-400 mt-1">All time</p>
                    </div>

                    {/* Completed */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <CheckCircle2 size={20} className="text-emerald-600" />
                            </div>
                            <p className="text-[13px] text-gray-500 font-medium">Completed</p>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">{completed}</h2>
                        <p className="text-xs text-gray-400 mt-1">
                            {totalInterviews > 0
                                ? `${Math.round((completed / totalInterviews) * 100)}% completion rate`
                                : "0% completion rate"}
                        </p>
                    </div>

                    {/* Avg. Duration */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                <Clock3 size={20} className="text-amber-500" />
                            </div>
                            <p className="text-[13px] text-gray-500 font-medium">Avg. Duration</p>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">{avgDuration} sec</h2>
                        <p className="text-xs text-gray-400 mt-1">Average interview time</p>
                    </div>

                    {/* Best Score */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                                <Star size={20} className="text-violet-600" />
                            </div>
                            <p className="text-[13px] text-gray-500 font-medium">Best Score</p>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">{bestScore}</h2>
                        <p className="text-xs text-gray-400 mt-1">Your highest score</p>
                    </div>

                    {/* Latest Score */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                                <TrendingUp size={20} className="text-rose-500" />
                            </div>
                            <p className="text-[13px] text-gray-500 font-medium">Latest Score</p>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">{latestScore}</h2>
                        <p className="text-xs text-gray-400 mt-1">Most recent score</p>
                    </div>
                </div>

                {/* ========== SEARCH + FILTERS ========== */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                    <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
                        {/* Search */}
                        <div className="relative w-full lg:w-80">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                placeholder="Search interviews..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <button className="flex items-center gap-2 h-10 px-3.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
                                <Calendar size={15} />
                                All Dates
                                <span className="text-gray-400">▾</span>
                            </button>

                            <button className="flex items-center gap-2 h-10 px-3.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
                                <Filter size={15} />
                                All Status
                                <span className="text-gray-400">▾</span>
                            </button>

                            <button className="flex items-center gap-2 h-10 px-3.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition">
                                <ArrowUpDown size={15} />
                                Newest First
                                <span className="text-gray-400">▾</span>
                            </button>

                            <button
                                onClick={loadHistory}
                                className="h-10 w-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition"
                            >
                                <RefreshCw size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* ========== CONTENT ========== */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm min-h-[420px] flex flex-col">
                    {filtered.length === 0 ? (
                        /* Empty State */
                        <div className="flex-1 flex flex-col items-center justify-center py-16 px-6">
                            {/* Illustration */}
                            <div className="relative mb-6">
                                <div className="w-40 h-40 rounded-full bg-blue-50 flex items-center justify-center">
                                    <div className="w-28 h-28 rounded-2xl bg-blue-100 flex items-center justify-center">
                                        <FileText size={48} className="text-blue-500" />
                                    </div>
                                </div>
                                <div className="absolute -right-2 -bottom-1 w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
                                    <Search size={22} className="text-blue-600" />
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 mb-2">
                                No interviews found
                            </h2>
                            <p className="text-sm text-gray-500 text-center max-w-md mb-6">
                                You haven't taken any interviews yet. Start your first AI interview
                                to see your history and analytics here.
                            </p>

                            <button
                                onClick={() => navigate("/dashboard")}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm transition"
                            >
                                <Plus size={16} />
                                Start New Interview
                            </button>
                        </div>
                    ) : (
                        /* List of interviews */
                        <div className="divide-y divide-gray-100">
                            {filtered.map((item) => (
                                <div
                                    key={item.session_id}
                                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/70 transition"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                                            <FileText size={20} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                Session #{item.session_id}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(item.date).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">Score</p>
                                            <p className="font-bold text-blue-600">
                                                {item.overall_score.toFixed(1)}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() =>
                                                navigate(`/interview-analytics/${item.session_id}`)
                                            }
                                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
                                        >
                                            View Analytics
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ========== ABOUT CARD ========== */}
                <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                        <Info size={18} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                            About Interview History
                        </h3>
                        <p className="text-sm text-gray-600">
                            Your interview results, analytics, and recordings will appear here after
                            you complete an interview.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}