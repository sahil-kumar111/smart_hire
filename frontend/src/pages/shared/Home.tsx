import { Link } from "react-router-dom";
import {
    Briefcase,
    Bot,
    BarChart3,
    FileSearch,
    ArrowRight,
} from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen bg-[#f0f4fa]">
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                            <Briefcase className="text-white" size={20} />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">
                                SmartHire AI
                            </h1>
                            <p className="text-xs text-gray-500">
                                AI-Powered Interview Platform
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            to="/login"
                            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                        >
                            Sign In
                        </Link>
                        <Link
                            to="/register"
                            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm transition"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </header>

            <section className="max-w-6xl mx-auto px-6 pt-16 pb-20">
                <div className="text-center max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        AI-Powered Career Platform
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                        Ace your next interview
                        <br />
                        with{" "}
                        <span className="text-blue-600">confidence</span>
                    </h1>

                    <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                        SmartHire AI helps you prepare, practice and perform your
                        best. Upload your resume, get AI analysis, and practice
                        real interview simulations.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition"
                        >
                            Start for Free
                            <ArrowRight size={18} />
                        </Link>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 transition"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-6 pb-20">
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 hover:shadow-md transition">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5">
                            <Bot size={24} className="text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            AI Interview Simulation
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Practice realistic AI-powered interviews tailored to
                            your resume and target role. Get instant feedback.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 hover:shadow-md transition">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mb-5">
                            <BarChart3 size={24} className="text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Real-time Analytics
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Track fluency, eye contact, filler words, emotion
                            and overall score with detailed performance charts.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7 hover:shadow-md transition">
                        <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center mb-5">
                            <FileSearch size={24} className="text-violet-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Smart Resume Analysis
                        </h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            Upload your resume and let AI extract skills,
                            experience and projects to personalize your
                            interview.
                        </p>
                    </div>
                </div>
            </section>

            <section className="bg-white border-y border-gray-100 py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">
                        How it works
                    </h2>

                    <div className="grid sm:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Upload Resume",
                                desc: "Upload your PDF resume and let AI analyze your skills and experience.",
                            },
                            {
                                step: "02",
                                title: "Practice Interview",
                                desc: "Start a live AI interview with real-time feedback on your answers.",
                            },
                            {
                                step: "03",
                                title: "Review Analytics",
                                desc: "Get detailed scores, charts and recommendations to improve.",
                            },
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                                    {item.step}
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-6 py-20">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-10 sm:p-14 text-center text-white shadow-xl">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Ready to land your dream job?
                    </h2>
                    <p className="text-blue-100 max-w-xl mx-auto mb-8">
                        Join thousands of candidates who are practicing smarter
                        with SmartHire AI.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-blue-600 font-semibold hover:bg-blue-50 transition shadow-md"
                    >
                        Create Free Account
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            <footer className="border-t border-gray-200 bg-white">
                <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                            <Briefcase className="text-white" size={16} />
                        </div>
                        <span className="font-semibold text-gray-900">
                            SmartHire AI
                        </span>
                    </div>
                    <p className="text-sm text-gray-400">
                        © 2026 SmartHire AI • All rights reserved
                    </p>
                </div>
            </footer>
        </div>
    );
}