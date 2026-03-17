from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from core.embedding_engine import query_similar
from core.services.llm_client import llm_json
from core.services.book_generator import generate_study_book
from core.services.exam_predictor import predict_document_exam_questions
import json
import re

router = APIRouter(prefix="/api/quiz", tags=["Quiz"])

class QuizRequest(BaseModel):
    doc_id: str
    num_questions: int = 5
    mode: str = "quiz"  # "quiz" or "flashcard"

@router.post("/generate")
async def generate_quiz_endpoint(req: QuizRequest):
    """Generate quiz questions or flashcards grounded in a document."""
    # Retrieve relevant context
    context_result = query_similar(
        query="What are the key concepts and facts in this document?",
        n_results=8,
        doc_id=req.doc_id
    )
    context_chunks = context_result.get("documents", [])

    if not context_chunks:
        raise HTTPException(status_code=404, detail="No document content found.")

    context = "\n\n".join(context_chunks[:6])

    if req.mode == "flashcard":
        system_prompt = "You are an expert tutor. Generate exactly {req.num_questions} flashcards based on the context."
        user_prompt = f"Context:\n{context}\n\nReturn JSON array: [{{'front': '', 'back': '', 'category': ''}}]"
        items = llm_json(system_prompt.format(req=req), user_prompt)
    else:
        system_prompt = "You are an expert educator. Generate exactly {req.num_questions} multiple-choice quiz questions."
        user_prompt = f"Context:\n{context}\n\nReturn JSON array: [{{'id': 1, 'level': 'Understand', 'question': '', 'options': ['', '', '', ''], 'correct': 0, 'explanation': ''}}]"
        items = llm_json(system_prompt.format(req=req), user_prompt)

    if isinstance(items, dict) and "questions" in items:
        items = items["questions"]
    elif isinstance(items, dict):
        # Handle cases where LLM might wrap in an object
        for key in items:
            if isinstance(items[key], list):
                items = items[key]
                break

    return {"questions": items, "total": len(items) if isinstance(items, list) else 0, "mode": req.mode}

@router.get("/study-book/{doc_id}")
async def get_study_book(doc_id: str):
    """Generate and return a comprehensive study book for a document."""
    try:
        book = generate_study_book(doc_id)
        if "error" in book:
            raise HTTPException(status_code=400, detail=book["error"])
        return book
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/predict/{doc_id}")
async def get_exam_predictions(doc_id: str):
    """Predict likely exam questions for a document."""
    try:
        predictions = predict_document_exam_questions(doc_id)
        return {"predictions": predictions, "total": len(predictions)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
