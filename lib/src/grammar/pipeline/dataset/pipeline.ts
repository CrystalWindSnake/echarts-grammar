import {
  DatasetDef,
  DatasetSource,
  DatasetFrom,
  DatasetTransform,
} from "./types";
import { normalizeDataSource } from "./normalizer";
import { DataSource } from "@/grammar/core/types";
import { Primitive } from "@/grammar/core/types/base";
import { filterTransform } from "./transforms";

export class DataPipeline {
  private idCounter = 0;

  /** unified dataset container */
  private datasets: Map<string, DatasetDef> = new Map();

  /** DataSource -> datasetId cache */
  private sourceCache = new WeakMap<object, string>();

  private nextDatasetId(): string {
    this.idCounter += 1;
    return `ds_${this.idCounter}`;
  }

  public getDatasetSource(id: string): DatasetSource {
    return this.datasets.get(id) as DatasetSource;
  }

  public createDatasetFromSource(source: DataSource): string {
    if (this.sourceCache.has(source as any)) {
      return this.sourceCache.get(source as any)!;
    }

    const normalized = normalizeDataSource(source);
    const id = this.nextDatasetId();

    const dataset: DatasetSource = {
      id,
      dimensions: normalized.dimensions,
      source: normalized.rows,
    };

    this.datasets.set(id, dataset);
    this.sourceCache.set(source as any, id);

    return id;
  }

  public addTransform(
    fromDatasetId: string,
    transform: DatasetTransform | DatasetTransform[]
  ): string {
    const id = this.nextDatasetId();

    const dataset: DatasetFrom = {
      id,
      fromDatasetId,
      transform,
    };

    this.datasets.set(id, dataset);
    return id;
  }

  public groupByDistinct(
    fromDatasetId: string,
    field: string
  ): Map<Primitive, string> {
    const base = this.datasets.get(fromDatasetId);

    if (!base || !(base as DatasetSource).dimensions) {
      throw new Error("groupByDistinct requires a source dataset");
    }

    const baseSource = base as DatasetSource;

    const idx = baseSource.dimensions.indexOf(field);
    if (idx === -1) {
      throw new Error(`Field not found: ${field}`);
    }

    const groups = new Map<Primitive, Primitive[][]>();

    for (const row of baseSource.source) {
      const key = row[idx];
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(row);
    }

    const duplicatedDataset: DatasetSource = {
      id: this.nextDatasetId(),
      dimensions: baseSource.dimensions,
      source: [...groups.values()].flat(1),
    };
    this.datasets.set(duplicatedDataset.id, duplicatedDataset);

    const result = new Map<Primitive, string>();

    for (const key of groups.keys()) {
      const id = this.addTransform(
        duplicatedDataset.id,
        filterTransform(field, "=", key)
      );

      result.set(key, id);
    }

    return result;
  }

  public exportDatasets(): any[] {
    return Array.from(this.datasets.values());
  }
}
