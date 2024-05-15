import { ConfigProvider, Segmented } from "antd";
import routes from "../../../../../../config/routes";
import { FormattedMessage, history, useLocation } from "umi";

const TopNav: React.FC = () => {
  const location = useLocation();

  return (
    <div>
      <ConfigProvider
        theme={{
          components: {
            Segmented: {
              /* 这里是你的组件 token */
              itemSelectedColor: "#1677ff",
            },
          },
        }}
      >
        <Segmented
          options={routes
            .filter((i) => !i.hideInMenu)
            .map((route) => ({
              label: <FormattedMessage id={route.name} />,
              value: route.path,
            }))}
          onChange={(value) => history.push(value)}
          value={location.pathname}
          className="bg-gray-100"
        />
      </ConfigProvider>
    </div>
  );
};

export default TopNav;
