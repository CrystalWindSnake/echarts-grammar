import { CollectedWithIDItem, CollectedItem, ReusePredicate } from "./types";
import { IdGenerator } from "./id-generator";

export abstract class CollectorWithIdBase<TConfig> {
  protected readonly items: CollectedWithIDItem<TConfig>[] = [];
  protected readonly idGen: IdGenerator;

  constructor(prefix: string) {
    this.idGen = new IdGenerator(prefix);
  }

  protected create(
    config: TConfig,
    reuse?: ReusePredicate<TConfig>,
  ): CollectedWithIDItem<TConfig> {
    if (reuse) {
      const found = this.items.find((i) => reuse(i.config));
      if (found) return found;
    }

    const id = this.idGen.next();
    const item = { id, config: { ...config, id } };
    this.items.push(item);
    return item;
  }

  export(): TConfig[] {
    return this.items.map((i) => i.config);
  }
}

export abstract class CollectorBase<TConfig> {
  protected readonly items: CollectedItem<TConfig>[] = [];

  protected create(
    config: TConfig,
    reuse?: ReusePredicate<TConfig>,
  ): CollectedItem<TConfig> {
    if (reuse) {
      const found = this.items.find((i) => reuse(i.config));
      if (found) return found;
    }

    const item = { config };
    this.items.push(item);
    return item;
  }

  export(): TConfig[] {
    return this.items.map((i) => i.config);
  }
}
