from typing import Annotated
from datetime import timedelta
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.exceptions import HTTPException

from app.core import security
from app.api.deps import SessionDep
from app.core.config import settings
from app.schemas.token import Token
from app.crud import user as crud_user

router = APIRouter()


@router.post("/login/access-token", response_class=Token)
def login_access_token(
    session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    """
    鉴权登录
    """
    user = crud_user.authenticate(
        session=session,
        username_or_email=form_data.username,
        password=form_data.password,
    )
    if not user:
        raise HTTPException(status_code=401, detail="邮箱、用户名或密码错误")
    if not user.is_active:
        raise HTTPException(status_code=401, detail="非活跃用户")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return Token(
        access_token=security.create_access_token(
            user.id, expires_delta=access_token_expires
        )
    )
