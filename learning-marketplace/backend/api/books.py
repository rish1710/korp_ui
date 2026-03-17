from fastapi import APIRouter
from pydantic import BaseModel
from core.book_service import generate_study_book

router = APIRouter()

class BookRequest(BaseModel):
    doc_id: str

@router.post("/books/generate")
async def create_book(req: BookRequest):
    try:
        data = generate_study_book(req.doc_id)
        return {
            "status": "success",
            "book": data
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
