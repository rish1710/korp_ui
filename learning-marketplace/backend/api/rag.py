"""RAG API — Retrieval Augmented Generation queries."""
from fastapi import APIRouter
from pydantic import BaseModel
from core.rag_pipeline import generate_rag_response

router = APIRouter()

class RAGRequest(BaseModel):
    query: str
    doc_id: str = None

@router.post("/rag/query")
async def rag_query(req: RAGRequest):
    return generate_rag_response(req.query, doc_id=req.doc_id)
