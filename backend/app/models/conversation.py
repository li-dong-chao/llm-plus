from sqlmodel import SQLModel

from app.models.base import Base
from app.schemas.conversation import ConversationType


class _ConversationBase(SQLModel):
    title: str
    type: ConversationType


class Conversation(_ConversationBase, Base, table=True):
    pass


class ConversationCreate(_ConversationBase):
    pass
