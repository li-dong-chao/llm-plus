import json
import datetime
from typing import Optional, List
from sqlmodel import Session
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.messages import (
    BaseMessage,
    message_to_dict,
    messages_from_dict,
)

from app.core.redis_client import get_redis_client
from app.models.message import MessageCreate
from app.crud.conversation_message import (
    create_conversation_message_with_new_message,
    get_messages_by_conversation_id,
)
from app.core.db import engine


class ConversationMessageCache(BaseChatMessageHistory):
    def __init__(
        self,
        conversation_id: str,
        key_prefix: str = "conversation:",
        ttl: Optional[int] = None,
    ):
        self.redis_client = get_redis_client()
        self.conversation_id = conversation_id
        self.key_prefix = key_prefix
        self.ttl = ttl

    @property
    def key(self) -> str:
        """构造key"""
        return self.key_prefix + self.conversation_id

    @property
    def messages(self) -> List[BaseMessage]:
        """从redis中获取message"""
        # 如果redis已经缓存了，则直接获取，否则尝试从数据库获取
        if self.redis_client.exists(self.key):
            _items = self.redis_client.lrange(self.key, 0, -1)
            items = [json.loads(m.decode("utf-8")) for m in _items[::-1]]
            messages = messages_from_dict(items)
        else:
            # TODO: 实现从数据库中读取messages信息
            with Session(engine) as session:
                db_messages = get_messages_by_conversation_id(
                    session, self.conversation_id
                )
                messages = [item.langchain_type for item in db_messages]
        return messages

    @messages.setter
    def messages(self, messages: List[BaseMessage]) -> None:
        """message不可修改"""
        raise NotImplementedError(
            "Direct assignment to 'messages' is not allowed."
            " Use the 'add_messages' instead."
        )

    def add_message(self, message: BaseMessage) -> None:
        """添加message"""
        # 添加创建时间参数
        message.create_time = str(datetime.datetime.now())
        self.redis_client.lpush(self.key, json.dumps(message_to_dict(message)))
        if self.ttl:
            self.redis_client.expire(self.key, self.ttl)
        # 下发数据入库任务
        task_id = create_conversation_message_with_new_message.apply_async(
            kwargs={
                "conversation_id": self.conversation_id,
                "new_message": MessageCreate(
                    type=message.type,
                    content=message.content,
                    create_time=message.create_time,
                ).model_dump(),
            },
        )
        print(task_id)

    def clear(self) -> None:
        """删除当前缓存"""
        self.redis_client.delete(self.key)

    def to_db(self) -> None:
        """持久化数据到数据库中"""
        # TODO
        pass
