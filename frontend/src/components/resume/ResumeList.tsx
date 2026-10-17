import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";
import {
    getResumes,
    deleteResume,
    downloadResume,
    analyzeResume,
} from "../../services/resumeService";
import type { Resume, ResumeAnalysis } from "../../services/resumeService";
import ResumeAnalysisCard from "./ResumeAnalysisCard";
import {
    FileText,
    Download,
    BarChart2,
    Play,
    Trash2,
    FolderOpen,
    Target,
    X,
} from "lucide-react";

interface Props {
    hasJd?: boolean;
    onMatch?: (resumeId: number) => void;
    matching?: boolean;
}

export default function ResumeList({
    hasJd = false,
    onMatch,
    matching = false,
}: Props) {
    const { token } = useAuth();
    const navigate = useNavigate();

    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
    const [analyzingId, setAnalyzingId] = useState<number | null>(null);

    // Interview type modal
    const [showTypeModal, setShowTypeModal] = useState(false);
    const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);

    const interviewTypes = [
        {
            id: "hr",
            title: "HR Interview",
            desc: "General HR and screening questions",
            color: "bg-blue-50 border-blue-200 hover:border-blue-400 text-blue-800",
        },
        {
            id: "technical",
            title: "Technical Interview",
            desc: "Coding, system design and domain knowledge",
            color: "bg-violet-50 border-violet-200 hover:border-violet-400 text-violet-800",
        },
        {
            id: "managerial",
            title: "Managerial Interview",
            desc: "Leadership, decision making and people management",
            color: "bg-amber-50 border-amber-200 hover:border-amber-400 text-amber-800",
        },
    ];

    async function loadResumes() {
        if (!token) return;
        try {
            const data = await getResumes(token);
            setResumes(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: number) {
        if (!token) return;
        const confirmed = window.confirm("Delete this resume?");
        if (!confirmed) return;

        try {
            await deleteResume(id, token);
            toast.success("Resume deleted.");
            loadResumes();
        } catch (error) {
            console.error(error);
            toast.error("Delete failed.");
        }
    }

    async function handleAnalyze(resumeId: number) {
        if (!token) return;
        try {
            setAnalyzingId(resumeId);
            const result = await analyzeResume(resumeId, token);
            setAnalysis(result.analysis);
            toast.success("Analysis completed!");
        } catch (error) {
            console.error(error);
            toast.error("Resume analysis failed.");
        } finally {
            setAnalyzingId(null);
        }
    }

    function openInterviewModal(resumeId: number) {
        setSelectedResumeId(resumeId);
        setShowTypeModal(true);
    }

    function startInterview(type: string) {
        setShowTypeModal(false);
        navigate("/interview", {
            state: {
                resumeId: selectedResumeId,
                interviewType: type, // "hr" | "technical" | "managerial"
            },
        });
    }

    useEffect(() => {
        loadResumes();
    }, []);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                <p className="text-gray-500">Loading resumes...</p>
            </div>
        );
    }

    if (resumes.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                    <FileText size={28} className="text-blue-500" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                    No resumes uploaded yet
                </h2>
                <p className="text-gray-500 mt-2 text-sm">
                    Upload your first resume to get started.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                        <FolderOpen size={18} className="text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        My Resumes
                        <span className="ml-2 text-sm font-normal text-gray-500">
                            ({resumes.length})
                        </span>
                    </h2>
                </div>

                <div className="space-y-4">
                    {resumes.map((resume) => (
                        <div
                            key={resume.id}
                            className="border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-sm transition bg-white"
                        >
                            {/* Left */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                                    <div className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                        PDF
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {resume.filename}
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        Uploaded on
                                        <br />
                                        {new Date(resume.uploaded_at).toLocaleString(
                                            "en-IN",
                                            {
                                                timeZone: "Asia/Kolkata",
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                second: "2-digit",
                                                hour12: true,
                                            }
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-2">
                                <button
                                    onClick={() =>
                                        downloadResume(resume.id, token!)
                                    }
                                    className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-medium hover:bg-emerald-100 transition"
                                >
                                    <Download size={14} />
                                    Download
                                </button>

                                <button
                                    onClick={() => handleAnalyze(resume.id)}
                                    disabled={analyzingId === resume.id}
                                    className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium hover:bg-blue-100 transition disabled:opacity-60"
                                >
                                    <BarChart2 size={14} />
                                    {analyzingId === resume.id
                                        ? "Analyzing..."
                                        : "Analyze"}
                                </button>

                                {/* Match with JD */}
                                {hasJd && onMatch && (
                                    <button
                                        onClick={() => onMatch(resume.id)}
                                        disabled={matching}
                                        className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-teal-200 bg-teal-50 text-teal-700 text-sm font-medium hover:bg-teal-100 transition disabled:opacity-60"
                                    >
                                        <Target size={14} />
                                        {matching ? "Matching..." : "Match JD"}
                                    </button>
                                )}

                                <button
                                    onClick={() => openInterviewModal(resume.id)}
                                    className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-violet-200 bg-violet-50 text-violet-700 text-sm font-medium hover:bg-violet-100 transition"
                                >
                                    <Play size={14} />
                                    Interview
                                </button>

                                <button
                                    onClick={() => handleDelete(resume.id)}
                                    className="flex items-center gap-1.5 h-9 px-3.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition"
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {analysis && <ResumeAnalysisCard analysis={analysis} />}
            </div>

            {/* ========== INTERVIEW TYPE MODAL ========== */}
            {showTypeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setShowTypeModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                            Select Interview Type
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Choose the type of interview you want to practice
                        </p>

                        <div className="space-y-3">
                            {interviewTypes.map((type) => (
                                <button
                                    key={type.id}
                                    onClick={() => startInterview(type.id)}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition ${type.color}`}
                                >
                                    <div className="font-semibold text-[15px]">
                                        {type.title}
                                    </div>
                                    <div className="text-sm opacity-80 mt-0.5">
                                        {type.desc}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowTypeModal(false)}
                            className="mt-5 w-full h-10 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}