from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi import HTTPException
import uuid
import os
import sys
import dotenv

# Vercel loads this file by path, so its own directory isn't on sys.path.
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from supa import *

dotenv.load_dotenv()
PREFIX = "/api/py"
@asynccontextmanager
async def lifespan(app: FastAPI):
    global user_client
    user_client = await UserDB.create()
    yield

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json", lifespan=lifespan)


#USER=====================================
@app.get(PREFIX + "/user/login")
def login():
    return {"message": str(uuid.uuid4())}
