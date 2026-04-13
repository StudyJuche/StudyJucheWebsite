from sqlmodel import SQLModel, create_engine, Session
import os
from dotenv import load_dotenv
from sqlalchemy import text # Import text

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./database.db")

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    # This is a workaround to ensure the ENUM type is created for PostgreSQL
    if "postgresql" in engine.url.drivername:
        with engine.connect() as conn:
            # Check if the type already exists
            result = conn.execute(text("SELECT 1 FROM pg_type WHERE typname = 'userrole'"))
            if result.scalar_one_or_none() is None:
                conn.execute(text("CREATE TYPE userrole AS ENUM ('admin', 'moderator', 'student')"))
            conn.commit()
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
