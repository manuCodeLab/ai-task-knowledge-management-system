import os
import ssl
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

raw_database_url = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:password@localhost:3306/ai_task_knowledge",
)


def normalize_database_url(database_url: str) -> tuple[str, dict]:
    parsed = urlsplit(database_url)
    scheme = "mysql+pymysql" if parsed.scheme == "mysql" else parsed.scheme
    query_items = dict(parse_qsl(parsed.query))
    ssl_mode = query_items.pop("ssl-mode", None) or query_items.pop("ssl_mode", None)
    normalized = urlunsplit(
        (scheme, parsed.netloc, parsed.path, urlencode(query_items), parsed.fragment)
    )

    connect_args = {}
    is_aiven_host = bool(parsed.hostname and "aivencloud.com" in parsed.hostname)
    if ssl_mode or is_aiven_host:
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE
        connect_args["ssl"] = ssl_context
    return normalized, connect_args


DATABASE_URL, CONNECT_ARGS = normalize_database_url(raw_database_url)

engine = create_engine(DATABASE_URL, pool_pre_ping=True, connect_args=CONNECT_ARGS)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
