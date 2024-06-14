from sqlmodel import SQLModel, Field, AutoString
from langchain_core.messages.utils import _message_from_dict

from app.models.base import Base


class _MessageBase(SQLModel):
    type: str
    content: str
    additional_kwargs: dict = Field(sa_type=AutoString)
    response_metadata: dict = Field(sa_type=AutoString)


class Message(_MessageBase, Base, table=True):

    @property
    def langchain_style(self):
        """生成langchain风格的message"""
        ret = _message_from_dict(self.model_dump())
        return ret


class MessageCreate(_MessageBase):
    pass
