export function buildFacetTransformDataset(
  id: string,
  conditions: Array<{ field: string; value: any }>,
  fromDatasetId: string
) {
  return {
    id,
    fromDatasetId,
    transform: {
      type: "filter",
      config: {
        and: conditions.map((c) => ({
          dimension: c.field,
          "=": c.value,
        })),
      },
    },
  };
}
