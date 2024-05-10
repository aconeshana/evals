import json
from typing import Optional, Dict, Any

from pydantic import BaseModel
from sqlalchemy import Column, Integer, Text, String, update, select, delete, func
from sqlalchemy.orm import Session

from .database import DBBaseModel, session


class EvalData(DBBaseModel):
    __tablename__ = "eval_data"

    id = Column(Integer, primary_key=True)
    name = Column(String, index=True)
    content = Column(Text(length=2 ** 32 - 1))
    created_by = Column(String(20), nullable=False)


class EvalDataModel(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    content: Optional[str] = None
    created_by: Optional[str] = None


class EvalExecution(DBBaseModel):
    __tablename__ = "eval_execution"

    id = Column(Integer, primary_key=True)
    model = Column(String(50), nullable=False)
    desc = Column(String(2000), nullable=False)
    match = Column(String(100), nullable=False)
    args = Column(String(8000))
    data_id = Column(Integer, nullable=False)
    result = Column(String(8000), nullable=False)
    progress = Column(String(100), nullable=False)
    created_by = Column(String(20), nullable=False)


class EvalExecutionModel(BaseModel):
    id: Optional[int] = None
    model: Optional[str] = None
    desc: Optional[str] = None
    match: Optional[str] = "evals.elsuite.basic.match:Match"
    args: Optional[Dict[Any, Any]] = None
    data_id: Optional[int] = None
    progress: Optional[str] = None
    created_by: Optional[str] = None


async def create_eval_data(db: Session, data: EvalDataModel):
    db_data = EvalData(name=data.name, content=data.content, created_by=data.created_by)
    db.add(db_data)
    await db.commit()
    await db.refresh(db_data)
    return db_data


def retrieve_eval_data(id: int):
    db = session()
    try:
        return db.query(EvalData).filter_by(id=id).first()
    finally:
        db.close()


async def a_retreive_eval_data(db: Session, id: int):
    result = await db.execute(select(EvalData).filter_by(id=id))
    return result.scalars().first()


async def update_eval_data(db: Session, data: EvalDataModel):
    stmt = (
        update(EvalData)
        .where(EvalData.id == data.id)
        .values(name=data.name, content=data.content)
    )
    # 执行更新操作
    await db.execute(stmt)
    await db.commit()


async def delete_eval_data(db: Session, data: EvalDataModel):
    stmt = delete(EvalData).where(EvalData.id == data.id)
    await db.execute(stmt)
    await db.commit()


async def get_list(db: Session, page: int, page_size: int):
    result = await db.execute(select(EvalData).offset((page - 1) * page_size).limit(page_size))
    count = await db.execute(select(func.count('*')).select_from(EvalData))
    return result.scalars().all(), count.scalars().first()


async def create_eval_execution(db: Session, data: EvalExecutionModel):
    eval_data = await a_retreive_eval_data(db, data.data_id)
    jsonl_data = eval_data.content.strip()

    # 按行分割字符串
    lines = jsonl_data.split('\n')

    db_data = EvalExecution(model=data.model, desc=data.desc, match=data.match,
                            args=json.dumps(data.args) if data.args else None,
                            data_id=data.data_id, created_by=data.created_by, progress=f"0/{len(lines)}")
    db.add(db_data)
    await db.commit()
    await db.refresh(db_data)
    return db_data


async def update_eval_execution(db: Session, id: int, result: str, progress: str):
    stmt = (
        update(EvalExecution)
        .where(EvalExecution.id == id)
        .values(result=result, progress=progress)
    )
    await db.execute(stmt)
    await db.commit()


async def retrieve_eval_execution(db: Session, id: int):
    result = await db.execute(select(EvalExecution).filter_by(id=id))
    return result.scalars().first()


async def get_executions_list(db: Session, page: int, page_size: int):
    result = await db.execute(select(EvalExecution).offset((page - 1) * page_size).limit(page_size))
    count = await db.execute(select(func.count('*')).select_from(EvalExecution))
    return result.scalars().all(), count.scalars().first()
