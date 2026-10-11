import os
import sys
import shutil

# Ensure backend directory is in Python sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND_DIR = os.path.join(BASE_DIR, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# In Vercel serverless environment, copy seed database to /tmp if it exists
if os.getenv("VERCEL"):
    tmp_db = "/tmp/outbound.db"
    src_db = os.path.join(BACKEND_DIR, "outbound.db")
    if os.path.exists(src_db) and not os.path.exists(tmp_db):
        try:
            shutil.copyfile(src_db, tmp_db)
        except Exception:
            pass

from app.main import app
