import os
import uuid
import traceback

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    Depends,
    HTTPException,
)

from sqlalchemy.orm import Session

from app.database.session import get_db

from app.speech.speech_to_text import SpeechToText
from app.speech.filler_word_detector import FillerWordDetector
from app.speech.emotion_detector import EmotionDetector
from app.speech.eye_contact_detector import EyeContactDetector
from app.speech.scoring_engine import ScoringEngine

from app.services.feedback_service import FeedbackService
from app.services.interview_monitoring_service import InterviewMonitoringService
from app.services.monitor_snapshot_service import MonitorSnapshotService
from app.services.pdf_report_service import PDFReportService

router = APIRouter(
    prefix="/interview-monitor",
    tags=["Interview Monitoring"],
)


@router.post("/analyze")
async def analyze_interview(
    session_id: int = Form(...),
    audio: UploadFile = File(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
):

    # ---------------------------------
    # Validate uploaded files
    # ---------------------------------

    if not audio.content_type:
        raise HTTPException(
            status_code=400,
            detail="Audio file has no content type.",
        )

    if not image.content_type:
        raise HTTPException(
            status_code=400,
            detail="Image file has no content type.",
        )

    if not audio.content_type.startswith("audio"):
        raise HTTPException(
            status_code=400,
            detail="Invalid audio file.",
        )

    if not image.content_type.startswith("image"):
        raise HTTPException(
            status_code=400,
            detail="Invalid image file.",
        )

    audio_path = (
        f"temp_{uuid.uuid4().hex}_{audio.filename}"
    )

    image_path = (
        f"temp_{uuid.uuid4().hex}_{image.filename}"
    )

    try:

        # ---------------------------------
        # Save uploaded files
        # ---------------------------------

        with open(audio_path, "wb") as f:
            f.write(await audio.read())

        with open(image_path, "wb") as f:
            f.write(await image.read())

        # ---------------------------------
        # Speech To Text
        # ---------------------------------

        speech = SpeechToText().transcribe(
            audio_path
        )

        if speech.get("word_count", 0) == 0:

            raise HTTPException(
                status_code=400,
                detail="No speech detected in the uploaded audio.",
            )

        # ---------------------------------
        # Filler Detection
        # ---------------------------------

        filler = FillerWordDetector().analyze(
            speech["text"]
        )

        # ---------------------------------
        # Emotion Detection
        # ---------------------------------

        emotion = EmotionDetector().detect(
            image_path
        )

        # ---------------------------------
        # Eye Contact Detection
        # ---------------------------------

        eye = EyeContactDetector().detect(
            image_path
        )

        # ---------------------------------
        # AI Score
        # ---------------------------------

        score = ScoringEngine().calculate(
            speech,
            filler,
            emotion,
            eye,
        )

        MonitorSnapshotService().save(

            db,

            {

                "session_id": session_id,

                "second": speech["duration"],

                "emotion": emotion["dominant_emotion"],

                "eye_contact_score": eye["confidence"],

                "fluency_score": filler["fluency_score"],

                "filler_count": filler["total_fillers"],

                "overall_score": score["overall_score"],

            }

        )

        # ---------------------------------
        # AI Feedback
        # ---------------------------------

        feedback = FeedbackService().generate(
            score,
            filler,
            emotion,
            eye,
        )

        # ---------------------------------
        # Database Report
        # ---------------------------------

        report = {

            "session_id": session_id,

            "transcript": speech.get(
                "text",
                "",
            ),

            "word_count": speech.get(
                "word_count",
                0,
            ),

            "duration": speech.get(
                "duration",
                0.0,
            ),

            "filler_count": filler.get(
                "total_fillers",
                0,
            ),

            "fluency_score": filler.get(
                "fluency_score",
                0,
            ),

            "confidence_score": score.get(
                "confidence_score",
                0,
            ),

            "dominant_emotion": emotion.get(
                "dominant_emotion",
                "unknown",
            ),

            "eye_contact_score": eye.get(
                "confidence",
                0,
            ),

            "overall_score": score.get(
                "overall_score",
                0,
            ),

            "recommendation": score.get(
                "recommendation",
                "N/A",
            ),

            "summary": feedback.get(
                "summary",
                "",
            ),

            "strengths": feedback.get(
                "strengths",
                [],
            ),

            "weaknesses": feedback.get(
                "weaknesses",
                [],
            ),

            "suggestions": feedback.get(
                "suggestions",
                [],
            ),

        }

        # ---------------------------------
        # Save Report
        # ---------------------------------

        InterviewMonitoringService().save(
            db,
            report,
        )

        # ---------------------------------
        # Generate PDF
        # ---------------------------------

        pdf_path = PDFReportService().generate(
            report
        )

        # ---------------------------------
        # API Response
        # ---------------------------------

        return {

            "speech": speech,

            "filler_words": filler,

            "emotion": emotion,

            "eye_contact": eye,

            "score": score,

            "feedback": feedback,

            "saved": True,

            "pdf": pdf_path,

        }

    except HTTPException:
        raise

    except Exception as e:

        traceback.print_exc() 

        raise HTTPException(
            status_code=500,
            detail=f"Interview analysis failed: {str(e)}",
        )

    finally:

        if os.path.exists(audio_path):
            os.remove(audio_path)

        if os.path.exists(image_path):
            os.remove(image_path)