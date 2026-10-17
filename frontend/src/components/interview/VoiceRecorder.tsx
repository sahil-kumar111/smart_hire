import { useRef, useState } from "react";
import { Mic, Square } from "lucide-react";

interface Props {
    onRecordingComplete: (blob: Blob) => void;
    disabled: boolean;
}

export default function VoiceRecorder({
    onRecordingComplete,
    disabled,
}: Props) {
    const recorder = useRef<MediaRecorder | null>(null);
    const chunks = useRef<Blob[]>([]);
    const [recording, setRecording] = useState(false);

    async function startRecording() {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
        });

        recorder.current = new MediaRecorder(stream);
        chunks.current = [];

        recorder.current.ondataavailable = (event) => {
            chunks.current.push(event.data);
        };

        recorder.current.onstop = () => {
            const blob = new Blob(chunks.current, {
                type: "audio/webm",
            });
            onRecordingComplete(blob);
        };

        recorder.current.start();
        setRecording(true);
    }

    function stopRecording() {
        recorder.current?.stop();
        setRecording(false);
    }

    return (
        <button
            disabled={disabled}
            onClick={() => {
                if (recording) stopRecording();
                else startRecording();
            }}
            className={`
                inline-flex items-center gap-2
                px-5 py-2.5
                rounded-xl
                text-sm font-medium
                transition
                shadow-sm
                border

                ${
                    recording
                        ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                        : "bg-blue-50 border-blue-100 text-blue-600 hover:bg-blue-100"
                }

                disabled:bg-gray-100
                disabled:text-gray-400
                disabled:border-gray-200
                disabled:cursor-not-allowed
            `}
        >
            {recording ? (
                <>
                    <Square size={15} className="fill-current" />
                    Stop Recording
                </>
            ) : (
                <>
                    <Mic size={16} />
                    Start Speaking
                </>
            )}
        </button>
    );
}