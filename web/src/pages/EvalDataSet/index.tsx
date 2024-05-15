import evalDataApi from "@/services/evalData";
import { Card, Divider, Input, Popconfirm, Space, Table } from "antd";
import { useRequest } from "ahooks";
import NewEvalDataSet from "./components/NewEvalDataSet";
import dayjs from "dayjs";
import { SearchOutlined } from "@ant-design/icons";
import useAsyncAction from "@/hooks/useAsyncAction";
import { useState } from "react";
import { FormattedMessage, useIntl } from "umi";

const EvalSet: React.FC = () => {
  const {
    data: evalDataList,
    loading: evalDataListLoading,
    run: getEvalData,
  } = useRequest(() => evalDataApi.evalDataList({ page_size: 9999 }));

  const { run: deleteEvalData } = useAsyncAction(evalDataApi.deleteEvalData, () => {
    getEvalData();
  });

  const [inputName, setInputName] = useState("");

  const filterByName = () => {
    if (!inputName) {
      return evalDataList?.list.sort((a, b) => b.id - a.id);
    }
    return evalDataList?.list
      .filter((item) => {
        return item.name.toLocaleLowerCase().includes(inputName.toLocaleLowerCase());
      })
      .sort((a, b) => b.id - a.id);
  };

  const intl = useIntl();
  const evaluationSetName = intl.formatMessage({
    id: "evaluationSetName",
  });

  return (
    <div>
      <Card bordered={false}>
        <div className="flex justify-between items-center mb-4">
          <Input
            className="w-[240px]"
            placeholder={evaluationSetName}
            suffix={<SearchOutlined />}
            onChange={(e) => {
              setInputName(e.target.value);
            }}
          />
          <NewEvalDataSet getEvalData={getEvalData} />
        </div>
        <Table
          loading={evalDataListLoading}
          dataSource={filterByName()}
          size="small"
          columns={[
            {
              dataIndex: "name",
              title: evaluationSetName,
            },
            {
              dataIndex: "created_by",
              title: <FormattedMessage id="uploader" />,
            },
            {
              dataIndex: "created_at",
              title: <FormattedMessage id="creationTime" />,
              render: (t) => dayjs(t * 1000).format("YYYY-MM-DD HH:mm"),
            },
            {
              dataIndex: "action",
              title: <FormattedMessage id="action" />,
              render: (t, r) => (
                <Space>
                  <NewEvalDataSet
                    getEvalData={getEvalData}
                    evalDataSet={r}
                    evalDataList={evalDataList?.list}
                  />
                  <Divider type="vertical" />
                  <Popconfirm
                    title={<FormattedMessage id="deleteConfirm" />}
                    onConfirm={() => {
                      deleteEvalData(r.id);
                    }}
                  >
                    <a className="text-red-500">
                      <FormattedMessage id="delete" />
                    </a>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default EvalSet;
