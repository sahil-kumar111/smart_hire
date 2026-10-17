import time

from groq import Groq

from app.core.config import settings


class GroqClient:

    def __init__(self):

        self.client = Groq(
            api_key=settings.GROQ_API_KEY
        )

        self.model = "openai/gpt-oss-120b"

    def generate(
        self,
        prompt: str,
    ) -> str:

        retries = 3

        for attempt in range(retries):

            try:

                response = (
                    self.client.chat.completions.create(
                        model=self.model,
                        temperature=0,
                        messages=[
                            {
                                "role": "user",
                                "content": prompt,
                            }
                        ],
                    )
                )

                return (
                    response
                    .choices[0]
                    .message
                    .content
                )

            except Exception:

                if attempt == retries - 1:
                    raise

                time.sleep(2)