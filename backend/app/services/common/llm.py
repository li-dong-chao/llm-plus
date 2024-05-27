from langchain_openai import ChatOpenAI

from app.core.config import settings

chat = ChatOpenAI(
    openai_api_key=settings.OPENAI_API_KEY,
    openai_api_base=settings.OPENAI_API_BASE,
    model="gpt-3.5-turbo",
)


if __name__ == "__main__":
    print(chat.invoke("你是谁", temperature=0.9).content)
