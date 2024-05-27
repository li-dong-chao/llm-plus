import datetime
from sqlmodel import SQLModel, Field

from app.utils import get_uuid4


class BotBase(SQLModel):
    name: str = Field(unique=True)


class BotCreate(BotBase):
    pass


class Bot(BotBase, table=True):
    id: str | None = Field(default_factory=get_uuid4, primary_key=True)
    create_time: datetime.datetime = Field(default_factory=datetime.datetime.now)
