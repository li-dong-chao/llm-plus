import datetime
from sqlmodel import SQLModel, Field
from langchain_core.messages.utils import _message_from_dict

from app.utils import get_uuid4


class MessageBase(SQLModel):
    type: str
    content: str
    depend_id: str | None = None


class MessageCreate(MessageBase):
    create_time: datetime.datetime = Field(default_factory=datetime.datetime.now)


class Message(MessageCreate, table=True):
    id: str | None = Field(default_factory=get_uuid4, primary_key=True)

    @property
    def langchain_style(self):
        ret = _message_from_dict(self.model_dump())
        print(ret)
        return ret


class UserMessage(SQLModel):
    content: str
    depend_id: str | None = None
