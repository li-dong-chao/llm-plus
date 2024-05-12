import secrets
from typing import Literal, Union, Annotated, Any
from pydantic import computed_field, PostgresDsn, AnyUrl, BeforeValidator
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
    BACKEND_CORS_ORIGINS: Annotated[list[AnyUrl] | str, BeforeValidator(parse_cors)] = (
        ["http://localhost:3000"]
    )

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
    POSTGRES_USER: str
    # 密码
    POSTGRES_PASSWORD: str
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


settings = Settings()
