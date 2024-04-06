import type { FlatType } from "../_typeutil.ts";
import type { Predicate, PredicateType } from "./type.ts";
import { type isOptionalOf, isReadonlyOf } from "./annotation.ts";
import {
  isAny,
  isArray,
  isMap,
  isRecord,
  isRecordObject,
  isSet,
  type Primitive,
} from "./core.ts";
import {
  type GetMetadata,
  getPredicateFactoryMetadata,
  setPredicateFactoryMetadata,
  type WithMetadata,
} from "../metadata.ts";

type IsReadonlyOfMetadata = GetMetadata<ReturnType<typeof isReadonlyOf>>;

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
  return setPredicateFactoryMetadata(
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
  return setPredicateFactoryMetadata(
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
    return setPredicateFactoryMetadata(
      (x: unknown): x is TupleOf<T> => {
        if (!isArray(x) || x.length !== predTup.length) {
          return false;
        }
        return predTup.every((pred, i) => pred(x[i]));
      },
      { name: "isTupleOf", args: [predTup] },
    );
  } else {
    return setPredicateFactoryMetadata(
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
 * Return a type predicate function that returns `true` if the type of `x` is `Readonly<TupleOf<T>>`.
 *
 * @deprecated Use `is.ReadonlyOf(is.TupleOf(...))` instead.
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
): Predicate<Readonly<TupleOf<T>>> & WithMetadata<IsReadonlyOfMetadata>;
export function isReadonlyTupleOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
  E extends Predicate<unknown[]>,
>(
  predTup: T,
  predElse: E,
):
  & Predicate<Readonly<[...TupleOf<T>, ...PredicateType<E>]>>
  & WithMetadata<IsReadonlyOfMetadata>;
export function isReadonlyTupleOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
  E extends Predicate<unknown[]>,
>(
  predTup: T,
  predElse?: E,
):
  & Predicate<
    | Readonly<TupleOf<T>>
    | Readonly<[...TupleOf<T>, ...PredicateType<E>]>
  >
  & WithMetadata<IsReadonlyOfMetadata> {
  if (!predElse) {
    return isReadonlyOf(isTupleOf(predTup));
  } else {
    return isReadonlyOf(isTupleOf(predTup, predElse));
  }
}

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
  return setPredicateFactoryMetadata(
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
 * Return a type predicate function that returns `true` if the type of `x` is `Readonly<UniformTupleOf<T>>`.
 *
 * @deprecated Use `is.ReadonlyOf(is.UniformTupleOf(...))` instead.
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
  & Predicate<Readonly<UniformTupleOf<T, N>>>
  & WithMetadata<IsReadonlyOfMetadata> {
  return isReadonlyOf(isUniformTupleOf(n, pred));
}

/**
 * Return a type predicate function that returns `true` if the type of `x` is an Object instance that satisfies `Record<K, T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * Note that this function check if the `x` is an instance of `Object`.
 * Use `isRecordOf` instead if you want to check if the `x` satisfies the `Record<K, T>` type.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.RecordObjectOf(is.Number);
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
 * const isMyType = is.RecordObjectOf(is.Number, is.String);
 * const a: unknown = {"a": 0, "b": 1};
 * if (isMyType(a)) {
 *   // a is narrowed to Record<string, number>
 *   const _: Record<string, number> = a;
 * }
 * ```
 */
export function isRecordObjectOf<T, K extends PropertyKey = PropertyKey>(
  pred: Predicate<T>,
  predKey?: Predicate<K>,
): Predicate<Record<K, T>> & WithMetadata<IsRecordObjectOfMetadata> {
  return setPredicateFactoryMetadata(
    (x: unknown): x is Record<K, T> => {
      if (!isRecordObject(x)) return false;
      for (const k in x) {
        if (!pred(x[k])) return false;
        if (predKey && !predKey(k)) return false;
      }
      return true;
    },
    { name: "isRecordObjectOf", args: [pred, predKey] },
  );
}

type IsRecordObjectOfMetadata = {
  name: "isRecordObjectOf";
  args: Parameters<typeof isRecordObjectOf>;
};

/**
 * Return a type predicate function that returns `true` if the type of `x` satisfies `Record<K, T>`.
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
  return setPredicateFactoryMetadata(
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
 * Return a type predicate function that returns `true` if the type of `x` satisfies `Record<K, T>`.
 *
 * @deprecated Use `is.RecordOf()` instead
 */
export function isRecordLikeOf<T, K extends PropertyKey = PropertyKey>(
  pred: Predicate<T>,
  predKey?: Predicate<K>,
): Predicate<Record<K, T>> & WithMetadata<IsRecordLikeOfMetadata> {
  return setPredicateFactoryMetadata(isRecordOf(pred, predKey), {
    name: "isRecordLikeOf",
    args: [pred, predKey],
  });
}

type IsRecordLikeOfMetadata = {
  name: "isRecordLikeOf";
  args: Parameters<typeof isRecordLikeOf>;
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
  return setPredicateFactoryMetadata(
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
  return setPredicateFactoryMetadata(
    (x: unknown): x is ObjectOf<T> => {
      if (x == null || typeof x !== "object" || Array.isArray(x)) return false;
      // Check each values
      for (const k in predObj) {
        if (!predObj[k]((x as T)[k])) return false;
      }
      return true;
    },
    { name: "isObjectOf", args: [predObj] },
  );
}

type WithOptional =
  | WithMetadata<GetMetadata<ReturnType<typeof isOptionalOf>>>
  | { optional: true }; // For backward compatibility

type ObjectOf<T extends Record<PropertyKey, Predicate<unknown>>> = FlatType<
  // Non optional
  & {
    [K in keyof T as T[K] extends WithOptional ? never : K]: T[K] extends
      Predicate<infer U> ? U : never;
  }
  // Optional
  & {
    [K in keyof T as T[K] extends WithOptional ? K : never]?: T[K] extends
      Predicate<infer U> ? U : never;
  }
>;

type IsObjectOfMetadata = {
  name: "isObjectOf";
  args: [Parameters<typeof isObjectOf>[0]];
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
  const { args } = getPredicateFactoryMetadata(pred);
  const s = new Set(Object.keys(args[0]));
  return setPredicateFactoryMetadata(
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
  return setPredicateFactoryMetadata(
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
  return setPredicateFactoryMetadata(
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
  return setPredicateFactoryMetadata(
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
  ReadonlyTupleOf: isReadonlyTupleOf,
  ReadonlyUniformTupleOf: isReadonlyUniformTupleOf,
  RecordLikeOf: isRecordLikeOf,
  RecordObjectOf: isRecordObjectOf,
  RecordOf: isRecordOf,
  SetOf: isSetOf,
  StrictOf: isStrictOf,
  TupleOf: isTupleOf,
  UniformTupleOf: isUniformTupleOf,
};
