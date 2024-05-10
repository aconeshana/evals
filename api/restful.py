import json
from typing import Union

from starlette.responses import JSONResponse


def resp_ok(
        data={}, message="ok", is_str=False, is_dict=False, headers=None, uid=None
) -> Union[JSONResponse, str, dict]:
    content = resp(
        data,
        message,
        code=200,
        is_str=is_str,
        headers=headers,
        is_dict=is_dict,
        uid=uid,
    )
    return content


def resp(
        data={},
        message="",
        code=200,
        is_str=False,
        is_dict=False,
        headers=None,
        uid=None,
):
    resp_dict = {
        "success": code == 200,
        "code": int(code),
        "message": message,
        "data": data,
    }

    if is_str:
        return json.dumps(resp_dict, ensure_ascii=False)
    if is_dict:
        return resp_dict
    return JSONResponse(content=resp_dict, headers=headers)
