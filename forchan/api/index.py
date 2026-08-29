from fastapi import FastAPI

app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")

@app.get("/api/py/hello")
def hello_world():
    return {"message": "Hello World from FastAPI on Vercel!"}