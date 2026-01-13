import type * as echarts from "echarts";
import { DrilldownLevel } from "@/drilldown-chart/models/drilldown-level";

export function bindNextTrigger(
  chart: echarts.ECharts,
  level: DrilldownLevel,
  handler: (params: any) => void
) {
  if (!level.bindTrigger || !level.mapEvent) return;

  level.bindTrigger(chart, handler);
}

export function unbindDefault(chart: echarts.ECharts) {
  chart.off("click");
}
