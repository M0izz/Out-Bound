import json
from datetime import datetime
from sqlalchemy import (
    create_engine, Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
)
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from app.config import settings

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class UserModel(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, default="MOIZ")
    title = Column(String(50), default="Explorer")
    avatar = Column(String(255), default="🌱")
    level = Column(Integer, default=12)
    xp = Column(Integer, default=1240)
    xp_to_next_level = Column(Integer, default=1500)
    grass_balance = Column(Integer, default=840)
    current_streak = Column(Integer, default=12)
    longest_streak = Column(Integer, default=16)
    completed_quests_count = Column(Integer, default=86)
    outdoor_hours = Column(Float, default=34.2)
    global_rank = Column(Integer, default=184)
    college_rank = Column(Integer, default=14)
    friends_rank = Column(Integer, default=2)
    preferred_categories = Column(Text, default=json.dumps(["exploration", "photography", "nature"]))
    disliked_categories = Column(Text, default=json.dumps(["running"]))
    preferred_difficulty = Column(String(20), default="medium")
    streak_shield_active = Column(Boolean, default=False)
    profile_frame = Column(String(50), default="emerald_glow")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    completions = relationship("QuestCompletionModel", back_populates="user")
    reward_transactions = relationship("RewardTransactionModel", back_populates="user")

class QuestModel(Base):
    __tablename__ = "quests"

    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(120), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(40), nullable=False) # nature, movement, exploration, photography, environment, social, wellness
    difficulty = Column(String(20), nullable=False) # easy, medium, hard, epic
    rarity = Column(String(20), nullable=False) # common, uncommon, rare, epic, legendary
    duration_minutes = Column(Integer, default=20)
    steps_json = Column(Text, nullable=False) # JSON array of step descriptions
    proof_type = Column(String(40), nullable=False) # timer_only, photo, timer_and_photo, activity_and_photo, location_and_photo
    proof_hint = Column(String(255), default="Capture evidence of your outdoor mission.")
    generated_by = Column(String(40), default="Gemma AI Game Master")
    generation_reason = Column(Text, default="Tailored to your love for exploratory photography and 25-minute breaks.")
    xp_reward = Column(Integer, default=50)
    grass_reward = Column(Integer, default=40)
    is_daily_drop = Column(Boolean, default=False)
    drop_tier = Column(String(20), nullable=True) # chill, explorer, hardcore
    status = Column(String(20), default="available") # available, active, completed, abandoned
    accepted_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class QuestCompletionModel(Base):
    __tablename__ = "quest_completions"

    id = Column(Integer, primary_key=True, index=True)
    quest_id = Column(String(50), ForeignKey("quests.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    duration_minutes = Column(Float, default=23.0)
    distance_km = Column(Float, default=1.7)
    photo_url = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    verification_status = Column(String(30), default="VERIFIED") # VERIFIED, REJECTED, PENDING
    verification_feedback = Column(Text, default="All criteria met. Clear outdoor movement & discovery registered.")
    confidence_score = Column(Float, default=0.96)
    xp_awarded = Column(Integer, default=75)
    grass_awarded = Column(Integer, default=55)
    badges_awarded_json = Column(Text, default="[]")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserModel", back_populates="completions")

class ChallengeModel(Base):
    __tablename__ = "challenges"

    id = Column(String(50), primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    tagline = Column(String(150), default="Hacktoberfest-inspired community campaign")
    description = Column(Text, nullable=False)
    category = Column(String(40), default="environment")
    badge_name = Column(String(80), default="Green Explorer")
    badge_icon = Column(String(20), default="🏅")
    target_count = Column(Integer, default=10)
    current_count = Column(Integer, default=7)
    xp_reward = Column(Integer, default=250)
    grass_reward = Column(Integer, default=200)
    end_date = Column(String(40), default="Ends in 14 days")
    is_active = Column(Boolean, default=True)

class BadgeModel(Base):
    __tablename__ = "badges"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(80), nullable=False)
    description = Column(String(255), nullable=False)
    icon = Column(String(20), default="🌱")
    category = Column(String(40), default="exploration")
    condition_type = Column(String(40), default="quests_count")
    condition_threshold = Column(Integer, default=1)
    unlocked = Column(Boolean, default=False)
    unlocked_at = Column(DateTime, nullable=True)

class RewardTransactionModel(Base):
    __tablename__ = "reward_transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    transaction_type = Column(String(40), nullable=False) # QUEST_COMPLETION, CHALLENGE_REWARD, STREAK_BONUS, SHOP_PURCHASE
    amount = Column(Integer, nullable=False) # positive for rewards, negative for shop buys
    balance_after = Column(Integer, nullable=False)
    description = Column(String(255), nullable=False)
    quest_id = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("UserModel", back_populates="reward_transactions")

class ExplorationSectorModel(Base):
    __tablename__ = "exploration_sectors"

    id = Column(String(50), primary_key=True, index=True)
    sector_name = Column(String(100), nullable=False)
    zone = Column(String(60), default="Downtown Greenery")
    grid_x = Column(Integer, default=0)
    grid_y = Column(Integer, default=0)
    fog_status = Column(String(20), default="discovered") # unexplored, discovered, mastered
    discovery_level = Column(Integer, default=1) # 0 to 3
    icon = Column(String(20), default="🌲")
    last_quest_id = Column(String(50), nullable=True)
    discovered_at = Column(DateTime, default=datetime.utcnow)

class ShopItemModel(Base):
    __tablename__ = "shop_items"

    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(80), nullable=False)
    description = Column(String(255), nullable=False)
    price_grass = Column(Integer, nullable=False)
    icon = Column(String(20), default="🔥")
    item_type = Column(String(40), default="utility") # utility, cosmetic, booster
    is_available = Column(Boolean, default=True)

def init_db():
    Base.metadata.create_all(bind=engine)
