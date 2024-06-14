from sqlmodel import Field, SQLModel

from app.models.base import Base


class _UserBase(SQLModel):
    username: str = Field(unique=True, index=True)
    email: str | None = Field(unique=True)
    is_active: bool = True
    is_superuser: bool = False


class User(_UserBase, Base, table=True):
    hashed_password: str


class UserCreate(_UserBase):
    password: str


class UserPublic(_UserBase):
    id: str
