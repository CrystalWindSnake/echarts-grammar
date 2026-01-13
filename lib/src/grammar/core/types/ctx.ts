import type { DataPipeline } from "@/grammar/pipeline/dataset/pipeline";

export interface SeriesBuildContext {
  datasetId: string;
  gridId?: string;
  axisId?: string;
  datasetPipeline: DataPipeline;
}
