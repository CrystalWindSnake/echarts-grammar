import * as echarts from "echarts";
import { compileOption, GrammarConfig } from "echarts-grammar";

export function run() {
  document.getElementById("app")!.innerHTML += '<div id="chart"></div>';

  const data = [
    { region: "华东", quarter: "Q1", category: "家具", sales: 120 },
    { region: "华东", quarter: "Q1", category: "办公用品", sales: 80 },
    { region: "华东", quarter: "Q1", category: "技术", sales: 150 },
    { region: "华东", quarter: "Q2", category: "家具", sales: 150 },
    { region: "华东", quarter: "Q2", category: "办公用品", sales: 90 },
    { region: "华东", quarter: "Q2", category: "技术", sales: 180 },
    { region: "华南", quarter: "Q1", category: "家具", sales: 100 },
    { region: "华南", quarter: "Q1", category: "办公用品", sales: 70 },
    { region: "华南", quarter: "Q1", category: "技术", sales: 130 },
    { region: "华南", quarter: "Q2", category: "家具", sales: 130 },
    { region: "华南", quarter: "Q2", category: "办公用品", sales: 85 },
    { region: "华南", quarter: "Q2", category: "技术", sales: 160 },
    { region: "华北", quarter: "Q1", category: "家具", sales: 110 },
    { region: "华北", quarter: "Q1", category: "办公用品", sales: 75 },
    { region: "华北", quarter: "Q1", category: "技术", sales: 140 },
    { region: "华北", quarter: "Q2", category: "家具", sales: 140 },
    { region: "华北", quarter: "Q2", category: "办公用品", sales: 95 },
    { region: "华北", quarter: "Q2", category: "技术", sales: 170 },
  ];
  const config: GrammarConfig = {
    data: { type: "object-array", data },
    facet: { row: "region" },
    marks: [
      {
        type: "bar",
        x: "quarter",
        y: "sales",
        color: "category",
        transpose: true,
        // stack: false,
      },
    ],
  };

  const chartOption = compileOption(config);

  console.log(chartOption);

  // ======================================================

  // 初始化图表

  const chartDom = document.getElementById("chart");
  const myChart = echarts.init(chartDom);

  // 应用配置
  myChart.setOption(chartOption);
}
