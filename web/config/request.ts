import { message } from "antd";
import type { RequestConfig, RequestOptions } from "umi";

// 与后端约定的响应数据格式
interface ResponseStructure {
  code: number; // 0: 成功; -1:失败
  data: any;
  msg?: string;
}

const apiPrefix = "/llm-eval/api/v1";
/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const requestConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res: any) => {
      const { data, code, msg } = res as unknown as ResponseStructure;
      if (code !== 0) {
        const error: any = new Error(msg);
        error.name = "BizError";
        error.info = { code, msg, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === "BizError") {
        const errorInfo: ResponseStructure | undefined = error.msg;
        // @ts-ignore
        message.error(errorInfo);
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        message.error(
          `Response status with ${error?.response?.status}: ${error?.response?.data?.msg || ""}`
        );
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error("None response! Please retry.");
      } else {
        // 发送请求时出了点问题
        message.error("Request error, please retry.");
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      // const url = config?.url?.concat('?token = 123');

      const url = apiPrefix + config?.url;
      return {
        ...config,
        url,
        headers: {
          ...config.headers,
        },
      };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response: any) => {
      if (response.headers["content-type"] === "text/event-stream") {
        return { data: response.data };
      }
      // 拦截响应数据，进行个性化处理
      const { data } = response as unknown as any;
      const errorResponse = { ...data, data: undefined, success: false };
      const info = data?.message || data?.data;
      if (data?.code === 200) {
        return data;
      } else {
        message.error(info);
        return errorResponse;
      }
      // switch (data?.code) {
      //   case 0:
      //     return data;
      //   case -1:
      //     message.error(info);
      //     return errorResponse;
      //   case 1:
      //     message.warning(info);
      //     return errorResponse;
      //   default:
      //     return data;
      // }
    },
  ],
};
