"""
FastAPI application for Pharmaceutical Quality Management System (QMS).
Complaint Intake and Analysis module.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.config import settings
from app.database import init_db
from app.api import extraction, complaints, chat, risk_analysis

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle startup and shutdown events."""
    # Startup
    logger.info("Starting Pharmaceutical QMS API")
    try:
        init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.warning(f"Continuing without database: {e}")
        logger.info("AI features (extraction, chat, risk analysis) will work normally")

    yield

    # Shutdown
    logger.info("Shutting down Pharmaceutical QMS API")


# Initialize FastAPI app
app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    description="Pharmaceutical Quality Management System - Complaint Intake API",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(extraction.router)
app.include_router(complaints.router)
app.include_router(chat.router)
app.include_router(risk_analysis.router)


# Health check endpoint
@app.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "healthy",
        "service": "Pharmaceutical QMS - Complaint Intake API",
        "version": settings.api_version
    }


# Root endpoint
@app.get("/", tags=["root"])
async def root():
    """Root endpoint with API information."""
    return {
        "name": settings.api_title,
        "version": settings.api_version,
        "description": "Pharmaceutical Quality Management System - Complaint Intake API",
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "extraction": {
                "POST /api/extract": "Extract complaint data from raw text"
            },
            "complaints": {
                "POST /api/complaints": "Create new complaint",
                "GET /api/complaints": "List complaints with filtering",
                "GET /api/complaints/{id}": "Get specific complaint",
                "PUT /api/complaints/{id}": "Update complaint"
            },
            "chat": {
                "POST /api/chat": "Chat about complaint details"
            },
            "risk_analysis": {
                "POST /api/analyze-risk": "Bonus Feature: Analyze complaint risk & completeness"
            }
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info",
        reload=settings.debug
    )
