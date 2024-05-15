import { Avatar, Divider } from "antd";
import TopNav from "./components/TopNav";
import { Link, getLocale, setLocale, getAllLocales } from "umi";

const Header: React.FC = () => {
  const locale = getLocale();
  console.log(locale)

  return (
    <div className="sticky top-0 left-0 right-0 z-20 flex flex-col bg-gray-100 grow-0 shrink-0 basis-auto h-[55px] border-b border-solid border-gray-200 border-y-0 border-t-0">
      <div className="flex flex-1 items-center justify-between px-4">
        <Link className="font-bold text-2xl text-black no-underline" to={"/"}>
          Evals
        </Link>
        <TopNav />
        <div className="flex items-center">
          <a
            className=" cursor-pointer hover:text-[#1677ff]"
            onClick={() => {
              setLocale(locale === "zh-CN" ? "en-US" : "zh-CN");
            }}
          >
            {locale === "zh-CN" ? "中文" : "EN"}
          </a>
          <Divider type="vertical" />
          <Avatar />
        </div>
      </div>
    </div>
  );
};

export default Header;
