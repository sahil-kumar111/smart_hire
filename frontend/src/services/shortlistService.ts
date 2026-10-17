import axios from "axios";

const API = "http://127.0.0.1:8000/api/v1";

export async function getShortlist(token: string) {
    const res = await axios.get(`${API}/recruiter/shortlist`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data as Array<{ session_id: number; status: string }>;
}

export async function updateShortlist(
    sessionId: number,
    status: string,
    token: string
) {
    const res = await axios.post(
        `${API}/recruiter/shortlist`,
        { session_id: sessionId, status },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}