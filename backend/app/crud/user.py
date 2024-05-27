from sqlmodel import Session, select

from app.models.user import User, UserCreate
from app.core.security import get_password_hash, verify_password


def create_user(*, session: Session, user_create: UserCreate) -> User:
    """
    创建用户
    """
    db_obj = User.model_validate(
        user_create, update={"hashed_password": get_password_hash(user_create.password)}
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def get_user_by_email(*, session: Session, email: str) -> User | None:
    """
    根据邮件查询用户
    """
    statement = select(User).where(User.email == email)
    session_user = session.exec(statement).first()
    return session_user


def get_user_by_username(*, session: Session, username: str) -> User | None:
    """
    根据用户名查询用户
    """
    statement = select(User).where(User.username == username)
    session_user = session.exec(statement).first()
    return session_user


def authenticate(
    *, session: Session, username_or_email: str, password: str
) -> User | None:
    """
    用户鉴权
    """
    db_user = get_user_by_email(session=session, email=username_or_email)
    if not db_user:
        db_user = get_user_by_username(session=session, username=username_or_email)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user
