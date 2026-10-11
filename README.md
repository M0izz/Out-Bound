<div align="center">

# 🌱 OUT BOUND
### *The Real-World AI Game Master Powered by Open-Weight Gemma*

**Complete Quests. Touch Grass. Earn $GRASS.**

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React 19](https://img.shields.io/badge/React-19.2+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.3+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![AI Engine](https://img.shields.io/badge/Gemma_2-9B_IT-FF6F00?style=for-the-badge&logo=google&logoColor=white)](https://huggingface.co/google/gemma-2-9b-it)

---

</div>

## 📖 Overview

**OUT BOUND** transforms the physical outdoors into an immersive RPG adventure. Designed to tackle modern screen-fatigue and digital burnout, OUT BOUND pairs players with an open-weight **Gemma AI Game Master** that crafts context-aware outdoor expeditions, verifies real-world proof of exploration, and rewards players with XP, badges, and **GRASS tokens**.

Whether it's a 10-minute courtyard sunlight reset between coding sprints or an epic 45-minute neighborhood photography expedition, OUT BOUND urges you to put your phone in your pocket, explore the real world, and level up your IRL stats.

---

## ✨ Key Features

### 🤖 Gemma AI Game Master
* **Autonomous Quest Crafter:** Dynamically generates bespoke quests using Google Gemma (`google/gemma-2-9b-it`) via Hugging Face Inference API, local Ollama, or built-in procedural mock fallback.
* **Smart Prompt Hinting:** Customize your mission with tags like *"photograph autumn trees"*, *"find historical landmarks"*, or *"20-minute coffee break stroll"*.
* **Atmospheric Lore:** Every quest features personalized Game Master commentary explaining why the mission was selected for your playstyle.

### 🌅 Daily Quest Drops & Tiered Expeditions
* **Chill Drop (10–15 min):** Gentle wellness walks, mindful breathing, courtyard sunlight resets.
* **Explorer Drop (20–30 min):** Architectural photography, botanical discovery, hidden alleyway navigation.
* **Hardcore Drop (40–60 min):** High-tempo perimeter walks, elevation climbs, endurance navigation.

### 🧭 Fog of War Exploration Grid
* Interactive sector grid dividing your city into undiscovered zones.
* Clear the fog as you complete quests in distinct sectors.
* Advance sectors from **Unexplored** → **Discovered** → **Mastered** with real-time sector metrics.

### 🛡️ Real-World Verification Engine
* **Multimodal Proof Assessment:** Evaluates outdoor honesty, duration timing, GPS distance estimates, and photo descriptions.
* **Anti-Cheat Verification:** Flags impossible speeds, mismatched durations, or indoor shortcuts with contextual game-master reflections.

### 🌿 GRASS Economy & Shop
* Complete quests and seasonal challenges to earn **GRASS tokens**.
* Purchase utility items like **Streak Shields**, **XP Multipliers**, cosmetic **Profile Frames**, and outdoor equipment perks.

### 🏆 Campus & Global Leaderboards
* Competitive rankings filterable by **Global**, **College / Campus**, and **Friends Circle**.
* Dynamic tier progression from *Sprout Wanderer* to *Grandmaster Wayfarer*.

---

## 🎨 Design Philosophy: Hacktoberfest Neo-Brutalism

OUT BOUND features a high-contrast Neo-Brutalist interface inspired by Hacktoberfest and classic tactical field guides:
* **Rich Earth Palette:** Deep Forest Teal (`#2C4D46`), Sunlight Yellow (`#F5B726`), Signal Coral (`#FA5438`), and Cream Parchment (`#F2F2EB`).
* **Tactile Brutalism:** Hard 2px/4px solid ink borders (`#10201D`), bold block shadows, and halftone dot textures.
* **Phone-Away Screen:** A dedicated minimal high-contrast countdown view that instructs you to lock your screen and engage with the physical world.

---

## 🏗️ Architecture & Tech Stack

```mermaid
graph TD
    Client["React 19 + TypeScript + Vite SPA"] <--> API["FastAPI Serverless Application"]
    API <--> Gemma["Gemma 2 9B-IT (Hugging Face / Ollama)"]
    API <--> DB["SQLite / PostgreSQL via SQLAlchemy"]
    Client <--> Assets["Vercel Global Edge CDN"]
```

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite 8, Lucide Icons, Canvas Confetti, Vanilla CSS Tokens |
| **Backend** | FastAPI, Python 3.12, Pydantic v2, SQLAlchemy 2.0, Uvicorn |
| **AI Engine** | Google Gemma 2 9B-IT (HuggingFace Inference API / Ollama / Mock Engine) |
| **Database** | SQLite (`/tmp/outbound.db` on serverless, local `outbound.db` in dev) / PostgreSQL |
| **Hosting** | Vercel Serverless Functions + Vercel Edge Static CDN |

---

## 🚀 Quick Start (Local Development)

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **Python**: v3.10, 3.11, or 3.12

### 1. Clone the Repository
```bash
git clone https://github.com/M0izz/Out-Bound.git
cd Out-Bound
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI development server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
The interactive Swagger API documentation will be available at: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup
In a new terminal:
```bash
# Navigate to frontend directory
cd frontend

# Install npm dependencies
npm install

# Start Vite development server
npm run dev
```
Open your browser at: `http://localhost:5173`

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory or set these in your Vercel Project Settings:

```env
# AI Model Configuration
GEMMA_MODEL=google/gemma-2-9b-it
HUGGINGFACE_API_KEY=your_huggingface_token_here

# Local AI with Ollama (Optional)
OLLAMA_ENDPOINT=http://localhost:11434

# Provider Selection: auto, gemma_hf, gemma_ollama, or mock
AI_PROVIDER_TYPE=auto

# Database (Optional - defaults to local/temp SQLite)
# DATABASE_URL=postgresql://user:password@host:5432/outbound
```

> **Note on AI Mode:** If no Hugging Face API token is provided, OUT BOUND automatically operates using its built-in procedural Game Master engine, providing zero-configuration offline quests immediately!

---

## 📡 API Reference Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check & active Gemma engine model info |
| `GET` | `/api/user/profile` | Player profile stats, level progress, and streak state |
| `GET` | `/api/quests/daily` | Fetches today's three tiered quest drops (Chill, Explorer, Hardcore) |
| `GET` | `/api/quests/active` | Current ongoing outdoor mission (or `null`) |
| `POST` | `/api/quests/generate` | Generates a custom mission via Gemma AI Game Master |
| `POST` | `/api/quests/{id}/accept` | Locks in a quest as the player's active mission |
| `POST` | `/api/quests/{id}/proof` | Submits outdoor completion proof for verification & XP rewards |
| `POST` | `/api/quests/{id}/abandon`| Forfeits active mission |
| `GET` | `/api/challenges` | Active Hacktoberfest community challenges & progress |
| `GET` | `/api/leaderboard` | Rankings queryable by `global`, `college`, or `friends` |
| `GET` | `/api/shop/items` | Available utility perks, cosmetics, and streak shields |
| `POST` | `/api/shop/purchase` | Purchases shop items with earned GRASS balance |
| `GET` | `/api/exploration/summary`| Fog of War sector map discoveries and grid states |

---

## 🌐 Deploying to Vercel

OUT BOUND is fully pre-configured for **single-click zero-config Vercel deployment** hosting both the React SPA and FastAPI backend together.

1. Fork or push this repository to your GitHub account.
2. Go to **[vercel.com/new](https://vercel.com/new)** and import the repository.
3. Keep the **Root Directory** as `./` (default).
4. (Optional) Add your `HUGGINGFACE_API_KEY` under **Environment Variables**.
5. Click **Deploy**. Vercel will:
   - Install and compile the Vite frontend bundle into `frontend/dist`.
   - Provision serverless Python runtime for all `/api/*` endpoints.
   - Serve static assets through Vercel's Edge CDN.

---

## 🤝 Contributing

Contributions, quest prompts, and UI improvements are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingQuest`)
3. Commit your Changes (`git commit -m 'Add amazing new community quest'`)
4. Push to the Branch (`git push origin feature/AmazingQuest`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">
<sub>Crafted with 🌿 for outdoor explorers everywhere. Remember to look up and touch grass.</sub>
</div>
