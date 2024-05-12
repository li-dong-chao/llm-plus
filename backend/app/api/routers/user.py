from typing import Any
from fastapi import APIRouter
from fastapi.exceptions import HTTPException

from app import crud
from app.api.deps import SessionDep
from app.models.user import UserCreate, UserPublic

router = APIRouter()


@router.post("/", response_model=UserPublic)
def create_user(*, session: SessionDep, user_in: UserCreate) -> Any:
    """
    创建用户
    """
    user = crud.user.get_user_by_email(session=session, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="该邮箱已被注册",
        )

    user = crud.user.create_user(session=session, user_create=user_in)
    return user
