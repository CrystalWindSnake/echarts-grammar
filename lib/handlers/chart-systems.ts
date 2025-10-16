import { DatasetSourceWithDim, ColorFieldType } from "@/types";

export function* iterValuesByColor(
  data: DatasetSourceWithDim,
  color: string | undefined,
  colorType: ColorFieldType | undefined
) {
  if (!color || colorType === "value") {
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

export function useFieldType(options: {
  dataset: DatasetSourceWithDim;
  field: string;
}) {
  const { dataset, field } = options;
  const index = dataset.dimensions.indexOf(field);
  if (index === -1) {
    throw new Error(`Invalid color field: ${field}`);
  }

  const value = dataset.source[0][index];
  if (typeof value === "string") {
    return "category";
  }

  return "value";
}

export function getValuesRange(options: {
  dataset: DatasetSourceWithDim;
  field: string;
}) {
  const { dataset, field } = options;
  const index = dataset.dimensions.indexOf(field);
  if (index === -1) {
    throw new Error(`Invalid color field: ${field}`);
  }

  const values = dataset.source.map((row) => row[index]);
  const min = Math.min(...values);
  const max = Math.max(...values);

  return [min, max];
}

export function useXAxisBaseConfig(options: {
  xType: "category" | "value";
  xField: string;
}) {
  const { xType, xField } = options;
  return { type: xType, name: xField + " →" };
}

export function useYAxisBaseConfig(options: {
  yType: "category" | "value";
  yField: string;
}) {
  const { yType, yField } = options;
  return { type: yType, name: "↑ " + yField };
}

export function useSeriesName(info: {
  colorField?: string;
  colorValue: any;
}): string | undefined {
  const { colorField, colorValue } = info;

  if (!colorField) {
    return undefined;
  }
  return colorValue;
}
