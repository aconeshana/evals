import logging

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from api.mysql.models import EvalDataModel, create_eval_data, a_retreive_eval_data, update_eval_data, delete_eval_data, \
    get_list
from api.restful import resp_ok
from api.routers.base import get_db_session

log = logging.getLogger(__name__)

router = APIRouter()


@router.post("/create")
async def create(data: EvalDataModel, db: Session = Depends(get_db_session)):
    result = await create_eval_data(db, data)
    return resp_ok(data=result.id)


@router.get("/detail/{id}")
async def get(id: int, db: Session = Depends(get_db_session)):
    result = await a_retreive_eval_data(db, id)
    return resp_ok(data=result.to_dict())


@router.post("/update")
async def update(data: EvalDataModel, db: Session = Depends(get_db_session)):
    await update_eval_data(db, data)
    return resp_ok()


@router.post("/delete")
async def delete(data: EvalDataModel, db: Session = Depends(get_db_session)):
    await delete_eval_data(db, data)
    return resp_ok()


@router.get("/list")
async def page_list(page: int = 1, page_size: int = 10, db: Session = Depends(get_db_session)):
    result, count = await get_list(db, page, page_size)
    return resp_ok(data={
        "total": count,
        "list": [item.to_dict() for item in result]
    })
