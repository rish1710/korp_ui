from fastapi import APIRouter
from pydantic import BaseModel
from core.quick_service import generate_cheat_sheet

router = APIRouter()

class QuickRequest(BaseModel):
    doc_id: str

@router.post("/api/quick/cheat-sheet")
async def create_cheat_sheet(req: QuickRequest):
    try:
        data = generate_cheat_sheet(req.doc_id)
        return {
            "status": "success",
            "content": data.get("content")
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.post("/api/quick/summary")
async def create_summary(req: QuickRequest):
    try:
        from core.quick_service import generate_summary
        data = generate_summary(req.doc_id)
        return {
            "status": "success",
            "content": data.get("content")
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
