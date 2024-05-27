from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.api.deps import SessionDep, CurrentUser
from app.services.chatbot.main import chat_bot
from app.crud.conversation import create_conversation
from app.models.conversation import ConversationCreate
from app.utils import json_response
from app.schemas.llm import ConversationMessage


router = APIRouter()


@router.post("/chatbot")
def chatbot(
    *, session: SessionDep, user: CurrentUser, payload: ConversationMessage
) -> JSONResponse:
    """ai chat"""
    # 有 conversation_id 说明已经创建过了，直接与大模型对话即可
    # 没有传 conversation_id 需要先创建
    conversation_id = payload.conversation_id
    if not conversation_id:
        title = "title"  # TODO: 考虑标题如何生成
        conversation_create = ConversationCreate(title=title, bot_id=payload.bot_id)
        conversation = create_conversation(session, conversation_create, user)
        conversation_id = conversation.id
    # ai_message = chat_bot.chat(
    #     input_message=payload.message, conversation_id=conversation_id
    # )
    import time
    time.sleep(3)
    return json_response.success(data="test chat message", conversation_id=conversation_id)


@router.post("/messages")
def get_messages(*, _: CurrentUser, conversation_id: str):
    """查询对话信息"""
    messages = [
        {"type": item.type, "content": item.content, "create_time": item.create_time}
        for item in chat_bot.get_history(conversation_id)
    ]
    return json_response.success(data=messages)


@router.post("/rag")
def rag():
    """ai检索增强"""
    # TODO
    raise NotImplementedError


@router.post("/agent")
def agent():
    """ai调用工具"""
    # TODO
    raise NotImplementedError
