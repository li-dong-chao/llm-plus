from enum import Enum


class ConversationType(str, Enum):
    CHAT = "chatbot"
    RAG = "rag"
    AGENT = "agent"
