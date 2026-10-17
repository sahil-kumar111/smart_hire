import axios from "axios";

const API = "http://127.0.0.1:8000/api/v1";

export async function saveJobDescription(jd_text: string, token: string) {
    const res = await axios.post(
        `${API}/job-description`,
        { jd_text },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}

export async function getJobDescription(token: string) {
    const res = await axios.get(`${API}/job-description`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

export async function matchResume(resume_id: number, token: string) {
    const res = await axios.post(
        `${API}/resume/match`,
        { resume_id },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
}