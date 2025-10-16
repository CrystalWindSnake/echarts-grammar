import type { EChartsOption } from "echarts";
import {
  GrammarConfig,
  NormalizedGrammarConfig,
  Dataset,
  DatasetSourceWithDim,
} from "@/types";
import { processMark } from "@/handlers";
import { GrammarToEchartsConverter } from "@/grammar-to-echarts-tools";
import * as consts from "@/consts";
import * as echartsSystems from "@/systems/echarts-systems";

const defaultEChartsOptions: EChartsOption = {
  tooltip: {
    trigger: "axis",
  },
};

export function convertToECharts(config: GrammarConfig): EChartsOption {
  const normalizedConfig = normalizeGrammarConfig(config);
  const { marks } = normalizedConfig;

  const echartsConverter = new GrammarToEchartsConverter(normalizedConfig);

  marks.forEach((mark) =>
    processMark(mark, normalizedConfig, echartsConverter)
  );

  const baseOptions = echartsSystems.mergeEChartsOptions(
    echartsConverter.toEChartsOption(),
    defaultEChartsOptions
  );

  return echartsSystems.mergeEChartsOptions(baseOptions, config.echartsOptions);
}

function normalizeGrammarConfig(
  config: GrammarConfig
): NormalizedGrammarConfig {
  const { data: defaultData, facet, marks, echartsOptions } = config;
  const normalizedDefaultData = defaultData
    ? normalizeDatasetSource(defaultData)
    : defaultData;

  const facetRecord = {
    data: null as DatasetSourceWithDim | null,
    row: null as string | undefined | null,
    column: null as string | undefined | null,
  };

  const normalizedMarks = marks.map((mark) => {
    const data = mark.data ??
      normalizedDefaultData ?? { dimensions: [], source: [] };
    if (!data) {
      throw new Error("Mark is missing data and no dataset is available");
    }

    const normalizedData = normalizeDatasetSource(data);

    const markFacet = mark.facet ?? facet;
    if (facetRecord.row === null) {
      facetRecord.row = markFacet?.row;
    } else if (markFacet && facetRecord.row !== markFacet.row) {
      throw new Error("Facet row is not consistent");
    }

    if (facetRecord.column === null) {
      facetRecord.column = markFacet?.column;
    } else if (markFacet && facetRecord.column !== markFacet?.column) {
      throw new Error("Facet column is not consistent");
    }

    if (facetRecord.data === null) {
      facetRecord.data = normalizedData;
    }

    return {
      ...mark,
      data: normalizedData,
      facet: markFacet,
    };
  });

  const facetInfo = {
    rowValues: [consts.matrix_data_default],
    columnValues: [consts.matrix_data_default],
  };

  if (facetRecord.row || facetRecord.column) {
    const facetData = facetRecord.data!;

    if (facetRecord.row) {
      const index = facetData.dimensions.indexOf(facetRecord.row!);
      facetInfo.rowValues = Array.from(
        new Set(facetData.source.map((row) => row[index]))
      );
    }

    if (facetRecord.column) {
      const index = facetData.dimensions.indexOf(facetRecord.column!);
      facetInfo.columnValues = Array.from(
        new Set(facetData.source.map((row) => row[index]))
      );
    }
  }

  return {
    facetInfo,
    marks: normalizedMarks,
    echartsOptions,
  };
}

function normalizeDatasetSource(source: Dataset): DatasetSourceWithDim {
  const sourceData = typeof source === "function" ? source() : source;

  if (Array.isArray(sourceData)) {
    if (sourceData.length === 0) {
      return { dimensions: [], source: [] };
    }

    const dimensions = Object.keys(sourceData[0]);
    const data = sourceData.map((row) => Object.values(row));
    return { dimensions, source: data };
  }

  return sourceData;
}
