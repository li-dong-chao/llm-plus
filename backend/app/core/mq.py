import pika

from app.core.config import settings

credentials = pika.PlainCredentials(settings.MQ_USER, settings.MQ_PASSWORD)
connection = pika.BlockingConnection(
    pika.ConnectionParameters(settings.MQ_HOST, settings.MQ_PORT, "/", credentials)
)


def get_mq_channel():
    """获取一个消息队列channel"""
    channel = connection.channel()
    return channel
