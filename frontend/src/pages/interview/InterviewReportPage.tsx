import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import {
    CircularProgressbar,
    buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

import {
    CheckCircle,
    AlertTriangle,
    BookOpen,
    Trophy,
    ClipboardList,
} from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

import {
    getInterviewReport,
    type InterviewReport,
} from "../../services/interviewService";

import { downloadInterviewReport } from "../../utils/downloadInterviewReport";

function recommendationColor(recommendation: string) {
    switch (recommendation) {
        case "Strong Hire":
            return "bg-green-600";
        case "Hire":
            return "bg-blue-600";
        case "Consider":
            return "bg-yellow-500";
        default:
            return "bg-red-600";
    }
}

export default function InterviewReportPage() {
    const { token } = useAuth();
    const location = useLocation();
    const sessionId = location.state?.sessionId;

    const [report, setReport] = useState<InterviewReport | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadReport() {
            if (!token || !sessionId) {
                setLoading(false);
                return;
            }

            try {
                const data = await getInterviewReport(sessionId, token);
                setReport(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        loadReport();
    }, [sessionId, token]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-xl">
                Loading Interview Report...
            </div>
        );
    }

    if (!report) {
        return (
            <div className="flex justify-center items-center h-screen">
                Failed to load report.
            </div>
        );
    }

    return (
        <div id="report-content" className="max-w-7xl mx-auto p-10">
            <h1 className="text-4xl font-bold mb-10">AI Interview Report</h1>

            <div className="flex justify-end mb-8">
                <button
                    onClick={() =>
                        downloadInterviewReport(
                            "report-content",
                            "Interview_Report.pdf"
                        )
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                >
                    Download PDF
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-10">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="w-64 h-64 mx-auto">
                        <CircularProgressbar
                            value={report.overall_score * 10}
                            text={`${report.overall_score}/10`}
                            styles={buildStyles({
                                textSize: "12px",
                            })}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col justify-center">
                    <h2 className="text-3xl font-bold">Overall Recommendation</h2>

                    <span
                        className={`mt-6 inline-block px-5 py-3 rounded-full text-white text-xl font-bold ${recommendationColor(
                            report.recommendation
                        )}`}
                    >
                        {report.recommendation}
                    </span>

                    <div className="mt-8 grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-gray-500">Questions</p>
                            <p className="text-3xl font-bold">
                                {report.total_questions}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500">Answered</p>
                            <p className="text-3xl font-bold">
                                {report.answered_questions}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10 grid lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="flex items-center gap-3 mb-5">
                        <ClipboardList className="text-blue-600" size={30} />
                        <h2 className="text-2xl font-bold">Executive Summary</h2>
                    </div>
                    <p className="text-gray-700 leading-8">{report.summary}</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="flex items-center gap-3 mb-5">
                        <Trophy className="text-yellow-500" size={30} />
                        <h2 className="text-2xl font-bold">Recommendation</h2>
                    </div>
                    <p className="text-lg">{report.recommendation}</p>
                </div>
            </div>

            <div className="mt-10 grid lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="flex items-center gap-3 mb-5">
                        <CheckCircle className="text-green-600" size={28} />
                        <h2 className="text-xl font-bold">Overall Strengths</h2>
                    </div>
                    <ul className="space-y-3">
                        {report.overall_strengths.map((item, index) => (
                            <li key={index} className="flex gap-3">
                                <CheckCircle
                                    size={18}
                                    className="text-green-600 mt-1"
                                />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="flex items-center gap-3 mb-5">
                        <AlertTriangle className="text-red-500" size={28} />
                        <h2 className="text-xl font-bold">Areas to Improve</h2>
                    </div>
                    <ul className="space-y-3">
                        {report.overall_weaknesses.map((item, index) => (
                            <li key={index} className="flex gap-3">
                                <AlertTriangle
                                    size={18}
                                    className="text-red-500 mt-1"
                                />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-8">
                    <div className="flex items-center gap-3 mb-5">
                        <BookOpen className="text-blue-600" size={28} />
                        <h2 className="text-xl font-bold">Learning Plan</h2>
                    </div>
                    <ul className="space-y-3">
                        {report.learning_plan.map((item, index) => (
                            <li key={index} className="flex gap-3">
                                <BookOpen
                                    size={18}
                                    className="text-blue-600 mt-1"
                                />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-3xl font-bold mb-8">
                    Question-by-Question Analysis
                </h2>

                <div className="space-y-8">
                    {report.questions.map((question, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-lg p-8"
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-bold">
                                    Question {index + 1}
                                </h3>
                                <span className="font-bold text-lg">
                                    {question.score}/10
                                </span>
                            </div>

                            <div className="mt-5">
                                <p className="font-semibold">Interview Question</p>
                                <p className="mt-2 text-gray-700">
                                    {question.question}
                                </p>
                            </div>

                            <div className="mt-6">
                                <p className="font-semibold">Your Answer</p>
                                <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                                    {question.candidate_answer}
                                </p>
                            </div>

                            <div className="mt-6">
                                <p className="font-semibold mb-2">Score</p>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <div
                                        className="bg-blue-600 h-4 rounded-full"
                                        style={{
                                            width: `${question.score * 10}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 mt-8">
                                <div>
                                    <h4 className="font-bold text-green-600 mb-3">
                                        Strengths
                                    </h4>
                                    <ul className="list-disc ml-6 space-y-2">
                                        {question.strengths.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold text-red-600 mb-3">
                                        Weaknesses
                                    </h4>
                                    <ul className="list-disc ml-6 space-y-2">
                                        {question.weaknesses.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h4 className="font-bold text-blue-700">
                                    Ideal Answer
                                </h4>
                                <p className="mt-3 text-gray-700 whitespace-pre-wrap">
                                    {question.ideal_answer}
                                </p>
                            </div>

                            <div className="mt-8">
                                <h4 className="font-bold text-yellow-600">
                                    AI Feedback
                                </h4>
                                <div className="mt-3 rounded-lg bg-yellow-50 border border-yellow-200 p-5">
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {question.feedback}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}