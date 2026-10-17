import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import {
    Bot,
    LayoutDashboard,
    History,
    Download,
    Award,          
} from "lucide-react";

import AnalyticsCards from "../../components/interview/AnalyticsCards";
import ScoreChart from "../../components/interview/ScoreChart";
import EyeContactChart from "../../components/interview/EyeContactChart";
import EmotionChart from "../../components/interview/EmotionChart";
import FillerChart from "../../components/interview/FillerChart";
import TranscriptHistory from "../../components/interview/TranscriptHistory";

export default function InterviewAnalytics() {
    const { sessionId } = useParams();
    const navigate = useNavigate();

    const [analytics, setAnalytics] = useState<Record<string, any> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function fetchWithRetry(retries = 3, delayMs = 1200): Promise<any> {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await api.get(`/interview-monitor/analytics/${sessionId}`);
                if (response.data) {
                    return response.data;
                }
            } catch (err: any) {
                if (i < retries - 1) {
                    await new Promise((res) => setTimeout(res, delayMs));
                } else {
                    throw err;
                }
            }
        }
        throw new Error("Analytics could not be loaded.");
    }

    async function loadAnalytics() {
        if (!sessionId) return;
        setLoading(true);
        setError(null);
        try {
            const data = await fetchWithRetry();
            setAnalytics(data);
        } catch (err: any) {
            console.error("Failed to load analytics:", err);
            setError(err?.response?.data?.detail || "Could not retrieve interview analytics.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadAnalytics();
    }, [sessionId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f0f4fa] flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center max-w-md w-full">
                    <div className="w-12 h-12 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Compiling Interview Analytics</h2>
                    <p className="text-sm text-gray-500">
                        Synthesizing fluency metrics, emotion detection, eye contact scores, and AI evaluations...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !analytics) {
        return (
            <div className="min-h-screen bg-[#f0f4fa] flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center max-w-md w-full">
                    <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                        <Bot size={24} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Analytics Still Finalizing</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        {error || "Your interview report is being processed by the AI pipeline."}
                    </p>
                    <div className="flex gap-3 w-full">
                        <button
                            onClick={() => loadAnalytics()}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition shadow-sm"
                        >
                            Retry
                        </button>
                        <button
                            onClick={() => navigate("/interview-history")}
                            className="flex-1 py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm transition"
                        >
                            History
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f0f4fa]">
            {/* ================= HEADER ================= */}
            <header className="bg-white border-b border-gray-200/70">
                <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                            <Bot className="text-white" size={22} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                                Interview Analytics
                            </h1>
                            <p className="text-sm text-gray-500">
                                Detailed AI-powered interview evaluation and insights
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* AI Feedback Button */}
                        <button
                            onClick={() => navigate(`/feedback/${sessionId}`)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium shadow-sm transition"
                        >
                            <Award size={16} />
                            AI Feedback
                        </button>

                        <button
                            onClick={() => navigate(`/progress/${sessionId}`)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium shadow-sm transition"
                        >
                            <LayoutDashboard size={16} />
                            Progress Dashboard
                        </button>

                        <button
                            onClick={() => navigate("/interview-history")}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm transition"
                        >
                            <History size={16} />
                            Interview History
                        </button>

                        <button
                            onClick={() =>
                                window.open(
                                    `${api.defaults.baseURL}/report/${sessionId}`,
                                    "_blank"
                                )
                            }
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-medium shadow-sm transition"
                        >
                            <Download size={16} />
                            Download PDF
                        </button>
                    </div>
                </div>
            </header>

            {/* ================= MAIN CONTENT ================= */}
            <main className="max-w-[1600px] mx-auto px-6 py-6">
                <AnalyticsCards
                    overallScore={analytics.overall_score}
                    recommendation={analytics.recommendation}
                    eyeContact={analytics.average_eye_contact}
                    fluency={analytics.average_fluency}
                    fillers={analytics.average_fillers}
                    emotion={analytics.average_emotion}
                />

                <div className="grid lg:grid-cols-2 gap-5 mt-6">
                    <ScoreChart data={analytics.timeline} />
                    <EyeContactChart data={analytics.timeline} />
                    <FillerChart data={analytics.timeline} />
                    <EmotionChart emotion={analytics.average_emotion} />
                </div>

                <div className="mt-6">
                    <TranscriptHistory
                        transcripts={
                            analytics.timeline?.map(
                                (item: any) => item.transcript ?? ""
                            ) ?? []
                        }
                    />
                </div>
            </main>
        </div>
    );
}