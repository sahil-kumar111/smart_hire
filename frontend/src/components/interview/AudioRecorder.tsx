import { useEffect, useRef } from "react";

type AudioRecorderProps = {
  onAudioReady: (audio: Blob) => void;
};

export default function AudioRecorder({
  onAudioReady,
}: AudioRecorderProps) {

  const mediaRecorder =
    useRef<MediaRecorder | null>(null);

  useEffect(() => {

    async function startRecording() {

      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      mediaRecorder.current =
        new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (
        event
      ) => {

        if (event.data.size > 0) {

          onAudioReady(event.data);

        }

      };

      mediaRecorder.current.start();

      setInterval(() => {

        if (mediaRecorder.current?.state === "recording") {

          mediaRecorder.current.stop();

          mediaRecorder.current.start();

        }

      }, 5000);

    }

    startRecording();

  }, [onAudioReady]);

  return null;

}