import asyncio
import json
import logging
from concurrent.futures import ThreadPoolExecutor
from typing import Dict, Any

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from api.mysql.models import EvalExecutionModel, create_eval_execution, update_eval_execution, \
    get_executions_list, retrieve_eval_execution
from api.restful import resp_ok
from evals.cli import oaieval
from evals.cli.oaieval import OaiEvalArguments
from .base import get_db_session

log = logging.getLogger(__name__)

router = APIRouter()


class OaiEvalRequest(BaseModel):
    completion_fn: str
    eval: str
    id: int
    match: str = "evals.elsuite.basic.match:Match"


executor = ThreadPoolExecutor()


@router.post("/create")
async def create(request: EvalExecutionModel, db: Session = Depends(get_db_session)):
    result = await create_eval_execution(db, request)
    args = OaiEvalArguments(completion_fn=request.model, eval=f"{result.id}", extra_completion_args=request.args,
                            cache=True,
                            completion_args='',
                            debug=False,
                            dry_run=False,
                            dry_run_logging=True,
                            extra_eval_params='',
                            http_batch_size=1,
                            http_fail_percent_threshold=5,
                            http_run=True,
                            http_run_url="http://localhost:8080/llm-eval/api/v1/eval/exec/callback",
                            local_run=False,
                            log_to_file=None,
                            max_samples=None,
                            record_path=None,
                            registry_path=None,
                            seed=20220722,
                            user='',
                            visible=None)
    loop = asyncio.get_event_loop()
    loop.run_in_executor(executor, oaieval.run, args, None, result.data_id, request.match, f"{result.id}")
    return resp_ok(data={"taskId": result.id})


@router.post("/callback")
async def callback(request: list[Dict[Any, Any]], db: Session = Depends(get_db_session)):
    print(request)
    old = await retrieve_eval_execution(db, id=request[-1]["run_id"])
    temp = old.to_dict()["result"]
    temp = [] if temp is None else json.loads(temp)

    # 过滤掉request中所有type为"sampling"的项
    filtered_request = [item for item in request if item["type"] != "sampling"]

    # 然后将过滤后的request加入到temp列表中
    temp += filtered_request

    completed = 0
    for i in temp:
        if i["type"] == "match":
            completed += 1

    total = old.progress.split("/")[-1]
    await update_eval_execution(db, int(request[-1]["run_id"]), json.dumps(temp, ensure_ascii=False), f"{completed}/{total}")
    return resp_ok()


@router.get("/list")
async def page_list(page: int = 1, page_size: int = 10, db: Session = Depends(get_db_session)):
    result, count = await get_executions_list(db, page, page_size)
    return resp_ok(data={
        "total": count,
        "list": [item.to_dict() for item in result]
    })


@router.get("/detail/{id}")
async def detail(id: int, db: Session = Depends(get_db_session)):
    result = await retrieve_eval_execution(db, id=id)
    return resp_ok(data=result.to_dict())


@router.post("/execute")
def execute(request: OaiEvalRequest):
    args = OaiEvalArguments(completion_fn=request.completion_fn, eval=request.eval,
                            cache=True,
                            completion_args='',
                            debug=False,
                            dry_run=False,
                            dry_run_logging=True,
                            extra_eval_params='',
                            http_batch_size=100,
                            http_fail_percent_threshold=5,
                            http_run=False,
                            http_run_url=None,
                            local_run=True,
                            log_to_file=None,
                            max_samples=None,
                            record_path=None,
                            registry_path=None,
                            seed=20220722,
                            user='',
                            visible=None)

    run_id, result = oaieval.run(args, eval_registry_id=request.id, match=request.match)
    return resp_ok(data={"taskId": run_id, **{key: value for key, value in result.items()}})
