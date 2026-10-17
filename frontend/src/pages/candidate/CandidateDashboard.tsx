import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
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

export default function Dashboard() {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();

    const [refreshKey, setRefreshKey] = useState(0);

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

                const historyRes = await axios.get(
                    "http://127.0.0.1:8000/api/v1/interview-monitor/history",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const history = historyRes.data || [];

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