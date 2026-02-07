import { CollectorBase } from "../core/collector-base";

export interface MatrixConfig {
  x?: {
    data?: any[];
    [key: string]: unknown;
  };
  y?: {
    data?: any[];
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export class MatrixCollector extends CollectorBase<MatrixConfig> {
  constructor() {
    super("matrix");
  }

  newRaw(config: MatrixConfig) {
    const { data: xData = ["-1"] } = config.x ?? {};
    const { data: yData = ["-1"] } = config.y ?? {};

    const x = { ...config.x, data: xData } as MatrixConfig["x"];
    const y = { ...config.y, data: yData } as MatrixConfig["y"];
    return this.create({ ...config, x, y });
  }

  exportMatrixs(): MatrixConfig[] {
    return this.export();
  }
}
