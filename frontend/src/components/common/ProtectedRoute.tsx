import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface Props {
    children: React.ReactNode;
    allowedRoles?: string[];  // e.g. ["candidate"] | ["recruiter"] | ["admin"]
}

export default function ProtectedRoute({
    children,
    allowedRoles,
}: Props) {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    // Role check
    if (allowedRoles && allowedRoles.length > 0) {
        const role = (user.role || "").toLowerCase();

        if (!allowedRoles.map((r) => r.toLowerCase()).includes(role)) {
            // Redirect to their own dashboard
            if (role === "admin") return <Navigate to="/admin" replace />;
            if (role === "recruiter") return <Navigate to="/recruiter" replace />;
            return <Navigate to="/dashboard" replace />;
        }
    }

    return <>{children}</>;
}