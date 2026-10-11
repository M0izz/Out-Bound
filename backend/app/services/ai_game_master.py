import json
import logging
import random
import requests
from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, List
from app.config import settings
from app.models.schemas import StructuredGemmaQuest

logger = logging.getLogger(__name__)

CURATED_GAME_MASTER_TEMPLATES = [
    {
        "title": "Urban Horizon Recon",
        "description": "Step outside and venture beyond your usual commute route. Look for an architectural quirk or mural you never spotted before.",
        "category": "exploration",
        "difficulty": "medium",
        "rarity": "rare",
        "duration_minutes": 25,
        "steps": [
            "Put your phone away and head down an unfamiliar path or side street",
            "Maintain a steady pace for at least 20 minutes without checking social feeds",
            "Locate one visual detail or structure you have never noticed",
            "Snap a clear photo of the discovery before returning"
        ],
        "proof_type": "activity_and_photo",
        "reason": "Generated for Level 12 Explorer. Matches your preference for visual discovery and medium-distance walks."
    },
    {
        "title": "Canopy Shadow Hunt",
        "description": "Seek out the oldest or tallest tree in your neighborhood park. Stand beneath it and observe the crown for bird activity or leaf patterns.",
        "category": "nature",
        "difficulty": "easy",
        "rarity": "common",
        "duration_minutes": 15,
        "steps": [
            "Walk to the nearest green patch or community park",
            "Find a prominent mature tree with large canopy coverage",
            "Spend 10 minutes observing the natural foliage with eyes away from screens",
            "Take one upward photo framing the canopy against the sky"
        ],
        "proof_type": "photo",
        "reason": "Tailored quick nature reset to boost streak and clear mental fatigue."
    },
    {
        "title": "Clean Steps Expedition",
        "description": "A community steward mission. Take a stroll with a bag and pick up 5 pieces of discarded litter along your neighborhood path.",
        "category": "environment",
        "difficulty": "medium",
        "rarity": "uncommon",
        "duration_minutes": 20,
        "steps": [
            "Grab a recycled bag or glove before stepping outside",
            "Walk a minimum of 1 km along a local street or park border",
            "Safely collect and dispose of at least 5 pieces of non-biodegradable waste",
            "Record your step time and photograph the cleaned area or disposal bin"
        ],
        "proof_type": "activity_and_photo",
        "reason": "Aligned with Hacktoberfest Green Campaign. Boosts environmental stewardship XP."
    },
    {
        "title": "Golden Hour Frame",
        "description": "Observe natural light interplay on outdoor surfaces. Capture texture, shadow, or warm sunlight reflecting off brick, water, or foliage.",
        "category": "photography",
        "difficulty": "medium",
        "rarity": "rare",
        "duration_minutes": 30,
        "steps": [
            "Head outside toward an open view facing the sun angle",
            "Spend 25 continuous minutes walking through ambient natural light",
            "Find a composition that highlights contrast and natural geometry",
            "Capture a single evocative photograph without filters"
        ],
        "proof_type": "photo",
        "reason": "Matches your high affinity for discovery photography and outdoor mindfulness."
    },
    {
        "title": "The Silent Kilometer",
        "description": "Complete a 15-minute brisk walk completely free of headphones, calls, or screen glances. Tune your senses strictly to ambient soundscapes.",
        "category": "wellness",
        "difficulty": "easy",
        "rarity": "common",
        "duration_minutes": 15,
        "steps": [
            "Switch device to Do Not Disturb and slide it into your pocket",
            "Walk briskly outdoors for 15 unbroken minutes",
            "Count 3 distinct birds or natural sounds you hear",
            "Log your time upon return"
        ],
        "proof_type": "timer_only",
        "reason": "Fast daily recharge quest to keep streak alive while detoxing from screen strain."
    },
    {
        "title": "The Outpost Trek",
        "description": "Push your exploration perimeter. Reach a landmark, park entrance, or plaza at least 2 km away from your starting position.",
        "category": "exploration",
        "difficulty": "hard",
        "rarity": "epic",
        "duration_minutes": 45,
        "steps": [
            "Plot a destination you have rarely or never walked to on foot",
            "Maintain an active walking pace for 40+ minutes",
            "Reach the landmark and take in the view for 5 minutes",
            "Capture photographic proof of the distant landmark"
        ],
        "proof_type": "activity_and_photo",
        "reason": "Epic weekend challenge for high-tier XP and territory discovery."
    }
]

class AIProvider(ABC):
    @abstractmethod
    def generate_quest(self, player_context: Dict[str, Any]) -> StructuredGemmaQuest:
        pass

class GemmaHFProvider(AIProvider):
    """
    Inference with open-weight Gemma-2-9b-it via HuggingFace or custom inference endpoint.
    """
    def __init__(self, api_key: str, model_id: str):
        self.api_key = api_key
        self.model_id = model_id
        self.endpoint = f"https://api-inference.huggingface.co/models/{model_id}"

    def generate_quest(self, player_context: Dict[str, Any]) -> StructuredGemmaQuest:
        prompt = (
            f"<start_of_turn>user\n"
            f"You are the AI GAME MASTER for OUT BOUND (SideQuest), a real-world outdoor adventure game.\n"
            f"Your mission is to get the player to put their phone down and touch grass.\n\n"
            f"PLAYER CONTEXT:\n"
            f"- Username: {player_context.get('username', 'Player')}\n"
            f"- Level: {player_context.get('level', 1)}\n"
            f"- Preferred Activities: {player_context.get('preferred_categories', ['exploration', 'nature'])}\n"
            f"- Disliked Activities: {player_context.get('disliked_categories', ['running'])}\n"
            f"- Available Time: {player_context.get('available_time', 25)} minutes\n"
            f"- Target Difficulty: {player_context.get('difficulty', 'medium')}\n"
            f"- Category Requested: {player_context.get('category', 'auto')}\n\n"
            f"Respond ONLY with valid JSON with this exact schema:\n"
            f"{{\n"
            f'  "title": "Concise Game Quest Name",\n'
            f'  "description": "Engaging real-world prompt (2-3 sentences)",\n'
            f'  "category": "nature|movement|exploration|photography|environment|wellness",\n'
            f'  "difficulty": "easy|medium|hard|epic",\n'
            f'  "rarity": "common|uncommon|rare|epic|legendary",\n'
            f'  "duration_minutes": integer,\n'
            f'  "steps": ["Step 1", "Step 2", "Step 3"],\n'
            f'  "proof_type": "timer_only|photo|activity_and_photo",\n'
            f'  "reason": "Why the Game Master customized this for the player"\n'
            f"}}\n<end_of_turn>\n<start_of_turn>model\n"
        )

        headers = {"Authorization": f"Bearer {self.api_key}"}
        payload = {
            "inputs": prompt,
            "parameters": {"max_new_tokens": 450, "temperature": 0.7, "return_full_text": False}
        }

        response = requests.post(self.endpoint, headers=headers, json=payload, timeout=12)
        if response.status_code == 200:
            result = response.json()
            generated_text = ""
            if isinstance(result, list) and len(result) > 0:
                generated_text = result[0].get("generated_text", "")
            elif isinstance(result, dict):
                generated_text = result.get("generated_text", "")
            
            # Extract JSON block
            match = json.loads(generated_text)
            return StructuredGemmaQuest(**match)
        raise Exception(f"HF Inference failed with code {response.status_code}: {response.text}")

class GemmaOllamaProvider(AIProvider):
    """
    Inference with local open-weight Gemma model running in Ollama.
    """
    def __init__(self, endpoint: str, model_id: str):
        self.endpoint = endpoint
        self.model_id = model_id

    def generate_quest(self, player_context: Dict[str, Any]) -> StructuredGemmaQuest:
        url = f"{self.endpoint}/api/generate"
        system_instruction = (
            "You are the open-weight Gemma AI Game Master for OUT BOUND. "
            "Generate an authentic real-world outdoor mission. Return ONLY valid JSON."
        )
        prompt = (
            f"{system_instruction}\n\n"
            f"Player Context: {json.dumps(player_context)}\n"
            f"Return JSON matching: title, description, category, difficulty, rarity, duration_minutes, steps, proof_type, reason."
        )
        res = requests.post(url, json={"model": self.model_id, "prompt": prompt, "format": "json", "stream": False}, timeout=15)
        if res.status_code == 200:
            data = res.json()
            parsed = json.loads(data["response"])
            return StructuredGemmaQuest(**parsed)
        raise Exception(f"Ollama inference failed: {res.text}")

class MockGameMasterProvider(AIProvider):
    """
    High-fidelity deterministic open-weight Gemma simulation.
    Ensures seamless offline demo execution with rich personalization.
    """
    def generate_quest(self, player_context: Dict[str, Any]) -> StructuredGemmaQuest:
        available_time = player_context.get("available_time", 25)
        difficulty = player_context.get("difficulty", "medium").lower()
        requested_category = player_context.get("category")
        user_name = player_context.get("username", "Moiz")
        level = player_context.get("level", 12)

        # Filter or adapt templates
        candidates = list(CURATED_GAME_MASTER_TEMPLATES)
        if requested_category and requested_category != "auto":
            matched = [t for t in candidates if t["category"] == requested_category]
            if matched:
                candidates = matched

        selected = random.choice(candidates)
        
        # Determine rarity based on difficulty & duration
        if available_time >= 40 or difficulty in ["hard", "epic"]:
            rarity = "epic" if difficulty == "epic" else "rare"
        elif available_time <= 15 and difficulty == "easy":
            rarity = "common"
        else:
            rarity = "uncommon" if difficulty == "easy" else "rare"

        # Personalize reason
        reason = (
            f"Crafted specifically for {user_name} (Level {level}). "
            f"Calibrated for {available_time} minutes of real-world outdoor exposure "
            f"focusing on {selected['category'].title()} discovery."
        )

        return StructuredGemmaQuest(
            title=selected["title"],
            description=selected["description"],
            category=selected["category"],
            difficulty=difficulty,
            rarity=rarity,
            duration_minutes=available_time if available_time > 10 else selected["duration_minutes"],
            steps=selected["steps"],
            proof_type=selected["proof_type"],
            reason=reason
        )

class GameMasterService:
    def __init__(self):
        self.provider: AIProvider = self._initialize_provider()

    def _initialize_provider(self) -> AIProvider:
        # Check if HuggingFace API key is present
        if settings.HUGGINGFACE_API_KEY:
            try:
                return GemmaHFProvider(settings.HUGGINGFACE_API_KEY, settings.GEMMA_MODEL)
            except Exception as e:
                logger.warning(f"Could not initialize HF Gemma provider: {e}")

        # Check if local Ollama is running
        try:
            res = requests.get(f"{settings.OLLAMA_ENDPOINT}/api/tags", timeout=1)
            if res.status_code == 200:
                return GemmaOllamaProvider(settings.OLLAMA_ENDPOINT, "gemma2:9b")
        except Exception:
            pass

        # Default to High-fidelity Provider
        return MockGameMasterProvider()

    def generate_personalized_quest(self, player_context: Dict[str, Any]) -> StructuredGemmaQuest:
        try:
            return self.provider.generate_quest(player_context)
        except Exception as e:
            logger.error(f"AI Provider error: {e}. Falling back to resilient Game Master template.")
            mock = MockGameMasterProvider()
            return mock.generate_quest(player_context)

game_master_service = GameMasterService()
