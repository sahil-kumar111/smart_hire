import api from "../api/axios";

export interface Resume {
    id: number;
    filename: string;
    file_path: string;
    uploaded_at: string;
}

export interface Education {
    institution: string;
    degree: string;
    gpa?: string;
    grade?: string;
    start_date?: string;
    end_date?: string;
}

export interface Experience {
    title: string;
    company: string;
    location?: string;
    start_date?: string;
    end_date?: string;
    description: string[];
}

export interface Project {
    title: string;
    tech_stack: string[];
    start_date?: string;
    end_date?: string;
    description: string[];
}

export interface ResumeAnalysis {
    id: number;

    resume_id: number;

    technical_skills: string[];

    soft_skills: string[];

    frameworks: string[];

    tools: string[];

    databases: string[];

    cloud: string[];

    certifications: string[];

    education: Education[];

    experience: Experience[];

    projects: Project[];
}

export interface ResumeAnalysisResult {
    resume: Resume;

    analysis: ResumeAnalysis;
}

export async function uploadResume(
    file: File,
    token: string
) {
    const formData = new FormData();

    formData.append("file", file);

    const response = await api.post(
        "/resume/upload",
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
}

export async function getResumes(
    token: string
) {
    const response = await api.get(
        "/resume/me",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}

export async function deleteResume(
    id: number,
    token: string
) {
    await api.delete(
        `/resume/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}

export async function downloadResume(
    id: number,
    token: string
) {
    const response = await api.get(
        `/resume/download/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
        }
    );

    const url = window.URL.createObjectURL(response.data);

    const link = document.createElement("a");

    link.href = url;

    link.download = "resume.pdf";

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
}

export async function analyzeResume(
    resumeId: number,
    token: string,
): Promise<ResumeAnalysisResult> {

    const response = await api.get(
        `/resume/analyze/${resumeId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}