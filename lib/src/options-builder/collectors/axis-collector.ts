import { CollectorBase } from "../core/collector-base";
import { ReusePredicate } from "../core/types";

export interface AxisConfig {
  id?: string;
  type: "category" | "value" | "time" | "log";
  gridId: string;
  [key: string]: unknown;
}

export class AxisCollector extends CollectorBase<AxisConfig> {
  constructor(prefix: "x-axis" | "y-axis") {
    super(prefix);
  }

  newAxis(config: AxisConfig) {
    return this.create(config);
  }

  newAxisWithReuse(config: AxisConfig, reuse: ReusePredicate<AxisConfig>) {
    return this.create(config, reuse);
  }

  exportAxes() {
    return this.export();
  }
}
