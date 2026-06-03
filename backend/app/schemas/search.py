from pydantic import BaseModel


class SearchRequest(BaseModel):
    query: str
    top_k: int = 5


class SearchResult(BaseModel):
    document_id: int | None = None
    title: str | None = None
    chunk: str
    score: float | None = None


class SearchResponse(BaseModel):
    query: str
    results: list[SearchResult]
