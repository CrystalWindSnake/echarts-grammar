import { DatasetSourceWithDim } from "@/types";

export function* iterValuesByColor(
  data: DatasetSourceWithDim,
  color: string | undefined
) {
  if (!color) {
    yield undefined;
    return;
  }

  const colorIndex = data.dimensions.indexOf(color);
  if (colorIndex === -1) throw new Error(`Invalid color field: ${color}`);
  const valueSet = new Set();
  for (const row of data.source) {
    const colorValue = row[colorIndex];
    if (valueSet.has(colorValue)) {
      continue;
    }
    valueSet.add(colorValue);
    yield colorValue;
  }
}

export function useEncodeLabel(
  label: string | string[] | undefined,
  labelConfig: Record<string, any>
) {
  const labelConfigResult = label ? labelConfig : undefined;

  const encodeLabelConfig = label
    ? {
        label,
      }
    : undefined;

  return {
    labelConfig: labelConfigResult,
    encodeLabelConfig,
  };
}

export function useEncodeTooltip(tooltip: string | string[] | undefined) {
  const encodeTooltipConfig = tooltip
    ? {
        tooltip,
      }
    : undefined;

  return {
    encodeTooltipConfig,
  };
}
