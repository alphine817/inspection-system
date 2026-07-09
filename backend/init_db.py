"""
Create all database tables from SQLAlchemy models and push schema to the database.

Usage:
    python init_db.py

Safe to run multiple times — existing tables are left unchanged.
"""

from sqlalchemy import inspect

from app import app
from models import (  # noqa: F401 — register all models with SQLAlchemy metadata
    Inspection,
    InspectionItem,
    Property,
    Unit,
    User,
    db,
)

EXPECTED_TABLES = [
    "users",
    "properties",
    "units",
    "inspections",
    "inspection_items",
]


def init_db() -> None:
    """Create missing tables and report the current schema."""
    with app.app_context():
        db.create_all()

        inspector = inspect(db.engine)
        existing_tables = sorted(inspector.get_table_names())

        print("Database schema synced.")
        print(f"  Connection: {app.config['SQLALCHEMY_DATABASE_URI'].split('@')[-1]}")
        print(f"  Tables ({len(existing_tables)}):")

        for table_name in existing_tables:
            columns = inspector.get_columns(table_name)
            column_names = ", ".join(column["name"] for column in columns)
            marker = "OK" if table_name in EXPECTED_TABLES else "extra"
            print(f"    [{marker}] {table_name}: {column_names}")

        missing = sorted(set(EXPECTED_TABLES) - set(existing_tables))
        if missing:
            print(f"\nWarning: missing expected tables: {', '.join(missing)}")
        else:
            print("\nAll expected tables are present.")


if __name__ == "__main__":
    init_db()
