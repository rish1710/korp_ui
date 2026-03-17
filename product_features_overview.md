# KORP — Feature Overview & Technical Reference (PDR)

KORP is a multimodal study intelligence platform that transforms raw documents into structured knowledge through AI-powered RAG pipelines, interactive 3D visualizations, and adaptive learning tools.

## 🚀 Core Features

### 1. Multimodal Study Intelligence (RAG)
- **Document Ingestion:** Supports PDF, PPT, and standard text. Files are chunked and stored in a ChromaDB vector store.
- **Advanced RAG Pipeline:** Powered by **LangGraph** using a multi-step logic:
    1. **Strategy:** AI determines the best search terms.
    2. **Query:** Retrieves context from ChromaDB.
    3. **Synthesis:** Compiles the final answer with source citations.
- **LLM Provider:** Fully migrated to **Groq (LLama3-8b-8192)** for lightning-fast inference.

### 2. Intelligent Notebook Workspace
- **3-Panel Dashboard:** Seamless navigation between document sources, AI results, and chat.
- **AI Summaries:** Instant generation of "Quick" or "Comprehensive" study guides from uploaded materials.
- **Contextual Chat:** Ask specific questions about any uploaded document using real-time RAG.

### 3. Adaptive Learning & Retrieval
- **Contextual Quiz Center:** Generates Multiple Choice Questions (MCQs) and 3D-flipping Flashcards directly from your documents.
- **Knowledge Graph (3D):** An interactive 3D force-directed graph visualized with Three.js. It extracts concepts and entity relationships from your study materials.

### 4. Tiki Mascot Branding
Integrated an 8-state emotional mascot system to provide friendly feedback:
- **Determined:** Login & CTA areas.
- **Happy / Thumbs Up:** Dashboard greeting.
- **Relaxed:** Empty upload zones.
- **Processing:** Loading states for RAG/Quizzes.
- **Celebrating:** High quiz scores (>= 75%).
- **Sad:** Low quiz scores or unexpected empty states.
- **Annoyed:** Empty Notebook states.

---

## 🛠 Technical Stack
- **Frontend:** Next.js (App Router), Tailwind CSS, Framer Motion, Lucide React, react-force-graph-3d.
- **Backend:** FastAPI, Uvicorn, LangChain, LangGraph, ChromaDB.
- **Embeddings:** Sentence Transformers (`all-MiniLM-L6-v2`).
- **LLM API:** Groq (via `langchain-groq`).

## ⚙️ Setup & Maintenance
- **Backend:** `python -m uvicorn main:app --reload --port 8000`
- **Frontend:** `npm run dev`
- **API Keys:** Managed via `.env` in the backend directory.

---
*Created on March 16, 2026*
