declare namespace EvalExecApi {
  interface EvalResult {
    id: number;
    model: string;
    desc: string;
    match: string;
    args: Object;
    data_id: number;
    result: string;
    progress: string;
    created_by: string;
    created_at: number;
    updated_at: number;
  }

  interface EvalDetail {
    id: number;
    model: string;
    desc: string;
    match: string;
    args: string;
    data_id: number;
    result: string;
    progress: string;
    created_by: string;
    created_at: number;
    updated_at: number;
  }
}
