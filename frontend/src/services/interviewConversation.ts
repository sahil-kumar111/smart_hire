import api from "../api/axios";

export async function sendMessage(
    sessionId: number,
    message: string,
) {

    const response = await api.post(
        `/interview/chat/${sessionId}`,
        {
            message,
        },
    );

    return response.data;

}