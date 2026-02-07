export type Id = string;

export type ReusePredicate<T> = (existing: T) => boolean;

export interface CollectedItem<T> {
  id: Id;
  config: T;
}
