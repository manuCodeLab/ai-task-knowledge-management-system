import os
from functools import lru_cache

import chromadb
from sentence_transformers import SentenceTransformer

MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"
CHROMA_PATH = os.getenv("CHROMA_PATH", "chroma_db")
COLLECTION_NAME = "knowledge_documents"


@lru_cache(maxsize=1)
def get_model():
    return SentenceTransformer(MODEL_NAME)


@lru_cache(maxsize=1)
def get_collection():
    client = chromadb.PersistentClient(path=CHROMA_PATH)
    return client.get_or_create_collection(name=COLLECTION_NAME)


def split_text(text: str, chunk_size: int = 900, overlap: int = 120) -> list[str]:
    cleaned = " ".join(text.split())
    if not cleaned:
        return []

    chunks = []
    start = 0
    while start < len(cleaned):
        end = start + chunk_size
        chunks.append(cleaned[start:end])
        if end >= len(cleaned):
            break
        start = max(0, end - overlap)
    return chunks


def embed_texts(texts: list[str]) -> list[list[float]]:
    if not texts:
        return []
    vectors = get_model().encode(texts, normalize_embeddings=True)
    return vectors.tolist()


def index_document(document_id: int, title: str, text: str):
    chunks = split_text(text)
    embeddings = embed_texts(chunks)
    if not chunks:
        return 0

    collection = get_collection()
    collection.add(
        ids=[f"doc-{document_id}-chunk-{index}" for index in range(len(chunks))],
        documents=chunks,
        embeddings=embeddings,
        metadatas=[
            {"document_id": document_id, "title": title, "chunk_index": index}
            for index in range(len(chunks))
        ],
    )
    return len(chunks)


def semantic_search(query: str, top_k: int = 5) -> list[dict]:
    query_embedding = embed_texts([query])[0]
    result = get_collection().query(
        query_embeddings=[query_embedding],
        n_results=max(1, min(top_k, 10)),
    )

    documents = result.get("documents", [[]])[0]
    metadatas = result.get("metadatas", [[]])[0]
    distances = result.get("distances", [[]])[0]

    matches = []
    for chunk, metadata, distance in zip(documents, metadatas, distances):
        matches.append(
            {
                "document_id": metadata.get("document_id"),
                "title": metadata.get("title"),
                "chunk": chunk,
                "score": None if distance is None else 1 - float(distance),
            }
        )
    return matches
