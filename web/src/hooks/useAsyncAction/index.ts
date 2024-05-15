import { message } from "antd";
import { useState } from "react";
import { FormattedMessage, useIntl } from "umi";

const useAsyncAction = <T>(
  submitFunction: (...params: T[]) => Promise<any>,
  successCallback?: (res?: any) => void,
  successMessage?: string,
  errorMessage?: string
) => {
  const [loading, setLoading] = useState(false);

  const intl = useIntl();
  const operationSuccessful = intl.formatMessage({
    id: "operationSuccessful",
  });
  const operationFailed = intl.formatMessage({
    id: "operationFailed",
  });

  const run = async (...params: T[]) => {
    setLoading(true);
    try {
      const res = await submitFunction(...params);
      if (res !== undefined) {
        message.success({
          content: successMessage || operationSuccessful,
        });
        successCallback?.(res); // 调用操作成功的回调函数
      }
    } catch (error) {
      message.error(errorMessage || operationFailed);
    } finally {
      setLoading(false);
    }
  };

  return { run, loading };
};

export default useAsyncAction;
