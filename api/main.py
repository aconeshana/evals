import uvicorn
from fastapi import FastAPI

from routers import eval,eval_data

app = FastAPI()

app.include_router(eval.router, prefix="/llm-eval/api/v1/eval/exec")
app.include_router(eval_data.router, prefix="/llm-eval/api/v1/eval/data")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, log_level="info")
