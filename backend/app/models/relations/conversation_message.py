from sqlmodel import SQLModel

from app.models.base import Base


class _ConversationMessageBase(SQLModel):
    conversation_id: str
    message_id: str


class ConversationMessage(_ConversationMessageBase, Base, table=True):
    pass


class ConversationMessageCreate(_ConversationMessageBase):
    pass
