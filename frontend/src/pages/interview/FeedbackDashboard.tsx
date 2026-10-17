import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Bot,
    ArrowLeft,
    Award,
    Eye,
    Mic,
    MessageSquare,
    Smile,
    CheckCircle2,
    AlertTriangle,
    Lightbulb,
    FileText,
    LayoutDashboard,
} from "lucide-react";

type FeedbackData = {
    overall_score: number;
    recommendation: string;
    transcript: string;
    word_count: number;
    fluency_score: number;
    filler_count: number;
    dominant_emotion: string;
    eye_contact_score: number;
    feedback: {
        summary: string;
        strengths: string[];
        weaknesses: string[];
        suggestions: string[];
    };
};

export default function FeedbackDashboard() {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [data, setData] = useState<FeedbackData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadFeedback();
    }, []);

    const loadFeedback = async () => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/v1/feedback/${sessionId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setData(response.data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f0f4fa] flex items-center justify-center">
                <div className="text-gray-500 text-lg">Loading feedback...</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-[#f0f4fa] flex items-center justify-center">
                <div className="text-gray-500 text-lg">
                    Failed to load feedback.
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f0f4fa]">
            {/* Header */}
            <header className="bg-white border-b border-gray-200/70">
                <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                            <Bot className="text-white" size={22} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                AI Feedback Dashboard
                            </h1>
                            <p className="text-sm text-gray-500">
                                Personalized insights from your interview
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(`/progress/${sessionId}`)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-sm transition"
                        >
                            <LayoutDashboard size={16} />
                            Progress Dashboard
                        </button>

                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-[1400px] mx-auto px-6 py-6 space-y-6">
                {/* Overall Score Card */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Award size={20} className="text-blue-600" />
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Overall Score
                                </h2>
                            </div>
                            <p className="text-gray-600 max-w-2xl">
                                {data.feedback.summary}
                            </p>
                            <div className="mt-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                    {data.recommendation}
                                </span>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="text-6xl font-bold text-blue-600">
                                {data.overall_score}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                out of 100
                            </p>
                        </div>
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <Mic size={16} className="text-violet-600" />
                            <p className="text-sm text-gray-500">Fluency</p>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {data.fluency_score}
                        </h3>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <Eye size={16} className="text-emerald-600" />
                            <p className="text-sm text-gray-500">Eye Contact</p>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {data.eye_contact_score}
                        </h3>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <MessageSquare size={16} className="text-orange-500" />
                            <p className="text-sm text-gray-500">Filler Words</p>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">
                            {data.filler_count}
                        </h3>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <Smile size={16} className="text-rose-500" />
                            <p className="text-sm text-gray-500">Emotion</p>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 capitalize">
                            {data.dominant_emotion}
                        </h3>
                    </div>
                </div>

                {/* Strengths / Weaknesses / Suggestions */}
                <div className="grid md:grid-cols-3 gap-5">
                    {/* Strengths */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <CheckCircle2 size={18} className="text-emerald-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Strengths
                            </h2>
                        </div>
                        <ul className="space-y-3">
                            {data.feedback.strengths.map((item, index) => (
                                <li
                                    key={index}
                                    className="flex gap-2 text-sm text-gray-700"
                                >
                                    <span className="text-emerald-500 mt-1">●</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Weaknesses */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
                                <AlertTriangle size={18} className="text-red-500" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Areas to Improve
                            </h2>
                        </div>
                        <ul className="space-y-3">
                            {data.feedback.weaknesses.map((item, index) => (
                                <li
                                    key={index}
                                    className="flex gap-2 text-sm text-gray-700"
                                >
                                    <span className="text-red-400 mt-1">●</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Suggestions */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                                <Lightbulb size={18} className="text-amber-500" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Suggestions
                            </h2>
                        </div>
                        <ul className="space-y-3">
                            {data.feedback.suggestions.map((item, index) => (
                                <li
                                    key={index}
                                    className="flex gap-2 text-sm text-gray-700"
                                >
                                    <span className="text-amber-500 mt-1">●</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Transcript */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                            <FileText size={18} className="text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Full Transcript
                            </h2>
                            <p className="text-sm text-gray-500">
                                Word count: {data.word_count}
                            </p>
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {data.transcript || "No transcript available."}
                    </div>
                </div>
            </main>
        </div>
    );
}