import { UploadOutlined } from "@ant-design/icons";
import { Button, Input, message, Upload, UploadProps } from "antd";
import { createRef, useState } from "react";
import { FormattedMessage } from "umi";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
}

const SetUpload: React.FC<Props> = (props) => {
  const { value, onChange } = props;

  const fileInputRef = createRef<HTMLInputElement>();
  const [loading, setLoading] = useState(false);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // 当按钮被点击时，触发input的点击事件
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e?.target?.result?.toString() || "");
      };
      reader.onerror = (e) => {
        reject(e.target?.error);
      };
      reader.readAsText(file);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setLoading(true);
      const content = await readFileAsText(file);
      setLoading(false);
      onChange?.(content);
    } catch (error) {
      message.error(`Error reading file: ${error}`);
    }
  };

  return (
    <div>
      <Button
        icon={<UploadOutlined className="mr-1" />}
        onClick={handleButtonClick}
        className="w-full"
        loading={loading}
      >
        <FormattedMessage id="evaluationFile" />
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".jsonl"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Input.TextArea
        autoSize={{ minRows: 8, maxRows: 16 }}
        className="mt-4"
        value={value}
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
      />
    </div>
  );
};

export default SetUpload;
