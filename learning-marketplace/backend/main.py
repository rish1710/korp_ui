"""
KORP — Knowledge Operating Platform
FastAPI Backend Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from api.ingest import router as ingest_router
from api.summarize import router as summarize_router
from api.rag import router as rag_router
from api.quiz import router as quiz_router
from api.graph import router as graph_router
from api.sentiment import router as sentiment_router
from api.podcast import router as podcast_router
from api.courses import router as courses_router
from api.concepts import router as concepts_router
from api.books import router as books_router
from api.quick import router as quick_router
from api.predictions import router as predictions_router
from api.quick import router as quick_router

app = FastAPI(
    title="KORP API",
    description="AI-powered knowledge workspace backend",
    version="1.0.0",
)

# CORS for Next.js frontend
# NOTE: allow_credentials=True cannot be used with allow_origins=["*"] per CORS spec.
# Since we don't use cookie-based auth, we drop allow_credentials entirely.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(ingest_router, prefix="/api", tags=["Ingest"])
app.include_router(summarize_router, prefix="/api", tags=["Summarize"])
app.include_router(rag_router, prefix="/api", tags=["RAG"])
app.include_router(quiz_router, prefix="/api", tags=["Quiz"])
app.include_router(graph_router, prefix="/api", tags=["Graph"])
app.include_router(sentiment_router, prefix="/api", tags=["Sentiment"])
app.include_router(podcast_router, prefix="/api", tags=["Podcast"])
app.include_router(courses_router, prefix="/api", tags=["Courses"])
app.include_router(concepts_router, prefix="/api", tags=["Concepts"])
app.include_router(books_router, prefix="/api", tags=["Books"])
app.include_router(quick_router, prefix="/api", tags=["Quick"])
app.include_router(predictions_router, prefix="/api", tags=["Predictions"])


@app.get("/")
def root():
    return {"name": "KORP API", "status": "running", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "ok"}
