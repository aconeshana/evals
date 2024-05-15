import { request } from "umi";
import { PageResponse } from "../typings";

const namespace = "/eval/exec";

/** 评测结果列表 POST /eval/exec/list */
export const evalExecList = async (params?: any) => {
  return request<PageResponse<EvalExecApi.EvalResult[]>>(`${namespace}/list`, {
    method: "GET",
    params,
  });
};

/** GET 评测 /eval/exec/detail/:id */
export const evalDetail = async (id?: number) => {
  return request<EvalExecApi.EvalDetail>(`${namespace}/detail/${id}`, {
    method: "GET",
  });
};

/** GET 评测add /eval/exec/create */
export const addEval = async (params?: any) => {
  return request<any>(`${namespace}/create`, {
    method: "POST",
    data: params,
  });
};
