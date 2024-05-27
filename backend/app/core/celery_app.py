from celery import Celery

from app.core.config import settings

# celery app configuration
celery_config = {
    "broker_url": str(settings.MQ_URL),
    "imports": ("app.worker",),
    "result_backend": str(settings.REDIS_URL),
    "broker_connection_retry_on_startup": True,
    "timezone": "Asia/Shanghai",
}


celery_app = Celery(settings.PROJECT_NAME)
celery_app.conf.update(celery_config)
