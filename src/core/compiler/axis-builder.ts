export function buildAxes(gridId: string, xName: string, yName: string) {
  const axisId = `g-${gridId.split("-")[1]}-0`;

  const xAxis = {
    id: axisId,
    gridId,
    type: "category",
    name: `${xName} →`,
    show: true,
    axisLine: { show: false },
  };

  const yAxis = {
    id: axisId,
    gridId,
    type: "value",
    name: `↑ ${yName}`,
    show: true,
    axisLine: { show: false },
  };

  return { xAxis, yAxis, axisId };
}
