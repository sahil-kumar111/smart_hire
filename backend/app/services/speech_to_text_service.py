import tempfile
import os

from fastapi import UploadFile

from groq import Groq

from app.core.config import settings


class SpeechToTextService:

    def __init__(self):

        self.client = Groq(
            api_key=settings.GROQ_API_KEY,
        )

    async def transcribe(
        self,
        audio: UploadFile,
    ) -> str:

        suffix = os.path.splitext(
            audio.filename or "audio.webm"
        )[1]

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix,
        ) as temp_file:

            content = await audio.read()

            temp_file.write(content)

            temp_path = temp_file.name

        try:

            with open(
                temp_path,
                "rb",
            ) as file:

                response = self.client.audio.transcriptions.create(

                    file=file,

                    model="whisper-large-v3",

                    response_format="verbose_json",

                    language="en",

                )

            return response.text.strip()

        finally:

            if os.path.exists(temp_path):

                os.remove(temp_path)