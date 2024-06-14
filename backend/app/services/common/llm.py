# from langchain_openai import ChatOpenAI
from langchain_community.chat_models.fake import FakeMessagesListChatModel

# from app.core.config import settings

# chat = ChatOpenAI(
#     openai_api_key=settings.OPENAI_API_KEY,
#     openai_api_base=settings.OPENAI_API_BASE,
#     model="gpt-3.5-turbo",
# )

responses = [
    {"content": "你好，有什么我可以帮助你的吗？", "type": "ai"},
    {"content": "你说啥？我听不懂", "type": "ai"},
]
chat = FakeMessagesListChatModel(responses=responses)


if __name__ == "__main__":
    print(chat.invoke("你是谁", temperature=0.9))
