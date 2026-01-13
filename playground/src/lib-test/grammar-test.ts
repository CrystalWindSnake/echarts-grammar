import * as echarts from "echarts";
import { compileOption } from "echarts-grammar";

export function run() {
  document.getElementById("app")!.innerHTML += '<div id="chart"></div>';

  const chartOption = compileOption({
    data: {
      type: "object-array",
      data: [
        { name: "A", value: 10 },
        { name: "B", value: 20 },
      ],
    },
    marks: [
      {
        type: "bar",
        x: "name",
        y: "value",
      },
    ],
  });
  // ======================================================

  // 初始化图表

  const chartDom = document.getElementById("chart");
  const myChart = echarts.init(chartDom);

  // 应用配置
  myChart.setOption(chartOption);
}
