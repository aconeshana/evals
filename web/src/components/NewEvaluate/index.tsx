import useAsyncAction from "@/hooks/useAsyncAction";
import evalDataApi from "@/services/evalData";
import evalExecApi from "@/services/evalExec";
import { matchList } from "@/utils/matchList";
import { PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { useBoolean, useRequest } from "ahooks";
import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import { FormattedMessage, Link, history } from "umi";

interface Props {
  getEvalExecList: () => void;
}
const NewEvaluate: React.FC<Props> = (props) => {
  const { getEvalExecList } = props;

  const [isOpen, { setTrue: openModal, setFalse: closeModal }] = useBoolean(false);

  const { data: evalDataList, loading: evalDataListLoading } = useRequest(() =>
    evalDataApi.evalDataList({ page_size: 9999 })
  );

  const { run: addEval, loading } = useAsyncAction(evalExecApi.addEval, (res) => {
    closeModal();
    getEvalExecList();
    history.push(`/eval/detail/${res.taskId}`);
  });

  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      addEval(values);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="mb-4">
      <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
        <FormattedMessage id="newEvaluation" />
      </Button>
      <Button icon={<ReloadOutlined className="mr-1" />} onClick={getEvalExecList} type="link">
        <FormattedMessage id="refresh" />
      </Button>
      <Modal
        open={isOpen}
        onCancel={closeModal}
        title={<FormattedMessage id="newEvaluation" />}
        width={"50%"}
        okText="开始评测"
        cancelText="取消"
        okButtonProps={{
          loading,
        }}
        onOk={handleSubmit}
      >
        <Form layout="vertical" form={form}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={<FormattedMessage id="model" />}
                name="model"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={<FormattedMessage id="evaluationCriteria" />}
                name="match"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select options={matchList} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label={<FormattedMessage id="modelParameters" />} name="args">
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 5 }} />
          </Form.Item>
          <Form.Item
            label={
              <div>
                <FormattedMessage id="evaluationSets" />{" "}
                <Link to={"/set"}>
                  <FormattedMessage id="addEvaluationSets" />
                </Link>
              </div>
            }
            name="data_id"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              loading={evalDataListLoading}
              showSearch
              optionFilterProp="label"
              options={evalDataList?.list.map((i) => ({
                label: i.name,
                value: i.id,
              }))}
            />
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="description" />}
            name="desc"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NewEvaluate;
