from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from core.concept_service import extract_concepts_from_doc

router = APIRouter()

class ConceptRequest(BaseModel):
    doc_id: str

@router.post("/concepts/extract")
async def extract_concepts(req: ConceptRequest):
    """
    Extracts structured concepts and relationships for a specific document.
    """
    try:
        data = extract_concepts_from_doc(req.doc_id)
        return {
            "status": "success",
            "concepts": data.get("concepts", []),
            "relationships": data.get("relationships", [])
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
