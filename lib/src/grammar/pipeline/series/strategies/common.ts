import { SeriesBuildContext } from "@/grammar/core/types";
import { AxisCollector } from "@/options-builder";

export function newXCategoryAxis(ctx: {
  axisCollector: AxisCollector;
  gridId: string;
  axisShard: boolean;
  x: string;
  matrixCtx: SeriesBuildContext["matrixCtx"];
}) {
  const { axisCollector, gridId, axisShard, x } = ctx;

  return axisCollector.newAxisWithReuse(
    {
      type: "category",
      gridId,
    },
    (e) =>
      e.gridId === gridId &&
      (axisShard || (e as unknown as { encode: { x: string } }).encode.x === x),
  );
}

export function newXValueAxis(ctx: {
  axisCollector: AxisCollector;
  gridId: string;
  axisShard: boolean;
  x: string;
  matrixCtx: SeriesBuildContext["matrixCtx"];
}) {
  const { axisCollector, gridId, axisShard, x } = ctx;

  return axisCollector.newAxisWithReuse(
    {
      type: "value",
      gridId,
    },
    (e) =>
      e.gridId === gridId &&
      (axisShard || (e as unknown as { encode: { x: string } }).encode.x === x),
  );
}

export function newYCategoryAxis(ctx: {
  axisCollector: AxisCollector;
  gridId: string;
  axisShard: boolean;
  y: string;
  matrixCtx: SeriesBuildContext["matrixCtx"];
}) {
  const { axisCollector, gridId, axisShard, y } = ctx;

  return axisCollector.newAxisWithReuse(
    {
      type: "category",
      gridId,
    },
    (e) =>
      e.gridId === gridId &&
      (axisShard || (e as unknown as { encode: { y: string } }).encode.y === y),
  );
}

export function newYValueAxis(ctx: {
  axisCollector: AxisCollector;
  gridId: string;
  axisShard: boolean;
  y: string;
  matrixCtx: SeriesBuildContext["matrixCtx"];
}) {
  const { axisCollector, gridId, axisShard, y } = ctx;

  return axisCollector.newAxisWithReuse(
    {
      type: "value",
      gridId,
    },
    (e) =>
      e.gridId === gridId &&
      (axisShard || (e as unknown as { encode: { y: string } }).encode.y === y),
  );
}

export function encodeTooltip(tooltip: string | string[] | undefined) {
  return tooltip && { tooltip: tooltip };
}
