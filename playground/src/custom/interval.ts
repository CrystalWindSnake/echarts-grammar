import type {
  CustomRootElementOption,
  CustomSeriesRenderItem,
  CustomSeriesRenderItemParams,
  CustomSeriesRenderItemAPI,
} from "echarts/types/src/chart/custom/CustomSeries.d.ts";

export function intervalFn(
  params: CustomSeriesRenderItemParams,
  api: CustomSeriesRenderItemAPI,
) {
  const { encode } = params;

  const x = api.value(encode.x[0]);

  const [valueStart, valueEnd] =
    encode.y.length === 1
      ? [0, api.value(encode.y[0])]
      : [api.value(encode.y[0]), api.value(encode.y[1])];

  const coordStart = api.coord([x, valueStart]);
  const coordEnd = api.coord([x, valueEnd]);

  // 一个类目宽度（像素）
  const bandWidth = api.coord([1, 0])[0] - api.coord([0, 0])[0];

  // series 维度信息
  const payload = (params.itemPayload ?? {}) as Record<string, any>;
  const colorCount = Math.max(1, payload.colorCount ?? 1);
  const colorIndex = Math.min(
    colorCount - 1,
    Math.max(0, payload.colorIndex ?? 0),
  );

  // 你可以把这个当成 barCategoryGap
  const groupRatio = 0.5;
  const groupWidth = bandWidth * groupRatio;

  // 每根柱子的宽度（不做间隔版本）
  const barWidth = groupWidth / colorCount;

  // 类目中心 x
  const centerX = coordStart[0];

  // group 的最左边 x
  const groupLeftX = centerX - groupWidth / 2;

  // 当前柱子 x
  const barX = groupLeftX + colorIndex * barWidth;

  // y/height 修正（确保 height >= 0）
  const yTop = Math.min(coordStart[1], coordEnd[1]);
  const yBottom = Math.max(coordStart[1], coordEnd[1]);
  const height = yBottom - yTop;

  const bar = {
    type: "rect",
    shape: {
      x: barX,
      y: yTop,
      width: barWidth,
      height,
    },
    style: {
      fill: api.visual("color"),
    },
  };

  return bar as CustomRootElementOption;
}
