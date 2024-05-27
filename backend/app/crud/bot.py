from sqlmodel import Session, select
from app.models.bot import Bot, BotCreate


def create_bot(session: Session, bot_create: BotCreate) -> Bot:
    """创建bot"""
    db_obj = Bot.model_validate(bot_create)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def get_bot_by_name(session: Session, name: str) -> Bot | None:
    """根据name查询"""
    sql = select(Bot).where(Bot.name == name)
    bot = session.exec(sql).first
    return bot
