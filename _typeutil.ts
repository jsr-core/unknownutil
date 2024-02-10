export type FlatType<T> = T extends Record<PropertyKey, unknown>
  ? { [K in keyof T]: FlatType<T[K]> }
  : T;

export type UnionToIntersection<U> =
  (U extends unknown ? (k: U) => void : never) extends ((k: infer I) => void)
    ? I
    : never;
