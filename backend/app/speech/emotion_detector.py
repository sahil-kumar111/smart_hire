from deepface import DeepFace


class EmotionDetector:

    def detect(
        self,
        image_path: str,
    ):

        result = DeepFace.analyze(
            img_path=image_path,
            actions=["emotion"],
            detector_backend="retinaface",
            enforce_detection=False,
        )

        if isinstance(result, list):
            result = result[0]

        return {

            "dominant_emotion": str(
                result["dominant_emotion"]
            ),

            "confidence": float(
                result["face_confidence"]
            ) if "face_confidence" in result else 100.0,

            "emotion_scores": {
                emotion: float(score)
                for emotion, score in result["emotion"].items()
            },
        }