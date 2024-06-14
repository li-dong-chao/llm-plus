from enum import Enum


class ConversationType(str, Enum):
    CHAT = "chat"
    RAG = "rag"
    AGENT = "agent"
