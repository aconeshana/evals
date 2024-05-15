const local = "http://localhost:8080";
const test = "https://ai.test.xmly.work";
const prod = "https://ai.xmly.work";

export default {
  dev: {
    "/llm-eval/": {
      target: local,
      changeOrigin: true,
      pathRewrite: { "^": "" },
    },
  },
};
