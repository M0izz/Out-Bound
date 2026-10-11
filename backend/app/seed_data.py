import json
from datetime import datetime, timedelta
from app.models.database import (
    SessionLocal, UserModel, QuestModel, ChallengeModel, BadgeModel,
    RewardTransactionModel, ExplorationSectorModel, ShopItemModel
)
from app.services.reward_engine import RewardEngine

def seed_database():
    db = SessionLocal()
    try:
        # Check if user already exists
        user = db.query(UserModel).filter(UserModel.username == "MOIZ").first()
        if user:
            return  # Already seeded

        # 1. Seed Current User: MOIZ
        user = UserModel(
            id=1,
            username="MOIZ",
            title="Explorer",
            avatar="🌿",
            level=12,
            xp=1240,
            xp_to_next_level=1500,
            grass_balance=840,
            current_streak=12,
            longest_streak=16,
            completed_quests_count=86,
            outdoor_hours=34.2,
            global_rank=184,
            college_rank=14,
            friends_rank=2,
            preferred_categories=json.dumps(["exploration", "photography", "nature"]),
            disliked_categories=json.dumps(["running"]),
            preferred_difficulty="medium",
            streak_shield_active=False,
            profile_frame="emerald_glow"
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # 2. Seed Daily Quest Drop (Chill, Explorer, Hardcore)
        daily_quests = [
            QuestModel(
                id="daily_chill_01",
                title="Neighborhood Sunlight Reset",
                description="Take a relaxed 10-minute walk through your closest street or courtyard. Let your eyes adjust to natural sunlight away from glass screens.",
                category="wellness",
                difficulty="easy",
                rarity="common",
                duration_minutes=10,
                steps_json=json.dumps([
                    "Lock your screen and pocket your device",
                    "Take a gentle 10-minute walk outside",
                    "Take 5 deep breaths while facing natural sunlight"
                ]),
                proof_type="timer_only",
                proof_hint="Honor timer verification upon return.",
                generated_by="Gemma AI Game Master",
                generation_reason="Low-barrier daily streak protector.",
                xp_reward=25,
                grass_reward=15,
                is_daily_drop=True,
                drop_tier="chill",
                status="available"
            ),
            QuestModel(
                id="daily_explorer_01",
                title="Urban Explorer: Secret Geometry",
                description="Explore somewhere you've never visited within your local perimeter. Find an unexpected architectural feature, mural, or garden corner.",
                category="exploration",
                difficulty="medium",
                rarity="rare",
                duration_minutes=25,
                steps_json=json.dumps([
                    "Leave your customary walking path",
                    "Spend 20-25 minutes actively exploring new streets",
                    "Find one visual landmark or unique architectural detail",
                    "Capture one clear photograph of the discovery"
                ]),
                proof_type="activity_and_photo",
                proof_hint="Upload your photo proof & movement duration.",
                generated_by="Gemma AI Game Master",
                generation_reason="Flagship daily mission tailored to your exploration profile.",
                xp_reward=75,
                grass_reward=55,
                is_daily_drop=True,
                drop_tier="explorer",
                status="available"
            ),
            QuestModel(
                id="daily_hardcore_01",
                title="The Ridge Perimeter Expedition",
                description="An intensive 45-minute outdoor endurance mission. Travel across multiple blocks or park trails and log sustained movement.",
                category="movement",
                difficulty="hard",
                rarity="epic",
                duration_minutes=45,
                steps_json=json.dumps([
                    "Head outdoors and target a distant milestone (> 2.5 km)",
                    "Keep moving continuously for 45 minutes",
                    "Avoid touching your screen until the waypoint is reached",
                    "Submit activity time and waypoint snapshot"
                ]),
                proof_type="activity_and_photo",
                proof_hint="Requires 40+ minutes of tracked outdoor movement.",
                generated_by="Gemma AI Game Master",
                generation_reason="High-intensity tier for maximum XP & GRASS yield.",
                xp_reward=150,
                grass_reward=100,
                is_daily_drop=True,
                drop_tier="hardcore",
                status="available"
            )
        ]
        for q in daily_quests:
            db.add(q)

        # 3. Seed Hacktoberfest Challenges
        challenges = [
            ChallengeModel(
                id="challenge_october",
                title="GREEN OCTOBER",
                tagline="Hacktoberfest-inspired Community Outdoor Sprint",
                description="Complete 10 outdoor quests during October. Connect with nature and contribute verified real-world activity.",
                category="environment",
                badge_name="Green Explorer Badge",
                badge_icon="🌳",
                target_count=10,
                current_count=7,
                xp_reward=250,
                grass_reward=200,
                end_date="Ends in 12 days",
                is_active=True
            ),
            ChallengeModel(
                id="challenge_urban",
                title="DISTRICT CARTOGRAPHER",
                tagline="Campus & Neighborhood Fog-of-War Discovery",
                description="Discover and authenticate 5 previously unexplored physical zones on your regional discovery map.",
                category="exploration",
                badge_name="Pioneer Compass",
                badge_icon="🧭",
                target_count=5,
                current_count=3,
                xp_reward=180,
                grass_reward=140,
                end_date="Ends in 19 days",
                is_active=True
            ),
            ChallengeModel(
                id="challenge_detox",
                title="SCREEN-FREE CENTURY",
                tagline="Digital Detox Endurance",
                description="Accumulate 100 outdoor minutes without a single phone unlock during active quests.",
                category="wellness",
                badge_name="Zen Sentinel",
                badge_icon="📵",
                target_count=100,
                current_count=65,
                xp_reward=200,
                grass_reward=160,
                end_date="Permanent Challenge",
                is_active=True
            )
        ]
        for c in challenges:
            db.add(c)

        # 4. Seed Badges
        badges = [
            BadgeModel(
                id="badge_first_touch",
                name="First Touch",
                description="Completed your first verified outdoor quest and touched real grass.",
                icon="🌱",
                category="progression",
                condition_type="quests_count",
                condition_threshold=1,
                unlocked=True,
                unlocked_at=datetime.utcnow() - timedelta(days=20)
            ),
            BadgeModel(
                id="badge_7_streak",
                name="Unstoppable",
                description="Achieved an unbroken 7-day outdoor quest streak.",
                icon="🔥",
                category="streaks",
                condition_type="streak_days",
                condition_threshold=7,
                unlocked=True,
                unlocked_at=datetime.utcnow() - timedelta(days=5)
            ),
            BadgeModel(
                id="badge_explorer",
                name="Explorer",
                description="Visited and authenticated 10 unique physical locations.",
                icon="🗺️",
                category="exploration",
                condition_type="unique_locations",
                condition_threshold=10,
                unlocked=True,
                unlocked_at=datetime.utcnow() - timedelta(days=8)
            ),
            BadgeModel(
                id="badge_observer",
                name="Observer",
                description="Captured and verified 10 discovery photographs.",
                icon="📸",
                category="photography",
                condition_type="photo_quests",
                condition_threshold=10,
                unlocked=True,
                unlocked_at=datetime.utcnow() - timedelta(days=3)
            ),
            BadgeModel(
                id="badge_tree_hugger",
                name="Tree Hugger",
                description="Completed 20 nature and greenery observation missions.",
                icon="🌳",
                category="nature",
                condition_type="nature_quests",
                condition_threshold=20,
                unlocked=True,
                unlocked_at=datetime.utcnow() - timedelta(days=2)
            ),
            BadgeModel(
                id="badge_digital_detox",
                name="Digital Detox",
                description="Completed an uninterrupted screen-free quest without touching phone.",
                icon="📵",
                category="wellness",
                condition_type="screen_free",
                condition_threshold=1,
                unlocked=True,
                unlocked_at=datetime.utcnow() - timedelta(days=1)
            ),
            BadgeModel(
                id="badge_squad_player",
                name="Squad Player",
                description="Team up and finish 5 collective outdoor expeditions.",
                icon="🤝",
                category="social",
                condition_type="squad_quests",
                condition_threshold=5,
                unlocked=False,
                unlocked_at=None
            ),
            BadgeModel(
                id="badge_community_hero",
                name="Community Hero",
                description="Execute 10 environmental cleanups or community action quests.",
                icon="🧹",
                category="environment",
                condition_type="eco_quests",
                condition_threshold=10,
                unlocked=False,
                unlocked_at=None
            ),
            BadgeModel(
                id="badge_legend",
                name="Outdoor Legend",
                description="Reach 100 completed quests in the physical world.",
                icon="🌍",
                category="mastery",
                condition_type="quests_count",
                condition_threshold=100,
                unlocked=False,
                unlocked_at=None
            )
        ]
        for b in badges:
            db.add(b)

        # 5. Seed Exploration Sectors (Fog of War)
        sectors_data = [
            ("sec_01", "Campus Quad Green", "University Hub", 0, 0, "mastered", 3, "🏫"),
            ("sec_02", "Pine Grove Trailhead", "Northwoods", 1, 0, "mastered", 3, "🌲"),
            ("sec_03", "Old Town Brick Alley", "Historic Quarter", 2, 0, "discovered", 2, "🧱"),
            ("sec_04", "Riverside Esplanade", "Waterfront", 0, 1, "mastered", 3, "🌊"),
            ("sec_05", "Sunset Hill Lookout", "Highlands", 1, 1, "discovered", 2, "🌄"),
            ("sec_06", "Botanical Conservatory", "Civic Park", 2, 1, "discovered", 1, "🌺"),
            ("sec_07", "Industrial Rail Path", "East Yard", 0, 2, "unexplored", 0, "🚂"),
            ("sec_08", "Creek Crossing Stone", "Greenbelt", 1, 2, "unexplored", 0, "🪵"),
            ("sec_09", "Market Square Plaza", "Central Town", 2, 2, "discovered", 2, "🎪"),
            ("sec_10", "Willow Lake Basin", "South Reservoir", 0, 3, "unexplored", 0, "🛶"),
            ("sec_11", "Observatory Plateau", "Ridge Crest", 1, 3, "unexplored", 0, "🔭"),
            ("sec_12", "Community Orchard", "Valley Commons", 2, 3, "unexplored", 0, "🍎"),
        ]
        for sec_id, name, zone, gx, gy, status, lvl, ic in sectors_data:
            db.add(ExplorationSectorModel(
                id=sec_id,
                sector_name=name,
                zone=zone,
                grid_x=gx,
                grid_y=gy,
                fog_status=status,
                discovery_level=lvl,
                icon=ic
            ))

        # 6. Seed Shop Items
        shop_items = [
            ShopItemModel(
                id="item_shield",
                name="Streak Shield",
                description="Protects your active quest streak if you miss a day due to rest or rain.",
                price_grass=500,
                icon="🛡️",
                item_type="utility"
            ),
            ShopItemModel(
                id="item_frame_emerald",
                name="Cyber Emerald Frame",
                description="Distinctive animated jade neon border for your player card and profile.",
                price_grass=300,
                icon="🎨",
                item_type="cosmetic"
            ),
            ShopItemModel(
                id="item_radar",
                name="Rare Quest Radar",
                description="Guarantees the Game Master generates Epic or Legendary rarity options for 48 hours.",
                price_grass=750,
                icon="🗺️",
                item_type="utility"
            ),
            ShopItemModel(
                id="item_boost",
                name="2× XP Overdrive",
                description="Double all outdoor XP gains for your next 3 completed real-world quests.",
                price_grass=1000,
                icon="⚡",
                item_type="booster"
            )
        ]
        for it in shop_items:
            db.add(it)

        # 7. Seed Initial Audit Transactions
        transactions = [
            RewardTransactionModel(
                user_id=1,
                transaction_type="QUEST_COMPLETION",
                amount=75,
                balance_after=765,
                description="Completed 'Canopy Shadow Hunt' (Rare)",
                quest_id="historic_quest_1"
            ),
            RewardTransactionModel(
                user_id=1,
                transaction_type="STREAK_BONUS",
                amount=75,
                balance_after=840,
                description="10-Day Streak Milestone Reward",
                quest_id=None
            )
        ]
        for tx in transactions:
            db.add(tx)

        db.commit()
    finally:
        db.close()
