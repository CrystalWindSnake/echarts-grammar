import { CollectorBase } from "../core/collector-base";

type CartesianRequired = {
  xAxisId: string;
  yAxisId: string;
  datasetId: string;
};

type CartesianConfig = { type: string } & { [key: string]: unknown };
type SeriesConfig = CartesianRequired & CartesianConfig;

export class SeriesCollector extends CollectorBase<SeriesConfig> {
  constructor() {
    super("series");
  }

  newSeries(config: SeriesConfig) {
    return this.create(config);
  }

  newCartesianSeries(cartesian: CartesianRequired, config: CartesianConfig) {
    return this.create({
      ...config,
      ...cartesian,
    });
  }

  exportSeries() {
    return this.export();
  }
}
