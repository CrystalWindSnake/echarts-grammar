/**
 * 构建 filter transform dataset config
 */
export function buildTransformDataset(
  id: string,
  field: string,
  value: any,
  rawIndex: number
) {
  return {
    id,
    transform: {
      type: "filter",
      config: { dimension: field, "=": value },
    },
    fromDatasetIndex: rawIndex,
  };
}
