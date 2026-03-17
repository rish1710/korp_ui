"""Summarize API — Quick and Comprehensive summarization."""
from fastapi import APIRouter
from pydantic import BaseModel
from core.summarizer import summarize_quick, summarize_comprehensive

router = APIRouter()

class SummarizeRequest(BaseModel):
    text: str
    mode: str = "quick"  # "quick" or "comprehensive"

@router.post("/summarize")
async def summarize(req: SummarizeRequest):
    if req.mode == "comprehensive":
        return summarize_comprehensive(req.text)
    return summarize_quick(req.text)
