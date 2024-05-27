import secrets
from pathlib import Path
from typing import Literal, Union, Annotated, Any, Optional
from pydantic import computed_field, PostgresDsn, AnyUrl, BeforeValidator, RedisDsn, AmqpDsn
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings, SettingsConfigDict


def parse_cors(v: Any) -> list[str] | str:
    """
    解析 cors
    """
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    # Settings 类的配置
    model_config = SettingsConfigDict(
        env_file=".env", env_ignore_empty=True, extra="ignore"
    )

    #######################################################################
    ##                         API 配置                                   ##
    #######################################################################

    # 项目名称
    PROJECT_NAME: str = "llm-plus"
    # api 路径前缀
    API_V1_STR: str = "/api/v1"
    # 跨域
    BACKEND_CORS_ORIGINS: Annotated[list[AnyUrl] | str, BeforeValidator(parse_cors)] = [
        "http://localhost:3000"
    ]

    #######################################################################
    ##                         鉴权配置                                   ##
    #######################################################################

    # 密钥
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # token 有效时间
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8

    #######################################################################
    ##                  postgresql 数据库配置                              ##
    #######################################################################

    # 地址
    POSTGRES_HOST: str
    # 端口
    POSTGRES_PORT: int = 5432
    # 用户
    POSTGRES_USER: Optional[str] = ""
    # 密码
    POSTGRES_PASSWORD: Optional[str] = ""
    # 数据库
    POSTGRES_DB: str = ""

    @computed_field
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> PostgresDsn:  # pylint: disable=invalid-name
        """
        数据库 URI
        """
        return MultiHostUrl.build(
            scheme="postgresql+psycopg2",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_HOST,
            port=self.POSTGRES_PORT,
            path=self.POSTGRES_DB,
        )

    #######################################################################
    ##                      redis 配置信息                                ##
    #######################################################################

    # 地址
    REDIS_HOST: str
    # 端口
    REDIS_PORT: int = 6379
    # 用户
    REDIS_USER: Optional[str] = ""
    # 密码
    REDIS_PASSWORD: Optional[str] = ""
    # 数据库
    REDIS_DB: Optional[str] = ""

    @computed_field
    @property
    def REDIS_URL(self) -> RedisDsn:  # pylint: disable=invalid-name
        """redis 连接 url"""
        return MultiHostUrl.build(
            scheme="redis",
            username=self.REDIS_USER,
            password=self.REDIS_PASSWORD,
            host=self.REDIS_HOST,
            port=self.REDIS_PORT,
            path=self.REDIS_DB,
        )

    #######################################################################
    ##                         mq 配置信息                                ##
    #######################################################################

    # 地址
    MQ_HOST: str
    # 端口
    MQ_PORT: int = 5672
    # 用户
    MQ_USER: Optional[str] = ""
    # 密码
    MQ_PASSWORD: Optional[str] = ""
    # Virtual host
    MQ_VHOST: str = "/"

    @computed_field
    @property
    def MQ_URL(self) -> AmqpDsn:  # pylint: disable=invalid-name
        """redis 连接 url"""
        return MultiHostUrl.build(
            scheme="pyamqp",
            username=self.MQ_USER,
            password=self.MQ_PASSWORD,
            host=self.MQ_HOST,
            port=self.MQ_PORT,
            path=self.MQ_VHOST,
        )

    #######################################################################
    ##                  开发环境 or 生产环境                                ##
    #######################################################################

    # 当前环境
    ENVIRONMENT: Literal["develop", "production"] = "develop"

    @computed_field
    @property
    def RELOAD(self) -> Union[bool, None]:  # pylint: disable=invalid-name
        """
        自动重新加载
        """
        # openapi.json 仅在开发环境下可以访问
        return self.ENVIRONMENT == "develop"

    @computed_field
    @property
    def OPENAPI_URL(self) -> Union[str, None]:  # pylint: disable=invalid-name
        """
        openapi.json 路径
        """
        # openapi.json 仅在开发环境下可以访问
        if self.ENVIRONMENT == "develop":
            return "/openapi.json"
        return None

    @computed_field
    @property
    def DOCS_URL(self) -> Union[str, None]:  # pylint: disable=invalid-name
        """
        swagger 页面路径
        """
        # swagger 页面仅在开发环境下可以访问
        if self.ENVIRONMENT == "develop":
            return "/docs"
        return None

    #######################################################################
    ##                         大模型配置                                  ##
    #######################################################################
    OPENAI_API_KEY: str = ""
    OPENAI_API_BASE: str = ""

    #######################################################################
    ##                         项目路径配置                                ##
    #######################################################################
    ROOT_PATH: Path = Path(__file__).parent.parent.parent
    # TODO: 项目启动时应该检测目录是否存在，不存在时需要自动创建
    LOG_PATH: Path = ROOT_PATH.joinpath("logs")


settings = Settings()


if __name__ == "__main__":
    print(str(settings.LOG_PATH))
