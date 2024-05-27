from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage
from app.services.common.llm import chat


def gen_title(message: str) -> str:
    """根据用户问题生成title"""
    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                "你是一个专业的内容总结专家，你能够根据用户问题抽取出一个标题，要求生成的标题长度不超过20字。",
            ),
            MessagesPlaceholder(variable_name="messages"),
        ]
    )
    chain = prompt | chat
    title = chain.invoke({"messages": [HumanMessage(content=message)]})
    return title.content


if __name__ == "__main__":
    print(gen_title("帮我查询今天南京的天气"))
