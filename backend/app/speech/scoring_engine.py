class ScoringEngine:

    def calculate(
        self,
        speech: dict,
        filler: dict,
        emotion: dict,
        eye: dict,
    ):

        # --------------------------
        # Fluency
        # --------------------------

        fluency = filler["fluency_score"]

        # --------------------------
        # Filler Score
        # --------------------------

        fillers = filler["total_fillers"]

        filler_score = max(
            0,
            100 - fillers * 5
        )

        # --------------------------
        # Eye Contact
        # --------------------------

        eye_score = eye["confidence"]

        # --------------------------
        # Emotion
        # --------------------------

        positive = [
            "happy",
            "neutral",
        ]

        dominant = emotion["dominant_emotion"]

        if dominant in positive:
            emotion_score = 100
        else:
            emotion_score = 60

        # --------------------------
        # Speaking Confidence
        # --------------------------

        word_count = speech["word_count"]

        if word_count >= 150:
            confidence = 100

        elif word_count >= 100:
            confidence = 90

        elif word_count >= 70:
            confidence = 80

        elif word_count >= 40:
            confidence = 70

        else:
            confidence = 50

        # --------------------------
        # Final Weighted Score
        # --------------------------

        final_score = (

            fluency * 0.25 +

            filler_score * 0.20 +

            eye_score * 0.20 +

            emotion_score * 0.15 +

            confidence * 0.20

        )

        final_score = round(final_score, 2)

        # --------------------------
        # Recommendation
        # --------------------------

        if final_score >= 90:
            recommendation = "Outstanding"

        elif final_score >= 80:
            recommendation = "Excellent"

        elif final_score >= 70:
            recommendation = "Good"

        elif final_score >= 60:
            recommendation = "Average"

        else:
            recommendation = "Needs Improvement"

        # --------------------------
        # AI Feedback
        # --------------------------

        feedback = []

        if fluency < 80:
            feedback.append(
                "Reduce filler words and speak more fluently."
            )

        if fillers > 5:
            feedback.append(
                "Avoid excessive use of words like 'um', 'uh', and 'like'."
            )

        if eye_score < 70:
            feedback.append(
                "Maintain better eye contact with the interviewer."
            )

        if dominant not in positive:
            feedback.append(
                "Maintain a calm and positive facial expression."
            )

        if confidence < 80:
            feedback.append(
                "Provide longer and more detailed answers."
            )

        if len(feedback) == 0:
            feedback.append(
                "Excellent interview performance. Keep it up!"
            )

        return {

            "overall_score": final_score,

            "communication_score": fluency,

            "filler_score": filler_score,

            "eye_contact_score": eye_score,

            "emotion_score": emotion_score,

            "confidence_score": confidence,

            "recommendation": recommendation,

            "feedback": feedback,

        }