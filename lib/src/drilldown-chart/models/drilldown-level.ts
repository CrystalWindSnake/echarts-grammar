import type * as echarts from "echarts";

export interface DrilldownLevel<Ctx = any> {
  getOption: (ctx: Ctx | undefined) => echarts.EChartsOption;

  mapEvent?: (params: any) => any;

  bindTrigger?: (chart: echarts.ECharts, fn: (params: any) => void) => void;
}
