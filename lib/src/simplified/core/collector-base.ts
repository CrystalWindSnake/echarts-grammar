import { CollectedItem, ReusePredicate } from "./types";
import { IdGenerator } from "./id-generator";

export abstract class CollectorBase<TConfig> {
  protected readonly items: CollectedItem<TConfig>[] = [];
  protected readonly idGen: IdGenerator;

  constructor(prefix: string) {
    this.idGen = new IdGenerator(prefix);
  }

  protected create(
    config: TConfig,
    reuse?: ReusePredicate<TConfig>,
  ): CollectedItem<TConfig> {
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
