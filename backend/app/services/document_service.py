from pathlib import Path
from uuid import uuid4

from fastapi import UploadFile

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


def save_text_file(file: UploadFile) -> tuple[str, str]:
    if not file.filename or not file.filename.lower().endswith(".txt"):
        raise ValueError("Only .txt files are supported")

    safe_name = Path(file.filename).name
    stored_name = f"{uuid4().hex}_{safe_name}"
    destination = UPLOAD_DIR / stored_name
    content = file.file.read()
    text = content.decode("utf-8", errors="ignore")
    destination.write_text(text, encoding="utf-8")
    return str(destination), text
