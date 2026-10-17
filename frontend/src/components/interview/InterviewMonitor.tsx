import {
    forwardRef,
    useImperativeHandle,
    useRef,
} from "react";

import Webcam from "react-webcam";
import axios from "axios";

export type InterviewMonitorHandle = {
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<void>;
    resetMonitoring: () => void;
    startAnalyzing: () => void;
};

type InterviewMonitorProps = {
    sessionId: number;
    transcript: string;
    emotion: string;
    eyeContact: string;
    fillerWords: number;
    fluency: number;
    overallScore: number;
    recommendation: string;
    onMetricsUpdate: (metrics: {
        transcript: string;
        emotion: string;
        eyeContact: string;
        fillerWords: number;
        fluency: number;
        overallScore: number;
        recommendation: string;
    }) => void;
};

const InterviewMonitor = forwardRef<
    InterviewMonitorHandle,
    InterviewMonitorProps
>(
    (
        {
            sessionId,
            onMetricsUpdate,
        },
        ref
    ) => {
        const webcamRef = useRef<Webcam>(null);
        const mediaRecorderRef = useRef<MediaRecorder | null>(null);
        const streamRef = useRef<MediaStream | null>(null);
        const audioChunksRef = useRef<Blob[]>([]);
        const recordingRef = useRef(false);

        const token = localStorage.getItem("token");

        //-----------------------------------------
        // Reset Monitoring UI
        //-----------------------------------------
        const resetMonitoring = () => {
            onMetricsUpdate({
                transcript: "Waiting...",
                emotion: "--",
                eyeContact: "--",
                fillerWords: 0,
                fluency: 0,
                overallScore: 0,
                recommendation: "--",
            });
        };

        //-----------------------------------------
        // Show Analyzing State
        //-----------------------------------------
        const startAnalyzing = () => {
            onMetricsUpdate({
                transcript: "Analyzing your answer...",
                emotion: "Analyzing...",
                eyeContact: "Analyzing...",
                fillerWords: 0,
                fluency: 0,
                overallScore: 0,
                recommendation: "Generating AI feedback...",
            });
        };

        //-----------------------------------------
        // Capture Webcam Image
        //-----------------------------------------
        const captureImage = (): Blob | null => {
            const screenshot = webcamRef.current?.getScreenshot();
            if (!screenshot) return null;

            const arr = screenshot.split(",");
            const mime = arr[0].match(/:(.*?);/)?.[1] || "image/jpeg";
            const bstr = atob(arr[1]);
            const u8arr = new Uint8Array(bstr.length);

            for (let i = 0; i < bstr.length; i++) {
                u8arr[i] = bstr.charCodeAt(i);
            }

            return new Blob([u8arr], { type: mime });
        };

        //-----------------------------------------
        // Start Recording
        //-----------------------------------------
        const startRecording = async () => {
            if (recordingRef.current) return;

            recordingRef.current = true;
            audioChunksRef.current = [];

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            streamRef.current = stream;

            let options = {};
            if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
                options = { mimeType: "audio/webm;codecs=opus" };
            }

            const recorder = new MediaRecorder(stream, options);
            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            audioChunksRef.current = [];
            recorder.start(1000);
            console.log("Recording Started");
        };

        //-----------------------------------------
        // Stop Recording
        //-----------------------------------------
        const stopRecording = async () => {
            return new Promise<void>((resolve) => {
                const recorder = mediaRecorderRef.current;

                if (!recorder || recorder.state !== "recording") {
                    recordingRef.current = false;
                    resolve();
                    return;
                }

                recorder.onstop = async () => {
                    streamRef.current
                        ?.getTracks()
                        .forEach((track) => track.stop());

                    recordingRef.current = false;
                    console.log("Recording Stopped");
                    resolve();
                };

                recorder.stop();
            });
        };

        //-----------------------------------------
        // Analyze Recording
        //-----------------------------------------
        const analyze = async () => {
            const image = captureImage();
            if (!image) {
                console.log("Image not captured.");
                return;
            }

            const audioBlob = new Blob(audioChunksRef.current, {
                type: "audio/webm",
            });

            if (audioBlob.size < 1000) {
                console.log("Audio too small.");
                return;
            }

            const form = new FormData();
            form.append("audio", audioBlob, "speech.webm");
            form.append("image", image, "frame.jpg");
            form.append("session_id", sessionId.toString());

            try {
                const response = await axios.post(
                    "http://127.0.0.1:8000/api/v1/interview-monitor/analyze",
                    form,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = response.data;

                onMetricsUpdate?.({
                    transcript: data.speech.text,
                    emotion: data.emotion.dominant_emotion,
                    eyeContact: data.eye_contact.eye_contact
                        ? "Detected"
                        : "Looking Away",
                    fillerWords: data.filler_words.total_fillers,
                    fluency: data.filler_words.fluency_score,
                    overallScore: data.score.overall_score,
                    recommendation: data.score.recommendation,
                });

                audioChunksRef.current = [];
            } catch (err) {
                console.error(err);
            }
        };

        //-----------------------------------------
        // Expose Functions
        //-----------------------------------------
        useImperativeHandle(ref, () => ({
            startRecording,
            stopRecording: async () => {
                await stopRecording();
                await analyze();
            },
            resetMonitoring,
            startAnalyzing,
        }));

        //-----------------------------------------
        // Clean camera only (matches target UI)
        //-----------------------------------------
        return (
            <Webcam
                ref={webcamRef}
                mirrored
                audio={false}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                    width: 1280,
                    height: 720,
                    facingMode: "user",
                }}
                className="w-full rounded-xl aspect-video object-cover bg-black"
            />
        );
    }
);

export default InterviewMonitor;