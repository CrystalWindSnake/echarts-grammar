let seriesCounter = 0;
let gridCounter = 0;

export function genSeriesId() {
  return `series-id-${seriesCounter++}`;
}

export function genGridId() {
  return `gid-${gridCounter++}`;
}

export function resetIds() {
  seriesCounter = 0;
  gridCounter = 0;
}
