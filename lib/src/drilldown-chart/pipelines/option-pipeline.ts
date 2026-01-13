import type * as echarts from "echarts";
import { DrilldownLevel } from "@/drilldown-chart/models/drilldown-level";

export function buildOption(
  level: DrilldownLevel,
  ctx: any
): echarts.EChartsOption {
  return level.getOption(ctx);
}
