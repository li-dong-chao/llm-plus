from typing import Any
from fastapi import APIRouter
from fastapi.exceptions import HTTPException

from app.crud.user import get_user_by_email, create_user
from app.api.deps import SessionDep, CurrentUser
from app.models.user import UserCreate, UserPublic

router = APIRouter()


@router.post("/register", response_model=UserPublic)
def create_new_user(*, session: SessionDep, user_in: UserCreate) -> Any:
    """
    创建用户
    """
    user = get_user_by_email(session=session, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="该邮箱已被注册",
        )
    user = create_user(session=session, user_create=user_in)
    return user


@router.get("/me", response_model=UserPublic)
def read_user_me(current_user: CurrentUser):
    """获取当前用户"""
    return current_user
