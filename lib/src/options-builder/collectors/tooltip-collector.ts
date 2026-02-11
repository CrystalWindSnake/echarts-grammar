import { SingleItemCollectorBase } from "../core/collector-base";

export interface TooltipConfig {}

export class TooltipCollector extends SingleItemCollectorBase<TooltipConfig> {
  newTooltip(config: TooltipConfig, settings: { convert?: boolean } = {}) {
    const { convert = false } = settings;

    if (!!this.item && !convert) {
      return this.item;
    }

    return this.create(config);
  }

  exportTooltip() {
    if (!this.item) {
      return undefined;
    }

    return this.export();
  }
}
