from sqlmodel import SQLModel, Field

from app.utils import get_uuid4


class UserConversationBase(SQLModel):
    user_id: str
    conversation_id: str


class UserConversationCreate(UserConversationBase):
    pass


class UserConversation(UserConversationBase, table=True):
    id: str = Field(default_factory=get_uuid4, primary_key=True)
