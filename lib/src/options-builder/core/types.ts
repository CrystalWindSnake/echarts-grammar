export type Id = string;

export type ReusePredicate<T> = (existing: T) => boolean;

export interface CollectedWithIDItem<T> {
  id: Id;
  config: T;
}

export interface CollectedItem<T> {
  config: T;
}
