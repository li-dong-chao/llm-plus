from typing import List
from sqlmodel import Session, select, desc, col

from app.models.conversation_message import (
    ConversationMessage,
    ConversationMessageCreate,
)
from app.models.message import MessageCreate, Message
from app.utils import get_uuid4
from app.core.celery_app import celery_app
from app.core.db import engine


def get_messages_by_conversation_id(
    session: Session, conversation_id: str
) -> List[ConversationMessage]:
    """根据 conversation id 查询 conversation message"""
    sql = (
        select(Message)
        .where(
            col(Message.id).in_(
                select(ConversationMessage.message_id).where(
                    ConversationMessage.conversation_id == conversation_id
                )
            )
        )
        .order_by(desc(Message.create_time))
    )
    messages = session.exec(sql)
    return messages


def create_conversation_message(
    session: Session, conversation_message_create: ConversationMessageCreate
) -> ConversationMessage:
    """创建conversation_message记录"""
    db_obj = ConversationMessage.model_validate(conversation_message_create)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


@celery_app.task(ignore_result=True)
def create_conversation_message_with_new_message(
    conversation_id: str, new_message: MessageCreate | dict
) -> ConversationMessage:
    """创建conversation_message记录"""
    if isinstance(new_message, dict):
        new_message = MessageCreate(**new_message)
    with Session(engine) as session:
        # 创建message
        message = Message.model_validate(new_message, update={"id": get_uuid4()})
        # 创建 conversation 和 message 的关系
        cmc = ConversationMessageCreate(
            conversation_id=conversation_id, message_id=message.id
        )
        conversation_message = ConversationMessage.model_validate(cmc)
        session.add(message)
        session.add(conversation_message)
        session.commit()
        session.refresh(conversation_message)
    return conversation_message
