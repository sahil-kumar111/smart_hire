from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass


import app.models.user
import app.models.resume
import app.models.interview_session
import app.models.interview_answer
import app.models.interview_question
import app.models.interview_monitor
import app.models.interview_monitor_snapshot
import app.models.resume_analysis
import app.models.interview_conversation