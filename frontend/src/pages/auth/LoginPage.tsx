import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../contexts/AuthContext";
import {
    loginSchema,
    type LoginFormData,
} from "../../validation/loginSchema";
import {
    Briefcase,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Bot,
    BarChart3,
    FileSearch,
} from "lucide-react";

export default function LoginPage() {
    const navigate = useNavigate();
    const { login, logout } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [role, setRole] = useState("candidate");

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    async function onSubmit(data: LoginFormData) {
        try {
            const currentUser = await login(data);
            const userRole = (currentUser?.role || "candidate").toLowerCase();

            if (userRole !== role.toLowerCase()) {
                alert(
                    `This account is registered as "${userRole}". Please select the correct role.`
                );
                logout();
                return;
            }

            if (userRole === "admin") {
                navigate("/admin");
            } else if (userRole === "recruiter") {
                navigate("/recruiter");
            } else {
                navigate("/dashboard");
            }
        } catch {
            alert("Invalid email or password.");
        }
    }

    const roles = [
        { id: "candidate", label: "Candidate" },
        { id: "recruiter", label: "Recruiter" },
        { id: "admin", label: "Admin" },
    ];

    return (
        <div className="min-h-screen bg-[#f0f4fa] flex items-center justify-center p-4 relative">
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
                {/* LEFT SIDE */}
                <div className="lg:w-[48%] bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
                            <Briefcase className="text-white" size={22} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                SmartHire AI
                            </h1>
                            <p className="text-xs text-gray-500">
                                AI-Powered Interview Platform
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 mt-10 lg:mt-0">
                        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                            Ace your next interview
                            <br />
                            with{" "}
                            <span className="text-blue-600">confidence</span>
                        </h2>
                        <p className="mt-4 text-gray-600 text-[15px] max-w-sm">
                            SmartHire AI helps you prepare, practice and perform
                            your best in every interview.
                        </p>

                        <div className="mt-8 space-y-5">
                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                    <Bot size={18} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-sm">
                                        AI Interview Simulation
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Realistic AI-powered interviews tailored
                                        to your profile.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                    <BarChart3
                                        size={18}
                                        className="text-emerald-600"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-sm">
                                        Real-time Analytics
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Get instant feedback and track your
                                        performance.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                                    <FileSearch
                                        size={18}
                                        className="text-violet-600"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-sm">
                                        Smart Resume Analysis
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        AI analyzes your resume and helps you
                                        stand out.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute right-0 bottom-0 w-64 h-64 opacity-30 pointer-events-none">
                        <div className="absolute right-8 bottom-12 w-40 h-48 bg-white/60 rounded-2xl shadow-lg border border-blue-100" />
                        <div className="absolute right-16 bottom-20 w-28 h-28 bg-blue-200/50 rounded-2xl" />
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="lg:w-[52%] p-8 lg:p-12 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Welcome Back 👋
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Sign in to continue to your account
                        </p>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="mt-8 space-y-5"
                        >
                            {/* Role selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Login as
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {roles.map((r) => (
                                        <button
                                            key={r.id}
                                            type="button"
                                            onClick={() => setRole(r.id)}
                                            className={`h-10 rounded-xl text-sm font-medium border transition ${
                                                role === r.id
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                                            }`}
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail
                                        size={16}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="email"
                                        {...register("email")}
                                        placeholder="Enter your email"
                                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.email.message}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        size={16}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        {...register("password")}
                                        placeholder="Enter your password"
                                        className="w-full h-11 pl-10 pr-11 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={16} />
                                        ) : (
                                            <Eye size={16} />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) =>
                                            setRememberMe(e.target.checked)
                                        }
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-600">
                                        Remember me
                                    </span>
                                </label>
                                <button
                                    type="button"
                                    className="text-sm text-blue-600 hover:underline font-medium"
                                >
                                    Forgot password?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition shadow-sm disabled:opacity-60"
                            >
                                {isSubmitting ? "Signing In..." : "Sign In"}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-500 mt-8">
                            Don’t have an account?{" "}
                            <Link
                                to="/register"
                                className="text-blue-600 font-medium hover:underline"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <p className="absolute bottom-4 text-center w-full text-xs text-gray-400">
                © 2026 SmartHire AI • All rights reserved
            </p>
        </div>
    );
}