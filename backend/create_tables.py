from app.database.base import Base
from app.database.session import engine
import app.models  # Ensures all 12 model tables are registered with Base.metadata

Base.metadata.create_all(bind=engine)

print("All application tables created successfully in database!")