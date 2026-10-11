from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

# ==================== USER SCHEMAS ====================
class UserBase(BaseModel):
    username: str
    title: str
    avatar: str
    level: int
    xp: int
    xp_to_next_level: int
    grass_balance: int
    current_streak: int
    longest_streak: int
    completed_quests_count: int
    outdoor_hours: float
    global_rank: int
    college_rank: int
    friends_rank: int
    preferred_categories: List[str]
    disliked_categories: List[str]
    preferred_difficulty: str
    streak_shield_active: bool = False
    profile_frame: str = "emerald_glow"

class UserProfileResponse(UserBase):
    id: int
    level_title: str
    streak_milestone: str
    rank_summary: Dict[str, int]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ==================== QUEST SCHEMAS ====================
class QuestStep(BaseModel):
    step_number: int
    instruction: str

class QuestBase(BaseModel):
    id: str
    title: str
    description: str
    category: str # nature, movement, exploration, photography, environment, social, wellness
    difficulty: str # easy, medium, hard, epic
    rarity: str # common, uncommon, rare, epic, legendary
    duration_minutes: int
    steps: List[str]
    proof_type: str # timer_only, photo, timer_and_photo, activity_and_photo, location_and_photo
    proof_hint: str
    generated_by: str = "Gemma AI Game Master"
    generation_reason: str
    xp_reward: int
    grass_reward: int
    is_daily_drop: bool = False
    drop_tier: Optional[str] = None # chill, explorer, hardcore
    status: str = "available" # available, active, completed, abandoned

class QuestResponse(QuestBase):
    accepted_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime

class QuestGenerationRequest(BaseModel):
    available_time: Optional[int] = Field(default=30, description="Available minutes (10 - 120)")
    category: Optional[str] = Field(default=None, description="Preferred category or auto-select")
    difficulty: Optional[str] = Field(default="medium", description="Desired difficulty: easy, medium, hard, epic")
    prompt_hint: Optional[str] = Field(default="", description="Optional user intent or location context")

class StructuredGemmaQuest(BaseModel):
    title: str
    description: str
    category: str
    difficulty: str
    rarity: str
    duration_minutes: int
    steps: List[str]
    proof_type: str
    reason: str

# ==================== PROOF & VERIFICATION SCHEMAS ====================
class ProofSubmissionRequest(BaseModel):
    quest_id: str
    duration_minutes: float
    distance_km: Optional[float] = 0.0
    photo_data_base64: Optional[str] = None # Or simulated photo path
    photo_description: Optional[str] = None
    notes: Optional[str] = None
    user_declared_honest: bool = True

class VerificationResultResponse(BaseModel):
    quest_id: str
    verification_status: str # VERIFIED, REJECTED
    confidence_score: float
    reason: str
    checks_passed: List[str]
    warnings: List[str]
    xp_awarded: int
    grass_awarded: int
    new_level: int
    level_up: bool
    new_streak: int
    badges_unlocked: List[Dict[str, Any]]
    game_master_reflection: str

# ==================== CHALLENGES & BADGES ====================
class ChallengeResponse(BaseModel):
    id: str
    title: str
    tagline: str
    description: str
    category: str
    badge_name: str
    badge_icon: str
    target_count: int
    current_count: int
    progress_percentage: float
    xp_reward: int
    grass_reward: int
    end_date: str
    is_active: bool

class BadgeResponse(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    category: str
    unlocked: bool
    unlocked_at: Optional[datetime] = None

# ==================== LEADERBOARD ====================
class LeaderboardUser(BaseModel):
    rank: int
    username: str
    avatar: str
    level: int
    level_title: str
    xp: int
    grass_balance: int
    badges_count: int
    is_current_user: bool = False

class LeaderboardResponse(BaseModel):
    category: str # global, college, friends
    users: List[LeaderboardUser]
    user_standing: LeaderboardUser

# ==================== SHOP & TRANSACTIONS ====================
class RewardTransactionResponse(BaseModel):
    id: int
    transaction_type: str
    amount: int
    balance_after: int
    description: str
    created_at: datetime

class ShopItemResponse(BaseModel):
    id: str
    name: str
    description: str
    price_grass: int
    icon: str
    item_type: str
    is_available: bool

class ShopPurchaseRequest(BaseModel):
    item_id: str

# ==================== EXPLORATION / FOG OF WAR ====================
class ExplorationSectorResponse(BaseModel):
    id: str
    sector_name: str
    zone: str
    grid_x: int
    grid_y: int
    fog_status: str # unexplored, discovered, mastered
    discovery_level: int
    icon: str

class ExplorationSummaryResponse(BaseModel):
    explored_percentage: float
    total_sectors: int
    discovered_sectors: int
    mastered_sectors: int
    sectors: List[ExplorationSectorResponse]
