from app.core.chroma_config import get_model, get_client

model= get_model()
client = get_client()
collection = client.get_collection(name="courses")

async def rec_courses(query:str, k:int=4):
    query_embedding= model.encode([query]).tolist()

    results=collection.query(
        query_embeddings=query_embedding,
        n_results=k,
    )

    return results["metadatas"][0]

    