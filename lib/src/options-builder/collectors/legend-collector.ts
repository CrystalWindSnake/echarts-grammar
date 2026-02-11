import { CollectorBase } from "../core/collector-base";

export interface LegendConfig {}

export class LegendCollector extends CollectorBase<LegendConfig> {
  newLegend(config: LegendConfig) {
    return this.create(config);
  }

  exportLegends() {
    if (this.items.length === 0) {
      return undefined;
    }

    return this.export();
  }
}
