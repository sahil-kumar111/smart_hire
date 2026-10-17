from sqlalchemy.orm import Session
from app.models.job_description import JobDescription


class JobDescriptionRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_by_user(self, user_id: int) -> JobDescription | None:
        return (
            self.db.query(JobDescription)
            .filter(JobDescription.user_id == user_id)
            .first()
        )

    def create_or_update(self, user_id: int, jd_text: str) -> JobDescription:
        existing = self.get_by_user(user_id)

        if existing:
            existing.jd_text = jd_text
            self.db.commit()
            self.db.refresh(existing)
            return existing

        new_jd = JobDescription(user_id=user_id, jd_text=jd_text)
        self.db.add(new_jd)
        self.db.commit()
        self.db.refresh(new_jd)
        return new_jd