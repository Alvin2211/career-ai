import sys
import pandas as pd
from sentence_transformers import SentenceTransformer
import chromadb
import os
from pathlib import Path


def build_chroma():

    script_dir = Path(__file__).resolve().parent

    server_dir = script_dir.parent

    sys.path.append(str(server_dir))

    csv_path = server_dir / "data" / "coursera.csv"

    print(f"Checking for file at: {csv_path}")

    if not csv_path.exists():
        print(f"Error: Could not find {csv_path}")
        print(f"Available in {server_dir}: {os.listdir(server_dir)}")
        sys.exit(1)

    df = pd.read_csv(csv_path).fillna("").astype(str)

    cols = [
        "Title",
        "Subject",
        "Institution",
        "Gained Skills",
        "Rate",
        "Reviews",
        "Duration",
        "Level",
        "Learning Product"
    ]

    df["combined"] = df[cols].agg(" ".join, axis=1)

    model = SentenceTransformer("all-MiniLM-L6-v2")

    client = chromadb.PersistentClient(path="chroma_db")

    try:
        client.delete_collection(name="courses")
    except:
        pass

    collection = client.get_or_create_collection(name="courses")

    documents = df["combined"].tolist()

    metadatas = df[cols].to_dict(orient="records")

    ids = [str(i) for i in range(len(df))]

    print(f"Starting embedding process for {len(documents)} rows...")

    embeddings = model.encode(
        documents,
        show_progress_bar=True,
        batch_size=32
    ).tolist()

    print("Encoding complete! Writing to ChromaDB...")

    collection.upsert(
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas,
        ids=ids
    )

    print("ChromaDB build complete!")


if __name__ == "__main__":
    build_chroma()