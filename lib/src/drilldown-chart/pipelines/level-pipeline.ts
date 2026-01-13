import { DrilldownLevel } from "@/drilldown-chart/models/drilldown-level";

export function getLevel(levels: DrilldownLevel[], index: number) {
  if (index < 0 || index >= levels.length) {
    throw new Error(`Invalid level index: ${index}`);
  }
  return levels[index];
}
