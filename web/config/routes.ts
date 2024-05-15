export default [
  { path: "/", component: "index", name: "evaluationResults" },
  { path: "/set", component: "EvalDataSet", name: "evaluationSets" },
  { path: "/eval/detail/:id", component: "./eval/Detail", name: "evaluationDetail", hideInMenu: true },
];
