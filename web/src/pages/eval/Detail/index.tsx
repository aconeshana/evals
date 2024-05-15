import SubTitle from "@/components/SubTitle";
import evalExecApi from "@/services/evalExec";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useRequest } from "ahooks";
import { Card, Descriptions, DescriptionsProps, message, Progress, Table } from "antd";
import { useEffect } from "react";
import { FormattedMessage, useMatch } from "umi";
import { matchList as allMatchType } from "@/utils/matchList";

const EvalDetail: React.FC = () => {
  const match = useMatch(`/eval/detail/:evalId`);
  const evalId = Number(match?.params.evalId);

  const {
    data: detail,
    loading,
    run,
    cancel,
  } = useRequest(
    async () => {
      const res = await evalExecApi.evalDetail(evalId);
      return res;
    },
    {
      pollingInterval: 1000,
      pollingErrorRetryCount: 3,
      manual: true,
    }
  );

  const progress = detail?.progress;
  const all = Number(progress?.split("/")[1]);
  const finished = Number(progress?.split("/")[0]);
  const isFinished = detail && all === finished;

  useEffect(() => {
    if (!detail) {
      run();
    } else {
      if (isFinished) {
        cancel();
        message.destroy();
      }
    }
  }, [detail]);

  useEffect(() => {
    if (!isFinished) {
      message.destroy();
      message.loading({
        content: <FormattedMessage id="evaluating" />,
        duration: 10,
      });
    }
  }, [isFinished]);

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: <FormattedMessage id="model" />,
      children: detail?.model,
    },
    {
      key: "2",
      label: <FormattedMessage id="description" />,
      children: detail?.desc,
    },
    {
      key: "3",
      label: <FormattedMessage id="evaluationCriteria" />,
      children: (
        <FormattedMessage
          id={allMatchType.find((i) => i.value === detail?.match)?.label || "evaluationCriteria"}
        />
      ),
    },
    {
      key: "4",
      label: <FormattedMessage id="progress" />,
      span: 3,
      children: (
        <div className="w-full flex items-center gap-2">
          <Progress percent={Number(((finished / all) * 100).toFixed(0))} type="circle" size={18} />{" "}
          <div>{detail?.progress}</div>
        </div>
      ),
    },
  ];

  const result = JSON.parse(detail?.result || "[]");
  const matchList = result.filter((i: any) => i.type === "match");
  const finalReport = result.filter((i: any) => i.type === "final_report");

  return (
    <div>
      <Card bordered={false}>
        <SubTitle
          title={
            <span>
              <FormattedMessage id="evaluation" /> {detail?.id}
            </span>
          }
        />
        <Descriptions items={items} className="mt-4" />
      </Card>
      <Card bordered={false} className="mt-4">
        <div className="flex gap-4 items-center justify-between">
          <SubTitle title={<FormattedMessage id={"evaluationDetail"} />} />
          <div className="flex gap-1 items-end">
            <div>
              <span className="text-green-500 text-3xl">
                {matchList.filter((i: any) => i.data.correct).length}
              </span>
            </div>
            <div>
              <FormattedMessage id="success" />
            </div>
            <div className=" text-gray-400">/</div>
            <div>
              <span className="text-red-500 text-3xl">
                {matchList.filter((i: any) => !i.data.correct).length}
              </span>
            </div>
            <div>
              <FormattedMessage id="failure" />
            </div>
          </div>
        </div>
        <Table
          size="small"
          dataSource={matchList}
          className="mt-4"
          columns={[
            {
              title: "sample_id",
              dataIndex: "sample_id",
            },
            {
              title: <FormattedMessage id="expectedReturn" />,
              render: (_, record) => record.data?.expected,
            },
            {
              title: <FormattedMessage id="actualReturn" />,
              render: (_, record) => record.data?.sampled,
            },
            {
              title: <FormattedMessage id="evaluationResult" />,
              render: (_, record) =>
                record.data?.correct ? (
                  <CheckOutlined className="text-green-500" />
                ) : (
                  <CloseOutlined className="text-red-500" />
                ),
            },
          ]}
        />
      </Card>
      <Card bordered={false} className="mt-4">
        <SubTitle title={<FormattedMessage id="evaluationReport" />} />
        <Descriptions
          items={
            (Object.entries(finalReport?.[0]?.data || "{}").map(([k, v]) => ({
              key: k,
              label: k,
              children: v,
            })) || []) as any
          }
          className="mt-4"
        />
      </Card>
    </div>
  );
};

export default EvalDetail;
