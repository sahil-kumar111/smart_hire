from fastapi import (
    APIRouter,
    UploadFile,
    File,
    HTTPException,
)
from pathlib import Path
import shutil
from app.speech.speech_to_text import SpeechToText
from app.speech.filler_word_detector import FillerWordDetector
from app.speech.emotion_detector import EmotionDetector
from app.speech.eye_contact_detector import EyeContactDetector
from app.speech.scoring_engine import ScoringEngine


router = APIRouter(
    prefix="/speech",
    tags=["Speech"],
)

UPLOAD_DIR = Path(
    "uploads/audio"
)

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

IMAGE_UPLOAD_DIR = Path(
    "uploads/images"
)

IMAGE_UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

@router.post("/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(...),
):

    if not audio.filename:

        raise HTTPException(
            status_code=400,
            detail="No audio uploaded.",
        )

    file_path = (
        UPLOAD_DIR
        / audio.filename
    )

    with open(
        file_path,
        "wb",
    ) as buffer:

        shutil.copyfileobj(
            audio.file,
            buffer,
        )

    speech = SpeechToText()

    transcript = speech.transcribe(
        str(file_path)
    )

    detector = FillerDetector()

    analysis = detector.analyze(
        transcript
    )

    communication_score = round(
        analysis["fluency_score"] / 10,
        2,
    )

    return {

        "transcript": transcript,

        "filler_words": analysis,

        "communication_score": communication_score,
    }

@router.post("/emotion")
async def detect_emotion(
    image: UploadFile = File(...),
):

    if not image.filename:
        raise HTTPException(
            status_code=400,
            detail="No image uploaded.",
        )

    file_path = IMAGE_UPLOAD_DIR / image.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    detector = EmotionDetector()

    result = detector.detect(str(file_path))

    engine = ScoringEngine()

    score = engine.calculate(
        filler_count=0,
        emotion=result["dominant_emotion"],
        eye_contact=True,
    )

    return {
        **result,
        **score,
    }

@router.post("/eye-contact")
async def detect_eye_contact(
    image: UploadFile = File(...),
):

    if not image.filename:

        raise HTTPException(
            status_code=400,
            detail="No image uploaded.",
        )

    file_path = (
        IMAGE_UPLOAD_DIR
        / image.filename
    )

    with open(
        file_path,
        "wb",
    ) as buffer:

        shutil.copyfileobj(
            image.file,
            buffer,
        )

    detector = EyeContactDetector()

    result = detector.detect(
        str(file_path)
    )

    engine = ScoringEngine()

    score = engine.calculate(

        filler_count=0,

        emotion="neutral",

        eye_contact=result["eye_contact"],

    )

    return {

        **result,

        **score,
    }