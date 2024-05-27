from sqlmodel import Session, select

from app.models.message import MessageCreate, Message


def create_message(*, session: Session, message_create: MessageCreate) -> Message:
    """创建message"""
    db_obj = Message.model_validate(message_create)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def get_message_by_id(*, session: Session, message_id: str) -> Message | None:
    """根据id查询message"""
    statement = select(Message).where(Message.id == message_id)
    session_message = session.exec(statement).first()
    return session_message
