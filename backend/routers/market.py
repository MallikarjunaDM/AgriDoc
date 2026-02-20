from fastapi import APIRouter

router = APIRouter(prefix="/api/market", tags=["market"])

@router.get("/products")
async def get_products(category: str = None):
    # Logic to get products
    return [
        {"id": 1, "name": "Urea", "price": 300, "category": "Fertilizers"}
    ]

@router.post("/orders")
async def create_order(order: dict):
    # Logic to create order
    return {"order_id": "ORD-123", "status": "Confirmed"}
