import os

from dotenv import load_dotenv


def load_config() -> None:
    """Load environment variables from the project .env file."""
    env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
    load_dotenv(env_path)


def get_database_uri() -> str:
    """Resolve the database URI from env, with Neon/Postgres driver support."""
    basedir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    url = os.environ.get("DATABASE_URL") or os.environ.get("database_url")

    if url and url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+psycopg://", 1)

    return url or f"sqlite:///{os.path.join(basedir, 'inspection_system.db')}"
