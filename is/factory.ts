import type { FlatType } from "../_typeutil.ts";
import type { Predicate, PredicateType } from "./type.ts";
import {
  isAny,
  isArray,
  isMap,
  isRecord,
  isSet,
  isUndefined,
  type Primitive,
} from "./core.ts";
import {
  getPredicateMetadata,
  setPredicateMetadata,
  type WithMetadata,
} from "../metadata.ts";

/**
 * Return a type predicate function that returns `true` if the type of `x` is `T[]`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.ArrayOf(is.String);
 * const a: unknown = ["a", "b", "c"];
 * if (isMyType(a)) {
 *   // a is narrowed to string[]
 *   const _: string[] = a;
 * }
 * ```
 */
export function isArrayOf<T>(
  pred: Predicate<T>,
): Predicate<T[]> & WithMetadata<IsArrayOfMetadata> {
  return setPredicateMetadata(
    (x: unknown): x is T[] => isArray(x) && x.every(pred),
    { name: "isArrayOf", args: [pred] },
  );
}

type IsArrayOfMetadata = {
  name: "isArrayOf";
  args: Parameters<typeof isArrayOf>;
};

/**
 * Return a type predicate function that returns `true` if the type of `x` is `Set<T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.SetOf(is.String);
 * const a: unknown = new Set(["a", "b", "c"]);
 * if (isMyType(a)) {
 *   // a is narrowed to Set<string>
 *   const _: Set<string> = a;
 * }
 * ```
 */
export function isSetOf<T>(
  pred: Predicate<T>,
): Predicate<Set<T>> & WithMetadata<IsSetOfMetadata> {
  return setPredicateMetadata(
    (x: unknown): x is Set<T> => {
      if (!isSet(x)) return false;
      for (const v of x.values()) {
        if (!pred(v)) return false;
      }
      return true;
    },
    { name: "isSetOf", args: [pred] },
  );
}

type IsSetOfMetadata = {
  name: "isSetOf";
  args: Parameters<typeof isSetOf>;
};

/**
 * Return a type predicate function that returns `true` if the type of `x` is `TupleOf<T>` or `TupleOf<T, E>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.TupleOf([is.Number, is.String, is.Boolean]);
 * const a: unknown = [0, "a", true];
 * if (isMyType(a)) {
 *   // a is narrowed to [number, string, boolean]
 *   const _: [number, string, boolean] = a;
 * }
 * ```
 *
 * With `predElse`:
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.TupleOf(
 *   [is.Number, is.String, is.Boolean],
 *   is.ArrayOf(is.Number),
 * );
 * const a: unknown = [0, "a", true, 0, 1, 2];
 * if (isMyType(a)) {
 *   // a is narrowed to [number, string, boolean, ...number[]]
 *   const _: [number, string, boolean, ...number[]] = a;
 * }
 * ```
 *
 * Depending on the version of TypeScript and how values are provided, it may be necessary to add `as const` to the array
 * used as `predTup`. If a type error occurs, try adding `as const` as follows:
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const predTup = [is.Number, is.String, is.Boolean] as const;
 * const isMyType = is.TupleOf(predTup);
 * const a: unknown = [0, "a", true];
 * if (isMyType(a)) {
 *   // a is narrowed to [number, string, boolean]
 *   const _: [number, string, boolean] = a;
 * }
 * ```
 */
export function isTupleOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
>(
  predTup: T,
): Predicate<TupleOf<T>> & WithMetadata<IsTupleOfMetadata>;
export function isTupleOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
  E extends Predicate<unknown[]>,
>(
  predTup: T,
  predElse: E,
):
  & Predicate<[...TupleOf<T>, ...PredicateType<E>]>
  & WithMetadata<IsTupleOfMetadata>;
export function isTupleOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
  E extends Predicate<unknown[]>,
>(
  predTup: T,
  predElse?: E,
):
  & Predicate<TupleOf<T> | [...TupleOf<T>, ...PredicateType<E>]>
  & WithMetadata<IsTupleOfMetadata> {
  if (!predElse) {
    return setPredicateMetadata(
      (x: unknown): x is TupleOf<T> => {
        if (!isArray(x) || x.length !== predTup.length) {
          return false;
        }
        return predTup.every((pred, i) => pred(x[i]));
      },
      { name: "isTupleOf", args: [predTup] },
    );
  } else {
    return setPredicateMetadata(
      (x: unknown): x is [...TupleOf<T>, ...PredicateType<E>] => {
        if (!isArray(x) || x.length < predTup.length) {
          return false;
        }
        const head = x.slice(0, predTup.length);
        const tail = x.slice(predTup.length);
        return predTup.every((pred, i) => pred(head[i])) && predElse(tail);
      },
      { name: "isTupleOf", args: [predTup, predElse] },
    );
  }
}

type TupleOf<T> = {
  -readonly [P in keyof T]: T[P] extends Predicate<infer U> ? U : never;
};

type IsTupleOfMetadata = {
  name: "isTupleOf";
  args: [Parameters<typeof isTupleOf>[0], Parameters<typeof isTupleOf>[1]?];
};

/**
 * Return a type predicate function that returns `true` if the type of `x` is `ReadonlyTupleOf<T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.ReadonlyTupleOf([is.Number, is.String, is.Boolean]);
 * const a: unknown = [0, "a", true];
 * if (isMyType(a)) {
 *   // a is narrowed to readonly [number, string, boolean]
 *   const _: readonly [number, string, boolean] = a;
 * }
 * ```
 *
 * With `predElse`:
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.ReadonlyTupleOf(
 *   [is.Number, is.String, is.Boolean],
 *   is.ArrayOf(is.Number),
 * );
 * const a: unknown = [0, "a", true, 0, 1, 2];
 * if (isMyType(a)) {
 *   // a is narrowed to readonly [number, string, boolean, ...number[]]
 *   const _: readonly [number, string, boolean, ...number[]] = a;
 * }
 * ```
 *
 * Depending on the version of TypeScript and how values are provided, it may be necessary to add `as const` to the array
 * used as `predTup`. If a type error occurs, try adding `as const` as follows:
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const predTup = [is.Number, is.String, is.Boolean] as const;
 * const isMyType = is.ReadonlyTupleOf(predTup);
 * const a: unknown = [0, "a", true];
 * if (isMyType(a)) {
 *   // a is narrowed to readonly [number, string, boolean]
 *   const _: readonly [number, string, boolean] = a;
 * }
 * ```
 */
export function isReadonlyTupleOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
>(
  predTup: T,
): Predicate<ReadonlyTupleOf<T>> & WithMetadata<IsReadonlyTupleOfMetadata>;
export function isReadonlyTupleOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
  E extends Predicate<unknown[]>,
>(
  predTup: T,
  predElse: E,
):
  & Predicate<readonly [...ReadonlyTupleOf<T>, ...PredicateType<E>]>
  & WithMetadata<IsReadonlyTupleOfMetadata>;
export function isReadonlyTupleOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
  E extends Predicate<unknown[]>,
>(
  predTup: T,
  predElse?: E,
):
  & Predicate<
    ReadonlyTupleOf<T> | readonly [...ReadonlyTupleOf<T>, ...PredicateType<E>]
  >
  & WithMetadata<IsReadonlyTupleOfMetadata> {
  if (!predElse) {
    return setPredicateMetadata(
      isTupleOf(predTup) as Predicate<ReadonlyTupleOf<T>>,
      { name: "isReadonlyTupleOf", args: [predTup] },
    );
  } else {
    return setPredicateMetadata(
      isTupleOf(predTup, predElse) as unknown as Predicate<
        readonly [...ReadonlyTupleOf<T>, ...PredicateType<E>]
      >,
      { name: "isReadonlyTupleOf", args: [predTup, predElse] },
    );
  }
}

type ReadonlyTupleOf<T> = {
  [P in keyof T]: T[P] extends Predicate<infer U> ? U : never;
};

type IsReadonlyTupleOfMetadata = {
  name: "isReadonlyTupleOf";
  args: [
    Parameters<typeof isReadonlyTupleOf>[0],
    Parameters<typeof isReadonlyTupleOf>[1]?,
  ];
};

/**
 * Return a type predicate function that returns `true` if the type of `x` is `UniformTupleOf<T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.UniformTupleOf(5);
 * const a: unknown = [0, 1, 2, 3, 4];
 * if (isMyType(a)) {
 *   // a is narrowed to [unknown, unknown, unknown, unknown, unknown]
 *   const _: [unknown, unknown, unknown, unknown, unknown] = a;
 * }
 * ```
 *
 * With predicate function:
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.UniformTupleOf(5, is.Number);
 * const a: unknown = [0, 1, 2, 3, 4];
 * if (isMyType(a)) {
 *   // a is narrowed to [number, number, number, number, number]
 *   const _: [number, number, number, number, number] = a;
 * }
 * ```
 */
export function isUniformTupleOf<T, N extends number>(
  n: N,
  pred: Predicate<T> = isAny,
): Predicate<UniformTupleOf<T, N>> & WithMetadata<IsUniformTupleOfMetadata> {
  return setPredicateMetadata(
    (x: unknown): x is UniformTupleOf<T, N> => {
      if (!isArray(x) || x.length !== n) {
        return false;
      }
      return x.every((v) => pred(v));
    },
    { name: "isUniformTupleOf", args: [n, pred] },
  );
}

// https://stackoverflow.com/a/71700658/1273406
type UniformTupleOf<
  T,
  N extends number,
  R extends readonly T[] = [],
> = R["length"] extends N ? R : UniformTupleOf<T, N, [T, ...R]>;

type IsUniformTupleOfMetadata = {
  name: "isUniformTupleOf";
  args: Parameters<typeof isUniformTupleOf>;
};

/**
 * Return a type predicate function that returns `true` if the type of `x` is `ReadonlyUniformTupleOf<T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.ReadonlyUniformTupleOf(5);
 * const a: unknown = [0, 1, 2, 3, 4];
 * if (isMyType(a)) {
 *   // a is narrowed to readonly [unknown, unknown, unknown, unknown, unknown]
 *   const _: readonly [unknown, unknown, unknown, unknown, unknown] = a;
 * }
 * ```
 *
 * With predicate function:
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.ReadonlyUniformTupleOf(5, is.Number);
 * const a: unknown = [0, 1, 2, 3, 4];
 * if (isMyType(a)) {
 *   // a is narrowed to readonly [number, number, number, number, number]
 *   const _: readonly [number, number, number, number, number] = a;
 * }
 * ```
 */
export function isReadonlyUniformTupleOf<T, N extends number>(
  n: N,
  pred: Predicate<T> = isAny,
):
  & Predicate<ReadonlyUniformTupleOf<T, N>>
  & WithMetadata<IsReadonlyUniformTupleOfMetadata> {
  return setPredicateMetadata(
    isUniformTupleOf(n, pred) as Predicate<ReadonlyUniformTupleOf<T, N>>,
    { name: "isReadonlyUniformTupleOf", args: [n, pred] },
  );
}

type ReadonlyUniformTupleOf<
  T,
  N extends number,
  R extends readonly T[] = [],
> = R["length"] extends N ? R
  : ReadonlyUniformTupleOf<T, N, readonly [T, ...R]>;

type IsReadonlyUniformTupleOfMetadata = {
  name: "isReadonlyUniformTupleOf";
  args: Parameters<typeof isReadonlyUniformTupleOf>;
};

/**
 * Return a type predicate function that returns `true` if the type of `x` is `Record<K, T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.RecordOf(is.Number);
 * const a: unknown = {"a": 0, "b": 1};
 * if (isMyType(a)) {
 *   // a is narrowed to Record<PropertyKey, number>
 *   const _: Record<PropertyKey, number> = a;
 * }
 * ```
 *
 * With predicate function for keys:
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.RecordOf(is.Number, is.String);
 * const a: unknown = {"a": 0, "b": 1};
 * if (isMyType(a)) {
 *   // a is narrowed to Record<string, number>
 *   const _: Record<string, number> = a;
 * }
 * ```
 */
export function isRecordOf<T, K extends PropertyKey = PropertyKey>(
  pred: Predicate<T>,
  predKey?: Predicate<K>,
): Predicate<Record<K, T>> & WithMetadata<IsRecordOfMetadata> {
  return setPredicateMetadata(
    (x: unknown): x is Record<K, T> => {
      if (!isRecord(x)) return false;
      for (const k in x) {
        if (!pred(x[k])) return false;
        if (predKey && !predKey(k)) return false;
      }
      return true;
    },
    { name: "isRecordOf", args: [pred, predKey] },
  );
}

type IsRecordOfMetadata = {
  name: "isRecordOf";
  args: Parameters<typeof isRecordOf>;
};

/**
 * Return a type predicate function that returns `true` if the type of `x` is `Map<K, T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.MapOf(is.Number);
 * const a: unknown = new Map([["a", 0], ["b", 1]]);
 * if (isMyType(a)) {
 *   // a is narrowed to Map<unknown, number>
 *   const _: Map<unknown, number> = a;
 * }
 * ```
 *
 * With predicate function for keys:
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.MapOf(is.Number, is.String);
 * const a: unknown = new Map([["a", 0], ["b", 1]]);
 * if (isMyType(a)) {
 *   // a is narrowed to Map<string, number>
 *   const _: Map<string, number> = a;
 * }
 * ```
 */
export function isMapOf<T, K>(
  pred: Predicate<T>,
  predKey?: Predicate<K>,
): Predicate<Map<K, T>> & WithMetadata<IsMapOfMetadata> {
  return setPredicateMetadata(
    (x: unknown): x is Map<K, T> => {
      if (!isMap(x)) return false;
      for (const entry of x.entries()) {
        const [k, v] = entry;
        if (!pred(v)) return false;
        if (predKey && !predKey(k)) return false;
      }
      return true;
    },
    { name: "isMapOf", args: [pred, predKey] },
  );
}

type IsMapOfMetadata = {
  name: "isMapOf";
  args: Parameters<typeof isMapOf>;
};

/**
 * Return a type predicate function that returns `true` if the type of `x` is `ObjectOf<T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * If `is.OptionalOf()` is specified in the predicate function, the property becomes optional.
 *
 * The number of keys of `x` must be greater than or equal to the number of keys of `predObj`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.ObjectOf({
 *   a: is.Number,
 *   b: is.String,
 *   c: is.OptionalOf(is.Boolean),
 * });
 * const a: unknown = { a: 0, b: "a", other: "other" };
 * if (isMyType(a)) {
 *   // "other" key in `a` is ignored because of `options.strict` is `false`.
 *   // a is narrowed to { a: number; b: string; c?: boolean | undefined }
 *   const _: { a: number; b: string; c?: boolean | undefined } = a;
 * }
 * ```
 *
 * The `option.strict` is deprecated. Use `isStrictOf()` instead.
 */
export function isObjectOf<
  T extends Record<PropertyKey, Predicate<unknown>>,
>(
  predObj: T,
  options?: { strict?: boolean },
): Predicate<ObjectOf<T>> & WithMetadata<IsObjectOfMetadata> {
  if (options?.strict) {
    // deno-lint-ignore no-explicit-any
    return isStrictOf(isObjectOf(predObj)) as any;
  }
  return setPredicateMetadata(
    (x: unknown): x is ObjectOf<T> => {
      if (!isRecord(x)) return false;
      for (const k in predObj) {
        if (!predObj[k](x[k])) return false;
      }
      return true;
    },
    { name: "isObjectOf", args: [predObj] },
  );
}

type Optional = {
  optional: true;
};

type ObjectOf<T extends Record<PropertyKey, Predicate<unknown>>> = FlatType<
  // Non optional
  & {
    [K in keyof T as T[K] extends Optional ? never : K]: T[K] extends
      Predicate<infer U> ? U : never;
  }
  // Optional
  & {
    [K in keyof T as T[K] extends Optional ? K : never]?: T[K] extends
      Predicate<infer U> ? U : never;
  }
>;

export type IsObjectOfMetadata = {
  name: "isObjectOf";
  args: [Parameters<typeof isObjectOf>[0]];
};

/**
 * Return a type predicate function that returns `true` if the type of `x` is `T` or `undefined`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.OptionalOf(is.String);
 * const a: unknown = "a";
 * if (isMyType(a)) {
 *   // a is narrowed to string | undefined
 *   const _: string | undefined = a;
 * }
 * ```
 */
export function isOptionalOf<T>(
  pred: Predicate<T>,
): Predicate<T | undefined> & Optional & WithMetadata<IsOptionalOfMetadata> {
  if ((pred as Partial<Optional>).optional) {
    return pred as
      & Predicate<T | undefined>
      & Optional
      & WithMetadata<IsOptionalOfMetadata>;
  }
  return Object.defineProperties(
    setPredicateMetadata(
      (x: unknown): x is Predicate<T | undefined> => isUndefined(x) || pred(x),
      { name: "isOptionalOf", args: [pred] },
    ),
    { optional: { value: true as const } },
  ) as Predicate<T | undefined> & Optional & WithMetadata<IsOptionalOfMetadata>;
}

type IsOptionalOfMetadata = {
  name: "isOptionalOf";
  args: Parameters<typeof isOptionalOf>;
};

/**
 * Return a type predicate function that returns `true` if the type of `x` is strictly follow the `ObjectOf<T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * If `is.OptionalOf()` is specified in the predicate function, the property becomes optional.
 *
 * The number of keys of `x` must be equal to the number of non optional keys of `predObj`. This is equivalent to
 * the deprecated `options.strict` in `isObjectOf()`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.StrictOf(is.ObjectOf({
 *   a: is.Number,
 *   b: is.String,
 *   c: is.OptionalOf(is.Boolean),
 * }));
 * const a: unknown = { a: 0, b: "a", other: "other" };
 * if (isMyType(a)) {
 *   // This block will not be executed because of "other" key in `a`.
 * }
 * ```
 */
export function isStrictOf<T extends Record<PropertyKey, unknown>>(
  pred:
    & Predicate<T>
    & WithMetadata<IsObjectOfMetadata>,
):
  & Predicate<T>
  & WithMetadata<IsStrictOfMetadata> {
  const { args } = getPredicateMetadata(pred);
  const s = new Set(Object.keys(args[0]));
  return setPredicateMetadata(
    (x: unknown): x is T => {
      if (!pred(x)) return false;
      // deno-lint-ignore no-explicit-any
      const ks = Object.keys(x as any);
      return ks.length <= s.size && ks.every((k) => s.has(k));
    },
    { name: "isStrictOf", args: [pred] },
  );
}

type IsStrictOfMetadata = {
  name: "isStrictOf";
  args: Parameters<typeof isStrictOf>;
};

/**
 * Return `true` if the type of `x` is instance of `ctor`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.InstanceOf(Date);
 * const a: unknown = new Date();
 * if (isMyType(a)) {
 *   // a is narrowed to Date
 *   const _: Date = a;
 * }
 * ```
 */
// deno-lint-ignore no-explicit-any
export function isInstanceOf<T extends new (...args: any) => unknown>(
  ctor: T,
): Predicate<InstanceType<T>> & WithMetadata<IsInstanceOfMetadata> {
  return setPredicateMetadata(
    (x: unknown): x is InstanceType<T> => x instanceof ctor,
    { name: "isInstanceOf", args: [ctor] },
  );
}

type IsInstanceOfMetadata = {
  name: "isInstanceOf";
  args: Parameters<typeof isInstanceOf>;
};

/**
 * Return a type predicate function that returns `true` if the type of `x` is a literal type of `pred`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.LiteralOf("hello");
 * const a: unknown = "hello";
 * if (isMyType(a)) {
 *   // a is narrowed to "hello"
 *   const _: "hello" = a;
 * }
 * ```
 */
export function isLiteralOf<T extends Primitive>(
  literal: T,
): Predicate<T> & WithMetadata<IsLiteralOfMetadata> {
  return setPredicateMetadata(
    (x: unknown): x is T => x === literal,
    { name: "isLiteralOf", args: [literal] },
  );
}

type IsLiteralOfMetadata = {
  name: "isLiteralOf";
  args: Parameters<typeof isLiteralOf>;
};

/**
 * Return a type predicate function that returns `true` if the type of `x` is one of literal type in `preds`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.LiteralOneOf(["hello", "world"] as const);
 * const a: unknown = "hello";
 * if (isMyType(a)) {
 *   // a is narrowed to "hello" | "world"
 *   const _: "hello" | "world" = a;
 * }
 * ```
 */
export function isLiteralOneOf<T extends readonly Primitive[]>(
  literals: T,
): Predicate<T[number]> & WithMetadata<IsLiteralOneOfMetadata> {
  const s = new Set(literals);
  return setPredicateMetadata(
    (x: unknown): x is T[number] => s.has(x as T[number]),
    { name: "isLiteralOneOf", args: [literals] },
  );
}

type IsLiteralOneOfMetadata = {
  name: "isLiteralOneOf";
  args: Parameters<typeof isLiteralOneOf>;
};

export default {
  ArrayOf: isArrayOf,
  InstanceOf: isInstanceOf,
  LiteralOf: isLiteralOf,
  LiteralOneOf: isLiteralOneOf,
  MapOf: isMapOf,
  ObjectOf: isObjectOf,
  OptionalOf: isOptionalOf,
  ReadonlyTupleOf: isReadonlyTupleOf,
  ReadonlyUniformTupleOf: isReadonlyUniformTupleOf,
  RecordOf: isRecordOf,
  SetOf: isSetOf,
  StrictOf: isStrictOf,
  TupleOf: isTupleOf,
  UniformTupleOf: isUniformTupleOf,
};
