from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.api.deps import SessionDep, CurrentUser
from app.services.chatbot.main import chat_bot
from app.crud.conversation import (
    create_conversation,
    get_conversations_by_user,
    update_conversation_title,
    delete_conversation_by_id,
)
from app.models.conversation import ConversationCreate
from app.utils import json_response, FoundNothingError
from app.schemas.llm import ConversationMessage, RenameTitle, ConversationId


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
    return json_response.success(
        data="test chat message", conversation_id=conversation_id
    )


@router.post("/messages")
def get_messages(*, _: CurrentUser, payload: ConversationId):
    """查询对话信息"""
    messages = [
        {"type": item.type, "content": item.content, "create_time": item.create_time}
        for item in chat_bot.get_history(payload.conversation_id)
    ]
    return json_response.success(data=messages)


@router.get("/conversations")
def get_conversations(*, user: CurrentUser, session: SessionDep):
    """查询当前用户的历史聊天记录"""
    conversations = get_conversations_by_user(session=session, user=user)
    return json_response.success(
        data=[
            {
                "id": item.id,
                "title": item.title,
                "create_time": item.create_time,
            }
            for item in conversations
        ]
    )


@router.post("/rename")
def rename(*, user: CurrentUser, session: SessionDep, payload: RenameTitle):
    """重命名对话title"""
    conversation = update_conversation_title(
        session=session,
        user=user,
        conversation_id=payload.conversation_id,
        title=payload.title,
    )
    return json_response.success(data=conversation)


@router.delete("/conversation")
def delete_conversation(
    *, _: CurrentUser, session: SessionDep, conversation_id: str
):
    """删除一个聊天记录"""
    try:
        delete_conversation_by_id(session=session, conversation_id=conversation_id)
    except FoundNothingError:
        return json_response.fail(
            detail=f"no conversation which id is {conversation_id}", status_code=403
        )
    return json_response.success()


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
