from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings
import logging

logger = logging.getLogger(__name__)

# Flag to track if database is available
DB_AVAILABLE = False
engine = None
SessionLocal = None
Base = declarative_base()

try:
    engine = create_engine(
        settings.database_url,
        echo=settings.debug,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
        connect_args={"check_same_thread": False} if "sqlite" in settings.database_url else {}
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    DB_AVAILABLE = True
except Exception as e:
    logger.warning(f"Database connection failed (continuing without database): {e}")
    engine = None
    SessionLocal = None
    DB_AVAILABLE = False


def get_db():
    """Dependency for FastAPI to inject database sessions."""
    if not DB_AVAILABLE or SessionLocal is None:
        logger.warning("Database not available")
        return None

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables if database is available."""
    global DB_AVAILABLE

    if not engine or not SessionLocal:
        logger.warning("Skipping database initialization - database not configured")
        DB_AVAILABLE = False
        return

    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
        DB_AVAILABLE = True
    except Exception as e:
        logger.warning(f"Could not initialize database tables: {e}")
        DB_AVAILABLE = False
