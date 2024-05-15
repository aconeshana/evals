import { Link, Outlet } from "umi";
import Header from "./components/Header";

export default function Layout() {
  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="grow relative flex flex-col overflow-y-auto overflow-x-hidden bg-gray-100">
        <Header />
        <div className="overflow-y-auto bg-gray-100 grow p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
