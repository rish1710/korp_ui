"""Ingest API — Upload and process documents."""
import os
import uuid
from fastapi import APIRouter, UploadFile, File, Form
from core.document_processor import process_document, chunk_text
from core.embedding_engine import store_chunks

router = APIRouter()

UPLOAD_DIR = "./storage/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/ingest")
async def ingest_document(files: list[UploadFile] = File(None), youtube_url: str = Form(None)):
    """Upload multiple files or a YouTube URL for processing."""
    doc_id = str(uuid.uuid4())
    aggregated_text = ""
    filenames = []
    
    if youtube_url:
        text = process_document(youtube_url, "youtube")
        aggregated_text += text
        filenames.append(youtube_url)
        file_type = "youtube"
    elif files:
        for file in files:
            ext = file.filename.split(".")[-1].lower()
            file_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}.{ext}")
            
            with open(file_path, "wb") as f:
                content = await file.read()
                f.write(content)
            
            text = process_document(file_path, ext)
            if text and not text.startswith("Unsupported"):
                aggregated_text += f"\n\n--- Source: {file.filename} ---\n\n" + text
                filenames.append(file.filename)
        
        file_type = "multi-file" if len(files) > 1 else files[0].filename.split(".")[-1].lower()
    else:
        return {"error": "No file or YouTube URL provided"}
    
    if not aggregated_text or not aggregated_text.strip():
        return {"error": "Text extraction failed. The documents might be empty or encrypted."}
    
    # Chunk and embed
    chunks = chunk_text(aggregated_text)
    num_stored = store_chunks(doc_id, chunks, metadata={"filenames": ", ".join(filenames), "type": file_type})
    
    return {
        "doc_id": doc_id,
        "filenames": filenames,
        "type": file_type,
        "text_length": len(aggregated_text),
        "chunks": num_stored,
        "status": "processed",
    }


@router.get("/documents")
async def list_documents():
    """List all processed documents (demo endpoint)."""
    return {"documents": [], "message": "Connect to a database for persistent document listing."}
