import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import Home from "../pages/shared/Home";
import RegisterPage from "../pages/auth/RegisterPage";
import Dashboard from "../pages/candidate/CandidateDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import TestAPI from "../pages/shared/TestAPI";
import ProtectedRoute from "../components/common/ProtectedRoute";
import LoginPage from "../pages/auth/LoginPage";
import InterviewPage from "../pages/interview/InterviewPage";
import InterviewReportPage from "../pages/interview/InterviewReportPage";
import InterviewAnalytics from "../pages/interview/InterviewAnalytics";
import ProgressDashboard from "../pages/interview/InterviewProgressDashboard";
import FeedbackDashboard from "../pages/interview/FeedbackDashboard";
import InterviewHistoryPage from "../pages/interview/InterviewHistory";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* ========== CANDIDATE ONLY ========== */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["candidate"]}>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/interview"
                    element={
                        <ProtectedRoute allowedRoles={["candidate"]}>
                            <InterviewPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/interview/report"
                    element={
                        <ProtectedRoute allowedRoles={["candidate"]}>
                            <InterviewReportPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/interview-analytics/:sessionId"
                    element={
                        <ProtectedRoute allowedRoles={["candidate", "recruiter"]}>
                            <InterviewAnalytics />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/interview-history"
                    element={
                        <ProtectedRoute allowedRoles={["candidate"]}>
                            <InterviewHistoryPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/progress"
                    element={
                        <ProtectedRoute allowedRoles={["candidate"]}>
                            <ProgressDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/progress/:sessionId"
                    element={
                        <ProtectedRoute allowedRoles={["candidate"]}>
                            <ProgressDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/feedback/:sessionId"
                    element={
                        <ProtectedRoute allowedRoles={["candidate"]}>
                            <FeedbackDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* ========== RECRUITER ONLY ========== */}
                <Route
                    path="/recruiter"
                    element={
                        <ProtectedRoute allowedRoles={["recruiter"]}>
                            <RecruiterDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* ========== ADMIN ONLY ========== */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Dev / test (optional – protect or remove in production) */}
                <Route
                    path="/test"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <TestAPI />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}