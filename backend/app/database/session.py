from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

db_url = settings.sync_database_url if hasattr(settings, "sync_database_url") and settings.sync_database_url else settings.DATABASE_URL

engine = create_engine(
    db_url,
    pool_pre_ping=True,
    pool_recycle=300,
    echo=settings.DEBUG,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()