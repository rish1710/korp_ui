from fastapi import APIRouter
from pydantic import BaseModel
from core.podcast_generator import create_podcast_script_from_document
from core.rag_pipeline import build_context

router = APIRouter()

class PodcastRequest(BaseModel):
    doc_id: str

@router.post("/podcast/generate")
async def generate_podcast(req: PodcastRequest):
    """
    Generates a podcast transcript based on the document's content.
    """
    try:
        # We need a general query to pull context for the podcast. 
        # "Give me a comprehensive overview of the entire document"
        context = build_context("Give me a comprehensive overview of the entire document.", doc_id=req.doc_id, n_results=10)
        
        podcast_script = create_podcast_script_from_document(context)
        return {
            "status": "success",
            "outline": podcast_script.get("outline"),
            "transcript": podcast_script.get("transcript")
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }
