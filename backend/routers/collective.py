from fastapi import APIRouter

router = APIRouter(prefix="/api/collective", tags=["collective"])

@router.get("/insights")
async def get_insights(district: str):
    # Logic to get aggregated data
    return [
        {"issue": "Aphids", "count": 15, "risk": "High"},
        {"issue": "Rust", "count": 8, "risk": "Medium"}
    ]

@router.post("/report")
async def report_issue(issue: dict):
    # Logic to save report
    return {"status": "Reported"}
