import os
from starlette.types import ASGIApp, Scope, Receive, Send
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.models.database import init_db
from app.seed_data import seed_database
from app.routers import user, quests, challenges, leaderboard, shop, exploration

# Initialize database eagerly on cold start
try:
    init_db()
    seed_database()
    print("[OUT BOUND] Database tables initialized and seeded.")
except Exception as e:
    print("[OUT BOUND] Database initialization notice:", e)

# Custom ASGI middleware to normalize Vercel rewrite prefixes
class VercelPathMiddleware:
    def __init__(self, app: ASGIApp):
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send):
        if scope["type"] == "http":
            path = scope.get("path", "")
            for prefix in ["/app/main.py", "/main.py", "/api/index.py", "/index.py"]:
                if path == prefix:
                    scope["path"] = "/"
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

# Include API Routers
app.include_router(user.router, prefix=settings.API_PREFIX)
app.include_router(quests.router, prefix=settings.API_PREFIX)
app.include_router(challenges.router, prefix=settings.API_PREFIX)
app.include_router(leaderboard.router, prefix=settings.API_PREFIX)
app.include_router(shop.router, prefix=settings.API_PREFIX)
app.include_router(exploration.router, prefix=settings.API_PREFIX)

@app.on_event("startup")
def on_startup():
    try:
        init_db()
        seed_database()
    except Exception:
        pass

@app.get("/health")
@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "app": "OUT BOUND",
        "tagline": "Complete quests. Touch grass. Earn GRASS.",
        "gemma_model": settings.GEMMA_MODEL
    }

@app.get("/api")
def api_root():
    return {
        "status": "online",
        "message": "Welcome to OUT BOUND API — AI Game Master for the real world.",
        "docs": "/docs",
        "health": "/health"
    }

# Locate compiled frontend distribution folder
current_dir = os.path.dirname(os.path.abspath(__file__))
dist_candidates = [
    os.path.join(current_dir, "..", "..", "frontend", "dist"),
    os.path.join(current_dir, "..", "frontend", "dist"),
    os.path.join(os.getcwd(), "frontend", "dist"),
    os.path.join(os.path.dirname(current_dir), "frontend", "dist"),
]
frontend_dist = next((d for d in dist_candidates if os.path.isdir(d)), None)

if frontend_dist and os.path.isdir(os.path.join(frontend_dist, "assets")):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

# Serve frontend index
@app.get("/")
@app.get("/index.html")
def root_index():
    if frontend_dist:
        index_file = os.path.join(frontend_dist, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
    return {
        "status": "online",
        "message": "Welcome to OUT BOUND — Your AI Game Master for the real world.",
        "docs": "/docs",
        "health": "/health"
    }

# SPA Fallback for any client-side routes (e.g. /quests, /map, /challenges)
@app.get("/{full_path:path}")
def catch_all(full_path: str):
    if not full_path.startswith("api") and frontend_dist:
        candidate_file = os.path.join(frontend_dist, full_path)
        if os.path.isfile(candidate_file):
            return FileResponse(candidate_file)
        index_file = os.path.join(frontend_dist, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
    return JSONResponse(status_code=404, content={"detail": "Not Found"})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
