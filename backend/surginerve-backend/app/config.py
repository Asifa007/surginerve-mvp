"""
SurgiNerve – Configuration
Reads all settings from environment variables (never hardcode credentials).
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App
    APP_NAME: str = "SurgiNerve API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = "postgresql://surginerve:surginerve@localhost:5432/surginerve_db"

    # CORS – allow the frontend origin
    ALLOWED_ORIGINS: list[str] = [
        "https://surginerve-guardian.lovable.app",
        "http://localhost:3000",
        "http://localhost:5173",
    ]

    # ML
    MODEL_PATH: str = "app/ml/ebm_model.pkl"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()
