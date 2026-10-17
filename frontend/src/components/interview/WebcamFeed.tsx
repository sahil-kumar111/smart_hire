import { useRef, useEffect } from "react";
import Webcam from "react-webcam";

type WebcamFeedProps = {
  onCapture: (image: Blob) => void;
};

export default function WebcamFeed({
  onCapture,
}: WebcamFeedProps) {
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!webcamRef.current) return;

      const screenshot =
        webcamRef.current.getScreenshot();

      if (!screenshot) return;

      fetch(screenshot)
        .then((res) => res.blob())
        .then((blob) => onCapture(blob));
    }, 1000);

    return () => clearInterval(interval);
  }, [onCapture]);

  return (
    <Webcam
      ref={webcamRef}
      audio={false}
      screenshotFormat="image/jpeg"
      style={{
        width: "100%",
        borderRadius: "12px",
      }}
    />
  );
}