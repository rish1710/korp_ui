"""
Knowledge Graph Builder — Extracts concept relationships using spaCy + NetworkX.
"""
import networkx as nx

try:
    import spacy
    _nlp = None
    def get_nlp():
        global _nlp
        if _nlp is None:
            try:
                _nlp = spacy.load("en_core_web_sm")
            except OSError:
                import subprocess
                subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"], check=True)
                _nlp = spacy.load("en_core_web_sm")
        return _nlp
except ImportError:
    def get_nlp():
        return None


def extract_concepts(text: str) -> list[dict]:
    """Extract named entities and noun phrases as concepts."""
    nlp = get_nlp()
    if nlp is None:
        # Fallback: simple word frequency
        words = text.lower().split()
        freq = {}
        for w in words:
            w = w.strip(".,;:!?")
            if len(w) > 4:
                freq[w] = freq.get(w, 0) + 1
        return [{"label": k, "type": "keyword", "count": v} for k, v in sorted(freq.items(), key=lambda x: -x[1])[:20]]
    
    doc = nlp(text[:100000])  # Limit text size
    
    concepts = {}
    
    # Named entities
    for ent in doc.ents:
        key = ent.text.lower().strip()
        if len(key) > 2:
            concepts[key] = {"label": ent.text, "type": ent.label_, "count": concepts.get(key, {}).get("count", 0) + 1}
    
    # Noun chunks (important concepts)
    for chunk in doc.noun_chunks:
        key = chunk.text.lower().strip()
        if len(key) > 3 and key not in concepts:
            concepts[key] = {"label": chunk.text, "type": "CONCEPT", "count": 1}
    
    return sorted(concepts.values(), key=lambda x: -x["count"])[:30]


def build_graph(text: str) -> dict:
    """Build a knowledge graph from text."""
    nlp = get_nlp()
    concepts = extract_concepts(text)
    
    G = nx.Graph()
    
    # Add nodes
    for concept in concepts:
        G.add_node(concept["label"], type=concept["type"], count=concept["count"])
    
    # Add edges based on co-occurrence in sentences
    sentences = [s.strip() for s in text.split(".") if len(s.strip()) > 10]
    
    concept_labels = [c["label"].lower() for c in concepts]
    
    for sentence in sentences:
        sent_lower = sentence.lower()
        present = [c for c in concept_labels if c in sent_lower]
        
        # Create edges between co-occurring concepts
        for i in range(len(present)):
            for j in range(i + 1, len(present)):
                c1 = next((c["label"] for c in concepts if c["label"].lower() == present[i]), present[i])
                c2 = next((c["label"] for c in concepts if c["label"].lower() == present[j]), present[j])
                
                if G.has_edge(c1, c2):
                    G[c1][c2]["weight"] += 1
                else:
                    G.add_edge(c1, c2, weight=1, relationship="co-occurs")
    
    # Convert to serializable format
    nodes = [{"id": n, "label": n, **G.nodes[n]} for n in G.nodes]
    edges = [{"from": u, "to": v, **G.edges[u, v]} for u, v in G.edges]
    
    return {
        "nodes": nodes,
        "edges": edges,
        "stats": {
            "total_nodes": len(nodes),
            "total_edges": len(edges),
        }
    }
