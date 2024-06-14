from sqlmodel import SQLModel

from app.models.base import Base


class _UserConversationBase(SQLModel):
    user_id: str
    conversation_id: str


class UserConversation(_UserConversationBase, Base, table=True):
    pass


class UserConversationCreate(_UserConversationBase):
    pass
