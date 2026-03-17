from .llm_client import llm_json
from core.embedding_engine import query_similar
import os

CONCEPT_SYSTEM = """You are an expert at decomposing complex educational material into a logical sequence of concepts.

Analyze the provided document context and extract the top 10 most important concepts or themes.
For each concept:
1. Provide a clear, concise name.
2. Estimate its importance (0.0 to 1.0) compared to other concepts.
3. Provide a 1-sentence description.

Return JSON:
{
  "concepts": [
    {
      "name": "...",
      "importance": 0.85,
      "description": "..."
    }
  ]
}"""

CONCEPT_USER = """Document Context:
{context}

Extract the most important learning concepts from this material."""

def extract_document_concepts(doc_id: str, n_concepts: int = 10) -> list[dict]:
    """
    Extract key concepts from a document using LLM analysis of relevant chunks.
    """
    # Retrieve a diverse set of chunks to understand the document
    results = query_similar("", n_results=15, doc_id=doc_id)
    
    context = ""
    if results and results.get("documents"):
        for doc in results["documents"]:
            context += doc + "\n\n"
            
    if not context:
        return []
    
    # Analyze via LLM
    result = llm_json(
        CONCEPT_SYSTEM,
        CONCEPT_USER.format(context=context[:8000])
    )
    
    concepts = result.get("concepts", [])
    
    # Add unique IDs
    for i, concept in enumerate(concepts):
        concept["id"] = i + 1
        
    return concepts[:n_concepts]
