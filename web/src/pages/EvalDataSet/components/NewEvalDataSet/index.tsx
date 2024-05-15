import { PlusOutlined } from "@ant-design/icons";
import { useBoolean } from "ahooks";
import { Button, Form, Input, Modal } from "antd";
import SetUpload from "../SetUpload";
import useAsyncAction from "@/hooks/useAsyncAction";
import evalDataApi from "@/services/evalData";
import { useEffect } from "react";
import { FormattedMessage } from "umi";

interface Props {
  getEvalData: () => void;
  evalDataSet?: EvalDataApi.EvalData;
  evalDataList?: EvalDataApi.EvalData[];
}

const NewEvalDataSet: React.FC<Props> = (props) => {
  const { getEvalData, evalDataSet, evalDataList } = props;
  const [isOpen, { setTrue: openModal, setFalse: closeModal }] = useBoolean(false);

  const { run: addEvalData, loading } = useAsyncAction(evalDataApi.addEvalData, () => {
    getEvalData();
    closeModal();
  });

  const [form] = Form.useForm();

  const addVersion = (name: string) => {
    if (evalDataSet) {
      const nameWithoutVersion = name.split(".V")[0];
      // 更新
      const dataNameList = evalDataList?.map((i) => i.name);
      const matchList = dataNameList?.filter((i) => i.split(".V")[0] === nameWithoutVersion);
      const versionList = matchList?.map((i) => Number(i.split(".V")[1]));

      const maxVersion = Math.max(...(versionList || []));
      return `${nameWithoutVersion}.V${maxVersion + 1}`;
    } else {
      return `${name}.V1`;
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      values.name = addVersion(values.name);
      addEvalData(values);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      form.setFieldsValue(evalDataSet);
    }
  }, [isOpen]);

  return (
    <div>
      {evalDataSet ? (
        <a onClick={openModal}>
          <FormattedMessage id="edit" />
        </a>
      ) : (
        <Button type="primary" icon={<PlusOutlined />} onClick={openModal}>
          <FormattedMessage id="addEvaluationSet" />
        </Button>
      )}
      <Modal
        title={
          evalDataSet ? (
            <FormattedMessage id="editEvaluationSet" />
          ) : (
            <FormattedMessage id="addEvaluationSet" />
          )
        }
        open={isOpen}
        onCancel={closeModal}
        width={"50%"}
        destroyOnClose
        onOk={handleSubmit}
        okButtonProps={{
          loading: loading,
        }}
      >
        <Form layout="vertical" preserve={false} form={form}>
          <Form.Item
            label={<FormattedMessage id="evaluationSetName" />}
            name="name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input disabled={!!evalDataSet?.id} />
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="evaluationData" />}
            name="content"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <SetUpload />
          </Form.Item>
          <Form.Item label={<FormattedMessage id="uploader" />} name="created_by">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NewEvalDataSet;
