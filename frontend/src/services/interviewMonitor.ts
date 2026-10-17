import api from "../api/axios";

export interface InterviewResult {
  speech: Record<string, unknown>;
  filler_words: Record<string, unknown>;
  emotion: Record<string, unknown>;
  eye_contact: Record<string, unknown>;
  score: Record<string, unknown>;
}

export async function analyzeInterview(
  sessionId: number,
  audio: Blob,
  image: Blob
): Promise<InterviewResult> {
  const formData = new FormData();

  formData.append("session_id", String(sessionId));
  formData.append("audio", audio, "audio.webm");
  formData.append("image", image, "frame.jpg");

  const response = await api.post(
    `/interview-monitor/analyze`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}