class InterviewReportGenerator:

    def generate(
        self,
        speech: dict,
        filler: dict,
        emotion: dict,
        eye_contact: dict,
        communication: dict,
        confidence: dict,
    ):

        strengths = []

        improvements = []

        # ------------------------
        # Communication
        # ------------------------

        if communication["communication_level"] in [
            "Excellent",
            "Good",
        ]:
            strengths.append(
                "Good communication skills."
            )
        else:
            improvements.append(
                "Improve communication clarity."
            )

        # ------------------------
        # Filler Words
        # ------------------------

        if filler["total_fillers"] <= 3:
            strengths.append(
                "Very few filler words."
            )
        else:
            improvements.append(
                "Reduce filler words like 'um' and 'uh'."
            )

        # ------------------------
        # Eye Contact
        # ------------------------

        if eye_contact["eye_contact"]:
            strengths.append(
                "Maintained eye contact."
            )
        else:
            improvements.append(
                "Maintain better eye contact."
            )

        # ------------------------
        # Emotion
        # ------------------------

        emotion_name = emotion["dominant_emotion"]

        if emotion_name in [
            "happy",
            "neutral",
        ]:
            strengths.append(
                "Professional facial expressions."
            )
        else:
            improvements.append(
                "Maintain a calm and positive expression."
            )

        # ------------------------
        # Confidence
        # ------------------------

        if confidence["confidence_level"] == "Excellent":
            strengths.append(
                "High confidence level."
            )

        elif confidence["confidence_level"] == "Needs Improvement":
            improvements.append(
                "Build confidence while answering."
            )

        return {

            "transcript": speech["text"],

            "overall_score":
                confidence["confidence_score"],

            "confidence":
                confidence["confidence_level"],

            "strengths": strengths,

            "areas_for_improvement": improvements,

            "recommendation":

                "Ready for Interview"

                if confidence["confidence_score"] >= 75

                else

                "Needs More Practice"

        }