let datasetCounter = 0;
let seriesCounter = 0;
let gridCounter = 0;

export function genDatasetId() {
  return `ds${datasetCounter++}`;
}

export function genSeriesId() {
  return `series-id-${seriesCounter++}`;
}

export function genGridId() {
  return `gid-${gridCounter++}`;
}

export function resetIds() {
  datasetCounter = 0;
  seriesCounter = 0;
  gridCounter = 0;
}
