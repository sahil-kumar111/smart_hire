class FeedbackService:

    def generate(
        self,
        score: dict,
        filler: dict,
        emotion: dict,
        eye: dict,
    ):

        strengths = []
        weaknesses = []
        suggestions = []

        overall = score["overall_score"]

        if overall >= 90:
            summary = "Outstanding interview performance."
        elif overall >= 80:
            summary = "Excellent interview performance."
        elif overall >= 70:
            summary = "Good interview performance."
        elif overall >= 60:
            summary = "Average interview performance."
        else:
            summary = "Interview performance needs improvement."

        # Fluency
        if filler["fluency_score"] >= 85:
            strengths.append("Excellent verbal fluency.")
        else:
            weaknesses.append("Speech fluency is below the expected level.")
            suggestions.append(
                "Practice answering questions slowly and clearly."
            )

        # Fillers
        if filler["total_fillers"] <= 3:
            strengths.append("Very few filler words detected.")
        elif filler["total_fillers"] <= 8:
            weaknesses.append("Moderate filler word usage.")
            suggestions.append(
                "Reduce words like 'um', 'uh', 'like'."
            )
        else:
            weaknesses.append("Excessive filler words detected.")
            suggestions.append(
                "Practice mock interviews to reduce filler words."
            )

        # Eye Contact
        if eye["confidence"] >= 85:
            strengths.append("Excellent eye contact.")
        elif eye["confidence"] >= 70:
            strengths.append("Good eye contact.")
        else:
            weaknesses.append("Poor eye contact.")
            suggestions.append(
                "Look directly at the webcam while answering."
            )

        # Emotion
        emotion_name = emotion["dominant_emotion"]

        if emotion_name in ["happy", "neutral"]:
            strengths.append("Positive facial expression.")
        else:
            weaknesses.append(
                f"Detected emotion: {emotion_name}."
            )
            suggestions.append(
                "Maintain a calm and confident expression."
            )

        # Overall confidence
        if score["confidence_score"] >= 90:
            strengths.append("Highly confident speaker.")
        elif score["confidence_score"] < 70:
            weaknesses.append("Confidence level is low.")
            suggestions.append(
                "Increase speaking confidence through practice."
            )

        return {

            "summary": summary,

            "strengths": strengths,

            "weaknesses": weaknesses,

            "suggestions": suggestions,

        }