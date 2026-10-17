class ConfidenceAnalyzer:

    def analyze(
        self,
        communication_score: float,
        eye_contact_percentage: float,
        dominant_emotion: str,
    ):

        confidence = communication_score

        # -----------------------
        # Eye Contact
        # -----------------------

        if eye_contact_percentage >= 95:
            confidence += 5

        elif eye_contact_percentage >= 85:
            confidence += 3

        elif eye_contact_percentage >= 70:
            confidence += 1

        else:
            confidence -= 8

        # -----------------------
        # Emotion
        # -----------------------

        emotion = dominant_emotion.lower()

        if emotion == "happy":
            confidence += 3

        elif emotion == "neutral":
            confidence += 2

        elif emotion in [
            "fear",
            "sad",
            "angry",
            "disgust",
        ]:
            confidence -= 6

        # -----------------------
        # Clamp
        # -----------------------

        confidence = max(
            0,
            min(
                100,
                round(
                    confidence,
                    2,
                ),
            ),
        )

        # -----------------------
        # Level
        # -----------------------

        if confidence >= 90:

            level = "Excellent"

        elif confidence >= 75:

            level = "Good"

        elif confidence >= 60:

            level = "Average"

        else:

            level = "Needs Improvement"

        return {

            "confidence_score": confidence,

            "confidence_level": level,

        }