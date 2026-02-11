import { CollectorBase } from "../core/collector-base";

export interface LegendConfig {}

export class LegendCollector extends CollectorBase<LegendConfig> {
  private defaultLegendConfig: LegendConfig | undefined;

  newLegend(config: LegendConfig) {
    return this.create(config);
  }

  defaultLegend(config: LegendConfig, settings: { convert?: boolean } = {}) {
    const { convert = false } = settings;

    if (!!this.defaultLegendConfig && !convert) {
      return this.defaultLegendConfig;
    }

    this.defaultLegendConfig = config;
    return config;
  }

  exportLegends() {
    if (!!this.defaultLegendConfig && this.items.length > 0) {
      throw new Error("Cannot have both default legend and named legends");
    }

    if (this.items.length === 0) {
      return undefined;
    }

    return this.export();
  }
}
