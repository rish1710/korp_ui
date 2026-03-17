"""
Book Service — Generates comprehensive study books from documents.
"""
import uuid
import json
import os
from typing import List, Dict, Any
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage
from core.rag_pipeline import build_context
from core.concept_service import extract_concepts_from_doc

def get_llm():
    return ChatGroq(
        model="llama-3.3-70b-versatile", 
        api_key=os.getenv("GROQ_API_KEY"), 
        temperature=0.3
    )

CHAPTER_SYSTEM = """You are an expert educational writer.
Generate a detailed, well-structured explanation for the given concept based on the source text.
Use markdown with headers, bullet points, and bold text. 
Length: 300-500 words.
Structure:
1. # Concept Name
2. ## Overview
3. ## Deep Dive (Core Principles)
4. ## Examples & Applications
5. ## Summary
"""

def generate_study_book(doc_id: str) -> Dict[str, Any]:
    """
    Generates a full study book from a document.
    """
    # 1. Extract concepts first
    concepts_data = extract_concepts_from_doc(doc_id)
    concepts = concepts_data.get("concepts", [])
    
    if not concepts:
        # Fallback to general summary if no concepts found
        concepts = [{"name": "General Overview", "importance": 1.0}]

    llm = get_llm()
    book_id = str(uuid.uuid4())
    chapters = []

    # Generate chapters for top concepts
    for concept in concepts[:8]:  # Limit to top 8 concepts for speed/cost
        name = concept["name"]
        
        # Pull specific context for this concept
        context = build_context(f"Deep dive into {name}", doc_id=doc_id, n_results=5)
        
        prompt = f"Write a comprehensive chapter for the concept: {name}\n\nSource material:\n{context}"
        
        response = llm.invoke([SystemMessage(content=CHAPTER_SYSTEM), SystemMessage(content=prompt)])
        
        chapters.append({
            "title": name,
            "content": response.content,
            "word_count": len(response.content.split())
        })

    return {
        "book_id": book_id,
        "title": "AI Study Companion",
        "chapters": chapters,
        "total_chapters": len(chapters)
    }
