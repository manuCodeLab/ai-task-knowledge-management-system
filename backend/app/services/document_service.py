from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile
from pypdf import PdfReader

UPLOAD_DIR = Path(__file__).resolve().parents[2] / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)


def extract_pdf_text(file_path: Path) -> str:
    reader = PdfReader(str(file_path))
    pages = [page.extract_text() or "" for page in reader.pages]
    return "\n".join(pages).strip()


def save_knowledge_file(file: UploadFile) -> tuple[str, str, bytes, str]:
    if not file.filename:
        raise ValueError("File name is required")

    extension = Path(file.filename).suffix.lower()
    if extension not in {".txt", ".pdf"}:
        raise ValueError("Only .txt and .pdf files are supported")

    safe_name = Path(file.filename).name
    stored_name = f"{uuid4().hex}_{safe_name}"
    destination = UPLOAD_DIR / stored_name
    content = file.file.read()
    destination.write_bytes(content)

    if extension == ".pdf":
        text = extract_pdf_text(destination)
    else:
        text = content.decode("utf-8", errors="ignore")

    if not text.strip():
        raise ValueError("No readable text found in uploaded file")

    content_type = file.content_type or "application/octet-stream"
    return str(destination.resolve()), text, content, content_type
