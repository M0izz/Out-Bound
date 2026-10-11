import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "OUT BOUND - Real-World AI Game Master"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    DATABASE_URL: str = "sqlite:///./outbound.db"
    
    # AI Engine Settings
    # Supports open-weight Gemma via HuggingFace Inference API, Ollama local endpoint, or Gemma mock provider
    GEMMA_MODEL: str = os.getenv("GEMMA_MODEL", "google/gemma-2-9b-it")
    HUGGINGFACE_API_KEY: str = os.getenv("HUGGINGFACE_API_KEY", "")
    OLLAMA_ENDPOINT: str = os.getenv("OLLAMA_ENDPOINT", "http://localhost:11434")
    AI_PROVIDER_TYPE: str = os.getenv("AI_PROVIDER_TYPE", "auto") # auto, gemma_hf, gemma_ollama, or mock

    class Config:
        env_file = ".env"

settings = Settings()
