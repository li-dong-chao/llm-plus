from pydantic import BaseModel


class ConversationMessage(BaseModel):
    message: str
    conversation_id: str = None


class RenameTitle(BaseModel):
    conversation_id: str
    title: str


class ConversationId(BaseModel):
    conversation_id: str
