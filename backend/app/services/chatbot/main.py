from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables.history import RunnableWithMessageHistory

from app.services.common.llm import chat as _chat
from app.cache.conversation_message import ConversationMessageCache


def get_conversaion_message_cache(conversation_id) -> ConversationMessageCache:
    """按照langchain要求构造return message history的方法"""
    return ConversationMessageCache(conversation_id=conversation_id, ttl=60 * 30)


class ChatBot:
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", "You're an assistant。"),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input_message}"),
        ]
    )
    chat_model = _chat
    chain = prompt | chat_model

    def __init__(self):
        self.conversation_message_cache = RunnableWithMessageHistory(
            self.chain,
            get_conversaion_message_cache,
            input_messages_key="input_message",
            history_messages_key="history",
        )

    def chat(self, input_message: str, conversation_id: str):
        """对话"""
        ans = self.conversation_message_cache.invoke(
            {"input_message": input_message},
            config={"configurable": {"session_id": conversation_id}},
        )
        return ans.content

    def get_history(self, conversation_id: str):
        """查询历史对话内容"""
        history = get_conversaion_message_cache(conversation_id).messages
        return history


chat_bot = ChatBot()
