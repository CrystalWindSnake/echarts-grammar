import { MarkConfig, SeriesBuildContext, XYMarkConfig } from "@/core/types";

export interface SeriesStrategy {
  supports(type: MarkConfig["type"]): boolean;

  requireAxis(mark: MarkConfig): mark is XYMarkConfig;

  build(mark: MarkConfig, ctx: SeriesBuildContext): any[];
}

class SeriesFactory {
  private strategies: SeriesStrategy[] = [];

  register(strategy: SeriesStrategy) {
    this.strategies.push(strategy);
  }

  getStrategy(type: MarkConfig["type"]) {
    const s = this.strategies.find((s) => s.supports(type));
    if (!s) throw new Error(`No series strategy for type: ${type}`);
    return s;
  }
}

export const seriesFactory = new SeriesFactory();
