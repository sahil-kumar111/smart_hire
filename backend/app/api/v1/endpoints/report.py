from pathlib import Path

from fastapi import APIRouter
from fastapi.responses import FileResponse

router = APIRouter(
    prefix="/report",
    tags=["PDF Report"],
)


@router.get("/{session_id}")
def download_report(
    session_id: int,
):

    filename = (
        Path("reports")
        / f"interview_{session_id}.pdf"
    )

    return FileResponse(

        path=str(filename),

        media_type="application/pdf",

        filename=filename.name,

    )