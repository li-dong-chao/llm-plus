import re
from typing import Any, Tuple
from fastapi import APIRouter
from fastapi.exceptions import HTTPException

from app.crud.user import get_user_by_email, get_user_by_username, create_user
from app.api.deps import SessionDep, CurrentUser
from app.models.user import UserCreate, UserPublic
from app.utils import json_response

router = APIRouter()


def _validate_username(username: str) -> Tuple[bool, str]:
    """
    验证用户名是否符合规则：
    1. 用户名长度必须在6到20个字符之间
    2. 用户名只能包含字母、数字和下划线
    3. 用户名必须以字母开头
    """
    if len(username) < 2 or len(username) > 20:
        return False, "用户名长度必须在2到20个字符之间"

    if not re.match("^[a-zA-Z][a-zA-Z0-9_]*$", username):
        return False, "用户名只能包含字母、数字和下划线，并且必须以字母开头"

    return True, "用户名合法"


def _validate_email(email: str) -> Tuple[bool, str]:
    """验证邮箱"""
    if not re.match(r"^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$", email):
        return False, "邮箱格式错误"

    return True, "邮箱合法"


@router.post("/register", response_model=UserPublic)
def create_new_user(*, session: SessionDep, user_in: UserCreate) -> Any:
    """
    创建用户
    """
    # 校验用户名格式
    check_pass, detail = _validate_username(username=user_in.username)
    if not check_pass:
        return json_response.fail(detail=detail)
    # 校验邮箱格式
    check_pass, detail = _validate_email(email=user_in.email)
    if not check_pass:
        return json_response.fail(detail=detail)
    # 校验邮箱是否已注册
    user = get_user_by_email(session=session, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="该邮箱已被注册",
        )
    # 校验用户名是否已注册
    user = get_user_by_username(session=session, username=user_in.username)
    if user:
        raise HTTPException(
            status_code=400,
            detail="该用户名已被注册",
        )
    # 所有校验通过，创建用户
    user = create_user(session=session, user_create=user_in)
    return user


@router.get("/me", response_model=UserPublic)
def read_user_me(current_user: CurrentUser):
    """获取当前用户"""
    return current_user
