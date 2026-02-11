import { CollectorWithIdBase } from "../core/collector-base";

type CartesianRequired = {
  xAxisId: string;
  yAxisId: string;
  datasetId: string;
};

type CartesianConfig = { type: string } & { [key: string]: unknown };
type SeriesConfig = Record<string, unknown>;

export class SeriesCollector extends CollectorWithIdBase<SeriesConfig> {
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
