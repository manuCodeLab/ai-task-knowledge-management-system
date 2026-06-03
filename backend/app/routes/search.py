from fastapi import APIRouter, Depends, HTTPException

from app.schemas.search import SearchRequest, SearchResponse
from app.services.embedding_service import semantic_search
from app.utils.rbac import get_current_user

router = APIRouter(prefix="/search", tags=["Search"])


@router.post("", response_model=SearchResponse)
def search_documents(payload: SearchRequest, current_user=Depends(get_current_user)):
    if not payload.query.strip():
        raise HTTPException(status_code=400, detail="Search query is required")
    results = semantic_search(payload.query, payload.top_k)
    return SearchResponse(query=payload.query, results=results)
