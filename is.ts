import type { FlatType, UnionToIntersection } from "./_typeutil.ts";
import {
  getPredicateMetadata,
  setPredicateMetadata,
  type WithMetadata,
} from "./metadata.ts";

const toString = Object.prototype.toString;

/**
 * A type predicate function.
 */
export type Predicate<T> = (x: unknown) => x is T;

/**
 * A type predicated by Predicate<T>.
 *
 * ```ts
 * import { is, type PredicateType } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isPerson = is.ObjectOf({
 *   name: is.String,
 *   age: is.Number,
 *   address: is.OptionalOf(is.String),
 * });
 *
 * type Person = PredicateType<typeof isPerson>;
 * // Above is equivalent to the following type
 * // type Person = {
 * //   name: string;
 * //   age: number;
 * //   address: string | undefined;
 * // };
 */
export type PredicateType<P> = P extends Predicate<infer T> ? T : never;

/**
 * Assume `x is `any` and always return `true` regardless of the type of `x`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a = "a";
 * if (is.Any(a)) {
 *   // a is narrowed to any
 *   const _: any = a;
 * }
 * ```
 */
// deno-lint-ignore no-explicit-any
export function isAny(_x: unknown): _x is any {
  return true;
}

/**
 * Assume `x` is `unknown` and always return `true` regardless of the type of `x`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a = "a";
 * if (is.Unknown(a)) {
 *   // a is narrowed to unknown
 *   const _: unknown = a;
 * }
 * ```
 */
export function isUnknown(_x: unknown): _x is unknown {
  return true;
}

/**
 * Return `true` if the type of `x` is `string`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = "a";
 * if (is.String(a)) {
 *   // a is narrowed to string
 *   const _: string = a;
 * }
 * ```
 */
export function isString(x: unknown): x is string {
  return typeof x === "string";
}

/**
 * Return `true` if the type of `x` is `number`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = 0;
 * if (is.Number(a)) {
 *   // a is narrowed to number
 *   const _: number = a;
 * }
 * ```
 */
export function isNumber(x: unknown): x is number {
  return typeof x === "number";
}

/**
 * Return `true` if the type of `x` is `bigint`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = 0n;
 * if (is.BigInt(a)) {
 *   // a is narrowed to bigint
 *   const _: bigint = a;
 * }
 * ```
 */
export function isBigInt(x: unknown): x is bigint {
  return typeof x === "bigint";
}

/**
 * Return `true` if the type of `x` is `boolean`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = true;
 * if (is.Boolean(a)) {
 *   // a is narrowed to boolean
 *   const _: boolean = a;
 * }
 * ```
 */
export function isBoolean(x: unknown): x is boolean {
  return typeof x === "boolean";
}

/**
 * Return `true` if the type of `x` is `unknown[]`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = [0, 1, 2];
 * if (is.Array(a)) {
 *   // a is narrowed to unknown[]
 *   const _: unknown[] = a;
 * }
 * ```
 */
export function isArray(x: unknown): x is unknown[] {
  return Array.isArray(x);
}

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
):
  & Predicate<T[]>
  & WithMetadata<IsArrayOfMetadata> {
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
 * Return `true` if the type of `x` is `Set<unknown>`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = new Set([0, 1, 2]);
 * if (is.Set(a)) {
 *   // a is narrowed to Set<unknown>
 *   const _: Set<unknown> = a;
 * }
 * ```
 */
export const isSet = Object.defineProperties(isInstanceOf(Set), {
  name: {
    value: "isSet",
  },
});

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
):
  & Predicate<Set<T>>
  & WithMetadata<IsSetOfMetadata> {
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
):
  & Predicate<TupleOf<T>>
  & WithMetadata<IsTupleOfMetadata>;
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

type IsTupleOfMetadata = {
  name: "isTupleOf";
  args: [Parameters<typeof isTupleOf>[0], Parameters<typeof isTupleOf>[1]?];
};

/**
 * Tuple type of types that are predicated by an array of predicate functions.
 *
 * ```ts
 * import { is, TupleOf } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * type A = TupleOf<readonly [typeof is.String, typeof is.Number]>;
 * // Above is equivalent to the following type
 * // type A = [string, number];
 * ```
 */
export type TupleOf<T> = {
  -readonly [P in keyof T]: T[P] extends Predicate<infer U> ? U : never;
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
):
  & Predicate<ReadonlyTupleOf<T>>
  & WithMetadata<IsReadonlyTupleOfMetadata>;
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
    const predInner = isTupleOf(predTup);
    return setPredicateMetadata(
      ((x) => predInner(x)) as Predicate<ReadonlyTupleOf<T>>,
      { name: "isReadonlyTupleOf", args: [predTup] },
    );
  } else {
    const predInner = isTupleOf(predTup, predElse);
    return setPredicateMetadata(
      ((x) => predInner(x)) as Predicate<
        readonly [...ReadonlyTupleOf<T>, ...PredicateType<E>]
      >,
      { name: "isReadonlyTupleOf", args: [predTup, predElse] },
    );
  }
}

type IsReadonlyTupleOfMetadata = {
  name: "isReadonlyTupleOf";
  args: [
    Parameters<typeof isReadonlyTupleOf>[0],
    Parameters<typeof isReadonlyTupleOf>[1]?,
  ];
};

/**
 * Readonly tuple type of types that are predicated by an array of predicate functions.
 *
 * ```ts
 * import { is, ReadonlyTupleOf } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * type A = ReadonlyTupleOf<readonly [typeof is.String, typeof is.Number]>;
 * // Above is equivalent to the following type
 * // type A = readonly [string, number];
 * ```
 */
export type ReadonlyTupleOf<T> = {
  [P in keyof T]: T[P] extends Predicate<infer U> ? U : never;
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
):
  & Predicate<UniformTupleOf<T, N>>
  & WithMetadata<IsUniformTupleOfMetadata> {
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

type IsUniformTupleOfMetadata = {
  name: "isUniformTupleOf";
  args: Parameters<typeof isUniformTupleOf>;
};

/**
 * Uniform tuple type of types that are predicated by a predicate function and the length is `N`.
 *
 * ```ts
 * import { is, UniformTupleOf } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * type A = UniformTupleOf<number, 5>;
 * // Above is equivalent to the following type
 * // type A = [number, number, number, number, number];
 * ```
 */
// https://stackoverflow.com/a/71700658/1273406
export type UniformTupleOf<
  T,
  N extends number,
  R extends readonly T[] = [],
> = R["length"] extends N ? R : UniformTupleOf<T, N, [T, ...R]>;

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
  const predInner = isUniformTupleOf(n, pred);
  return setPredicateMetadata(
    ((x) => predInner(x)) as Predicate<ReadonlyUniformTupleOf<T, N>>,
    { name: "isReadonlyUniformTupleOf", args: [n, pred] },
  );
}

type IsReadonlyUniformTupleOfMetadata = {
  name: "isReadonlyUniformTupleOf";
  args: Parameters<typeof isReadonlyUniformTupleOf>;
};

/**
 * Readonly uniform tuple type of types that are predicated by a predicate function `T` and the length is `N`.
 *
 * ```ts
 * import { is, ReadonlyUniformTupleOf } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * type A = ReadonlyUniformTupleOf<number, 5>;
 * // Above is equivalent to the following type
 * // type A = readonly [number, number, number, number, number];
 * ```
 */
export type ReadonlyUniformTupleOf<
  T,
  N extends number,
  R extends readonly T[] = [],
> = R["length"] extends N ? R
  : ReadonlyUniformTupleOf<T, N, readonly [T, ...R]>;

/**
 * Return `true` if the type of `x` is `Record<PropertyKey, unknown>`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = {"a": 0, "b": 1};
 * if (is.Record(a)) {
 *   // a is narrowed to Record<PropertyKey, unknown>
 *   const _: Record<PropertyKey, unknown> = a;
 * }
 * ```
 */
export function isRecord(
  x: unknown,
): x is Record<PropertyKey, unknown> {
  if (isNullish(x) || isArray(x) || isSet(x) || isMap(x)) {
    return false;
  }
  return typeof x === "object";
}

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
):
  & Predicate<Record<K, T>>
  & WithMetadata<IsRecordOfMetadata> {
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
 * Return `true` if the type of `x` is `Map<unknown, unknown>`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = new Map([["a", 0], ["b", 1]]);
 * if (is.Map(a)) {
 *   // a is narrowed to Map<unknown, unknown>
 *   const _: Map<unknown, unknown> = a;
 * }
 * ```
 */
export const isMap = Object.defineProperties(isInstanceOf(Map), {
  name: {
    value: "isMap",
  },
});

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
):
  & Predicate<Map<K, T>>
  & WithMetadata<IsMapOfMetadata> {
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
 *   // "other" key in `a` is ignored.
 *   // a is narrowed to { a: number; b: string; c?: boolean | undefined }
 *   const _: { a: number; b: string; c?: boolean | undefined } = a;
 * }
 * ```
 *
 * The `options.strict` is deprecated. Use `isStrictOf()` instead.
 */
export function isObjectOf<
  T extends Record<PropertyKey, Predicate<unknown>>,
>(
  predObj: T,
  { strict }: { strict?: boolean } = {},
): Predicate<ObjectOf<T>> & WithMetadata<IsObjectOfMetadata> {
  if (strict) {
    // For backward compatibility
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

type IsObjectOfMetadata = {
  name: "isObjectOf";
  args: [Parameters<typeof isObjectOf>[0]];
};

/**
 * Object types that are predicated by predicate functions in the object `T`.
 *
 * ```ts
 * import { is, ObjectOf } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * type A = ObjectOf<{ a: typeof is.Number, b: typeof is.String }>;
 * // Above is equivalent to the following type
 * // type A = { a: number; b: string };
 * ```
 */
export type ObjectOf<T extends Record<PropertyKey, Predicate<unknown>>> =
  FlatType<
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
):
  & Predicate<T | undefined>
  & Optional
  & WithMetadata<IsOptionalOfMetadata> {
  // Avoid duplicate wrapping
  if ((pred as Partial<Optional>).optional) {
    return pred as
      & Predicate<T | undefined>
      & Optional
      & WithMetadata<IsOptionalOfMetadata>;
  }
  return setPredicateMetadata(
    Object.defineProperties(
      (x: unknown): x is Predicate<T | undefined> => isUndefined(x) || pred(x),
      { optional: { value: true } },
    ) as Predicate<T | undefined> & Optional,
    { name: "isOptionalOf", args: [pred] },
  );
}

type IsOptionalOfMetadata = {
  name: "isOptionalOf";
  args: Parameters<typeof isOptionalOf>;
};

type Optional = {
  optional: true;
};

/**
 * Return `true` if the type of `x` is `function`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = () => {};
 * if (is.Function(a)) {
 *   // a is narrowed to (...args: unknown[]) => unknown
 *   const _: ((...args: unknown[]) => unknown) = a;
 * }
 * ```
 */
export function isFunction(x: unknown): x is (...args: unknown[]) => unknown {
  return x instanceof Function;
}

/**
 * Return `true` if the type of `x` is `function` (non async function).
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = () => {};
 * if (is.Function(a)) {
 *   // a is narrowed to (...args: unknown[]) => unknown
 *   const _: ((...args: unknown[]) => unknown) = a;
 * }
 * ```
 */
export function isSyncFunction(
  x: unknown,
): x is (...args: unknown[]) => unknown {
  return toString.call(x) === "[object Function]";
}

/**
 * Return `true` if the type of `x` is `function` (async function).
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = async () => {};
 * if (is.Function(a)) {
 *   // a is narrowed to (...args: unknown[]) => Promise<unknown>
 *   const _: ((...args: unknown[]) => unknown) = a;
 * }
 * ```
 */
export function isAsyncFunction(
  x: unknown,
): x is (...args: unknown[]) => Promise<unknown> {
  return toString.call(x) === "[object AsyncFunction]";
}

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
):
  & Predicate<InstanceType<T>>
  & WithMetadata<IsInstanceOfMetadata> {
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
 * Return `true` if the type of `x` is `null`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = null;
 * if (is.Null(a)) {
 *   // a is narrowed to null
 *   const _: null = a;
 * }
 * ```
 */
export function isNull(x: unknown): x is null {
  return x === null;
}

/**
 * Return `true` if the type of `x` is `undefined`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = undefined;
 * if (is.Undefined(a)) {
 *   // a is narrowed to undefined
 *   const _: undefined = a;
 * }
 * ```
 */
export function isUndefined(x: unknown): x is undefined {
  return typeof x === "undefined";
}

/**
 * Return `true` if the type of `x` is `null` or `undefined`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = null;
 * if (is.Nullish(a)) {
 *   // a is narrowed to null | undefined
 *   const _: (null | undefined) = a;
 * }
 * ```
 */
export function isNullish(x: unknown): x is null | undefined {
  return x == null;
}

/**
 * Return `true` if the type of `x` is `symbol`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = Symbol("symbol");
 * if (is.Symbol(a)) {
 *   // a is narrowed to symbol
 *   const _: symbol = a;
 * }
 * ```
 */
export function isSymbol(x: unknown): x is symbol {
  return typeof x === "symbol";
}

/**
 * Return `true` if the type of `x` is `Primitive`.
 *
 * ```ts
 * import { is, Primitive } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = 0;
 * if (is.Primitive(a)) {
 *   // a is narrowed to Primitive
 *   const _: Primitive = a;
 * }
 * ```
 */
export function isPrimitive(x: unknown): x is Primitive {
  return x == null || primitiveSet.has(typeof x);
}

const primitiveSet = new Set([
  "string",
  "number",
  "bigint",
  "boolean",
  "symbol",
]);

export type Primitive =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | symbol;

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
):
  & Predicate<T>
  & WithMetadata<IsLiteralOfMetadata<T>> {
  return setPredicateMetadata(
    (x: unknown): x is T => x === literal,
    { name: "isLiteralOf", args: [literal] },
  );
}

type IsLiteralOfMetadata<T> = {
  name: "isLiteralOf";
  args: [T];
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
):
  & Predicate<T[number]>
  & WithMetadata<IsLiteralOneOfMetadata<T>> {
  const s = new Set(literals);
  return setPredicateMetadata(
    (x: unknown): x is T[number] => s.has(x as Primitive),
    { name: "isLiteralOneOf", args: [literals] },
  );
}

type IsLiteralOneOfMetadata<T> = {
  name: "isLiteralOneOf";
  args: [T];
};

/**
 * Return a type predicate function that returns `true` if the type of `x` is `OneOf<T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.OneOf([is.Number, is.String, is.Boolean]);
 * const a: unknown = 0;
 * if (isMyType(a)) {
 *   // a is narrowed to number | string | boolean
 *   const _: number | string | boolean = a;
 * }
 * ```
 *
 * Depending on the version of TypeScript and how values are provided, it may be necessary to add `as const` to the array
 * used as `preds`. If a type error occurs, try adding `as const` as follows:
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const preds = [is.Number, is.String, is.Boolean] as const;
 * const isMyType = is.OneOf(preds);
 * const a: unknown = 0;
 * if (isMyType(a)) {
 *   // a is narrowed to number | string | boolean
 *   const _: number | string | boolean = a;
 * }
 * ```
 */
export function isOneOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
>(
  preds: T,
):
  & Predicate<OneOf<T>>
  & WithMetadata<IsOneOfMetadata<T>> {
  return setPredicateMetadata(
    (x: unknown): x is OneOf<T> => preds.some((pred) => pred(x)),
    { name: "isOneOf", args: [preds] },
  );
}

type IsOneOfMetadata<T> = {
  name: "isOneOf";
  args: [T];
};

export type OneOf<T> = T extends readonly [Predicate<infer U>, ...infer R]
  ? U | OneOf<R>
  : never;

/**
 * Return a type predicate function that returns `true` if the type of `x` is `AllOf<T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.AllOf([
 *   is.ObjectOf({ a: is.Number }),
 *   is.ObjectOf({ b: is.String }),
 * ]);
 * const a: unknown = { a: 0, b: "a" };
 * if (isMyType(a)) {
 *   // a is narrowed to { a: number } & { b: string }
 *   const _: { a: number } & { b: string } = a;
 * }
 * ```
 *
 * Depending on the version of TypeScript and how values are provided, it may be necessary to add `as const` to the array
 * used as `preds`. If a type error occurs, try adding `as const` as follows:
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const preds = [
 *   is.ObjectOf({ a: is.Number }),
 *   is.ObjectOf({ b: is.String }),
 * ] as const
 * const isMyType = is.AllOf(preds);
 * const a: unknown = { a: 0, b: "a" };
 * if (isMyType(a)) {
 *   // a is narrowed to { a: number } & { b: string }
 *   const _: { a: number } & { b: string } = a;
 * }
 * ```
 */
export function isAllOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
>(
  preds: T,
):
  & Predicate<AllOf<T>>
  & WithMetadata<IsAllOfMetadata<T>> {
  return setPredicateMetadata(
    (x: unknown): x is AllOf<T> => preds.every((pred) => pred(x)),
    { name: "isAllOf", args: [preds] },
  );
}

type IsAllOfMetadata<T> = {
  name: "isAllOf";
  args: [T];
};

export type AllOf<T> = UnionToIntersection<OneOf<T>>;

/**
 * Synonym of `Record<K, T>`
 *
 * @deprecated Use `Record<K, T>` instead.
 */
export type RecordOf<T, K extends PropertyKey = PropertyKey> = Record<K, T>;

export default {
  AllOf: isAllOf,
  Any: isAny,
  Array: isArray,
  ArrayOf: isArrayOf,
  AsyncFunction: isAsyncFunction,
  BigInt: isBigInt,
  Boolean: isBoolean,
  Function: isFunction,
  InstanceOf: isInstanceOf,
  LiteralOf: isLiteralOf,
  LiteralOneOf: isLiteralOneOf,
  Map: isMap,
  MapOf: isMapOf,
  Null: isNull,
  Nullish: isNullish,
  Number: isNumber,
  ObjectOf: isObjectOf,
  OneOf: isOneOf,
  OptionalOf: isOptionalOf,
  Primitive: isPrimitive,
  ReadonlyTupleOf: isReadonlyTupleOf,
  ReadonlyUniformTupleOf: isReadonlyUniformTupleOf,
  Record: isRecord,
  RecordOf: isRecordOf,
  Set: isSet,
  SetOf: isSetOf,
  StrictOf: isStrictOf,
  String: isString,
  Symbol: isSymbol,
  SyncFunction: isSyncFunction,
  TupleOf: isTupleOf,
  Undefined: isUndefined,
  UniformTupleOf: isUniformTupleOf,
  Unknown: isUnknown,
};
