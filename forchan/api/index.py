from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi import HTTPException
from fastapi import Cookie
import uuid
import os
import sys
import dotenv
from pydantic import BaseModel

# Vercel loads this file by path, so its own directory isn't on sys.path.
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from supa import *  # pyright: ignore[reportImplicitRelativeImport]

dotenv.load_dotenv()
PREFIX = "/api/py"
@asynccontextmanager
async def lifespan(app: FastAPI):
    global user_client
    user_client = await UserDB.create()
    yield

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json", lifespan=lifespan)


#USER=====================================
@app.post(PREFIX + "/user/login")
async def login():
    return await user_client.regToken()

@app.get(PREFIX + "/user/checkExpiration")
async def check(token):
    return await user_client.checkToken(token)

#POSTING==================================
class PostCreate(BaseModel):
    title: str
    text: str
    board_slug: str


@app.post(PREFIX + "/post/make")
async def post(post: PostCreate, token: str | None = Cookie(default=None)):
    if not token:
        raise HTTPException(
            status_code=401, 
            detail="Chybí autorizační cookie"
        )
        return




