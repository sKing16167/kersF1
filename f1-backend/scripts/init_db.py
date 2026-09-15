"""
Dev convenience: creates all tables directly from the SQLAlchemy models.
For anything beyond local dev, use Alembic migrations instead
(`alembic upgrade head`) so schema changes are tracked and reversible.

Usage:
    python -m scripts.init_db
"""
from app.db.session import engine
from app.db import base  # noqa: F401  (imports all models onto Base.metadata)
from app.db.session import Base


def main():
    Base.metadata.create_all(bind=engine)
    print("All tables created.")


if __name__ == "__main__":
    main()
