import api from "../api/axios";

export interface CandidateInterview {
    session_id: number;
    overall_score: number;
    date: string;
    interview_type?: string;
    session_status?: string;
    candidate_name?: string;
    candidate_email?: string;
    status: "pending" | "selected" | "shortlisted" | "rejected";
    selection_status: "pending" | "selected" | "shortlisted" | "rejected";
}

export async function getShortlist(token?: string) {
    const res = await api.get("/recruiter/shortlist", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data as Array<{ session_id: number; status: string }>;
}

export async function updateShortlist(
    sessionId: number,
    status: string,
    token?: string
) {
    const res = await api.post(
        "/recruiter/shortlist",
        { session_id: sessionId, status },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return res.data;
}

export async function getCandidateInterviews(token?: string): Promise<CandidateInterview[]> {
    const res = await api.get("/candidate/interviews", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return Array.isArray(res.data) ? res.data : [];
}