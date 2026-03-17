"""
Quiz Generator — Generates quizzes based on Bloom's Taxonomy levels.
"""
import random


BLOOM_LEVELS = ["Remember", "Understand", "Apply", "Analyze"]

BLOOM_TEMPLATES = {
    "Remember": [
        "What is {concept}?",
        "Which of the following best defines {concept}?",
        "What is the primary purpose of {concept}?",
    ],
    "Understand": [
        "Why is {concept} important in {context}?",
        "How does {concept} relate to {related}?",
        "Explain the relationship between {concept} and {related}.",
    ],
    "Apply": [
        "In which scenario would you use {concept}?",
        "If you needed to solve a problem involving {context}, which approach using {concept} would be most effective?",
    ],
    "Analyze": [
        "Compare and contrast {concept} with {related}. Which statement is most accurate?",
        "What would happen if {concept} were removed from {context}?",
    ],
}


def extract_key_terms(text: str, n: int = 10) -> list[str]:
    """Extract key terms from text for quiz generation."""
    words = text.lower().split()
    freq = {}
    stop_words = {"the", "a", "an", "is", "are", "was", "were", "in", "on", "at", "to", "for", "of", "and", "or", "but", "with", "by", "from", "as", "it", "this", "that", "be", "have", "has", "had", "not", "can", "will"}
    
    for w in words:
        w = w.strip(".,;:!?\"'()[]{}").lower()
        if len(w) > 4 and w not in stop_words:
            freq[w] = freq.get(w, 0) + 1
    
    return [k for k, v in sorted(freq.items(), key=lambda x: -x[1])[:n]]


def generate_quiz(text: str, num_questions: int = 5, levels: list[str] = None) -> list[dict]:
    """
    Generate quiz questions from text.
    
    In production, uses LLM for high-quality question generation.
    For demo, uses template-based generation.
    """
    if levels is None:
        levels = BLOOM_LEVELS
    
    key_terms = extract_key_terms(text, n=15)
    
    if len(key_terms) < 3:
        return [{"error": "Not enough content to generate questions."}]
    
    questions = []
    
    for i in range(min(num_questions, len(key_terms))):
        level = random.choice(levels)
        concept = key_terms[i]
        related = key_terms[(i + 1) % len(key_terms)]
        context = key_terms[(i + 2) % len(key_terms)]
        
        templates = BLOOM_TEMPLATES.get(level, BLOOM_TEMPLATES["Remember"])
        template = random.choice(templates)
        question_text = template.format(concept=concept, related=related, context=context)
        
        # Generate plausible options
        correct_answer = f"A key aspect of {concept} that connects to {related}"
        wrong_answers = [
            f"It is unrelated to {related}",
            f"{concept} is only theoretical and has no practical use",
            f"It replaces {context} entirely",
        ]
        
        options = [correct_answer] + wrong_answers
        correct_idx = 0
        
        # Shuffle
        combined = list(enumerate(options))
        random.shuffle(combined)
        shuffled_indices, shuffled_options = zip(*combined)
        correct_idx = list(shuffled_indices).index(0)
        
        questions.append({
            "id": i + 1,
            "level": level,
            "question": question_text,
            "options": list(shuffled_options),
            "correct": correct_idx,
            "concept": concept,
            "explanation": f"This question tests your {level.lower()}-level understanding of {concept}.",
        })
    
    return questions
