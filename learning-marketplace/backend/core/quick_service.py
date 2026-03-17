"""
Quick Service — Rapid revision tools like Cheat Sheets and Mnemonics.
"""
import os
from typing import Dict, Any
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage
from core.rag_pipeline import build_context

def get_llm():
    return ChatGroq(
        model="llama-3.3-70b-versatile", 
        api_key=os.getenv("GROQ_API_KEY"), 
        temperature=0.4
    )

SUMMARY_SYSTEM = """You are an expert at distilling information.
Create a high-level, executive summary of the provided text.
Structure:
1. # Executive Summary
2. ## Core Objective
3. ## Key Takeaways (Bullet points)
4. ## Strategic Conclusion
Keep it professional, dense with information, yet highly readable.
"""

def generate_cheat_sheet(doc_id: str) -> Dict[str, Any]:
    llm = get_llm()
    context = build_context("Extract all key formulas, definitions, and facts for a quick reference sheet.", doc_id=doc_id, n_results=10)
    
    prompt = f"Create a comprehensive cheat sheet for the following material:\n\n{context}"
    
    response = llm.invoke([SystemMessage(content=CHEAT_SHEET_SYSTEM), SystemMessage(content=prompt)])
    
    return {
        "content": response.content,
        "status": "success"
    }

def generate_summary(doc_id: str) -> Dict[str, Any]:
    llm = get_llm()
    # Pull broad context for summary
    context = build_context("Summarize the entire document's main points.", doc_id=doc_id, n_results=15)
    
    prompt = f"Summarize the following content:\n\n{context}"
    
    response = llm.invoke([SystemMessage(content=SUMMARY_SYSTEM), SystemMessage(content=prompt)])
    
    return {
        "content": response.content,
        "status": "success"
    }
