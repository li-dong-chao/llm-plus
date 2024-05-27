from sqlmodel import create_engine

from app.core.config import settings

# pylint: disable=unused-import, ungrouped-imports
# 请确保所有需要在数据库中创建的数据表对应的类都已经在下面导入
# 否则将不会在数据库中创建对应的数据表
from sqlmodel import SQLModel
from app.models.user import User
from app.models.bot import Bot
from app.models.conversation import Conversation
from app.models.file import File
from app.models.conversation_message import ConversationMessage
from app.models.user_conversation import UserConversation
from app.models.message import Message
from app.models.tool import Tool


# 数据库 engine
engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))
