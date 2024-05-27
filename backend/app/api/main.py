from fastapi import APIRouter

from app.api.routers import login
from app.api.routers import user
from app.api.routers import llm

api_router = APIRouter()
api_router.include_router(login.router, tags=["login"])
api_router.include_router(user.router, tags=["user"])
api_router.include_router(llm.router, tags=["llm"])
