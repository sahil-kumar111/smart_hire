import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { register as registerUser } from "../../services/authService";
import {
    Briefcase,
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Bot,
    BarChart3,
    FileText,
} from "lucide-react";

interface RegisterForm {
    full_name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function RegisterPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [role, setRole] = useState("candidate");

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegisterForm>();

    const password = watch("password");

    async function onSubmit(data: RegisterForm) {
        if (!agreeTerms) {
            alert("Please agree to the Terms of Service and Privacy Policy.");
            return;
        }

        if (data.password !== data.confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            await registerUser({
                full_name: data.full_name,
                email: data.email,
                password: data.password,
                role,
            });
            alert("Registration successful!");
            navigate("/login");
        } catch {
            alert("Registration failed.");
        }
    }

    const roles = [
        { id: "candidate", label: "Candidate" },
        { id: "recruiter", label: "Recruiter" },
        { id: "admin", label: "Admin" },
    ];

    return (
        <div className="min-h-screen bg-[#f0f4fa] flex flex-col items-center justify-center p-4">
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
                            Create your account
                            <br />
                            and{" "}
                            <span className="text-blue-600">start your journey</span>
                        </h2>
                        <p className="mt-4 text-gray-600 text-[15px] max-w-sm">
                            Join SmartHire AI and access AI-powered tools to
                            crack your dream job.
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
                                        Practice with AI interviewers and improve
                                        your confidence.
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
                                        Get detailed feedback and track your
                                        performance.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center shrink-0">
                                    <FileText
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
                <div className="lg:w-[52%] p-8 lg:p-10 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Create Account
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Fill in your details to get started
                        </p>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="mt-7 space-y-4"
                        >
                            {/* Role selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Register as
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {roles.map((r) => (
                                        <button
                                            key={r.id}
                                            type="button"
                                            onClick={() => setRole(r.id)}
                                            className={`h-10 rounded-xl text-sm font-medium border transition ${role === r.id
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                                                }`}
                                        >
                                            {r.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User
                                        size={16}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        {...register("full_name", {
                                            required: "Name is required",
                                        })}
                                        placeholder="Enter your full name"
                                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                                    />
                                </div>
                                {errors.full_name && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.full_name.message}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail
                                        size={16}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="email"
                                        {...register("email", {
                                            required: "Email is required",
                                        })}
                                        placeholder="Enter your email address"
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
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 8,
                                                message:
                                                    "Password must be at least 8 characters",
                                            },
                                        })}
                                        placeholder="Create a password"
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

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock
                                        size={16}
                                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        {...register("confirmPassword", {
                                            required:
                                                "Please confirm your password",
                                            validate: (value) =>
                                                value === password ||
                                                "Passwords do not match",
                                        })}
                                        placeholder="Confirm your password"
                                        className="w-full h-11 pl-10 pr-11 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={16} />
                                        ) : (
                                            <Eye size={16} />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.confirmPassword.message}
                                    </p>
                                )}
                            </div>

                            {/* Terms */}
                            <label className="flex items-start gap-2.5 cursor-pointer mt-1">
                                <input
                                    type="checkbox"
                                    checked={agreeTerms}
                                    onChange={(e) =>
                                        setAgreeTerms(e.target.checked)
                                    }
                                    className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-600">
                                    I agree to the{" "}
                                    <span className="text-blue-600 font-medium">
                                        Terms of Service
                                    </span>{" "}
                                    and{" "}
                                    <span className="text-blue-600 font-medium">
                                        Privacy Policy
                                    </span>
                                </span>
                            </label>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition shadow-sm disabled:opacity-60 mt-2"
                            >
                                {isSubmitting
                                    ? "Creating Account..."
                                    : "Create Account"}
                            </button>
                        </form>

                        <p className="text-center text-sm text-gray-500 mt-7">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-blue-600 font-medium hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            <p className="mt-6 text-center text-xs text-gray-400">
                © 2026 SmartHire AI • All rights reserved
            </p>
        </div>
    );
}