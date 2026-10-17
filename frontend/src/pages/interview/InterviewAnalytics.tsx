import { useEffect, useState } from "react";
import axios from "axios";
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
    const token = localStorage.getItem("token");

    const [analytics, setAnalytics] = useState<any>(null);

    useEffect(() => {
        loadAnalytics();
    }, []);

    async function loadAnalytics() {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/v1/interview-monitor/analytics/${sessionId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setAnalytics(response.data);
        } catch (err) {
            console.error(err);
        }
    }

    if (!analytics) {
        return (
            <div className="min-h-screen bg-[#f0f4fa] flex items-center justify-center">
                <div className="text-gray-500 text-lg">Loading analytics...</div>
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
                                    `http://127.0.0.1:8000/api/v1/report/${sessionId}`,
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