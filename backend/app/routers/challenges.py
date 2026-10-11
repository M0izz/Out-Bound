from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.database import get_db, ChallengeModel
from app.models.schemas import ChallengeResponse

router = APIRouter(prefix="/challenges", tags=["Hacktoberfest Campaigns"])

@router.get("", response_model=list[ChallengeResponse])
def get_challenges(db: Session = Depends(get_db)):
    challenges = db.query(ChallengeModel).all()
    res = []
    for c in challenges:
        pct = round(min(100.0, (c.current_count / max(1, c.target_count)) * 100), 1)
        res.append(ChallengeResponse(
            id=c.id,
            title=c.title,
            tagline=c.tagline,
            description=c.description,
            category=c.category,
            badge_name=c.badge_name,
            badge_icon=c.badge_icon,
            target_count=c.target_count,
            current_count=c.current_count,
            progress_percentage=pct,
            xp_reward=c.xp_reward,
            grass_reward=c.grass_reward,
            end_date=c.end_date,
            is_active=c.is_active
        ))
    return res
