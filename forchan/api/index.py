from contextlib import asynccontextmanager
from fastapi import FastAPI
import uuid
from .supa import *

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")
PREFIX = "/api/py"

@asynccontextmanager
async def lifespan(app: FastAPI):
    global user_client
    user_client = await UserDB.create()
    yield


#USER=====================================
@app.get(PREFIX + "/user/login")
def login():
    return {"message": uuid.uuid8()} 
