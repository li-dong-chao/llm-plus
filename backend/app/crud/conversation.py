from sqlmodel import Session, select, col, desc

from app.models.conversation import ConversationCreate, Conversation
from app.models.relations.user_conversation import (
    UserConversationCreate,
    UserConversation,
)
from app.models.user import User
from app.utils import get_uuid4, FoundNothingError


def create_conversation(
    session: Session, conversation_create: ConversationCreate, user: User
) -> Conversation:
    """创建conversation"""
    # 创建conversation
    conversation = Conversation.model_validate(
        conversation_create, update={"id": get_uuid4()}
    )
    # 创建 conversation 和 user 的关系
    ucc = UserConversationCreate(user_id=user.id, conversation_id=conversation.id)
    user_conversation = UserConversation.model_validate(ucc)
    session.add(conversation)
    session.add(user_conversation)
    session.commit()
    session.refresh(conversation)
    return conversation


def get_conversations_by_user(session: Session, user: User) -> list[Conversation]:
    """根据用户查询历史对话记录"""
    sql = (
        select(Conversation)
        .where(
            col(Conversation.id).in_(
                select(UserConversation.conversation_id).where(
                    UserConversation.user_id == user.id
                )
            )
        )
        .order_by(desc(Conversation.create_time))
    )
    db_user_conversations = session.exec(sql).all()
    return db_user_conversations


def get_conversation_by_id(
    session: Session, conversation_id: str
) -> Conversation | None:
    sql = select(Conversation).where(Conversation.id == conversation_id)
    conversation = session.exec(sql).first()
    return conversation


def update_conversation_title(
    session: Session, user: User, conversation_id: str, title: str
) -> Conversation:
    """更新conversation的title"""
    # 先校验一下是不是存在以及是不是当前用户的
    sql = select(UserConversation).where(
        UserConversation.conversation_id == conversation_id
    )
    user_conversation = session.exec(sql).first()
    if user_conversation is None:
        return None
    if user_conversation.user_id != user.id:
        raise PermissionError
    sql = select(Conversation).where(Conversation.id == conversation_id)
    conversation = session.exec(sql).first()
    if conversation:
        conversation.title = title
        session.commit()
        session.refresh(conversation)
    return conversation


def delete_conversation_by_id(session: Session, conversation_id: str) -> None:
    """删除conversation"""
    sql = select(Conversation).where(Conversation.id == conversation_id)
    conversation = session.exec(sql).first()
    if conversation is None:
        raise FoundNothingError
    session.delete(conversation)
