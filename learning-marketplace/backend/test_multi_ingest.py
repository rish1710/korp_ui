import requests
import os

BASE_URL = "http://127.0.0.1:8000/api"

def test_multi_ingest():
    print("--- Testing Multi-File Ingestion ---")
    
    # Create two dummy files
    file1_path = "f1.txt"
    with open(file1_path, "w") as f:
        f.write("Quantum computing is a type of computing that uses quantum-mechanical phenomena.")
        
    file2_path = "f2.txt"
    with open(file2_path, "w") as f:
        f.write("Shor's algorithm is a quantum algorithm for integer factorization.")
    
    # Create and upload
    with open(file1_path, 'rb') as f1, open(file2_path, 'rb') as f2:
        files = [
            ('files', ('f1.txt', f1, 'text/plain')),
            ('files', ('f2.txt', f2, 'text/plain'))
        ]
        response = requests.post(f"{BASE_URL}/ingest", files=files)
        data = response.json()
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {data}")
    
    # Clean up
    if os.path.exists(file1_path): os.remove(file1_path)
    if os.path.exists(file2_path): os.remove(file2_path)
    
    if "doc_id" in data:
        doc_id = data["doc_id"]
        print(f"\n--- Testing Study Book Context for Doc ID: {doc_id} ---")
        
        # Check if we can generate a book
        book_resp = requests.post(f"{BASE_URL}/books/generate", json={"doc_id": doc_id})
        book_data = book_resp.json()
        
        print(f"Book Status: {book_resp.status_code}")
        # print(f"Book Data: {book_data}")
        
        if book_data.get("status") == "success":
            print("SUCCESS: Study book generated from multi-file batch!")
            # Check if both topics are mentioned (briefly)
            full_text = str(book_data)
            has_quantum = "Quantum" in full_text
            has_shor = "Shor" in full_text
            print(f"Contains 'Quantum': {has_quantum}")
            print(f"Contains 'Shor': {has_shor}")
        else:
            print("FAILURE: Study book generation failed.")

if __name__ == "__main__":
    test_multi_ingest()
