import redis

from app.core.config import settings

pool = redis.ConnectionPool(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    password=settings.REDIS_PASSWORD,
    db=settings.REDIS_DB,
    max_connections=10,
)


def get_redis_client() -> redis.Redis:
    """从redis连接池种获取一个redis连接"""
    r = redis.Redis(connection_pool=pool)
    return r
