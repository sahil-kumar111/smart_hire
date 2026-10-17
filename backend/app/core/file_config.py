from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent

UPLOAD_FOLDER = BASE_DIR / "uploads"

RESUME_FOLDER = UPLOAD_FOLDER / "resumes"

RESUME_FOLDER.mkdir(
    parents=True,
    exist_ok=True
)