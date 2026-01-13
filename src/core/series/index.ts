import { seriesFactory } from "./series-factory";
import { BarSeriesStrategy } from "./strategies/bar";
import { PieSeriesStrategy } from "./strategies/pie";
import { LineSeriesStrategy } from "./strategies/line";

seriesFactory.register(new BarSeriesStrategy());
seriesFactory.register(new LineSeriesStrategy());
seriesFactory.register(new PieSeriesStrategy());

export { seriesFactory };
