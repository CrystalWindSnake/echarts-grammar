import { CollectorBase } from "../core/collector-base";

export interface TooltipConfig {}

export class TooltipCollector extends CollectorBase<TooltipConfig> {
  newTooltip(config: TooltipConfig) {
    return this.create(config);
  }

  exportTooltip() {
    if (this.items.length === 0) {
      return undefined;
    }

    return this.export();
  }
}
