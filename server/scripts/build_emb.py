import sys
import pandas as pd
from sentence_transformers import SentenceTransformer
import chromadb
import os
from pathlib import Path

# 1. Get the directory of the current script (server/scripts)
script_dir = Path(__file__).resolve().parent

# 2. Go up one level to the 'server' folder
server_dir = script_dir.parent

# 3. Add 'server' to sys.path so 'import app' works
# (Since 'app' is inside 'server')
sys.path.append(str(server_dir))

# 4. Define the path to your CSV (inside server/data)
csv_path = server_dir / "data" / "coursera.csv"

print(f"Checking for file at: {csv_path}")

if not csv_path.exists():
    print(f"Error: Could not find {csv_path}")
    print(f"Available in {server_dir}: {os.listdir(server_dir)}")
    sys.exit(1) 
df = pd.read_csv(csv_path).fillna("").astype(str)
cols = ["Title","Subject","Institution","Gained Skills","Rate","Reviews","Duration","Level","Learning Product"]

df["combined"] = df[cols].agg(" ".join, axis=1)
print(df["combined"])
model = SentenceTransformer("all-MiniLM-L6-v2")

client = chromadb.PersistentClient(path="chroma_db")
client.delete_collection(name="courses")
collection = client.get_or_create_collection(name="courses")
documents = df["combined"].tolist()

metadatas = df[cols].to_dict(orient="records")

ids = [str(i) for i in range(len(df))]
print(f"Starting embedding process for {len(documents)} rows...")

embeddings = model.encode(documents,show_progress_bar=True,batch_size=32).tolist()

print("Encoding complete! Writing to ChromaDB...")

collection.upsert(
    documents=documents,     
    embeddings=embeddings,
    metadatas=metadatas,     
    ids=ids
)

