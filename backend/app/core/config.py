from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "VidyāMitra API"
    
    # API Keys - Made optional for easier local startup
    OPENAI_API_KEY: Optional[str] = None
    GOOGLE_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None
    YOUTUBE_API_KEY: Optional[str] = None
    PEXELS_API_KEY: Optional[str] = None
    NEWS_API_KEY: Optional[str] = None
    EXCHANGE_API_KEY: Optional[str] = None
    JSEARCH_API_KEY: Optional[str] = None  # RapidAPI JSearch for job listings

    # Database - Made optional
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None
    
    # Security - Made optional with default for dev
    JWT_SECRET: str = "dev_secret_key" 
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        import os
        # Look for .env in the backend directory regardless of where the server is started from
        env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")
        env_file_encoding = "utf-8"
        extra = "ignore" 

settings = Settings()
