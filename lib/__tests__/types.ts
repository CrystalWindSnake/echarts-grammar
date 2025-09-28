type TRecordWith<T> = Record<string, any> & T;

export type TResult = {
  dataset: TRecordWith<{ id: string; fromDatasetId: string }>[];
  series: TRecordWith<{
    type: string;
    datasetId: string;
    xAxisId: string;
    yAxisId: string;
  }>[];
  xAxis: TRecordWith<{ id: string; gridId: string }>[];
  yAxis: TRecordWith<{ id: string; gridId: string }>[];
  grid: TRecordWith<{ id: string; coord: string[] }>[];
  matrix: TRecordWith<{
    x: { data: string[]; show: boolean };
    y: { data: string[]; show: boolean };
  }>;
};
