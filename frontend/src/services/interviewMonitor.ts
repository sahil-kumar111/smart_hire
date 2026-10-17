import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1",
});

export interface InterviewResult {
  speech: any;
  filler_words: any;
  emotion: any;
  eye_contact: any;
  score: any;
}

export async function analyzeInterview(
  sessionId: number,
  audio: Blob,
  image: Blob
): Promise<InterviewResult> {

  const formData = new FormData();

  formData.append("audio", audio, "audio.webm");
  formData.append("image", image, "frame.jpg");

  const response = await API.post(
    `/interview-monitor/analyze?session_id=${sessionId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}