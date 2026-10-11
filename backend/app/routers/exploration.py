from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.database import get_db, ExplorationSectorModel
from app.models.schemas import ExplorationSummaryResponse, ExplorationSectorResponse

router = APIRouter(prefix="/exploration", tags=["Fog of War Exploration"])

@router.get("/summary", response_model=ExplorationSummaryResponse)
def get_exploration_summary(db: Session = Depends(get_db)):
    sectors = db.query(ExplorationSectorModel).all()
    total = len(sectors)
    discovered = len([s for s in sectors if s.fog_status in ["discovered", "mastered"]])
    mastered = len([s for s in sectors if s.fog_status == "mastered"])

    pct = round((discovered / max(1, total)) * 100, 1) if total > 0 else 0.0

    return ExplorationSummaryResponse(
        explored_percentage=pct,
        total_sectors=total,
        discovered_sectors=discovered,
        mastered_sectors=mastered,
        sectors=[
            ExplorationSectorResponse(
                id=s.id,
                sector_name=s.sector_name,
                zone=s.zone,
                grid_x=s.grid_x,
                grid_y=s.grid_y,
                fog_status=s.fog_status,
                discovery_level=s.discovery_level,
                icon=s.icon
            )
            for s in sectors
        ]
    )
