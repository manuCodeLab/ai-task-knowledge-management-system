from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.search import SearchRequest, SearchResponse
from app.services.embedding_service import semantic_search
from app.services.log_service import log_activity
from app.utils.rbac import get_current_user

router = APIRouter(prefix="/search", tags=["Search"])


@router.post("", response_model=SearchResponse)
def search_documents(
    payload: SearchRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not payload.query.strip():
        raise HTTPException(status_code=400, detail="Search query is required")
    results = semantic_search(payload.query, payload.top_k)
    log_activity(db, current_user.id, "search", payload.query.strip())
    return SearchResponse(query=payload.query, results=results)
