class CommunicationAnalyzer:

    def analyze(
        self,
        transcript: str,
        filler_result: dict,
        eye_contact_percentage: float,
        dominant_emotion: str,
        duration_seconds: float,
    ):

        words = transcript.split()

        total_words = len(words)

        if duration_seconds <= 0:
            duration_seconds = 1

        words_per_minute = round(
            total_words * 60 / duration_seconds,
            2,
        )

        fluency = filler_result[
            "fluency_score"
        ]

        communication_score = fluency

        # Speaking speed

        if words_per_minute < 90:
            communication_score -= 10

        elif words_per_minute > 170:
            communication_score -= 8

        # Eye contact

        if eye_contact_percentage < 70:
            communication_score -= 10

        elif eye_contact_percentage < 85:
            communication_score -= 5

        # Emotion

        if dominant_emotion.lower() not in [
            "happy",
            "neutral",
        ]:
            communication_score -= 5

        communication_score = max(
            0,
            min(
                100,
                round(
                    communication_score,
                    2,
                ),
            ),
        )

        return {

            "words": total_words,

            "words_per_minute": words_per_minute,

            "fluency_score": fluency,

            "communication_score": communication_score,

        }