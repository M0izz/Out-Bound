import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.models.database import init_db
from app.seed_data import seed_database
from app.routers import user, quests, challenges, leaderboard, shop, exploration

app = FastAPI(
    title="OUT BOUND — AI Game Master for the Real World",
    description="Backend API powering real-world outdoor questing, open-weight Gemma Game Master, and GRASS rewards.",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(user.router, prefix=settings.API_PREFIX)
app.include_router(quests.router, prefix=settings.API_PREFIX)
app.include_router(challenges.router, prefix=settings.API_PREFIX)
app.include_router(leaderboard.router, prefix=settings.API_PREFIX)
app.include_router(shop.router, prefix=settings.API_PREFIX)
app.include_router(exploration.router, prefix=settings.API_PREFIX)

@app.on_event("startup")
def on_startup():
    init_db()
    seed_database()
    print("[OUT BOUND] Database initialized and seeded with demo player MOIZ!")

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "app": "OUT BOUND",
        "tagline": "Complete quests. Touch grass. Earn GRASS.",
        "gemma_model": settings.GEMMA_MODEL
    }

@app.get("/")
def root():
    return {
        "message": "Welcome to OUT BOUND — Your AI Game Master for the real world.",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
