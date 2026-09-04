from contextlib import asynccontextmanager
from fastapi import FastAPI
import uuid
from api.supa import *

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
