from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.models.database import get_db, UserModel
from app.models.schemas import LeaderboardResponse, LeaderboardUser
from app.services.reward_engine import get_level_title

router = APIRouter(prefix="/leaderboard", tags=["Leaderboards"])

MOCK_GLOBAL_PLAYERS = [
    {"rank": 1, "username": "Alex_Vanguard", "avatar": "⚡", "level": 34, "xp": 12450, "grass_balance": 4820, "badges": 14},
    {"rank": 2, "username": "SarahWild", "avatar": "🦅", "level": 31, "xp": 11980, "grass_balance": 4150, "badges": 12},
    {"rank": 3, "username": "Karan_Trail", "avatar": "🐺", "level": 29, "xp": 11420, "grass_balance": 3980, "badges": 11},
    {"rank": 4, "username": "Elena_Roam", "avatar": "🦊", "level": 28, "xp": 10875, "grass_balance": 3600, "badges": 10},
    {"rank": 5, "username": "Marcus_Sky", "avatar": "🏔️", "level": 25, "xp": 9400, "grass_balance": 3100, "badges": 9},
]

MOCK_COLLEGE_PLAYERS = [
    {"rank": 1, "username": "Rohan_Tech", "avatar": "🚀", "level": 18, "xp": 3420, "grass_balance": 1850, "badges": 8},
    {"rank": 2, "username": "Priya_Code", "avatar": "🌻", "level": 16, "xp": 2890, "grass_balance": 1400, "badges": 7},
    {"rank": 3, "username": "Vikram_Bot", "avatar": "🦾", "level": 15, "xp": 2350, "grass_balance": 1200, "badges": 6},
    {"rank": 4, "username": "Ananya_Run", "avatar": "🏃‍♀️", "level": 13, "xp": 1890, "grass_balance": 980, "badges": 5},
]

MOCK_FRIENDS_PLAYERS = [
    {"rank": 1, "username": "Aryan_Grass", "avatar": "🌿", "level": 14, "xp": 1890, "grass_balance": 1150, "badges": 7},
    {"rank": 3, "username": "Riya_Hikes", "avatar": "🌸", "level": 11, "xp": 1120, "grass_balance": 720, "badges": 5},
    {"rank": 4, "username": "Dev_Cam", "avatar": "📷", "level": 9, "xp": 860, "grass_balance": 540, "badges": 4},
]

@router.get("", response_model=LeaderboardResponse)
def get_leaderboard(
    category: str = Query(default="global", pattern="^(global|college|friends)$"),
    db: Session = Depends(get_db)
):
    user = db.query(UserModel).filter(UserModel.username == "MOIZ").first()
    if not user:
        user_level = 12
        user_xp = 1240
        user_grass = 840
        user_badges = 6
    else:
        user_level = user.level
        user_xp = user.xp
        user_grass = user.grass_balance
        user_badges = 6

    if category == "global":
        rank = user.global_rank if user else 184
        users_pool = list(MOCK_GLOBAL_PLAYERS)
    elif category == "college":
        rank = user.college_rank if user else 14
        users_pool = list(MOCK_COLLEGE_PLAYERS)
    else: # friends
        rank = user.friends_rank if user else 2
        users_pool = list(MOCK_FRIENDS_PLAYERS)

    current_user_entry = LeaderboardUser(
        rank=rank,
        username="MOIZ (You)",
        avatar="🌱",
        level=user_level,
        level_title=get_level_title(user_level),
        xp=user_xp,
        grass_balance=user_grass,
        badges_count=user_badges,
        is_current_user=True
    )

    result_users = []
    inserted_user = False
    for p in users_pool:
        if p["rank"] > rank and not inserted_user:
            result_users.append(current_user_entry)
            inserted_user = True

        result_users.append(LeaderboardUser(
            rank=p["rank"],
            username=p["username"],
            avatar=p["avatar"],
            level=p["level"],
            level_title=get_level_title(p["level"]),
            xp=p["xp"],
            grass_balance=p["grass_balance"],
            badges_count=p["badges"],
            is_current_user=False
        ))

    if not inserted_user:
        result_users.append(current_user_entry)

    return LeaderboardResponse(
        category=category,
        users=result_users,
        user_standing=current_user_entry
    )
