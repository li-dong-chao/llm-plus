import datetime
from pathlib import Path
from sqlmodel import SQLModel, Field

from app.utils import get_uuid4


class FileBase(SQLModel):
    filepath: str

    @property
    def filename(self):
        """文件名"""
        return Path(self.filepath).name

    @property
    def filetype(self):
        """文件类型"""
        return Path(self.filepath).suffix


class File(FileBase, table=True):
    id: str | None = Field(default_factory=get_uuid4, primary_key=True)
    create_time: datetime.datetime = Field(default_factory=datetime.datetime.now)
