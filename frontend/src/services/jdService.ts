import api from "../api/axios";

export async function saveJobDescription(jd_text: string, token?: string) {
    const res = await api.post(
        "/job-description",
        { jd_text },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return res.data;
}

export async function getJobDescription(token?: string) {
    const res = await api.get("/job-description", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
}

export async function matchResume(resume_id: number, token?: string) {
    const res = await api.post(
        "/resume/match",
        { resume_id },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    return res.data;
}