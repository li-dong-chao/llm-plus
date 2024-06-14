import re
import datetime
from sqlmodel import SQLModel, Field
from sqlalchemy.orm import declared_attr

from app.utils import get_uuid4


class Base(SQLModel):
    id: str | None = Field(default_factory=get_uuid4, primary_key=True)
    create_time: datetime.datetime = Field(default_factory=datetime.datetime.now)

    @declared_attr
    @classmethod
    def __tablename__(cls):
        name_list = re.findall(r"[A-Z][a-z\d]*", cls.__name__)
        return "_".join(name_list).lower()
