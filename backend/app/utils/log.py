from loguru import logger as loguru_logger

from app.core.config import settings


def _get_logger(name: str):
    """创建一个logger"""
    loguru_logger.add(
        sink=settings.LOG_PATH.joinpath(f"{name}_" + "{time:YYYY_MM}.log"),
        encoding="utf-8",
        enqueue=True,
        filter=lambda record: record["extra"].get("name") == name,
    )
    new_logger = loguru_logger.bind(name=name)
    return new_logger


logger = _get_logger("service")
consumer_logger = _get_logger("consumer")
