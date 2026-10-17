from fastapi import APIRouter

router = APIRouter(
    prefix="/interview-live",
    tags=["Interview Live"],
)

@router.get("/{session_id}")
def get_live_metrics(session_id: int):

    return {
        "overall_score": 8.4,
        "emotion": "Confident 😊",
        "eye_contact": "Excellent",
        "eye_contact_score": 91,
        "confidence": 89,
        "fluency": 8.8,
        "filler_words": 4,
        "recommendation": "Strong Hire",
        "status": "Interview Running",
    }