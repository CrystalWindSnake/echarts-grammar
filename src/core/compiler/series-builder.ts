import { MarkConfig } from "@/core/types";
import { genSeriesId } from "@/core/id-generator";

export function buildSeries(
  mark: MarkConfig,
  datasetId: string,
  axisId: string
) {
  return {
    id: genSeriesId(),
    type: mark.type,
    datasetId,
    encode: {
      x: mark.x,
      y: mark.y,
    },
    xAxisId: axisId,
    yAxisId: axisId,
    ...(mark.options || {}),
  };
}
