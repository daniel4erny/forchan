from contextlib import asynccontextmanager
from fastapi import Depends, FastAPI
from fastapi import HTTPException
from fastapi import Cookie
import uuid
import os
import sys
import dotenv
from pydantic import BaseModel

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from supa import *  # pyright: ignore[reportImplicitRelativeImport]

dotenv.load_dotenv()
PREFIX = "/api/py"

user_client: UserDB
post_client: PostDB

@asynccontextmanager
async def lifespan(app: FastAPI):
	global user_client, post_client
	user_client = await UserDB.create()
	post_client = await PostDB.create()
	yield

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json", lifespan=lifespan)

async def get_current_token(token: str | None = Cookie(default=None)) -> str:
	if not token:
		raise HTTPException(
			status_code=401,
			detail="tf ur cookie brotha"
		)
	return token


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
async def post(post: PostCreate, token: str = Depends(get_current_token)):
	return await post_client.makePost(post.title, post.text, post.board_slug, token)

class PostEdit(BaseModel):
	title: str
	text: str
	post_id: int

@app.post(PREFIX + "/post/edit")
async def edit(post: PostEdit, token: str = Depends(get_current_token)):
	return await post_client.editPost(post.title, post.text, token, post.post_id)

class PostDelete(BaseModel):
	post_id: int

@app.post(PREFIX + "/post/delete")
async def delete(post: PostDelete, token: str = Depends(get_current_token)):
	return await post_client.deletePost(token, post.post_id)

@app.get(PREFIX + "/post/board")
async def getPostsSlug(board_slug: str, page_num: int):
	return await post_client.getPostsBoard(board_slug, page_num)

@app.get(PREFIX + "/post/relKey")
async def getPostsRel(rel_key: str, page_num: int):
	return await post_client.getPostsRelKey(rel_key, page_num)

@app.get(PREFIX + "/post/token")
async def getPostsToken(page_num: int, token: str = Depends(get_current_token)):
	return await post_client.getPostsSessionToken(token, page_num)

@app.get(PREFIX + "/post/id")
async def getPostId(post_id: int):
	return await post_client.getPostId(post_id)



