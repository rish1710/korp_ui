"""
Prediction Service — Predicts likely exam questions based on document content.
"""
import os
import json
from typing import Dict, Any, List
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage
from core.rag_pipeline import build_context

def get_llm():
    return ChatGroq(
        model="llama-3.3-70b-versatile", 
        api_key=os.getenv("GROQ_API_KEY"), 
        temperature=0.5
    )

PREDICTION_SYSTEM = """You are an expert professor designing a final exam.
Analyze the provided material and predict the most likely questions to appear on an exam.
Categorize them into:
1. Conceptual (Testing understanding)
2. Applied (Problem solving/Scenarios)
3. Factual (Recall of key data)

Return JSON with this structure:
{
  "predictions": [
    {"question": "...", "type": "Conceptual", "reason": "Why this is likely", "hint": "..."},
    ...
  ]
}
"""

def predict_exam_questions(doc_id: str) -> Dict[str, Any]:
    llm = get_llm()
    context = build_context("Identify core exam-worthy topics and complex relationships.", doc_id=doc_id, n_results=10)
    
    prompt = f"Predict exam questions for this material:\n\n{context}"
    
    response = llm.invoke([SystemMessage(content=PREDICTION_SYSTEM), SystemMessage(content=prompt)])
    
    try:
        content = response.content
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].strip()
            
        data = json.loads(content)
        return data
    except Exception as e:
        print(f"Error parsing predictions: {e}")
        return {"predictions": [], "error": str(e)}
