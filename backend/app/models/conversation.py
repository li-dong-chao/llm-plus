import datetime
from sqlmodel import SQLModel, Field

from app.utils import get_uuid4


class ConversationBase(SQLModel):
    title: str
    bot_id: str
    depend_id: str | None = None


class ConversationCreate(ConversationBase):
    create_time: datetime.datetime = Field(default_factory=datetime.datetime.now)


class Conversation(ConversationCreate, table=True):
    id: str | None = Field(default_factory=get_uuid4, primary_key=True)
