import * as echarts from "echarts";
import { useDrilldown, compileOption } from "echarts-grammar";

export function run() {
  document.getElementById("app")!.innerHTML += '<div id="chart"></div>';

  const opt1 = compileOption({
    data: {
      type: "object-array",
      data: [
        { x: "A", y: 10 },
        { x: "B", y: 20 },
      ],
    },
    marks: [
      {
        type: "bar",
      },
    ],
  });

  const opt2 = compileOption({
    data: {
      type: "object-array",
      data: [
        { x: "A", y: 100 },
        { x: "B", y: 200 },
      ],
    },
    marks: [
      {
        type: "line",
      },
    ],
  });
  // ======================================================

  // 初始化图表

  const chartDom = document.getElementById("chart");
  const myChart = echarts.init(chartDom);

  useDrilldown(myChart, [
    {
      getOption: (ctx) => opt1,
      mapEvent: (params) => params.name,
      bindTrigger: (chart, fn) => {
        chart.on("click", fn);
      },
    },
    {
      getOption: (ctx) => opt2,
    },
  ]);
}
