import json
from typing import List, Optional, TypedDict
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage
from langgraph.graph import StateGraph, END
from core.embedding_engine import query_similar
from prompter import Prompter
import os

class RAGState(TypedDict):
    question: str
    doc_id: Optional[str]
    strategy_reasoning: str
    searches: List[dict]
    query_results: List[str]
    final_answer: str

# Use an LLM for the graph. Ensure OPENAI_API_KEY is accessible.
# We initialize it conditionally or inside the functions depending on setup.
# We'll initialize it here; if the key is missing at runtime, it will throw.
def get_llm():
    return ChatGroq(model="llama-3.3-70b-versatile", api_key=os.getenv("GROQ_API_KEY"), temperature=0)

def generate_strategy(state: RAGState):
    llm = get_llm()
    prompter = Prompter("ask/entry")
    prompt_text = prompter.render(
        question=state["question"],
        format_instructions="Return JSON with 'reasoning' and 'searches' array (each with 'term' and 'instructions')."
    )
    
    response = llm.invoke([SystemMessage(content=prompt_text)])
    
    try:
        content = response.content
        if "```json" in content:
            content = content.split("```json")[1].split("```")[0].strip()
        elif "```" in content:
            content = content.split("```")[1].strip()
            
        data = json.loads(content)
        return {
            "strategy_reasoning": data.get("reasoning", ""),
            "searches": data.get("searches", [{"term": state["question"], "instructions": "Find general info."}])
        }
    except Exception as e:
        return {
            "strategy_reasoning": "Fallback strategy due to parsing error.",
            "searches": [{"term": state["question"], "instructions": "Search for context."}]
        }

def execute_queries(state: RAGState):
    llm = get_llm()
    prompter = Prompter("ask/query_process")
    query_results = []
    
    for search in state["searches"]:
        term = search["term"]
        instructions = search["instructions"]
        
        # Retrieve context
        results = query_similar(term, n_results=5, doc_id=state.get("doc_id"))
        
        retrieved_context = ""
        ids = []
        if results and results.get("documents"):
            for i, (doc, meta) in enumerate(zip(results["documents"], results["metadatas"])):
                source_id = f"source:{meta.get('doc_id', 'unknown')}_{i}"
                ids.append(source_id)
                source_filename = meta.get("filename", "Unknown")
                retrieved_context += f"Document ID: [{source_id}]\nFilename: {source_filename}\nContent: {doc}\n\n"
        
        if not retrieved_context:
            retrieved_context = "No results found for this query."
            
        prompt_text = prompter.render(
            question=state["question"],
            term=term,
            instructions=instructions,
            results=retrieved_context,
            ids=", ".join(ids) if ids else "None"
        )
        
        response = llm.invoke([SystemMessage(content=prompt_text)])
        query_results.append(response.content)
        
    return {"query_results": query_results}

def synthesize_answer(state: RAGState):
    llm = get_llm()
    prompter = Prompter("ask/final_answer")
    
    answers_text = ""
    for i, res in enumerate(state["query_results"]):
        answers_text += f"--- Sub-Query {i+1} Results ---\n{res}\n\n"
        
    prompt_text = prompter.render(
        question=state["question"],
        strategy=state["strategy_reasoning"],
        answers=answers_text
    )
    
    response = llm.invoke([SystemMessage(content=prompt_text)])
    return {"final_answer": response.content}

workflow = StateGraph(RAGState)
workflow.add_node("strategy", generate_strategy)
workflow.add_node("query", execute_queries)
workflow.add_node("synthesize", synthesize_answer)

workflow.set_entry_point("strategy")
workflow.add_edge("strategy", "query")
workflow.add_edge("query", "synthesize")
workflow.add_edge("synthesize", END)

rag_app = workflow.compile()

def build_context(query: str, doc_id: str = None, n_results: int = 5) -> str:
    """
    Helper to fetch and format document context for other tools (like podcast generator).
    """
    results = query_similar(query, n_results=n_results, doc_id=doc_id)
    context = ""
    if results and results.get("documents"):
        for doc in results["documents"]:
            context += doc + "\n\n"
    return context.strip() or "No relevant context found."

def generate_rag_response(query: str, doc_id: str = None) -> dict:
    """
    Executes the multi-step LangGraph RAG pipeline.
    """
    if not os.environ.get("GROQ_API_KEY"):
        return {
            "query": query,
            "answer": "Error: GROQ_API_KEY environment variable is missing. The AI needs this to generate a response.",
            "sources": []
        }
        
    initial_state = {
        "question": query,
        "doc_id": doc_id,
        "strategy_reasoning": "",
        "searches": [],
        "query_results": [],
        "final_answer": ""
    }
    
    try:
        result = rag_app.invoke(initial_state)
        return {
            "query": query,
            "answer": result["final_answer"],
            # Returning the strategy and intermediate reasoning for frontend transparency if needed
            "strategy": result["strategy_reasoning"],
            "searches": result["searches"],
            "sources": result["query_results"] 
        }
    except Exception as e:
        return {
            "query": query,
            "answer": f"Error running RAG pipeline: {str(e)}",
            "sources": []
        }
