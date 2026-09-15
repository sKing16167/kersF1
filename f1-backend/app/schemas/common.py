from pydantic import BaseModel, ConfigDict


class ORMBase(BaseModel):
    """Base class for schemas read directly off SQLAlchemy models."""
    model_config = ConfigDict(from_attributes=True)
