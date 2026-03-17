from .llm_client import llm_text, llm_json
from .concept_mapper import extract_document_concepts
from core.embedding_engine import query_similar
import uuid

BOOK_CHAPTER_SYSTEM = """You are an expert educational content writer creating comprehensive study materials.

Generate a detailed, well-structured explanation of the given concept for students preparing for exams.

Requirements:
- 300-500 words minimum
- Clear section headers (use ## for sections)
- Explain core principles thoroughly
- Include examples and applications
- Use markdown formatting (bold, italic, lists)
- Academic but accessible tone

Structure:
1. **Overview**: What is this concept and why it matters
2. **Key Principles**: Core ideas explained
3. **Examples**: Practical examples or use cases
4. **Key Takeaways**: Bullet points of essential facts
"""

BOOK_CHAPTER_USER = """Concept: {concept_name}

Write a comprehensive chapter section covering this concept. Use the following source material:

{context}
"""

def generate_study_book(doc_id: str) -> dict:
    """
    Generate a comprehensive study book based on document concepts.
    """
    # 1. Extract concepts
    concepts = extract_document_concepts(doc_id, n_concepts=6) # Small number for demo/speed
    
    if not concepts:
        return {"error": "No concepts extracted from document"}
    
    book_id = str(uuid.uuid4())
    chapters = []
    total_word_count = 0
    
    # 2. Generate chapters for each concept
    for concept in concepts:
        # Retrieve context for this specific concept
        relevant = query_similar(concept["name"], n_results=6, doc_id=doc_id)
        context = "\n\n".join(relevant.get("documents", []))
        
        # Generate content
        content = llm_text(
            BOOK_CHAPTER_SYSTEM,
            BOOK_CHAPTER_USER.format(
                concept_name=concept["name"],
                context=context[:6000]
            )
        )
        
        if not content:
            content = f"## {concept['name']}\n\nCould not generate content."
            
        word_count = len(content.split())
        total_word_count += word_count
        
        chapters.append({
            "id": concept["id"],
            "name": concept["name"],
            "description": concept["description"],
            "importance": concept["importance"],
            "content": content,
            "word_count": word_count
        })
        
    return {
        "book_id": book_id,
        "doc_id": doc_id,
        "chapters": chapters,
        "total_word_count": total_word_count,
        "estimated_read_time": round(total_word_count / 200)
    }
