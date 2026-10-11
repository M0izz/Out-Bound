import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.database import get_db, UserModel, BadgeModel, RewardTransactionModel
from app.models.schemas import UserProfileResponse, BadgeResponse, RewardTransactionResponse
from app.services.reward_engine import get_level_title

router = APIRouter(prefix="/user", tags=["User & Progression"])

@router.get("/profile", response_model=UserProfileResponse)
def get_user_profile(db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.username == "MOIZ").first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    preferred_cats = json.loads(user.preferred_categories) if user.preferred_categories else []
    disliked_cats = json.loads(user.disliked_categories) if user.disliked_categories else []

    streak_milestone = "Gold (30d target)" if user.current_streak >= 14 else "Silver (14d target)"

    return UserProfileResponse(
        id=user.id,
        username=user.username,
        title=user.title,
        avatar=user.avatar,
        level=user.level,
        xp=user.xp,
        xp_to_next_level=user.xp_to_next_level,
        grass_balance=user.grass_balance,
        current_streak=user.current_streak,
        longest_streak=user.longest_streak,
        completed_quests_count=user.completed_quests_count,
        outdoor_hours=round(user.outdoor_hours, 1),
        global_rank=user.global_rank,
        college_rank=user.college_rank,
        friends_rank=user.friends_rank,
        preferred_categories=preferred_cats,
        disliked_categories=disliked_cats,
        preferred_difficulty=user.preferred_difficulty,
        streak_shield_active=user.streak_shield_active,
        profile_frame=user.profile_frame,
        level_title=get_level_title(user.level),
        streak_milestone=streak_milestone,
        rank_summary={
            "global": user.global_rank,
            "college": user.college_rank,
            "friends": user.friends_rank
        },
        created_at=user.created_at,
        updated_at=user.updated_at
    )

@router.get("/badges", response_model=list[BadgeResponse])
def get_user_badges(db: Session = Depends(get_db)):
    badges = db.query(BadgeModel).all()
    return [
        BadgeResponse(
            id=b.id,
            name=b.name,
            description=b.description,
            icon=b.icon,
            category=b.category,
            unlocked=b.unlocked,
            unlocked_at=b.unlocked_at
        )
        for b in badges
    ]

@router.get("/transactions", response_model=list[RewardTransactionResponse])
def get_user_transactions(db: Session = Depends(get_db)):
    txs = db.query(RewardTransactionModel).order_by(RewardTransactionModel.created_at.desc()).limit(20).all()
    return [
        RewardTransactionResponse(
            id=t.id,
            transaction_type=t.transaction_type,
            amount=t.amount,
            balance_after=t.balance_after,
            description=t.description,
            created_at=t.created_at
        )
        for t in txs
    ]
