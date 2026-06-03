from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.document import Document
from app.models.user import User
from app.schemas.document import DocumentOut
from app.services.document_service import save_text_file
from app.services.embedding_service import index_document
from app.services.log_service import log_activity
from app.utils.rbac import get_current_user, require_roles

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/upload", response_model=DocumentOut, status_code=status.HTTP_201_CREATED)
def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(require_roles("admin")),
    db: Session = Depends(get_db),
):
    try:
        file_path, text = save_text_file(file)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    document = Document(
        title=file.filename or "Untitled document",
        file_path=file_path,
        uploaded_by=current_user.id,
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    chunk_count = index_document(document.id, document.title, text)
    log_activity(
        db,
        current_user.id,
        "document_uploaded",
        f"Uploaded document {document.id} with {chunk_count} chunks",
    )
    return document


@router.get("", response_model=list[DocumentOut])
def list_documents(
    current_user: User = Depends(get_current_user), db: Session = Depends(get_db)
):
    return db.query(Document).order_by(Document.uploaded_at.desc()).all()


@router.get("/{document_id}/download")
def download_document(
    document_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    file_path = Path(document.file_path)
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Uploaded file is not available")

    return FileResponse(
        path=file_path,
        media_type="text/plain",
        filename=document.title,
    )
