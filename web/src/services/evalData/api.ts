import { request } from "umi";
import { PageResponse } from "../typings";

const namespace = "/eval/data";

/** 评测集列表 GET /eval/data/list */
export const evalDataList = async (params?: any) => {
  return request<PageResponse<EvalDataApi.EvalData[]>>(`${namespace}/list`, {
    method: "GET",
    params,
  });
};

/** 添加评测集 POST /eval/data/list */
export const addEvalData = async (params?: any) => {
  return request<any>(`${namespace}/create`, {
    method: "POST",
    data: params,
  });
};

/** 删除评测集 POST /eval/data/delete */
export const deleteEvalData = async (id?: number) => {
  return request<any>(`${namespace}/delete`, {
    method: "POST",
    data: { id },
  });
};
