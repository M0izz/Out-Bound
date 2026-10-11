import json
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.database import (
    get_db, UserModel, QuestModel, QuestCompletionModel,
    RewardTransactionModel, BadgeModel, ChallengeModel, ExplorationSectorModel
)
from app.models.schemas import (
    QuestResponse, QuestGenerationRequest, ProofSubmissionRequest,
    VerificationResultResponse
)
from app.services.ai_game_master import game_master_service
from app.services.reward_engine import RewardEngine
from app.services.verification_engine import VerificationEngine

router = APIRouter(prefix="/quests", tags=["Quests & Game Loop"])

@router.get("/daily", response_model=list[QuestResponse])
def get_daily_quests(db: Session = Depends(get_db)):
    daily = db.query(QuestModel).filter(QuestModel.is_daily_drop == True).all()
    res = []
    for q in daily:
        steps = json.loads(q.steps_json) if q.steps_json else []
        res.append(QuestResponse(
            id=q.id,
            title=q.title,
            description=q.description,
            category=q.category,
            difficulty=q.difficulty,
            rarity=q.rarity,
            duration_minutes=q.duration_minutes,
            steps=steps,
            proof_type=q.proof_type,
            proof_hint=q.proof_hint,
            generated_by=q.generated_by,
            generation_reason=q.generation_reason,
            xp_reward=q.xp_reward,
            grass_reward=q.grass_reward,
            is_daily_drop=q.is_daily_drop,
            drop_tier=q.drop_tier,
            status=q.status,
            accepted_at=q.accepted_at,
            completed_at=q.completed_at,
            created_at=q.created_at
        ))
    return res

@router.get("/active", response_model=QuestResponse | None)
def get_active_quest(db: Session = Depends(get_db)):
    active = db.query(QuestModel).filter(QuestModel.status == "active").first()
    if not active:
        return None
    steps = json.loads(active.steps_json) if active.steps_json else []
    return QuestResponse(
        id=active.id,
        title=active.title,
        description=active.description,
        category=active.category,
        difficulty=active.difficulty,
        rarity=active.rarity,
        duration_minutes=active.duration_minutes,
        steps=steps,
        proof_type=active.proof_type,
        proof_hint=active.proof_hint,
        generated_by=active.generated_by,
        generation_reason=active.generation_reason,
        xp_reward=active.xp_reward,
        grass_reward=active.grass_reward,
        is_daily_drop=active.is_daily_drop,
        drop_tier=active.drop_tier,
        status=active.status,
        accepted_at=active.accepted_at,
        completed_at=active.completed_at,
        created_at=active.created_at
    )

@router.post("/generate", response_model=QuestResponse)
def generate_custom_quest(
    req: QuestGenerationRequest,
    db: Session = Depends(get_db)
):
    user = db.query(UserModel).filter(UserModel.username == "MOIZ").first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    preferred_cats = json.loads(user.preferred_categories) if user.preferred_categories else ["exploration"]
    disliked_cats = json.loads(user.disliked_categories) if user.disliked_categories else []

    player_context = {
        "username": user.username,
        "level": user.level,
        "xp": user.xp,
        "preferred_categories": preferred_cats,
        "disliked_categories": disliked_cats,
        "available_time": req.available_time or 25,
        "difficulty": req.difficulty or user.preferred_difficulty,
        "category": req.category,
        "prompt_hint": req.prompt_hint
    }

    # Generate via Open-Weight Gemma Game Master
    ai_quest = game_master_service.generate_personalized_quest(player_context)

    # Calculate DETERMINISTIC rewards in application backend
    xp_reward, grass_reward = RewardEngine.calculate_rewards(
        duration_minutes=ai_quest.duration_minutes,
        difficulty=ai_quest.difficulty,
        rarity=ai_quest.rarity,
        category=ai_quest.category
    )

    quest_id = f"quest_{uuid.uuid4().hex[:8]}"
    db_quest = QuestModel(
        id=quest_id,
        title=ai_quest.title,
        description=ai_quest.description,
        category=ai_quest.category,
        difficulty=ai_quest.difficulty,
        rarity=ai_quest.rarity,
        duration_minutes=ai_quest.duration_minutes,
        steps_json=json.dumps(ai_quest.steps),
        proof_type=ai_quest.proof_type,
        proof_hint="Submit your verified time and physical proof upon return.",
        generated_by="Gemma 2 AI Game Master",
        generation_reason=ai_quest.reason,
        xp_reward=xp_reward,
        grass_reward=grass_reward,
        is_daily_drop=False,
        drop_tier=None,
        status="available"
    )
    db.add(db_quest)
    db.commit()
    db.refresh(db_quest)

    return QuestResponse(
        id=db_quest.id,
        title=db_quest.title,
        description=db_quest.description,
        category=db_quest.category,
        difficulty=db_quest.difficulty,
        rarity=db_quest.rarity,
        duration_minutes=db_quest.duration_minutes,
        steps=ai_quest.steps,
        proof_type=db_quest.proof_type,
        proof_hint=db_quest.proof_hint,
        generated_by=db_quest.generated_by,
        generation_reason=db_quest.generation_reason,
        xp_reward=db_quest.xp_reward,
        grass_reward=db_quest.grass_reward,
        is_daily_drop=db_quest.is_daily_drop,
        drop_tier=db_quest.drop_tier,
        status=db_quest.status,
        accepted_at=db_quest.accepted_at,
        completed_at=db_quest.completed_at,
        created_at=db_quest.created_at
    )

@router.get("/{quest_id}", response_model=QuestResponse)
def get_quest(quest_id: str, db: Session = Depends(get_db)):
    q = db.query(QuestModel).filter(QuestModel.id == quest_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Quest not found")
    steps = json.loads(q.steps_json) if q.steps_json else []
    return QuestResponse(
        id=q.id,
        title=q.title,
        description=q.description,
        category=q.category,
        difficulty=q.difficulty,
        rarity=q.rarity,
        duration_minutes=q.duration_minutes,
        steps=steps,
        proof_type=q.proof_type,
        proof_hint=q.proof_hint,
        generated_by=q.generated_by,
        generation_reason=q.generation_reason,
        xp_reward=q.xp_reward,
        grass_reward=q.grass_reward,
        is_daily_drop=q.is_daily_drop,
        drop_tier=q.drop_tier,
        status=q.status,
        accepted_at=q.accepted_at,
        completed_at=q.completed_at,
        created_at=q.created_at
    )

@router.post("/{quest_id}/accept", response_model=QuestResponse)
def accept_quest(quest_id: str, db: Session = Depends(get_db)):
    q = db.query(QuestModel).filter(QuestModel.id == quest_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Quest not found")

    # Mark other active quests as available if any
    db.query(QuestModel).filter(QuestModel.status == "active").update({"status": "available"})
    q.status = "active"
    q.accepted_at = datetime.utcnow()
    db.commit()
    db.refresh(q)

    steps = json.loads(q.steps_json) if q.steps_json else []
    return QuestResponse(
        id=q.id,
        title=q.title,
        description=q.description,
        category=q.category,
        difficulty=q.difficulty,
        rarity=q.rarity,
        duration_minutes=q.duration_minutes,
        steps=steps,
        proof_type=q.proof_type,
        proof_hint=q.proof_hint,
        generated_by=q.generated_by,
        generation_reason=q.generation_reason,
        xp_reward=q.xp_reward,
        grass_reward=q.grass_reward,
        is_daily_drop=q.is_daily_drop,
        drop_tier=q.drop_tier,
        status=q.status,
        accepted_at=q.accepted_at,
        completed_at=q.completed_at,
        created_at=q.created_at
    )

@router.post("/{quest_id}/abandon", response_model=QuestResponse)
def abandon_quest(quest_id: str, db: Session = Depends(get_db)):
    q = db.query(QuestModel).filter(QuestModel.id == quest_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Quest not found")
    q.status = "available"
    q.accepted_at = None
    db.commit()
    db.refresh(q)
    steps = json.loads(q.steps_json) if q.steps_json else []
    return QuestResponse(
        id=q.id,
        title=q.title,
        description=q.description,
        category=q.category,
        difficulty=q.difficulty,
        rarity=q.rarity,
        duration_minutes=q.duration_minutes,
        steps=steps,
        proof_type=q.proof_type,
        proof_hint=q.proof_hint,
        generated_by=q.generated_by,
        generation_reason=q.generation_reason,
        xp_reward=q.xp_reward,
        grass_reward=q.grass_reward,
        is_daily_drop=q.is_daily_drop,
        drop_tier=q.drop_tier,
        status=q.status,
        accepted_at=q.accepted_at,
        completed_at=q.completed_at,
        created_at=q.created_at
    )

@router.post("/{quest_id}/proof", response_model=VerificationResultResponse)
def submit_proof_and_verify(
    quest_id: str,
    submission: ProofSubmissionRequest,
    db: Session = Depends(get_db)
):
    quest = db.query(QuestModel).filter(QuestModel.id == quest_id).first()
    if not quest:
        raise HTTPException(status_code=404, detail="Quest not found")

    user = db.query(UserModel).filter(UserModel.username == "MOIZ").first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Run Verification Engine
    verification = VerificationEngine.verify_proof(
        quest_title=quest.title,
        expected_duration_minutes=quest.duration_minutes,
        proof_type=quest.proof_type,
        submission=submission
    )

    if verification["status"] != "VERIFIED":
        return VerificationResultResponse(
            quest_id=quest.id,
            verification_status="REJECTED",
            confidence_score=verification["confidence_score"],
            reason=verification["reason"],
            checks_passed=verification["checks_passed"],
            warnings=verification["warnings"],
            xp_awarded=0,
            grass_awarded=0,
            new_level=user.level,
            level_up=False,
            new_streak=user.current_streak,
            badges_unlocked=[],
            game_master_reflection=verification["reflection"]
        )

    # PASS: Deterministic Progression
    xp_awarded = quest.xp_reward
    grass_awarded = quest.grass_reward

    # Level progression
    new_level, new_xp, xp_to_next, leveled_up = RewardEngine.process_level_progression(
        current_level=user.level,
        current_xp=user.xp,
        xp_gain=xp_awarded
    )

    user.level = new_level
    user.xp = new_xp
    user.xp_to_next_level = xp_to_next
    user.grass_balance += grass_awarded
    user.completed_quests_count += 1
    user.outdoor_hours += round(submission.duration_minutes / 60.0, 1)

    # Streak progression
    user.current_streak += 1
    if user.current_streak > user.longest_streak:
        user.longest_streak = user.current_streak

    # Mark quest completed
    quest.status = "completed"
    quest.completed_at = datetime.utcnow()

    # Record Quest Completion
    completion = QuestCompletionModel(
        quest_id=quest.id,
        user_id=user.id,
        duration_minutes=submission.duration_minutes,
        distance_km=submission.distance_km or 1.2,
        photo_url=submission.photo_description or "verified_outdoor_proof.jpg",
        notes=submission.notes,
        verification_status="VERIFIED",
        verification_feedback=verification["reflection"],
        confidence_score=verification["confidence_score"],
        xp_awarded=xp_awarded,
        grass_awarded=grass_awarded,
        badges_awarded_json="[]"
    )
    db.add(completion)

    # Record auditable RewardTransaction
    tx = RewardTransactionModel(
        user_id=user.id,
        transaction_type="QUEST_COMPLETION",
        amount=grass_awarded,
        balance_after=user.grass_balance,
        description=f"Verified quest: {quest.title} (+{xp_awarded} XP, +{grass_awarded} GRASS)",
        quest_id=quest.id
    )
    db.add(tx)

    # Check for unlocked badges
    unlocked_badges = []
    # Check 1: First Touch or Quest Count milestones
    if user.completed_quests_count >= 87: # Just finished this one!
        # Check Community Hero or Observer
        hero_badge = db.query(BadgeModel).filter(BadgeModel.id == "badge_observer").first()
        if hero_badge and not hero_badge.unlocked:
            hero_badge.unlocked = True
            hero_badge.unlocked_at = datetime.utcnow()
            unlocked_badges.append({"name": hero_badge.name, "icon": hero_badge.icon, "description": hero_badge.description})

    # Update Hacktoberfest challenge
    oct_challenge = db.query(ChallengeModel).filter(ChallengeModel.id == "challenge_october").first()
    if oct_challenge and oct_challenge.current_count < oct_challenge.target_count:
        oct_challenge.current_count += 1

    # Reveal a sector on Fog of War map
    unexplored_sector = db.query(ExplorationSectorModel).filter(ExplorationSectorModel.fog_status == "unexplored").first()
    if unexplored_sector:
        unexplored_sector.fog_status = "discovered"
        unexplored_sector.discovery_level = 1
        unexplored_sector.last_quest_id = quest.id

    db.commit()

    return VerificationResultResponse(
        quest_id=quest.id,
        verification_status="VERIFIED",
        confidence_score=verification["confidence_score"],
        reason=verification["reason"],
        checks_passed=verification["checks_passed"],
        warnings=verification["warnings"],
        xp_awarded=xp_awarded,
        grass_awarded=grass_awarded,
        new_level=user.level,
        level_up=leveled_up,
        new_streak=user.current_streak,
        badges_unlocked=unlocked_badges,
        game_master_reflection=verification["reflection"]
    )
