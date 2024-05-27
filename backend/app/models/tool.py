import datetime
from sqlmodel import SQLModel, Field

from app.utils import get_uuid4


# TODO: 工具实际执行逻辑如何设计？


class ToolBase(SQLModel):
    name: str


class Tool(ToolBase, table=True):
    id: str | None = Field(default_factory=get_uuid4, primary_key=True)
    create_time: datetime.datetime = Field(default_factory=datetime.datetime.now)
