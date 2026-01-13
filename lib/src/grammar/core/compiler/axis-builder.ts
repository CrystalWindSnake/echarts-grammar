export function buildAxes(
  gridId: string,
  xName: string | undefined,
  yName: string | undefined
) {
  const axisId = `g-${gridId.split("-")[1]}-0`;

  const xAxis = {
    id: axisId,
    gridId,
    type: "category",
    name: `${xName || "x"} →`,
    show: true,
    axisLine: { show: false },
  };

  const yAxis = {
    id: axisId,
    gridId,
    type: "value",
    name: `↑ ${yName || "y"}`,
    show: true,
    axisLine: { show: false },
  };

  return { xAxis, yAxis, axisId };
}
