import { TCollectors } from "@/options-builder/collectors";

export interface SeriesBuildContext {
  collectors: TCollectors;
  gridId: string;
  datasetId: string;
  themeColors: string[];
}
