import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { deleteAccount } from "../../services/authService";
import axios from "axios";
import {
    Briefcase,
    LogOut,
    Trash2,
    Users,
    UserCheck,
    UserCog,
    Calendar,
    Search,
    Shield,
    BarChart3,
    FileText,
} from "lucide-react";

type UserRow = {
    id: number;
    full_name: string;
    email: string;
    role: string;
    created_at?: string;
};

export default function AdminDashboard() {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();

    const [users, setUsers] = useState<UserRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState<
        "all" | "candidate" | "recruiter" | "admin"
    >("all");

    const [currentTime, setCurrentTime] = useState(
        new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        })
    );

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(
                new Date().toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    weekday: "long",
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                })
            );
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        if (!token) return;
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/v1/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error(err);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }

    async function handleDeleteAccount() {
        const ok = window.confirm(
            "Are you sure you want to permanently delete your account and all related data? This cannot be undone."
        );
        if (!ok || !token) return;

        try {
            await deleteAccount(token);
            logout();
            navigate("/register");
        } catch (err) {
            console.error(err);
            alert("Failed to delete account. Please try again.");
        }
    }

    const filtered = users.filter((u) => {
        if (
            roleFilter !== "all" &&
            (u.role || "").toLowerCase() !== roleFilter
        ) {
            return false;
        }
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
            (u.full_name || "").toLowerCase().includes(q) ||
            (u.email || "").toLowerCase().includes(q) ||
            String(u.id).includes(q)
        );
    });

    const totalUsers = users.length;
    const candidates = users.filter(
        (u) => (u.role || "").toLowerCase() === "candidate"
    ).length;
    const recruiters = users.filter(
        (u) => (u.role || "").toLowerCase() === "recruiter"
    ).length;
    const admins = users.filter(
        (u) => (u.role || "").toLowerCase() === "admin"
    ).length;

    function roleBadge(role: string) {
        const r = (role || "candidate").toLowerCase();
        if (r === "admin") {
            return (
                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-100">
                    Admin
                </span>
            );
        }
        if (r === "recruiter") {
            return (
                <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-100">
                    Recruiter
                </span>
            );
        }
        return (
            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                Candidate
            </span>
        );
    }

    return (
        <div className="min-h-screen bg-[#f0f4fa]">
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                            <Briefcase className="text-white" size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                                SmartHire AI
                            </h1>
                            <p className="text-sm text-gray-500">Admin Portal</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDeleteAccount}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition"
                        >
                            <Trash2 size={16} />
                            Delete Account
                        </button>

                        <button
                            onClick={() => {
                                logout();
                                navigate("/login");
                            }}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium shadow-sm transition"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Calendar size={15} />
                    <span>{currentTime}</span>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Welcome back, {user?.full_name} 👋
                    </h2>
                    <span className="inline-block mt-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-red-100">
                        ADMIN
                    </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                <Users size={20} className="text-blue-600" />
                            </div>
                            <p className="text-[13px] text-gray-500 font-medium">
                                Total Users
                            </p>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {totalUsers}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">All accounts</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                                <UserCheck size={20} className="text-emerald-600" />
                            </div>
                            <p className="text-[13px] text-gray-500 font-medium">
                                Candidates
                            </p>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {candidates}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Job seekers</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                                <UserCog size={20} className="text-violet-600" />
                            </div>
                            <p className="text-[13px] text-gray-500 font-medium">
                                Recruiters
                            </p>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">
                            {recruiters}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">Hiring team</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                                <Shield size={20} className="text-red-600" />
                            </div>
                            <p className="text-[13px] text-gray-500 font-medium">
                                Admins
                            </p>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">{admins}</h3>
                        <p className="text-xs text-gray-400 mt-1">System access</p>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                User Management
                            </h2>
                            <p className="text-sm text-gray-500 mt-0.5">
                                View all registered users
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                            <select
                                value={roleFilter}
                                onChange={(e) =>
                                    setRoleFilter(
                                        e.target.value as
                                            | "all"
                                            | "candidate"
                                            | "recruiter"
                                            | "admin"
                                    )
                                }
                                className="h-10 rounded-xl border border-gray-200 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 bg-white"
                            >
                                <option value="all">All roles</option>
                                <option value="candidate">Candidate</option>
                                <option value="recruiter">Recruiter</option>
                                <option value="admin">Admin</option>
                            </select>

                            <div className="relative w-full sm:w-64">
                                <Search
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search name or email..."
                                    className="w-full h-10 pl-9 pr-4 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                                />
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-12 text-gray-500">
                            Loading users...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                                <Users size={24} className="text-blue-500" />
                            </div>
                            <h3 className="font-semibold text-gray-900">
                                No users found
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Try changing filters.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-500 border-b border-gray-100">
                                        <th className="pb-3 font-medium">ID</th>
                                        <th className="pb-3 font-medium">Name</th>
                                        <th className="pb-3 font-medium">Email</th>
                                        <th className="pb-3 font-medium">Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((u) => (
                                        <tr
                                            key={u.id}
                                            className="border-b border-gray-50 hover:bg-gray-50/50"
                                        >
                                            <td className="py-4 font-semibold text-gray-900">
                                                #{u.id}
                                            </td>
                                            <td className="py-4 text-gray-800">
                                                {u.full_name}
                                            </td>
                                            <td className="py-4 text-gray-600">
                                                {u.email}
                                            </td>
                                            <td className="py-4">
                                                {roleBadge(u.role)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <BarChart3 size={18} className="text-blue-600" />
                            <h3 className="font-semibold text-gray-900">
                                Platform Overview
                            </h3>
                        </div>
                        <p className="text-sm text-gray-500">
                            Monitor all candidates, recruiters and admins from one
                            place.
                        </p>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <FileText size={18} className="text-violet-600" />
                            <h3 className="font-semibold text-gray-900">
                                Admin Capabilities
                            </h3>
                        </div>
                        <p className="text-sm text-gray-500">
                            View registered users and filter them by role.
                        </p>
                    </div>
                </div>

                <footer className="mt-12 text-center text-gray-400 text-sm">
                    © 2026 SmartHire AI • Admin Portal
                </footer>
            </main>
        </div>
    );
}