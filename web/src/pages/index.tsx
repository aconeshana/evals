import { Card, Table } from "antd";
import NewEvaluate from "@/components/NewEvaluate";
import { usePagination } from "ahooks";
import evalExecApi from "@/services/evalExec";
import dayjs from "dayjs";
import { FormattedMessage, Link } from "umi";
import { matchList } from "@/utils/matchList";

export default function HomePage() {
  const {
    data: evalExecList,
    loading: evalExecListLoading,
    run: getEvalExecList,
    pagination,
  } = usePagination(async (params) => {
    const res = await evalExecApi.evalExecList({
      page_size: params.pageSize,
      page: params.current,
    });
    return res;
  });

  return (
    <div>
      <Card bordered={false}>
        <NewEvaluate
          getEvalExecList={() => {
            getEvalExecList({
              current: 1,
              pageSize: pagination.pageSize,
            });
          }}
        />
        <Table
          pagination={pagination}
          loading={evalExecListLoading}
          dataSource={evalExecList?.list}
          size="small"
          columns={[
            {
              dataIndex: "id",
              title: "ID",
            },
            {
              dataIndex: "model",
              title: <FormattedMessage id="model" />,
            },
            {
              dataIndex: "match",
              title: <FormattedMessage id="evaluationCriteria" />,
              render: (match) => (
                <FormattedMessage id={matchList.find((i) => i.value === match)?.label} />
              ),
            },
            {
              dataIndex: "desc",
              title: <FormattedMessage id="description" />,
            },
            {
              dataIndex: "progress",
              title: <FormattedMessage id="progress" />,
              render: (progress) => progress || "N/A",
            },
            {
              dataIndex: "created_at",
              title: <FormattedMessage id="creationTime" />,
              render: (t) => dayjs(t * 1000).format("YYYY-MM-DD HH:mm"),
            },
            {
              dataIndex: "action",
              title: <FormattedMessage id="detail" />,
              render: (t, r) => (
                <Link to={`/eval/detail/${r.id}`}>
                  <FormattedMessage id="detail" />
                </Link>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
}
