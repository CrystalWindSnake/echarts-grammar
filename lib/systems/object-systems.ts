export function isEmptyObject(obj: any) {
  return obj && typeof obj === "object" && Object.keys(obj).length === 0;
}
