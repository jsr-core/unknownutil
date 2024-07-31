export type FlatType<T> = T extends Record<PropertyKey, unknown>
  ? { [K in keyof T]: FlatType<T[K]> }
  : T;

export type TupleToIntersection<T> = T extends readonly [] ? never
  : T extends readonly [infer U] ? U
  : T extends readonly [infer U, ...infer R] ? U & TupleToIntersection<R>
  : never;
