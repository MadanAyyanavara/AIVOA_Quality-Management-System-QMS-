from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    # Database
    database_url: str = "postgresql://user:password@localhost:5432/qms_db"

    # Groq API
    groq_api_key: str = ""

    # FastAPI
    api_title: str = "Pharmaceutical QMS"
    api_version: str = "1.0.0"
    debug: bool = False

    # CORS
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:5173"]

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
