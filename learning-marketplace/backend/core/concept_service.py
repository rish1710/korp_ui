"""
Concept Service — Extracts concepts and relationships from document text using Groq.
"""
import json
import os
from typing import List, Dict, Any
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage
from core.rag_pipeline import build_context
from prompter import Prompter

def get_llm():
    return ChatGroq(
        model="llama-3.3-70b-versatile", 
        api_key=os.getenv("GROQ_API_KEY"), 
        temperature=0.1
    )

EXTRACT_SYSTEM = """You are an expert at analyzing educational content.
Extract the key concepts and their relationships from the given text.

Return JSON with this exact structure:
{
  "concepts": [
    {"name": "concept1", "importance": 0.9, "description": "Brief summary"},
    ...
  ],
  "relationships": [
    {"source": "concept1", "target": "concept2", "relation": "prerequisite"},
    ...
  ]
}

Rules:
- Keep concept names short (1-4 words).
- relation must be one of: "prerequisite", "related", "part_of".
- Extract only meaningful concepts that are central to the document.
"""

def extract_concepts_from_doc(doc_id: str) -> Dict[str, Any]:
    """
    Retrieves document content and extracts a structured concept graph.
    """
    llm = get_llm()
    
    # Use RAG to pull a broad overview of the document
    context = build_context("Give me a comprehensive overview of all major topics in this document.", doc_id=doc_id, n_results=10)
    
    if "No relevant context found" in context:
        return {"concepts": [], "relationships": []}

    prompt_text = f"Extract concepts and relationships from this educational text:\n\n{context[:12000]}"
    
    response = llm.invoke([SystemMessage(content=EXTRACT_SYSTEM), SystemMessage(content=prompt_text)])
    
    try:
        content = response.content
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].strip()
            
        data = json.loads(content)
        return data
    except Exception as e:
        print(f"Error parsing concepts: {e}")
        return {"concepts": [], "relationships": [], "error": str(e)}
