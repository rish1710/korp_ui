"""Graph API — Knowledge graph generation."""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from core.knowledge_graph_builder import build_graph, extract_concepts

router = APIRouter()

class GraphRequest(BaseModel):
    text: Optional[str] = None
    doc_id: Optional[str] = None

@router.post("/graph/build")
async def build_graph_endpoint(req: GraphRequest):
    content = req.text
    if req.doc_id:
        from core.embedding_engine import query_similar
        # Fetch top chunks to build a meaningful graph
        result = query_similar("Explain the main concepts and their relationships.", n_results=10, doc_id=req.doc_id)
        content = "\n\n".join(result.get("documents", []))
    
    if not content:
        return {"nodes": [], "edges": [], "error": "No content to graph."}
        
    return build_graph(content)

@router.post("/graph/concepts")
async def extract_concepts_endpoint(req: GraphRequest):
    concepts = extract_concepts(req.text)
    return {"concepts": concepts}
