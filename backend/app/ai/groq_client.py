import logging
import time

from groq import Groq

from app.core.config import settings

logger = logging.getLogger(__name__)


class GroqClient:
    def __init__(self):
        self.client = None
        if settings.GROQ_API_KEY:
            self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = getattr(settings, "GROQ_MODEL", "openai/gpt-oss-120b") or "openai/gpt-oss-120b"

    def _generate_gemini(self, prompt: str) -> str:
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY is not configured.")
        from google import genai

        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        model = getattr(settings, "GEMINI_MODEL", "gemini-3.8-flash") or "gemini-3.8-flash"
        response = client.models.generate_content(
            model=model,
            contents=prompt,
        )
        return (response.text or "").strip()

    def generate(
        self,
        prompt: str,
    ) -> str:
        # If explicitly set to gemini or groq key is missing, use Gemini directly
        if getattr(settings, "AI_PROVIDER", "groq") == "gemini" or not settings.GROQ_API_KEY:
            return self._generate_gemini(prompt)

        retries = 3
        last_error = None

        for attempt in range(retries):
            try:
                response = self.client.chat.completions.create(
                    model=self.model,
                    temperature=0.2,
                    messages=[
                        {
                            "role": "user",
                            "content": prompt,
                        }
                    ],
                )
                content = response.choices[0].message.content or ""
                if content.strip():
                    return content.strip()
            except Exception as e:
                last_error = e
                logger.warning(f"Groq API attempt {attempt + 1} failed: {e}")
                time.sleep(1.5)

        # Fallback to Gemini if Groq exhausted retries and Gemini key exists
        if settings.GEMINI_API_KEY:
            try:
                logger.info("Falling back to Gemini for text generation...")
                return self._generate_gemini(prompt)
            except Exception as gemini_err:
                logger.error(f"Gemini fallback also failed: {gemini_err}")

        if last_error:
            raise last_error
        raise RuntimeError("Failed to generate response from AI provider.")