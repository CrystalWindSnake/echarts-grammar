import { genGridId } from "@/core/id-generator";

export function buildGrid() {
  const id = genGridId();
  return {
    id,
    grid: {
      id,
    },
  };
}
