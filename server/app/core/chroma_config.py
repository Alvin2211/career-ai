import chromadb
from sentence_transformers import SentenceTransformer
import os 

def get_model():
    return SentenceTransformer("all-MiniLM-L6-v2")

def get_client():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    db_path = os.path.join(base_dir, "chroma_db")
    return chromadb.PersistentClient(path=db_path)