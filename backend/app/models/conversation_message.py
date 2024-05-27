from sqlmodel import Field, SQLModel

from app.utils import get_uuid4


class ConversationMessageBase(SQLModel):
    conversation_id: str
    message_id: str


class ConversationMessageCreate(ConversationMessageBase):
    pass


class ConversationMessage(ConversationMessageBase, table=True):
    id: str = Field(primary_key=True, default_factory=get_uuid4)
