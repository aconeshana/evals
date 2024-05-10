from api.mysql.database import async_session


async def get_db_session():
    async with async_session() as session:
        try:
            yield session  # 提供会话给路由函数
        finally:
            await session.close()  # 确保会话结束后关闭