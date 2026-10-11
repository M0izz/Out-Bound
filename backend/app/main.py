import os
from starlette.types import ASGIApp, Scope, Receive, Send
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.models.database import init_db
from app.seed_data import seed_database
from app.routers import user, quests, challenges, leaderboard, shop, exploration

# Custom ASGI middleware to fix Vercel rewrite paths if any
class VercelPathMiddleware:
    def __init__(self, app: ASGIApp):
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        if scope["type"] == "http":
            path = scope.get("path", "")
            for prefix in ["/app/main.py", "/main.py", "/api/index.py", "/index.py"]:
                if path == prefix:
                    scope["path"] = "/api"
                    break
                elif path.startswith(prefix + "/"):
                    scope["path"] = path[len(prefix):]
                    break
        await self.app(scope, receive, send)

app = FastAPI(
    title="OUT BOUND — AI Game Master for the Real World",
    description="Backend API powering real-world outdoor questing, open-weight Gemma Game Master, and GRASS rewards.",
    version="1.0.0"
)

# Fix Vercel path rewrites
app.add_middleware(VercelPathMiddleware)

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
@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "app": "OUT BOUND",
        "tagline": "Complete quests. Touch grass. Earn GRASS.",
        "gemma_model": settings.GEMMA_MODEL
    }

@app.get("/")
@app.get("/api")
def root():
    return {
        "status": "online",
        "message": "Welcome to OUT BOUND — Your AI Game Master for the real world.",
        "docs": "/docs",
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
