from .llm_client import llm_json
from .concept_mapper import extract_document_concepts
from core.embedding_engine import query_similar

PREDICTION_SYSTEM = """You are an expert at predicting exam questions.

Generate realistic exam-style questions based on the provided concept and material.

For each question:
- Focus on application and analysis (Bloom's taxonomy)
- Make it realistic and exam-appropriate
- Include 4 plausible options
- Provide reasoning for why this is likely to appear on an exam

Return JSON:
{
  "questions": [
    {
      "question": "...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "correct": "A",
      "explanation": "...",
      "likelihood_score": 0.85,
      "reasoning": "..."
    }
  ]
}"""

PREDICTION_USER = """Predict likely exam questions for Concept: {concept_name}

Source material:
{context}

Generate 2 exam-style questions focusing on application and analysis."""

def predict_document_exam_questions(doc_id: str) -> list[dict]:
    """
    Predict likely exam questions for a document's key concepts.
    """
    # 1. Get concepts
    concepts = extract_document_concepts(doc_id, n_concepts=5)
    
    all_predictions = []
    
    # 2. Predict questions for each concept
    for concept in concepts:
        relevant = query_similar(concept["name"], n_results=6, doc_id=doc_id)
        context = "\n\n".join(relevant.get("documents", []))
        
        result = llm_json(
            PREDICTION_SYSTEM,
            PREDICTION_USER.format(
                concept_name=concept["name"],
                context=context[:4000]
            )
        )
        
        questions = result.get("questions", [])
        for q in questions:
            q["concept_name"] = concept["name"]
            all_predictions.append(q)
            
    # Sort by likelihood
    all_predictions.sort(key=lambda x: x.get("likelihood_score", 0), reverse=True)
    
    return all_predictions[:10]
