"""
Summarizer — Quick and Comprehensive summarization modes.
"""


def summarize_quick(text: str) -> dict:
    """
    Quick Mode: 100-150 word summary with bullet points.
    
    In production, uses LangChain + LLM.
    For demo, uses extractive summarization.
    """
    sentences = [s.strip() for s in text.replace("\n", " ").split(".") if len(s.strip()) > 20]
    
    # Take key sentences (simple extractive approach for demo)
    key_sentences = sentences[:5] if len(sentences) >= 5 else sentences
    summary = ". ".join(key_sentences) + "."
    
    # Extract key concepts (words that appear frequently)
    words = text.lower().split()
    word_freq = {}
    stop_words = {"the", "a", "an", "is", "are", "was", "were", "in", "on", "at", "to", "for", "of", "and", "or", "but", "with", "by", "from", "as", "it", "this", "that"}
    for w in words:
        w = w.strip(".,;:!?\"'()[]{}").lower()
        if len(w) > 3 and w not in stop_words:
            word_freq[w] = word_freq.get(w, 0) + 1
    
    key_concepts = sorted(word_freq.items(), key=lambda x: -x[1])[:8]
    
    return {
        "mode": "quick",
        "summary": summary[:600],
        "key_concepts": [k for k, v in key_concepts],
        "word_count": len(summary.split()),
    }


def summarize_comprehensive(text: str) -> dict:
    """
    Comprehensive Mode: Structured chapters with explanations.
    
    In production, uses LangChain + LLM for chapter generation.
    For demo, splits text into sections.
    """
    paragraphs = [p.strip() for p in text.split("\n\n") if len(p.strip()) > 50]
    
    # Group into "chapters"
    chapter_size = max(1, len(paragraphs) // 4)
    chapters = []
    for i in range(0, len(paragraphs), chapter_size):
        chunk = paragraphs[i:i + chapter_size]
        if chunk:
            # Generate chapter title from first sentence
            first_sentence = chunk[0].split(".")[0][:80]
            chapters.append({
                "title": f"Section {len(chapters) + 1}: {first_sentence}",
                "content": "\n\n".join(chunk),
                "key_points": [s.split(".")[0][:100] for s in chunk[:3]],
            })
    
    return {
        "mode": "comprehensive",
        "chapters": chapters[:6],
        "total_sections": len(chapters),
    }
