import api from "../api/axios";

export interface ChatResponse {
    reply: string;
    interview_finished: boolean;
}

export interface InterviewSession {
    id: number;
    resume_id: number;
    status: string;
    created_at: string;
    completed_at: string | null;
}

export interface QuestionReport {
    question: string;
    candidate_answer: string;
    score: number;
    strengths: string[];
    weaknesses: string[];
    ideal_answer: string;
    feedback: string;
}

export interface InterviewReport {
    overall_score: number;
    recommendation: string;
    summary: string;
    overall_strengths: string[];
    overall_weaknesses: string[];
    learning_plan: string[];
    total_questions: number;
    answered_questions: number;
    questions: QuestionReport[];
}

export async function startInterview(
    resumeId: number,
    token?: string,
    interviewType: string = "technical",
) {
    const response = await api.post(
        `/interview/start/${resumeId}`,
        {
            interview_type: interviewType,   // "hr" | "technical" | "managerial"
        },
        {
            headers: token
                ? {
                    Authorization: `Bearer ${token}`,
                }
                : {},
        }
    );

    return response.data;
}

export async function sendMessage(
    sessionId: number,
    message: string,
    token?: string,
): Promise<ChatResponse> {
    const response = await api.post(
        `/interview/chat/${sessionId}`,
        {
            message,
        },
        {
            headers: token
                ? {
                    Authorization: `Bearer ${token}`,
                }
                : {},
        }
    );

    return response.data;
}

export async function sendVoiceMessage(
    sessionId: number,
    audio: Blob,
    token?: string,
) {
    const formData = new FormData();

    formData.append(
        "audio",
        audio,
        "audio.webm",
    );

    const response = await api.post(
        `/speech-chat/${sessionId}`,
        formData,
        {
            headers: {
                ...(token
                    ? {
                        Authorization: `Bearer ${token}`,
                    }
                    : {}),
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
}

export async function finishInterview(
    sessionId: number,
    token?: string,
) {
    const response = await api.post(
        `/interview/finish/${sessionId}`,
        {},
        {
            headers: token
                ? {
                    Authorization: `Bearer ${token}`,
                }
                : {},
        }
    );

    return response.data;
}

export async function getInterviewSessions(
    token?: string,
): Promise<InterviewSession[]> {
    const response = await api.get(
        "/interview/sessions",
        {
            headers: token
                ? {
                    Authorization: `Bearer ${token}`,
                }
                : {},
        }
    );

    return response.data;
}

export async function getInterviewReport(
    sessionId: number,
    token?: string,
): Promise<InterviewReport> {
    const response = await api.get(
        `/interview/report/${sessionId}`,
        {
            headers: token
                ? {
                    Authorization: `Bearer ${token}`,
                }
                : {},
        }
    );

    return response.data;
}

export interface LiveMetrics {

    overall_score: number;

    emotion: string;

    eye_contact: string;

    eye_contact_score: number;

    confidence: number;

    fluency: number;

    filler_words: number;

    recommendation: string;

    status: string;
}

export async function getLiveMetrics(
    sessionId: number,
    token?: string,
): Promise<LiveMetrics> {

    const response = await api.get(
        `/interview-live/${sessionId}`,
        {
            headers: token
                ? {
                    Authorization: `Bearer ${token}`,
                }
                : {},
        },
    );

    return response.data;
}