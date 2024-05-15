import React from "react";
import "./style.less";

interface Props {
  title: string | JSX.Element;
  operations?: JSX.Element;
  style?: React.CSSProperties;
  size?: "default" | "small";
  fontStyle?: React.CSSProperties;
}

const SubTitle: React.FC<Props> = (props) => {
  const { title, style, operations, size = "default", fontStyle } = props;

  const fontSizeMap = {
    small: "14px",
    default: "16px",
  };
  return (
    <div style={style}>
      <span
        style={{
          fontSize: fontSizeMap[size],
          fontWeight: 600,
          borderLeft: `3px solid #1677ff`,
          height: 20,
          ...fontStyle,
        }}
      >
        <span style={{ marginLeft: 5 }}>{title}</span>
      </span>
      <div style={{ float: "right" }}>{operations ? operations : null}</div>
    </div>
  );
};
export default SubTitle;
