import math
from typing import Dict, Any, Tuple

# Level Thresholds and Titles
LEVEL_TITLES = {
    1: "Rookie",
    5: "Walker",
    10: "Explorer",
    12: "Explorer",
    20: "Adventurer",
    30: "Trailblazer",
    50: "Outdoor Legend"
}

def get_level_title(level: int) -> str:
    for lvl in sorted(LEVEL_TITLES.keys(), reverse=True):
        if level >= lvl:
            return LEVEL_TITLES[lvl]
    return "Rookie"

def get_xp_for_next_level(level: int) -> int:
    """XP needed to reach next level: base 200 with smooth scaling."""
    return int(100 * (level ** 1.3) + 300)

class RewardEngine:
    """
    Deterministic Reward Engine.
    The AI generates the quest content, but the backend application code
    STRICTLY and deterministically calculates the XP, GRASS rewards and leveling.
    """

    @staticmethod
    def calculate_rewards(
        duration_minutes: int,
        difficulty: str,
        rarity: str,
        category: str
    ) -> Tuple[int, int]:
        """
        Calculates (xp_reward, grass_reward) deterministically.
        """
        base_reward = 10

        # Duration bonus
        if duration_minutes <= 15:
            duration_bonus = 10
        elif duration_minutes <= 30:
            duration_bonus = 20
        elif duration_minutes <= 45:
            duration_bonus = 30
        else:
            duration_bonus = 45

        # Difficulty multiplier
        diff = difficulty.lower()
        if diff == "easy":
            diff_mult = 1.0
        elif diff == "medium":
            diff_mult = 1.25
        elif diff == "hard":
            diff_mult = 1.5
        elif diff == "epic":
            diff_mult = 2.0
        else:
            diff_mult = 1.25

        # Rarity multiplier
        rar = rarity.lower()
        if rar == "common":
            rarity_mult = 1.0
        elif rar == "uncommon":
            rarity_mult = 1.3
        elif rar == "rare":
            rarity_mult = 1.6
        elif rar == "epic":
            rarity_mult = 2.2
        elif rar == "legendary":
            rarity_mult = 3.0
        else:
            rarity_mult = 1.0

        # Category bonuses
        cat = category.lower()
        category_bonus = 0
        if cat in ["environment", "community", "social"]:
            category_bonus = 20
        elif cat in ["exploration", "nature"]:
            category_bonus = 10

        # Calculate GRASS
        raw_grass = (base_reward + duration_bonus + category_bonus) * diff_mult * (0.8 + 0.3 * rarity_mult)
        grass_reward = max(15, int(round(raw_grass / 5.0) * 5))

        # Calculate XP (progression metric, slightly higher than GRASS)
        raw_xp = (base_reward + duration_bonus + category_bonus + 15) * diff_mult * 1.25
        xp_reward = max(20, int(round(raw_xp / 5.0) * 5))

        return xp_reward, grass_reward

    @staticmethod
    def process_level_progression(current_level: int, current_xp: int, xp_gain: int) -> Tuple[int, int, int, bool]:
        """
        Returns: (new_level, new_xp, xp_to_next, leveled_up)
        """
        new_xp = current_xp + xp_gain
        leveled_up = False
        level = current_level
        xp_needed = get_xp_for_next_level(level)

        while new_xp >= xp_needed:
            new_xp -= xp_needed
            level += 1
            leveled_up = True
            xp_needed = get_xp_for_next_level(level)

        return level, new_xp, xp_needed, leveled_up
