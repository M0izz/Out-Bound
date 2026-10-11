from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.database import get_db, UserModel, ShopItemModel, RewardTransactionModel
from app.models.schemas import ShopItemResponse, ShopPurchaseRequest

router = APIRouter(prefix="/shop", tags=["GRASS Shop"])

@router.get("/items", response_model=list[ShopItemResponse])
def get_shop_items(db: Session = Depends(get_db)):
    items = db.query(ShopItemModel).filter(ShopItemModel.is_available == True).all()
    return [
        ShopItemResponse(
            id=item.id,
            name=item.name,
            description=item.description,
            price_grass=item.price_grass,
            icon=item.icon,
            item_type=item.item_type,
            is_available=item.is_available
        )
        for item in items
    ]

@router.post("/purchase")
def purchase_item(req: ShopPurchaseRequest, db: Session = Depends(get_db)):
    user = db.query(UserModel).filter(UserModel.username == "MOIZ").first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    item = db.query(ShopItemModel).filter(ShopItemModel.id == req.item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if user.grass_balance < item.price_grass:
        raise HTTPException(status_code=400, detail="Insufficient GRASS balance. Complete more outdoor quests!")

    user.grass_balance -= item.price_grass

    # Apply item effect
    if item.id == "item_shield":
        user.streak_shield_active = True
    elif item.id == "item_frame_emerald":
        user.profile_frame = "neon_emerald_pro"

    tx = RewardTransactionModel(
        user_id=user.id,
        transaction_type="SHOP_PURCHASE",
        amount=-item.price_grass,
        balance_after=user.grass_balance,
        description=f"Purchased {item.name} (-{item.price_grass} GRASS)",
        quest_id=None
    )
    db.add(tx)
    db.commit()

    return {
        "success": True,
        "message": f"Successfully acquired {item.name}!",
        "new_grass_balance": user.grass_balance,
        "item_id": item.id
    }
