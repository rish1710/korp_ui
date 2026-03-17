"""
Sentiment Analyzer — Analyzes tone and emphasis in content.
Uses HuggingFace distilbert-base-uncased-finetuned-sst-2-english.
"""
from transformers import pipeline


_analyzer = None


def get_analyzer():
    global _analyzer
    if _analyzer is None:
        _analyzer = pipeline(
            "sentiment-analysis",
            model="distilbert-base-uncased-finetuned-sst-2-english",
            truncation=True,
            max_length=512,
        )
    return _analyzer


def analyze_sentiment(text: str) -> dict:
    """Analyze the overall sentiment of a text."""
    analyzer = get_analyzer()
    
    # Split into manageable chunks for the model
    sentences = [s.strip() for s in text.split(".") if len(s.strip()) > 10]
    
    if not sentences:
        return {"overall": "neutral", "confidence": 0, "details": []}
    
    # Analyze each sentence
    results = []
    for sent in sentences[:20]:  # Limit to 20 sentences
        try:
            result = analyzer(sent[:512])[0]
            results.append({
                "text": sent[:100],
                "label": result["label"].lower(),
                "score": round(result["score"], 3),
            })
        except Exception:
            continue
    
    # Aggregate
    pos_count = sum(1 for r in results if r["label"] == "positive")
    neg_count = sum(1 for r in results if r["label"] == "negative")
    total = len(results) or 1
    
    overall = "positive" if pos_count > neg_count else "negative" if neg_count > pos_count else "neutral"
    avg_confidence = sum(r["score"] for r in results) / total
    
    return {
        "overall_tone": overall,
        "confidence": round(avg_confidence, 3),
        "positive_ratio": round(pos_count / total, 2),
        "negative_ratio": round(neg_count / total, 2),
        "details": results[:10],
    }


def analyze_emphasis(text: str) -> dict:
    """Detect concept importance and emphasis patterns."""
    words = text.lower().split()
    word_freq = {}
    stop_words = {"the", "a", "an", "is", "are", "was", "were", "in", "on", "at", "to", "for", "of", "and", "or", "but", "with", "by", "from", "as"}
    
    for w in words:
        w = w.strip(".,;:!?\"'()[]{}").lower()
        if len(w) > 3 and w not in stop_words:
            word_freq[w] = word_freq.get(w, 0) + 1
    
    # Top concepts by frequency = importance
    sorted_concepts = sorted(word_freq.items(), key=lambda x: -x[1])[:15]
    max_freq = sorted_concepts[0][1] if sorted_concepts else 1
    
    return {
        "concepts": [
            {"term": term, "frequency": freq, "importance": round(freq / max_freq, 2)}
            for term, freq in sorted_concepts
        ]
    }
