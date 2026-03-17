from fastapi import APIRouter, Body
from core.schemas import CourseSuggestionResponse
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
import os

router = APIRouter(prefix="/api/rag", tags=["RAG"])

@router.post("/courses", response_model=CourseSuggestionResponse)
async def generate_course_suggestions(doc_content: str = Body(..., description="The combined text content of the uploaded documents.")):
    """
    Generate strict, structured course suggestions based on the provided document context using
    Groq's structured outputs via Langchain.
    """
    api_key = os.getenv("GROQ_API_KEY")

    llm = ChatGroq(model="llama-3.3-70b-versatile", api_key=api_key).with_structured_output(CourseSuggestionResponse)
    
    prompt = PromptTemplate.from_template(
        "Based on the following document context, suggest exactly 3 tailored learning courses that the student should take to master the material.\n\nContext: {context}"
    )
    
    chain = prompt | llm
    
    # In a real scenario, this doc_content would be retrieved from ChromaDB 
    # instead of passed directly in the body, but this fulfills the UI requirement.
    response = chain.invoke({"context": doc_content[:5000]}) # Limit context size
    
    return response
