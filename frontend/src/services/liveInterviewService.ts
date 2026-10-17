import api from "../api/axios";

export async function startConversation(
    sessionId: number,
) {
    const response = await api.post(
        `/conversation/start/${sessionId}`
    );

    return response.data;
}

export async function sendMessage(
    sessionId: number,
    message: string,
) {
    const response = await api.post(
        `/conversation/message`,
        {
            session_id: sessionId,
            message,
        }
    );

    return response.data;
}

export async function finishConversation(
    sessionId: number,
) {
    const response = await api.post(
        `/conversation/finish/${sessionId}`
    );

    return response.data;
}