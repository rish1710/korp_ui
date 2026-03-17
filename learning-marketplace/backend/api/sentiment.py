"""Sentiment API — Tone and emphasis analysis."""
from fastapi import APIRouter
from pydantic import BaseModel
from core.sentiment_analyzer import analyze_sentiment, analyze_emphasis

router = APIRouter()

class SentimentRequest(BaseModel):
    text: str

@router.post("/sentiment/analyze")
async def analyze_sentiment_endpoint(req: SentimentRequest):
    sentiment = analyze_sentiment(req.text)
    emphasis = analyze_emphasis(req.text)
    return {"sentiment": sentiment, "emphasis": emphasis}
