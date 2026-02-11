import { SeriesStrategy } from "../series-factory";
import {
  MarkConfig,
  PieMarkConfig,
  SeriesBuildContext,
} from "@/grammar/core/types";

const SERIES_TYPE = "bar";

export class PieSeriesStrategy implements SeriesStrategy {
  supports(type: MarkConfig["type"]) {
    return type === SERIES_TYPE;
  }

  build(ctx: SeriesBuildContext, mark: PieMarkConfig) {
    const { collectors, datasetId, themeColors } = ctx;

    collectors.series.newSeries({
      type: SERIES_TYPE,
      datasetId,
      encode: {
        value: mark.angle || "value",
        itemName: mark.category || "name",
      },
      itemStyle: { color: themeColors },
      ...(mark.options || {}),
    });
  }
}
