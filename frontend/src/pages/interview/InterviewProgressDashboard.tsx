import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    BarChart,
    Bar,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import {
    Award,
    Eye,
    Mic,
    MessageSquare,
    Smile,
    Trophy,
    Camera,
    TrendingUp,
    TrendingDown,
    Clock3,
    LayoutDashboard,
} from "lucide-react";

interface Snapshot {
    id: number;
    second: number;
    emotion: string;
    eye_contact_score: number;
    fluency_score: number;
    filler_count: number;
    overall_score: number;
}

export default function ProgressDashboard() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [history, setHistory] = useState<Snapshot[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const base =
                import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/v1";
            const response = await axios.get(
                `${base}/monitor-history/${sessionId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setHistory(response.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f0f4fa] flex items-center justify-center">
                <div className="text-gray-500 text-lg">Loading Progress Dashboard...</div>
            </div>
        );
    }

    // Averages & stats
    const averageScore =
        history.length > 0
            ? (history.reduce((sum, item) => sum + item.overall_score, 0) / history.length).toFixed(1)
            : "0";

    const averageEye =
        history.length > 0
            ? (history.reduce((sum, item) => sum + item.eye_contact_score, 0) / history.length).toFixed(1)
            : "0";

    const averageFluency =
        history.length > 0
            ? (history.reduce((sum, item) => sum + item.fluency_score, 0) / history.length).toFixed(1)
            : "0";

    const totalFillers = history.reduce((sum, item) => sum + item.filler_count, 0);

    const highestScore = history.length
        ? Math.max(...history.map((item) => item.overall_score)).toFixed(2)
        : "0";

    const lowestScore = history.length
        ? Math.min(...history.map((item) => item.overall_score)).toFixed(2)
        : "0";

    const duration = history.length ? history[history.length - 1].second : 0;

    // Emotion distribution for pie
    const emotionCount: Record<string, number> = {};
    history.forEach((item) => {
        const e = item.emotion || "Unknown";
        emotionCount[e] = (emotionCount[e] || 0) + 1;
    });
    const emotionData = Object.entries(emotionCount).map(([name, value]) => ({
        name,
        value,
    }));

    const EMOTION_COLORS = ["#64748b", "#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

    return (
        <div className="min-h-screen bg-[#f0f4fa]">
            {/* ================= HEADER ================= */}
            <header className="bg-white border-b border-gray-200/70">
                <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                            <LayoutDashboard className="text-white" size={22} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                                Interview Progress Dashboard
                            </h1>
                            <p className="text-sm text-gray-500">
                                Real-time overview of your interview performance
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition shadow-sm"
                    >
                        ← Back
                    </button>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto px-6 py-6 space-y-6">
                {/* ========== TOP METRIC CARDS ========== */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                    {/* Overall Score */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-2.5 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Award size={18} className="text-blue-600" />
                            </div>
                            <p className="text-[13px] text-gray-500 font-medium">Overall Score</p>
                        </div>
                        <h2 className="text-2xl font-bold text-blue-600 mb-2">
                            {averageScore}<span className="text-base text-gray-400">/100</span>
                        </h2>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${averageScore}%` }}
                            />
                        </div>
                        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            Good
                        </span>
                    </div>

                    {/* Eye Contact */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-2.5 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <Eye size={18} className="text-emerald-600" />
                            </div>
                            <p className="text-[13px] text-gray-500 font-medium">Eye Contact</p>
                        </div>
                        <h2 className="text-2xl font-bold text-emerald-600 mb-2">
                            {averageEye}%
                        </h2>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${averageEye}%` }}
                            />
                        </div>
                        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
                            Excellent
                        </span>
                    </div>

                    {/* Fluency */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-2.5 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center">
                                <Mic size={18} className="text-violet-600" />
                            </div>
                            <p className="text-[13px] text-gray-500 font-medium">Fluency</p>
                        </div>
                        <h2 className="text-2xl font-bold text-violet-600 mb-2">
                            {averageFluency}<span className="text-base text-gray-400">/100</span>
                        </h2>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-2">
                            <div
                                className="h-full bg-violet-500 rounded-full"
                                style={{ width: `${averageFluency}%` }}
                            />
                        </div>
                        <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            Good
                        </span>
                    </div>

                    {/* Fillers */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-2.5 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                                <MessageSquare size={20} className="text-orange-500" />
                            </div>
                            <p className="text-[13px] text-gray-500 font-medium">Fillers (Avg/min)</p>
                        </div>
                        <h2 className="text-2xl font-bold text-orange-500 mb-3">
                            {(totalFillers / Math.max(history.length, 1)).toFixed(2)}
                        </h2>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                            <div
                                className="h-full bg-orange-400 rounded-full"
                                style={{ width: `${Math.min((totalFillers / Math.max(history.length, 1)) * 25, 100)}%` }}
                            />
                        </div>
                        <span className="self-start text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            Good
                        </span>
                    </div>

                    {/* Emotion */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-2.5 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
                                <Smile size={20} className="text-rose-500" />
                            </div>
                            <p className="text-[13px] text-gray-500 font-medium">Emotion</p>
                        </div>
                        <h2 className="text-2xl font-bold text-rose-500 mb-3 capitalize">
                            {history.length > 0 ? history[history.length - 1].emotion : "--"}
                        </h2>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                            <div className="h-full bg-rose-400 rounded-full" style={{ width: "40%" }} />
                        </div>
                        <span className="self-start text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-red-100 text-red-700">
                            Needs Improvement
                        </span>
                    </div>

                    {/* Recommendation */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-2.5 mb-3">
                            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                                <Trophy size={20} className="text-amber-500" />
                            </div>
                            <p className="text-[13px] text-gray-500 font-medium">Recommendation</p>
                        </div>
                        <h2 className="text-2xl font-bold text-green-600 mb-3">
                            Excellent
                        </h2>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden mb-3">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: "90%" }} />
                        </div>
                        <span className="self-start text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
                            Excellent
                        </span>
                    </div>
                </div>

                {/* ========== CHARTS ========== */}
                <div className="grid lg:grid-cols-2 gap-5 mt-6">
                    {/* Overall Score Trend */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <TrendingUp size={16} className="text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-[15px] font-semibold text-gray-900">Overall Score Trend</h2>
                                    <p className="text-[12px] text-gray-500">Your overall score trend throughout the interview</p>
                                </div>
                            </div>
                            <span className="text-[12px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border">Line Chart</span>
                        </div>
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="second" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="overall_score" name="Overall Score" stroke="#2563eb" strokeWidth={2.5} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Eye Contact Trend */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                                    <Eye size={16} className="text-emerald-600" />
                                </div>
                                <div>
                                    <h2 className="text-[15px] font-semibold text-gray-900">Eye Contact Trend</h2>
                                    <p className="text-[12px] text-gray-500">Your eye contact percentage over time</p>
                                </div>
                            </div>
                            <span className="text-[12px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border">Area Chart</span>
                        </div>
                        <ResponsiveContainer width="100%" height={240}>
                            <AreaChart data={history}>
                                <defs>
                                    <linearGradient id="eyeGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="second" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Area type="monotone" dataKey="eye_contact_score" name="Eye Contact" stroke="#16a34a" strokeWidth={2} fill="url(#eyeGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Second row of charts */}
                <div className="grid lg:grid-cols-3 gap-5 mt-5">
                    {/* Fluency Trend */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                                    <Mic size={16} className="text-violet-600" />
                                </div>
                                <div>
                                    <h2 className="text-[15px] font-semibold text-gray-900">Fluency Trend</h2>
                                    <p className="text-[12px] text-gray-500">Your fluency score over time</p>
                                </div>
                            </div>
                            <span className="text-[12px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border">Line Chart</span>
                        </div>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="second" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="fluency_score" name="Fluency" stroke="#9333ea" strokeWidth={2.5} dot={{ r: 3 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Filler Words Trend */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                                    <MessageSquare size={16} className="text-orange-500" />
                                </div>
                                <div>
                                    <h2 className="text-[15px] font-semibold text-gray-900">Filler Words Trend</h2>
                                    <p className="text-[12px] text-gray-500">Average filler words per minute</p>
                                </div>
                            </div>
                            <span className="text-[12px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border">Bar Chart</span>
                        </div>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={history}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                <XAxis dataKey="second" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Bar dataKey="filler_count" name="Filler Words" fill="#f97316" radius={[6, 6, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Dominant Emotion */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                                    <Smile size={16} className="text-rose-500" />
                                </div>
                                <div>
                                    <h2 className="text-[15px] font-semibold text-gray-900">Dominant Emotion</h2>
                                    <p className="text-[12px] text-gray-500">Emotion distribution during interview</p>
                                </div>
                            </div>
                            <span className="text-[12px] text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border">Pie Chart</span>
                        </div>
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={emotionData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={55}
                                    outerRadius={80}
                                    stroke="none"
                                >
                                    {emotionData.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={EMOTION_COLORS[index % EMOTION_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Emotion Timeline Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mt-5">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                            <Smile size={16} className="text-rose-500" />
                        </div>
                        <div>
                            <h2 className="text-[15px] font-semibold text-gray-900">Emotion Timeline</h2>
                            <p className="text-[12px] text-gray-500">Your emotions detected at different time intervals</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-rose-50 text-gray-700">
                                    <th className="text-left py-3 px-4 font-semibold rounded-tl-lg">Time (sec)</th>
                                    <th className="text-left py-3 px-4 font-semibold">Emotion</th>
                                    <th className="text-left py-3 px-4 font-semibold">Score</th>
                                    <th className="text-left py-3 px-4 font-semibold rounded-tr-lg">Eye Contact</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                        <td className="py-3 px-4 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                                            {item.second}
                                        </td>
                                        <td className="py-3 px-4 capitalize">{item.emotion}</td>
                                        <td className="py-3 px-4">{item.overall_score.toFixed(2)}</td>
                                        <td className="py-3 px-4">{item.eye_contact_score.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Interview Statistics */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mt-5">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                            <LayoutDashboard size={16} className="text-blue-600" />
                        </div>
                        <h2 className="text-[15px] font-semibold text-gray-900">
                            Interview Statistics
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Camera size={22} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Snapshots</p>
                                <h3 className="text-2xl font-bold text-gray-900">{history.length}</h3>
                                <p className="text-xs text-gray-400">Total captured snapshots</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                                <TrendingUp size={22} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Highest Score</p>
                                <h3 className="text-2xl font-bold text-green-600">{highestScore}</h3>
                                <p className="text-xs text-gray-400">Your best performance</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
                                <TrendingDown size={22} className="text-red-500" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Lowest Score</p>
                                <h3 className="text-2xl font-bold text-red-500">{lowestScore}</h3>
                                <p className="text-xs text-gray-400">Lowest performance</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Clock3 size={22} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Interview Duration</p>
                                <h3 className="text-2xl font-bold text-gray-900">{duration.toFixed(2)} sec</h3>
                                <p className="text-xs text-gray-400">Total interview time</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}