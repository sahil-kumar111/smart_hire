import whisper


class SpeechToText:

    def __init__(self):

        self.model = whisper.load_model(
            "base"
        )

    def transcribe(
        self,
        audio_path: str,
    ):

        result = self.model.transcribe(
            audio_path
        )

        text = result["text"].strip()

        words = text.split()

        duration = 0.0

        if (
            "segments" in result
            and len(result["segments"]) > 0
        ):

            duration = result["segments"][-1]["end"]

        return {

            "text": text,

            "word_count": len(words),

            "duration": round(duration, 2),

        }