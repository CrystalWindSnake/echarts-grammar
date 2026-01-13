import type * as echarts from "echarts";
import { DrilldownLevel } from "./models/drilldown-level";
import { DrilldownRuntime } from "./runtime/drilldown-runtime";

export function useDrilldown(chart: echarts.ECharts, levels: DrilldownLevel[]) {
  return new DrilldownRuntime(chart, levels);
}

export type { DrilldownLevel };
