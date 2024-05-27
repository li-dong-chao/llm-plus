from sqlmodel import Session

from app.models.conversation import ConversationCreate, Conversation
from app.models.user_conversation import UserConversationCreate, UserConversation
from app.models.user import User
from app.utils import get_uuid4


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
