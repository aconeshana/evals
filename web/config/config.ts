import { defineConfig } from "umi";
import routes from "./routes";
import proxy from "./proxy";

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  routes,
  npmClient: "yarn",
  tailwindcss: {},
  request: {},
  plugins: [
    "@umijs/plugins/dist/tailwindcss",
    "@umijs/plugins/dist/request",
    "@umijs/plugins/dist/locale",
  ],
  history: {
    type: "hash",
  },
  proxy: proxy[(REACT_APP_ENV || "dev") as keyof typeof proxy],
  locale: {
    // 默认使用 src/locales/zh-CN.ts 作为多语言文件
    default: "en-US",
    baseSeparator: "-",
  },
});
