import datetime
from sqlmodel import Field, SQLModel

from app.utils import get_uuid4


class UserBase(SQLModel):
    username: str = Field(unique=True, index=True)
    email: str | None = None
    is_active: bool = True
    is_superuser: bool = False


class UserCreate(UserBase):
    password: str


class UserRegister(SQLModel):
    email: str = Field(unique=True, index=True)
    password: str
    username: str = Field(index=True)


class User(UserBase, table=True):
    id: str | None = Field(default_factory=get_uuid4, primary_key=True)
    hashed_password: str
    create_time: datetime.datetime = Field(default_factory=datetime.datetime.now)


class UserPublic(UserBase):
    id: str
