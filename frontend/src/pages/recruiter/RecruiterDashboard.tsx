import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { getShortlist, updateShortlist } from "../../services/shortlistService";
import { deleteAccount } from "../../services/authService";
import axios from "axios";
import {
    Briefcase,
    LogOut,
    Trash2,
    Users,
    BarChart3,
    Search,
    Star,
    Calendar,
    Eye,
    Download,
    Filter,
    CheckCircle2,
    XCircle,
    Clock3,
} from "lucide-react";

type HistoryItem = {
    session_id: number;
    overall_score: number;
    date: string;
    candidate_name?: string;
};

type ShortlistStatus = "pending" | "shortlisted" | "rejected";

export default function RecruiterDashboard() {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();

    const [sessions, setSessions] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [scoreFilter, setScoreFilter] = useState<"all" | "high" | "medium" | "low">("all");
    const [statusMap, setStatusMap] = useState<Record<number, ShortlistStatus>>({});

    const [currentTime, setCurrentTime] = useState(
        new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        })
    );

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(
                new Date().toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                })
            );
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        loadSessions();
        loadShortlist();
    }, []);

    async function loadSessions() {
        if (!token) return;
        try {
            const res = await axios.get(
                "http://127.0.0.1:8000/api/v1/interview-monitor/history",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setSessions(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            setSessions([]);
        } finally {
            setLoading(false);
        }
    }

    async function loadShortlist() {
        if (!token) return;
        try {
            const rows = await getShortlist(token);
            const map: Record<number, ShortlistStatus> = {};
            rows.forEach((r) => {
                map[r.session_id] = r.status as ShortlistStatus;
            });
            setStatusMap(map);
        } catch (err) {
            console.error(err);
        }
    }

    async function updateStatus(sessionId: number, status: ShortlistStatus) {
        if (!token) return;
        try {
            await updateShortlist(sessionId, status, token);
            setStatusMap((prev) => ({
                ...prev,
                [sessionId]: status,
            }));
        } catch (err) {
            console.error(err);
            alert("Failed to update shortlist status");
        }
    }

    async function handleDeleteAccount() {
        const ok = window.confirm(
            "Are you sure you want to permanently delete your account and all related data? This cannot be undone."
        );
        if (!ok || !token) return;

        try {
            await deleteAccount(token);
            logout();
            navigate("/register");
        } catch (err) {
            console.error(err);
            alert("Failed to delete account. Please try again.");
        }
    }

    const filtered = sessions.filter((s) => {
        const score = Number(s.overall_score) || 0;

        if (scoreFilter === "high" && score < 80) return false;
        if (scoreFilter === "medium" && (score < 60 || score >= 80)) return false;
        if (scoreFilter === "low" && score >= 60) return false;

        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
            String(s.session_id).includes(q) ||
            (s.candidate_name || "").toLowerCase().includes(q)
        );
    });

    const avgScore =
        sessions.length > 0
            ? sessions.reduce((sum, s) => sum + (Number(s.overall_score) || 0), 0) /
              sessions.length
            : 0;

    const shortlistedCount = Object.values(statusMap).filter(
        (s) => s === "shortlisted"
    ).length;

    const highPerformers = sessions.filter(
        (s) => Number(s.overall_score) >= 80
    ).length;

    function statusBadge(status: ShortlistStatus) {
        if (status === "shortlisted") {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <CheckCircle2 size={12} />
                    Shortlisted
                </span>
            );
        }
        if (status === "rejected") {
            return (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100">
                    <XCircle size={12} />
                    Rejected
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200">
                <Clock3 size={12} />
                Pending
            </span>
        );
    }

    return (
        <div className="min-h-screen bg-[#f0f4fa]">
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                            <Briefcase className="text-white" size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                                SmartHire AI
                            </h1>
                            <p className="text-sm text-gray-500">Recruiter Portal</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDeleteAccount}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition"
                        >
                            <Trash2 size={16} />
                            Delete Account
                        </button>

                        <button
                            onClick={() => {
                                logout();
                                navigate("/login");
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium shadow-sm transition"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar size={15} />
                    <span>{currentTime}</span>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Welcome back, {user?.full_name} 👋
                    </h2>
                    <span className="inline-block mt-2 bg-violet-50 text-violet-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-violet-100">
                        RECRUITER
                    </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Users size={20} className="text-blue-600" />
                            </div>
                            <p className="text-[13px] text-gray-500 font-medium">
                                Interviews
                            </p>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {sessions.length}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Total sessions</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <Star size={20} className="text-emerald-600" />
                            </div>
                            <p className="text-[13px] text-gray-500 font-medium">
                                Avg. Score
                            </p>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {avgScore.toFixed(1)}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Overall average</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                <BarChart3 size={20} className="text-amber-500" />
                            </div>
                            <p className="text-[13px] text-gray-500 font-medium">
                                High Performers
                            </p>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {highPerformers}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Score ≥ 80</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                                <CheckCircle2 size={20} className="text-violet-600" />
                            </div>
                            <p className="text-[13px] text-gray-500 font-medium">
                                Shortlisted
                            </p>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {shortlistedCount}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Marked by you</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Candidate Interviews
                            </h2>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Review, shortlist and download evaluation reports
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            <div className="flex items-center gap-2">
                                <Filter size={15} className="text-gray-400" />
                                <select
                                    value={scoreFilter}
                                    onChange={(e) =>
                                        setScoreFilter(
                                            e.target.value as
                                                | "all"
                                                | "high"
                                                | "medium"
                                                | "low"
                                        )
                                    }
                                    className="h-10 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 bg-white"
                                >
                                    <option value="all">All scores</option>
                                    <option value="high">High (≥ 80)</option>
                                    <option value="medium">Medium (60–79)</option>
                                    <option value="low">Low (&lt; 60)</option>
                                </select>
                            </div>

                            <div className="relative w-full sm:w-64">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search session ID..."
                                    className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                                />
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-12 text-gray-500">
                            Loading sessions...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                                <Users size={24} className="text-blue-500" />
                            </div>
                            <h3 className="font-semibold text-gray-900">
                                No interviews found
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Try changing filters or wait for candidates to complete interviews.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-500 border-b border-gray-100">
                                        <th className="pb-3 font-medium">Session</th>
                                        <th className="pb-3 font-medium">Date</th>
                                        <th className="pb-3 font-medium">Score</th>
                                        <th className="pb-3 font-medium">Status</th>
                                        <th className="pb-3 font-medium text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((item) => {
                                        const status =
                                            statusMap[item.session_id] || "pending";
                                        const score = Number(item.overall_score) || 0;

                                        return (
                                            <tr
                                                key={item.session_id}
                                                className="border-b border-gray-50 hover:bg-gray-50/50"
                                            >
                                                <td className="py-4 font-semibold text-gray-900">
                                                    #{item.session_id}
                                                </td>
                                                <td className="py-4 text-gray-600">
                                                    {item.date
                                                        ? new Date(item.date).toLocaleString(
                                                              "en-IN"
                                                          )
                                                        : "—"}
                                                </td>
                                                <td className="py-4">
                                                    <span
                                                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                            score >= 80
                                                                ? "bg-emerald-50 text-emerald-700"
                                                                : score >= 60
                                                                  ? "bg-amber-50 text-amber-700"
                                                                  : "bg-red-50 text-red-600"
                                                        }`}
                                                    >
                                                        {score.toFixed(1)}
                                                    </span>
                                                </td>
                                                <td className="py-4">
                                                    {statusBadge(status)}
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex flex-wrap items-center justify-end gap-2">
                                                        <button
                                                            onClick={() =>
                                                                navigate(
                                                                    `/interview-analytics/${item.session_id}`
                                                                )
                                                            }
                                                            className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition"
                                                        >
                                                            <Eye size={13} />
                                                            Analytics
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                window.open(
                                                                    `http://127.0.0.1:8000/api/v1/report/${item.session_id}`,
                                                                    "_blank"
                                                                )
                                                            }
                                                            className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100 transition"
                                                        >
                                                            <Download size={13} />
                                                            PDF
                                                        </button>

                                                        <select
                                                            value={status}
                                                            onChange={(e) =>
                                                                updateStatus(
                                                                    item.session_id,
                                                                    e.target.value as ShortlistStatus
                                                                )
                                                            }
                                                            className="h-9 rounded-xl border border-gray-200 px-2 text-xs outline-none bg-white"
                                                        >
                                                            <option value="pending">Pending</option>
                                                            <option value="shortlisted">
                                                                Shortlist
                                                            </option>
                                                            <option value="rejected">Reject</option>
                                                        </select>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <footer className="mt-12 text-center text-gray-400 text-sm">
                    © 2026 SmartHire AI • Recruiter Portal
                </footer>
            </main>
        </div>
    );
}