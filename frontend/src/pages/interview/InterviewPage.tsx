import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    Bot,
    Clock3,
    FileText,
    User,
    Square,
    Smile,
    Eye,
    Mic,
    MessageSquare,
    Award,
    Shield,
    Video,
} from "lucide-react";

import InterviewMonitor from "../../components/interview/InterviewMonitor";
import type { InterviewMonitorHandle } from "../../components/interview/InterviewMonitor";

import ChatWindow from "../../components/interview/ChatWindow";
import ChatInput from "../../components/interview/ChatInput";
import SpeechPlayer from "../../components/interview/SpeechPlayer";
import VoiceRecorder from "../../components/interview/VoiceRecorder";

import {
    startInterview,
    sendMessage,
    sendVoiceMessage,
    finishInterview,
} from "../../services/interviewService";

interface Message {
    id: number;
    role: "assistant" | "user";
    content: string;
}

export default function InterviewPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const resumeId = location.state?.resumeId;
    const interviewType = location.state?.interviewType || "technical";
    // possible values: "hr" | "technical" | "managerial"

    const token = localStorage.getItem("token") ?? "";
    const monitorRef = useRef<InterviewMonitorHandle>(null);

    const [sessionId, setSessionId] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [finished, setFinished] = useState(false);
    const [aiSpeech, setAiSpeech] = useState("");
    const [seconds, setSeconds] = useState(0);

    const [metrics, setMetrics] = useState({
        transcript: "Waiting...",
        emotion: "--",
        eyeContact: "--",
        fillerWords: 0,
        fluency: 0,
        overallScore: 0,
        recommendation: "--",
    });

    const interviewTypeLabel =
        interviewType === "hr"
            ? "HR Interview"
            : interviewType === "managerial"
              ? "Managerial Interview"
              : "Technical Interview";

    useEffect(() => {
        if (finished) return;
        const timer = setInterval(() => setSeconds((v) => v + 1), 1000);
        return () => clearInterval(timer);
    }, [finished]);

    function formatTime() {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }

    useEffect(() => {
        if (!resumeId) {
            navigate("/dashboard");
            return;
        }
        initializeInterview();
    }, []);

    async function initializeInterview() {
        try {
            setLoading(true);

            // Pass interviewType to backend
            const session = await startInterview(resumeId, token, interviewType);
            setSessionId(session.id);

            setTimeout(() => {
                monitorRef.current?.startRecording();
            }, 1000);

            const response = await sendMessage(session.id, "", token);
            const greeting: Message = {
                id: 1,
                role: "assistant",
                content: response.reply,
            };
            setMessages([greeting]);
            setAiSpeech(greeting.content);
        } catch (err) {
            console.log(err);
            alert("Unable to start interview.");
        } finally {
            setLoading(false);
        }
    }

    async function onSend(text: string) {
        if (!sessionId || finished || !text.trim()) return;

        const userMessage: Message = {
            id: Date.now(),
            role: "user",
            content: text,
        };
        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);

        try {
            monitorRef.current?.startAnalyzing();
            await monitorRef.current?.stopRecording();

            const response = await sendMessage(sessionId, text, token);
            const aiMessage: Message = {
                id: Date.now() + 1,
                role: "assistant",
                content: response.reply,
            };
            setMessages((prev) => [...prev, aiMessage]);
            setAiSpeech(aiMessage.content);

            if (response.interview_finished) {
                await finishCurrentInterview();
                return;
            }
            await monitorRef.current?.startRecording();
        } catch (err) {
            console.log(err);
            alert("Unable to contact AI interviewer.");
        } finally {
            setLoading(false);
        }
    }

    async function onVoiceRecordingComplete(audio: Blob) {
        if (!sessionId || finished) return;
        setLoading(true);

        try {
            monitorRef.current?.startAnalyzing();
            await monitorRef.current?.stopRecording();

            const response = await sendVoiceMessage(sessionId, audio, token);

            const transcript: Message = {
                id: Date.now(),
                role: "user",
                content: response.transcript,
            };
            const aiReply: Message = {
                id: Date.now() + 1,
                role: "assistant",
                content: response.reply,
            };

            setMessages((prev) => [...prev, transcript, aiReply]);
            setAiSpeech(aiReply.content);

            if (response.interview_finished) {
                await finishCurrentInterview();
                return;
            }
            await monitorRef.current?.startRecording();
        } catch (err) {
            console.log(err);
            alert("Voice processing failed.");
        } finally {
            setLoading(false);
        }
    }

    async function finishCurrentInterview() {
        if (!sessionId) return;
        setFinished(true);

        try {
            await finishInterview(sessionId, token);
            await monitorRef.current?.stopRecording();
            setTimeout(() => {
                navigate(`/interview-analytics/${sessionId}`);
            }, 2500);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="min-h-screen bg-[#f0f4fa]">
            {/* Header */}
            <header className="bg-white border-b border-gray-200/70">
                <div className="max-w-[1580px] mx-auto px-6 py-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                            <Bot className="text-white" size={20} />
                        </div>
                        <div>
                            <h1 className="text-[17px] font-bold text-gray-900 tracking-tight">
                                SmartHire AI Live Interview
                            </h1>
                        </div>
                        <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-violet-50 text-violet-700 border border-violet-100">
                            {interviewTypeLabel}
                        </span>
                    </div>

                    <button
                        onClick={finishCurrentInterview}
                        disabled={finished}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl
                                   bg-white border border-gray-200 text-red-500
                                   font-medium text-sm hover:bg-red-50 transition shadow-sm"
                    >
                        <Square size={13} className="fill-red-500 text-red-500" />
                        End Interview
                    </button>
                </div>
            </header>

            <main className="max-w-[1580px] mx-auto px-6 py-5">
                <div className="grid grid-cols-12 gap-5">
                    {/* ========== LEFT ========== */}
                    <div className="col-span-8 flex flex-col gap-4">
                        {/* Top status bar */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-3.5">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                        <FileText size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-[15px] font-bold text-gray-900">
                                            Live AI Interview
                                        </h2>
                                        <div className="flex items-center gap-2.5 mt-0.5 text-[12px] text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <FileText size={11} />
                                                Resume ID :{" "}
                                                <strong className="text-gray-700">
                                                    {resumeId}
                                                </strong>
                                            </span>
                                            <span className="text-gray-300">|</span>
                                            <span className="flex items-center gap-1">
                                                <User size={11} />
                                                Session ID :{" "}
                                                <strong className="text-gray-700">
                                                    {sessionId ?? "--"}
                                                </strong>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="bg-green-50 text-green-700 px-3.5 py-1.5 rounded-full text-[12px] font-medium flex items-center gap-1.5 border border-green-100">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        {finished
                                            ? "Interview Completed"
                                            : "AI Interview In Progress"}
                                    </div>

                                    <div className="w-px h-7 bg-gray-200" />

                                    <div className="flex items-center gap-2.5">
                                        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center">
                                            <Clock3 size={16} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-[15px] font-bold text-gray-900 leading-none">
                                                {formatTime()}
                                            </p>
                                            <p className="text-[11px] text-gray-500 mt-0.5">
                                                Interview Time
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chat card */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col flex-1 min-h-[640px]">
                            <div className="flex-1 overflow-y-auto px-4 py-4">
                                <ChatWindow messages={messages} loading={loading} />
                            </div>

                            <div className="border-t border-gray-100 px-5 py-3.5">
                                <div className="mb-3">
                                    <VoiceRecorder
                                        disabled={loading || finished}
                                        onRecordingComplete={onVoiceRecordingComplete}
                                    />
                                </div>

                                <SpeechPlayer text={aiSpeech} />

                                <div className="mt-2">
                                    <ChatInput
                                        onSend={onSend}
                                        disabled={loading || finished}
                                    />
                                </div>

                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-[11px] text-gray-400">
                                        Tip: Be clear, concise and take a moment to think before answering.
                                    </p>
                                    <p className="text-[11px] text-gray-400">
                                        Press Enter to send
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ========== RIGHT ========== */}
                    <div className="col-span-4 flex flex-col gap-4">
                        {/* Camera card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3">
                                <h2 className="text-[14px] font-semibold text-gray-900">
                                    Live Camera Feed
                                </h2>
                                <span className="text-green-600 text-[11px] font-semibold flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    LIVE
                                </span>
                            </div>

                            <div className="px-3.5">
                                {sessionId && (
                                    <div className="rounded-xl overflow-hidden">
                                        <InterviewMonitor
                                            ref={monitorRef}
                                            sessionId={sessionId}
                                            transcript={metrics.transcript}
                                            emotion={metrics.emotion}
                                            eyeContact={metrics.eyeContact}
                                            fillerWords={metrics.fillerWords}
                                            fluency={metrics.fluency}
                                            overallScore={metrics.overallScore}
                                            recommendation={metrics.recommendation}
                                            onMetricsUpdate={setMetrics}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-center gap-2 py-3.5">
                                <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-[11px] font-medium flex items-center gap-1.5 border border-green-100">
                                    <Mic size={11} /> Mic On
                                </span>
                                <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-[11px] font-medium flex items-center gap-1.5 border border-green-100">
                                    <Video size={11} /> Camera On
                                </span>
                                <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-[11px] font-medium flex items-center gap-1.5 border border-blue-100">
                                    <Shield size={11} /> Secure
                                </span>
                            </div>
                        </div>

                        {/* Analytics */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                                <h2 className="text-[14px] font-semibold text-gray-900">
                                    Live AI Analytics
                                </h2>
                                <span className="bg-green-50 text-green-700 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-green-100 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    LIVE
                                </span>
                            </div>

                            <div className="px-4 py-3.5">
                                <div className="pb-3.5">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2 text-[13px] text-gray-600">
                                            <div className="w-5 h-5 rounded-full bg-blue-50 flex items-center justify-center">
                                                <Award size={11} className="text-blue-600" />
                                            </div>
                                            Overall Score
                                        </div>
                                        <span className="text-[17px] font-bold text-green-600">
                                            {Number(metrics.overallScore).toFixed(1)}/100
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 rounded-full transition-all duration-500"
                                            style={{
                                                width: `${Math.min(
                                                    Number(metrics.overallScore) || 0,
                                                    100
                                                )}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between py-3 border-t border-gray-50">
                                    <div className="flex items-center gap-2 text-[13px] text-gray-600">
                                        <Smile size={15} className="text-yellow-500" />
                                        Emotion
                                    </div>
                                    <span className="font-semibold text-[13px] text-gray-800">
                                        {metrics.emotion}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between py-3 border-t border-gray-50">
                                    <div className="flex items-center gap-2 text-[13px] text-gray-600">
                                        <Eye size={15} className="text-blue-500" />
                                        Eye Contact
                                    </div>
                                    <span className="font-semibold text-[13px] text-green-600">
                                        {metrics.eyeContact}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between py-3 border-t border-gray-50">
                                    <div className="flex items-center gap-2 text-[13px] text-gray-600">
                                        <Mic size={15} className="text-blue-500" />
                                        Fluency
                                    </div>
                                    <span className="font-semibold text-[13px] text-green-600">
                                        {metrics.fluency}/100
                                    </span>
                                </div>

                                <div className="flex items-center justify-between py-3 border-t border-gray-50">
                                    <div className="flex items-center gap-2 text-[13px] text-gray-600">
                                        <MessageSquare size={15} className="text-blue-400" />
                                        Filler Words
                                    </div>
                                    <span className="font-semibold text-[13px] text-gray-800">
                                        {metrics.fillerWords}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between py-3 border-t border-gray-50">
                                    <div className="flex items-center gap-2 text-[13px] text-gray-600">
                                        <Award size={15} className="text-yellow-500" />
                                        Recommendation
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-[12px] font-semibold ${
                                            metrics.recommendation === "Outstanding"
                                                ? "bg-green-100 text-green-700"
                                                : metrics.recommendation === "Excellent"
                                                  ? "bg-blue-100 text-blue-700"
                                                  : metrics.recommendation === "Good"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-gray-100 text-gray-500"
                                        }`}
                                    >
                                        {metrics.recommendation}
                                    </span>
                                </div>
                            </div>

                            <div className="px-4 py-2.5 border-t border-gray-50 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                                <Shield size={11} />
                                Your interview is secure and monitored by AI
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}