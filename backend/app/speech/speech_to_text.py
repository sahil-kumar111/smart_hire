import logging
import os
from app.core.config import settings

logger = logging.getLogger(__name__)


class SpeechToText:

    def __init__(self):
        self.model = None

    def transcribe(
        self,
        audio_path: str,
    ):
        # 1. Prefer Groq cloud Whisper if configured
        if settings.GROQ_API_KEY and os.path.exists(audio_path):
            try:
                from groq import Groq
                client = Groq(api_key=settings.GROQ_API_KEY)
                with open(audio_path, "rb") as f:
                    response = client.audio.transcriptions.create(
                        file=f,
                        model="whisper-large-v3",
                        response_format="verbose_json",
                        language="en",
                    )
                text = (getattr(response, "text", "") or "").strip()
                duration = float(getattr(response, "duration", 0.0) or 0.0)
                words = text.split()
                return {
                    "text": text,
                    "word_count": len(words),
                    "duration": round(duration, 2),
                }
            except Exception as e:
                logger.warning(f"Groq speech transcription failed: {e}. Trying local fallback...")

        # 2. Local Whisper fallback
        try:
            import whisper
            if self.model is None:
                self.model = whisper.load_model("base")
            result = self.model.transcribe(audio_path)
            text = result["text"].strip()
            words = text.split()
            duration = 0.0
            if "segments" in result and len(result["segments"]) > 0:
                duration = result["segments"][-1]["end"]
            return {
                "text": text,
                "word_count": len(words),
                "duration": round(duration, 2),
            }
        except Exception as e:
            logger.error(f"Local whisper transcription failed: {e}")
            return {
                "text": "",
                "word_count": 0,
                "duration": 0.0,
            }