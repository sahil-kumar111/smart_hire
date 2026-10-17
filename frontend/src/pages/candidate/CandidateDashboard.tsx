import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../api/axios";
import toast from "react-hot-toast";
import {
    Briefcase,
    LogOut,
    Trash2,
    Calendar,
    FileText,
    CheckCircle2,
    PieChart,
    Star,
    Clock3,
    XCircle,
    Trophy,
    Eye,
    Download,
    Award,
    ArrowRight,
} from "lucide-react";

import ResumeUpload from "../../components/resume/ResumeUpload";
import ResumeList from "../../components/resume/ResumeList";
import {
    saveJobDescription,
    getJobDescription,
    matchResume,
} from "../../services/jdService";
import { getResumes } from "../../services/resumeService";
import { deleteAccount } from "../../services/authService";
import { type CandidateInterview } from "../../services/shortlistService";

export default function Dashboard() {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();

    const [refreshKey, setRefreshKey] = useState(0);
    const [interviews, setInterviews] = useState<CandidateInterview[]>([]);

    const [stats, setStats] = useState({
        totalResumes: 0,
        resumesAnalyzed: 0,
        interviewsTaken: 0,
        avgScore: 0,
    });

    const [jdText, setJdText] = useState("");
    const [savedJd, setSavedJd] = useState("");
    const [savingJd, setSavingJd] = useState(false);

    const [matchResult, setMatchResult] = useState<any>(null);
    const [matching, setMatching] = useState(false);

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
        document.title = "Candidate Dashboard | SmartHire AI";
    }, []);

    useEffect(() => {
        async function loadJd() {
            if (!token) return;
            try {
                const data = await getJobDescription(token);
                if (data?.jd_text) {
                    setJdText(data.jd_text);
                    setSavedJd(data.jd_text);
                }
            } catch {
                // no JD yet
            }
        }
        loadJd();
    }, [token]);

    useEffect(() => {
        async function loadStats() {
            if (!token) return;
            try {
                const resumes = await getResumes(token);

                let history: CandidateInterview[] = [];
                try {
                    const res = await api.get(
                        "/candidate/interviews",
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    history = Array.isArray(res.data) ? res.data : [];
                } catch {
                    const historyRes = await api.get(
                        "/interview-monitor/history",
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    history = Array.isArray(historyRes.data) ? historyRes.data : [];
                }
                setInterviews(history);

                const totalResumes = resumes?.length || 0;
                const interviewsTaken = history.length;

                let avgScore = 0;
                if (interviewsTaken > 0) {
                    const total = history.reduce(
                        (sum: number, item: any) =>
                            sum + (Number(item.overall_score) || 0),
                        0
                    );
                    avgScore = total / interviewsTaken;
                }

                setStats({
                    totalResumes,
                    resumesAnalyzed: totalResumes,
                    interviewsTaken,
                    avgScore: Number(avgScore.toFixed(1)),
                });
            } catch (err) {
                console.error(err);
            }
        }
        loadStats();
    }, [token, refreshKey]);

    async function handleSaveJd() {
        if (!jdText.trim() || !token) return;
        try {
            setSavingJd(true);
            await saveJobDescription(jdText.trim(), token);
            setSavedJd(jdText.trim());
            toast.success("Job Description saved!");
        } catch {
            toast.error("Failed to save Job Description");
        } finally {
            setSavingJd(false);
        }
    }

    async function handleMatch(resumeId: number) {
        if (!token) return;
        if (!savedJd) {
            toast.error("Please save a Job Description first");
            return;
        }
        try {
            setMatching(true);
            const result = await matchResume(resumeId, token);
            setMatchResult(result);
            toast.success("Match completed!");
        } catch (err: any) {
            toast.error(err?.response?.data?.detail || "Match failed");
        } finally {
            setMatching(false);
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
                            <p className="text-sm text-gray-500">
                                Resume Management Portal
                            </p>
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
                    <span className="inline-block mt-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-blue-100">
                        {user?.role?.toUpperCase() || "CANDIDATE"}
                    </span>
                </div>

                {interviews.some(
                    (i) => (i.selection_status || i.status) === "selected" || (i.selection_status || i.status) === "shortlisted"
                ) && (
                    <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 text-white shadow-md border border-emerald-400/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                                <Trophy size={26} className="text-white" />
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-lg font-bold">
                                        Congratulations! You have been Selected 🎉
                                    </h3>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white text-emerald-800 shadow-xs">
                                        Recruiter Status: Selected
                                    </span>
                                </div>
                                <p className="text-sm text-emerald-50 mt-1">
                                    The recruiter has reviewed your interview and marked you as <strong>Selected</strong>! Check the details in your applications table below.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => {
                                    const selected = interviews.find(
                                        (i) => (i.selection_status || i.status) === "selected" || (i.selection_status || i.status) === "shortlisted"
                                    );
                                    if (selected) {
                                        navigate(`/interview-analytics/${selected.session_id}`);
                                    }
                                }}
                                className="px-4 py-2 rounded-xl bg-white text-emerald-800 font-semibold text-xs hover:bg-emerald-50 transition shadow-sm"
                            >
                                View Analytics
                            </button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <FileText size={20} className="text-blue-600" />
                            </div>
                            <p className="text-[13px] text-gray-500 font-medium">
                                Total Resumes
                            </p>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {stats.totalResumes}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Uploaded</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <CheckCircle2 size={20} className="text-emerald-600" />
                            </div>
                            <p className="text-[13px] text-gray-500 font-medium">
                                Resumes Analyzed
                            </p>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {stats.resumesAnalyzed}
                        </h3>
                        <p className="text-xs text-emerald-600 mt-1 font-medium">
                            {stats.totalResumes > 0
                                ? `${Math.round(
                                    (stats.resumesAnalyzed / stats.totalResumes) * 100
                                )}% analyzed`
                                : "0% analyzed"}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                                <PieChart size={20} className="text-violet-600" />
                            </div>
                            <p className="text-[13px] text-gray-500 font-medium">
                                Interviews Taken
                            </p>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {stats.interviewsTaken}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Completed</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                <Star size={20} className="text-amber-500" />
                            </div>
                            <p className="text-[13px] text-gray-500 font-medium">
                                Avg. Score
                            </p>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {stats.avgScore.toFixed(1)}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Overall average</p>
                    </div>
                </div>

                {/* ================= INTERVIEW APPLICATIONS & RECRUITER STATUS ================= */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                <Award size={20} />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    My Interview Applications & Results
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Live recruiter status and AI evaluation reports for your interviews
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => navigate("/interview-history")}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
                            >
                                Full History <ArrowRight size={13} />
                            </button>
                        </div>
                    </div>

                    {interviews.length === 0 ? (
                        <div className="text-center py-10 px-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                                <Briefcase size={22} />
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm">
                                No interviews taken yet
                            </h3>
                            <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 mb-4">
                                Once you complete an AI interview, your results and recruiter decision (Pending, Selected, or Rejected) will appear here live.
                            </p>
                            <button
                                onClick={() => {
                                    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
                                }}
                                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition shadow-sm"
                            >
                                Upload Resume to Start
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-400 text-xs font-medium border-b border-gray-100">
                                        <th className="pb-3">Interview Session</th>
                                        <th className="pb-3">Date Completed</th>
                                        <th className="pb-3">AI Score</th>
                                        <th className="pb-3">Recruiter Decision</th>
                                        <th className="pb-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {interviews.map((item) => {
                                        const rawStatus = (item.selection_status || item.status || "pending").toLowerCase();
                                        const isSelected = rawStatus === "selected" || rawStatus === "shortlisted";
                                        const isRejected = rawStatus === "rejected";
                                        const isPending = !isSelected && !isRejected;
                                        const score = Number(item.overall_score) || 0;

                                        return (
                                            <tr
                                                key={item.session_id}
                                                className={`hover:bg-gray-50/60 transition ${
                                                    isSelected ? "bg-emerald-50/30" : ""
                                                }`}
                                            >
                                                <td className="py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-gray-900">
                                                            Session #{item.session_id}
                                                        </span>
                                                        <span className="text-[11px] uppercase font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                                                            {item.interview_type || "Technical"}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="py-4 text-gray-600 text-xs">
                                                    {item.date
                                                        ? new Date(item.date).toLocaleString("en-IN", {
                                                              day: "2-digit",
                                                              month: "short",
                                                              year: "numeric",
                                                              hour: "2-digit",
                                                              minute: "2-digit",
                                                          })
                                                        : "—"}
                                                </td>

                                                <td className="py-4">
                                                    <span
                                                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${
                                                            score >= 80
                                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                                                : score >= 60
                                                                  ? "bg-amber-50 text-amber-700 border border-amber-100"
                                                                  : "bg-red-50 text-red-600 border border-red-100"
                                                        }`}
                                                    >
                                                        {score.toFixed(1)} / 100
                                                    </span>
                                                </td>

                                                <td className="py-4">
                                                    {isSelected && (
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-xs w-fit">
                                                                <CheckCircle2 size={13} className="text-emerald-600" />
                                                                Selected
                                                            </span>
                                                            <span className="text-[11px] text-emerald-700 font-medium">
                                                                Recruiter marked you as Selected 🎉
                                                            </span>
                                                        </div>
                                                    )}
                                                    {isPending && (
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 w-fit">
                                                                <Clock3 size={13} className="text-amber-600" />
                                                                Pending Review
                                                            </span>
                                                            <span className="text-[11px] text-gray-400">
                                                                Under recruiter evaluation
                                                            </span>
                                                        </div>
                                                    )}
                                                    {isRejected && (
                                                        <div className="flex flex-col gap-0.5">
                                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 w-fit">
                                                                <XCircle size={13} className="text-red-500" />
                                                                Not Selected
                                                            </span>
                                                            <span className="text-[11px] text-gray-400">
                                                                Decision finalized
                                                            </span>
                                                        </div>
                                                    )}
                                                </td>

                                                <td className="py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() =>
                                                                navigate(`/interview-analytics/${item.session_id}`)
                                                            }
                                                            className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition"
                                                        >
                                                            <Eye size={12} />
                                                            Analytics
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                navigate(`/feedback/${item.session_id}`)
                                                            }
                                                            className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-700 text-xs font-medium hover:bg-amber-100 transition"
                                                        >
                                                            <Award size={12} />
                                                            Feedback
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                window.open(
                                                                    `${api.defaults.baseURL}/report/${item.session_id}`,
                                                                    "_blank"
                                                                )
                                                            }
                                                            className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 text-xs font-medium transition"
                                                            title="Download PDF Report"
                                                        >
                                                            <Download size={12} />
                                                        </button>
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

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                            <FileText size={20} className="text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Job Description
                            </h2>
                            <p className="text-sm text-gray-500">
                                Paste the JD to enable Resume Match and personalized interviews
                            </p>
                        </div>
                    </div>

                    <textarea
                        value={jdText}
                        onChange={(e) => setJdText(e.target.value)}
                        placeholder="Paste the full Job Description here..."
                        rows={6}
                        className="w-full rounded-xl border border-gray-200 p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition resize-y"
                    />

                    <div className="mt-4 flex items-center gap-3">
                        <button
                            onClick={handleSaveJd}
                            disabled={savingJd || !jdText.trim()}
                            className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white text-sm font-medium transition"
                        >
                            {savingJd ? "Saving..." : "Save Job Description"}
                        </button>
                        {savedJd && (
                            <span className="text-sm text-emerald-600 font-medium">
                                ✓ JD saved
                            </span>
                        )}
                    </div>
                </div>

                {matchResult && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <CheckCircle2 size={20} className="text-emerald-600" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Resume ↔ Job Description Match
                                </h2>
                                <p className="text-sm text-gray-500">
                                    AI-powered match analysis
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-5 mb-5">
                            <div className="text-5xl font-bold text-emerald-600">
                                {matchResult.match_score}%
                            </div>
                            <div className="flex-1">
                                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-emerald-500 rounded-full transition-all"
                                        style={{
                                            width: `${matchResult.match_score}%`,
                                        }}
                                    />
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    {matchResult.summary}
                                </p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div>
                                <h4 className="text-sm font-semibold text-emerald-700 mb-2">
                                    Matching Skills
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {matchResult.matching_skills?.map((s: string) => (
                                        <span
                                            key={s}
                                            className="px-2.5 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700 border border-emerald-100"
                                        >
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-red-600 mb-2">
                                    Missing Skills
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {matchResult.missing_skills?.map((s: string) => (
                                        <span
                                            key={s}
                                            className="px-2.5 py-1 rounded-full text-xs bg-red-50 text-red-600 border border-red-100"
                                        >
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <ResumeUpload onUploadSuccess={() => setRefreshKey((k) => k + 1)} />

                <div className="mt-6" key={refreshKey}>
                    <ResumeList
                        hasJd={!!savedJd}
                        onMatch={handleMatch}
                        matching={matching}
                    />
                </div>

                <footer className="mt-12 text-center text-gray-400 text-sm">
                    © 2026 SmartHire AI • Candidate Portal
                </footer>
            </main>
        </div>
    );
}