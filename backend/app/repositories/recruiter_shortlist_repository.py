from sqlalchemy.orm import Session
from app.models.recruiter_shortlist import RecruiterShortlist


class RecruiterShortlistRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_by_recruiter(self, recruiter_id: int):
        return (
            self.db.query(RecruiterShortlist)
            .filter(RecruiterShortlist.recruiter_id == recruiter_id)
            .all()
        )

    def get_one(self, recruiter_id: int, session_id: int):
        return (
            self.db.query(RecruiterShortlist)
            .filter(
                RecruiterShortlist.recruiter_id == recruiter_id,
                RecruiterShortlist.session_id == session_id,
            )
            .first()
        )

    def upsert(self, recruiter_id: int, session_id: int, status: str):
        row = self.get_one(recruiter_id, session_id)

        if row:
            row.status = status
            self.db.commit()
            self.db.refresh(row)
            return row

        row = RecruiterShortlist(
            recruiter_id=recruiter_id,
            session_id=session_id,
            status=status,
        )
        self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row