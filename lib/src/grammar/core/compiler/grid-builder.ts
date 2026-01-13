import { genGridId } from "@/grammar/core/id-generator";

export function buildGrid() {
  const id = genGridId();
  return {
    id,
    grid: {
      id,
    },
  };
}
