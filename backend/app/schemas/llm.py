from pydantic import BaseModel, root_validator


class ConversationMessage(BaseModel):
    message: str
    bot_id: str = None
    conversation_id: str = None

    @root_validator(pre=True)
    def check_mutually_exclusive(cls, values):  # pylint: disable=no-self-argument
        """检验 bot id 和 conversation id 不能同时存在，且必须存在一个"""
        bot_id, conversation_id = values.get("bot_id"), values.get("conversation_id")
        if bot_id is not None and conversation_id is not None:
            raise ValueError("bot_id and conversation_id are mutually exclusive")
        if bot_id is None and conversation_id is None:
            raise ValueError("One of bot_id or conversation_id must be provided")
        return values


class RenameTitle(BaseModel):
    conversation_id: str
    title: str


class ConversationId(BaseModel):
    conversation_id: str
