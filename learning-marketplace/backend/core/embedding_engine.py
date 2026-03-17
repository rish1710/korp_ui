"""
Embedding Engine — Generates embeddings using Sentence Transformers and stores in ChromaDB.
"""
import chromadb
from sentence_transformers import SentenceTransformer


# Initialize model and DB
_model = None
_client = None
_collection = None


def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer("all-MiniLM-L6-v2")
    return _model


def get_collection():
    global _client, _collection
    if _collection is None:
        _client = chromadb.PersistentClient(path="./storage/chroma_db")
        _collection = _client.get_or_create_collection(
            name="korp_documents",
            metadata={"hnsw:space": "cosine"}
        )
    return _collection


def generate_embeddings(texts: list[str]) -> list[list[float]]:
    """Generate embeddings for a list of text chunks."""
    model = get_model()
    embeddings = model.encode(texts, show_progress_bar=True)
    return embeddings.tolist()


def store_chunks(doc_id: str, chunks: list[str], metadata: dict = None):
    """Store document chunks with embeddings in ChromaDB."""
    if not chunks:
        return 0
        
    collection = get_collection()
    model = get_model()
    
    embeddings = model.encode(chunks).tolist()
    ids = [f"{doc_id}_chunk_{i}" for i in range(len(chunks))]
    metadatas = [{"doc_id": doc_id, "chunk_index": i, **(metadata or {})} for i in range(len(chunks))]
    
    collection.add(
        ids=ids,
        embeddings=embeddings,
        documents=chunks,
        metadatas=metadatas,
    )
    return len(chunks)


def query_similar(query: str, n_results: int = 5, doc_id: str = None):
    """Find similar chunks to a query."""
    collection = get_collection()
    model = get_model()
    
    query_embedding = model.encode([query]).tolist()
    
    where_filter = {"doc_id": doc_id} if doc_id else None
    
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=n_results,
        where=where_filter,
    )
    
    return {
        "documents": results["documents"][0] if results["documents"] else [],
        "metadatas": results["metadatas"][0] if results["metadatas"] else [],
        "distances": results["distances"][0] if results["distances"] else [],
    }
