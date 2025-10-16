import { EChartsOption } from "echarts";
import {
  merge as _merge,
  mergeWith as _mergeWith,
  isArray,
  isPlainObject,
} from "lodash-es";

export function mergeEChartsOptions(
  orgOptions: EChartsOption,
  newOptions: EChartsOption | undefined | null
): EChartsOption {
  if (!newOptions) {
    return orgOptions;
  }

  return _mergeWith({}, orgOptions, newOptions, (objValue, srcValue) => {
    // org: { a: [{ b: 1 }, { b: 2 }] }
    // new: { a: { c: 2 } }
    // result: { a: [{ b: 1, c: 2 }, { b: 2, c: 2 }]
    if (isArray(objValue) && isPlainObject(srcValue)) {
      return objValue.map((item) => _merge({}, item, srcValue));
    }

    // use default merge for other cases
    return undefined;
  });
}
