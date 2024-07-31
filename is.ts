import type { FlatType, TupleToIntersection } from "./_typeutil.ts";
import { rewriteName } from "./_funcutil.ts";
import { annotate, hasAnnotation, type WithOptional } from "./_annotation.ts";
import { asOptional, asUnoptional, hasOptional } from "./as/optional.ts";

const objectToString = Object.prototype.toString;
const primitiveSet = new Set([
  "string",
  "number",
  "bigint",
  "boolean",
  "symbol",
]);

/**
 * A type predicate function.
 */
export type Predicate<T> = (x: unknown) => x is T;

/**
 * A type predicated by Predicate<T>.
 *
 * ```ts
 * import { as, is, type PredicateType } from "@core/unknownutil";
 *
 * const isPerson = is.ObjectOf({
 *   name: is.String,
 *   age: is.Number,
 *   address: as.Optional(is.String),
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
 * import { is } from "@core/unknownutil";
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
 * import { is } from "@core/unknownutil";
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
 * import { is } from "@core/unknownutil";
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
 * import { is } from "@core/unknownutil";
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
 * import { is } from "@core/unknownutil";
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
 * import { is } from "@core/unknownutil";
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
 * import { is } from "@core/unknownutil";
 *
 * const a: unknown = [0, 1, 2];
 * if (is.Array(a)) {
 *   // a is narrowed to unknown[]
 *   const _: unknown[] = a;
 * }
 * ```
 */
export function isArray(
  x: unknown,
): x is unknown[] {
  return Array.isArray(x);
}

/**
 * Return `true` if the type of `x` is `Set<unknown>`.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const a: unknown = new Set([0, 1, 2]);
 * if (is.Set(a)) {
 *   // a is narrowed to Set<unknown>
 *   const _: Set<unknown> = a;
 * }
 * ```
 */
export function isSet(x: unknown): x is Set<unknown> {
  return x instanceof Set;
}

/**
 * Return `true` if the type of `x` is an object instance that satisfies `Record<PropertyKey, unknown>`.
 *
 * Note that this function check if the `x` is an instance of `Object`.
 * Use `isRecordLike` instead if you want to check if the `x` satisfies the `Record<PropertyKey, unknown>` type.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const a: unknown = {"a": 0, "b": 1};
 * if (is.RecordObject(a)) {
 *   // a is narrowed to Record<PropertyKey, unknown>
 *   const _: Record<PropertyKey, unknown> = a;
 * }
 *
 * const b: unknown = new Set();
 * if (is.RecordObject(b)) {
 *   // b is not a raw object, so it is not narrowed
 * }
 * ```
 */
export function isRecordObject(
  x: unknown,
): x is Record<PropertyKey, unknown> {
  return x != null && typeof x === "object" && x.constructor === Object;
}

/**
 * Return `true` if the type of `x` satisfies `Record<PropertyKey, unknown>`.
 *
 * Note that this function returns `true` for ambiguous instances like `Set`, `Map`, `Date`, `Promise`, etc.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const a: unknown = {"a": 0, "b": 1};
 * if (is.Record(a)) {
 *   // a is narrowed to Record<PropertyKey, unknown>
 *   const _: Record<PropertyKey, unknown> = a;
 * }
 *
 * const b: unknown = new Set();
 * if (is.Record(b)) {
 *   // b is narrowed to Record<PropertyKey, unknown>
 *   const _: Record<PropertyKey, unknown> = b;
 * }
 * ```
 */
export function isRecord(
  x: unknown,
): x is Record<PropertyKey, unknown> {
  return x != null && !Array.isArray(x) && typeof x === "object";
}

/**
 * Return `true` if the type of `x` is `Map<unknown, unknown>`.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const a: unknown = new Map([["a", 0], ["b", 1]]);
 * if (is.Map(a)) {
 *   // a is narrowed to Map<unknown, unknown>
 *   const _: Map<unknown, unknown> = a;
 * }
 * ```
 */
export function isMap(x: unknown): x is Map<unknown, unknown> {
  return x instanceof Map;
}

/**
 * Return `true` if the type of `x` is `function`.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
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
 * import { is } from "@core/unknownutil";
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
  return objectToString.call(x) === "[object Function]";
}

/**
 * Return `true` if the type of `x` is `function` (async function).
 *
 * ```ts
 * import { is } from "@core/unknownutil";
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
  return objectToString.call(x) === "[object AsyncFunction]";
}

/**
 * Return `true` if the type of `x` is `null`.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
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
 * import { is } from "@core/unknownutil";
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
 * import { is } from "@core/unknownutil";
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
 * import { is } from "@core/unknownutil";
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

export type Primitive =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | symbol;

/**
 * Return `true` if the type of `x` is `Primitive`.
 *
 * ```ts
 * import { is, Primitive } from "@core/unknownutil";
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

/**
 * Return a type predicate function that returns `true` if the type of `x` is `T[]`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
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
): Predicate<T[]> {
  return rewriteName(
    (x: unknown): x is T[] => isArray(x) && x.every(pred),
    "isArrayOf",
    pred,
  );
}

/**
 * Return a type predicate function that returns `true` if the type of `x` is `Set<T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
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
): Predicate<Set<T>> {
  return rewriteName(
    (x: unknown): x is Set<T> => {
      if (!isSet(x)) return false;
      for (const v of x.values()) {
        if (!pred(v)) return false;
      }
      return true;
    },
    "isSetOf",
    pred,
  );
}

/**
 * Return a type predicate function that returns `true` if the type of `x` is `TupleOf<T>` or `TupleOf<T, E>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
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
 * import { is } from "@core/unknownutil";
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
 * import { is } from "@core/unknownutil";
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
): Predicate<TupleOf<T>>;
export function isTupleOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
  E extends Predicate<unknown[]>,
>(
  predTup: T,
  predElse: E,
): Predicate<[...TupleOf<T>, ...PredicateType<E>]>;
export function isTupleOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
  E extends Predicate<unknown[]>,
>(
  predTup: T,
  predElse?: E,
): Predicate<TupleOf<T> | [...TupleOf<T>, ...PredicateType<E>]> {
  if (!predElse) {
    return rewriteName(
      (x: unknown): x is TupleOf<T> => {
        if (!isArray(x) || x.length !== predTup.length) {
          return false;
        }
        return predTup.every((pred, i) => pred(x[i]));
      },
      "isTupleOf",
      predTup,
    );
  } else {
    return rewriteName(
      (x: unknown): x is [...TupleOf<T>, ...PredicateType<E>] => {
        if (!isArray(x) || x.length < predTup.length) {
          return false;
        }
        const head = x.slice(0, predTup.length);
        const tail = x.slice(predTup.length);
        return predTup.every((pred, i) => pred(head[i])) && predElse(tail);
      },
      "isTupleOf",
      predTup,
      predElse,
    );
  }
}

type TupleOf<T> = {
  -readonly [P in keyof T]: T[P] extends Predicate<infer U> ? U : never;
};

/**
 * Return a type predicate function that returns `true` if the type of `x` is `ParametersOf<T>` or `ParametersOf<T, E>`.
 *
 * This is similar to `TupleOf<T>` or `TupleOf<T, E>`, but if `as.Optional()` is specified at the trailing, the trailing elements becomes optional and makes variable-length tuple.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { as, is } from "@core/unknownutil";
 *
 * const isMyType = is.ParametersOf([
 *   is.Number,
 *   as.Optional(is.String),
 *   is.Boolean,
 *   as.Optional(is.Number),
 *   as.Optional(is.String),
 *   as.Optional(is.Boolean),
 * ] as const);
 * const a: unknown = [0, undefined, "a"];
 * if (isMyType(a)) {
 *   // a is narrowed to [number, string | undefined, boolean, number?, string?, boolean?]
 *   const _: [number, string | undefined, boolean, number?, string?, boolean?] = a;
 * }
 * ```
 *
 * With `predElse`:
 *
 * ```ts
 * import { as, is } from "@core/unknownutil";
 *
 * const isMyType = is.ParametersOf(
 *   [
 *     is.Number,
 *     as.Optional(is.String),
 *     as.Optional(is.Boolean),
 *   ] as const,
 *   is.ArrayOf(is.Number),
 * );
 * const a: unknown = [0, "a", true, 0, 1, 2];
 * if (isMyType(a)) {
 *   // a is narrowed to [number, string?, boolean?, ...number[]]
 *   const _: [number, string?, boolean?, ...number[]] = a;
 * }
 * ```
 *
 * Depending on the version of TypeScript and how values are provided, it may be necessary to add `as const` to the array
 * used as `predTup`. If a type error occurs, try adding `as const` as follows:
 *
 * ```ts
 * import { as, is } from "@core/unknownutil";
 *
 * const predTup = [is.Number, is.String, as.Optional(is.Boolean)] as const;
 * const isMyType = is.ParametersOf(predTup);
 * const a: unknown = [0, "a"];
 * if (isMyType(a)) {
 *   // a is narrowed to [number, string, boolean?]
 *   const _: [number, string, boolean?] = a;
 * }
 * ```
 */
export function isParametersOf<
  T extends readonly [...Predicate<unknown>[]],
>(
  predTup: T,
): Predicate<ParametersOf<T>>;
export function isParametersOf<
  T extends readonly [...Predicate<unknown>[]],
  E extends Predicate<unknown[]>,
>(
  predTup: T,
  predElse: E,
): Predicate<[...ParametersOf<T>, ...PredicateType<E>]>;
export function isParametersOf<
  T extends readonly [...Predicate<unknown>[]],
  E extends Predicate<unknown[]>,
>(
  predTup: T,
  predElse?: E,
): Predicate<ParametersOf<T> | [...ParametersOf<T>, ...PredicateType<E>]> {
  const requiresLength = 1 +
    predTup.findLastIndex((pred) => !hasOptional(pred));
  if (!predElse) {
    return rewriteName(
      (x: unknown): x is ParametersOf<T> => {
        if (
          !isArray(x) || x.length < requiresLength || x.length > predTup.length
        ) {
          return false;
        }
        return predTup.every((pred, i) => pred(x[i]));
      },
      "isParametersOf",
      predTup,
    );
  } else {
    return rewriteName(
      (x: unknown): x is [...ParametersOf<T>, ...PredicateType<E>] => {
        if (!isArray(x) || x.length < requiresLength) {
          return false;
        }
        const head = x.slice(0, predTup.length);
        const tail = x.slice(predTup.length);
        return predTup.every((pred, i) => pred(head[i])) && predElse(tail);
      },
      "isParametersOf",
      predTup,
      predElse,
    );
  }
}

type ParametersOf<T> = T extends readonly [] ? []
  : T extends readonly [...infer P, infer R]
  // Tuple of predicates
    ? P extends Predicate<unknown>[]
      ? R extends Predicate<unknown> & WithOptional<unknown>
        // Last parameter is optional
        ? [...ParametersOf<P>, PredicateType<R>?]
        // Last parameter is NOT optional
      : [...ParametersOf<P>, PredicateType<R>]
    : never
  // Array of predicates
  : TupleOf<T>;

/**
 * Return a type predicate function that returns `true` if the type of `x` is `UniformTupleOf<T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
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
 * import { is } from "@core/unknownutil";
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
): Predicate<UniformTupleOf<T, N>> {
  return rewriteName(
    (x: unknown): x is UniformTupleOf<T, N> => {
      if (!isArray(x) || x.length !== n) {
        return false;
      }
      return x.every((v) => pred(v));
    },
    "isUniformTupleOf",
    n,
    pred,
  );
}

// https://stackoverflow.com/a/71700658/1273406
type UniformTupleOf<
  T,
  N extends number,
  R extends readonly T[] = [],
> = R["length"] extends N ? R : UniformTupleOf<T, N, [T, ...R]>;

/**
 * Return a type predicate function that returns `true` if the type of `x` is an Object instance that satisfies `Record<K, T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * Note that this function check if the `x` is an instance of `Object`.
 * Use `isRecordOf` instead if you want to check if the `x` satisfies the `Record<K, T>` type.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
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
 * import { is } from "@core/unknownutil";
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
): Predicate<Record<K, T>> {
  return rewriteName(
    (x: unknown): x is Record<K, T> => {
      if (!isRecordObject(x)) return false;
      for (const k in x) {
        if (!pred(x[k])) return false;
        if (predKey && !predKey(k)) return false;
      }
      return true;
    },
    "isRecordObjectOf",
    pred,
    predKey,
  );
}

/**
 * Return a type predicate function that returns `true` if the type of `x` satisfies `Record<K, T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
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
 * import { is } from "@core/unknownutil";
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
): Predicate<Record<K, T>> {
  return rewriteName(
    (x: unknown): x is Record<K, T> => {
      if (!isRecord(x)) return false;
      for (const k in x) {
        if (!pred(x[k])) return false;
        if (predKey && !predKey(k)) return false;
      }
      return true;
    },
    "isRecordOf",
    pred,
    predKey,
  );
}

/**
 * Return a type predicate function that returns `true` if the type of `x` is `Map<K, T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
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
 * import { is } from "@core/unknownutil";
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
): Predicate<Map<K, T>> {
  return rewriteName(
    (x: unknown): x is Map<K, T> => {
      if (!isMap(x)) return false;
      for (const entry of x.entries()) {
        const [k, v] = entry;
        if (!pred(v)) return false;
        if (predKey && !predKey(k)) return false;
      }
      return true;
    },
    "isMapOf",
    pred,
    predKey,
  );
}

/**
 * Return a type predicate function that returns `true` if the type of `x` is `ObjectOf<T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * If `as.Optional` is specified in the predicate function, the property becomes optional.
 *
 * The number of keys of `x` must be greater than or equal to the number of keys of `predObj`.
 *
 * ```ts
 * import { as, is } from "@core/unknownutil";
 *
 * const isMyType = is.ObjectOf({
 *   a: is.Number,
 *   b: is.String,
 *   c: as.Optional(is.Boolean),
 * });
 * const a: unknown = { a: 0, b: "a", other: "other" };
 * if (isMyType(a)) {
 *   // "other" key in `a` is ignored because of `options.strict` is `false`.
 *   // a is narrowed to { a: number; b: string; c?: boolean | undefined }
 *   const _: { a: number; b: string; c?: boolean | undefined } = a;
 * }
 * ```
 */
export function isObjectOf<
  T extends Record<PropertyKey, Predicate<unknown>>,
>(predObj: T): Predicate<ObjectOf<T>> & WithPredObj<T> {
  return annotate(
    rewriteName(
      (x: unknown): x is ObjectOf<T> => {
        if (
          x == null ||
          typeof x !== "object" && typeof x !== "function" ||
          Array.isArray(x)
        ) return false;
        // Check each values
        for (const k in predObj) {
          if (!predObj[k]((x as T)[k])) return false;
        }
        return true;
      },
      "isObjectOf",
      predObj,
    ),
    "predObj",
    predObj,
  );
}

type ObjectOf<T extends Record<PropertyKey, Predicate<unknown>>> = FlatType<
  // Optional
  & {
    [K in keyof T as T[K] extends WithOptional<unknown> ? K : never]?:
      T[K] extends Predicate<infer U> ? U : never;
  }
  // Non optional
  & {
    [K in keyof T as T[K] extends WithOptional<unknown> ? never : K]:
      T[K] extends Predicate<infer U> ? U : never;
  }
>;

type WithPredObj<T extends Record<PropertyKey, Predicate<unknown>>> = {
  predObj: T;
};

/**
 * Return a type predicate function that returns `true` if the type of `x` is strictly follow the `ObjectOf<T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * If `as.Optional` is specified in the predicate function, the property becomes optional.
 *
 * The number of keys of `x` must be equal to the number of non optional keys of `predObj`.
 *
 * ```ts
 * import { as, is } from "@core/unknownutil";
 *
 * const isMyType = is.StrictOf(is.ObjectOf({
 *   a: is.Number,
 *   b: is.String,
 *   c: as.Optional(is.Boolean),
 * }));
 * const a: unknown = { a: 0, b: "a", other: "other" };
 * if (isMyType(a)) {
 *   // This block will not be executed because of "other" key in `a`.
 * }
 * ```
 */
export function isStrictOf<
  T extends Record<PropertyKey, unknown>,
  P extends Record<PropertyKey, Predicate<unknown>>,
>(
  pred:
    & Predicate<T>
    & WithPredObj<P>,
):
  & Predicate<T>
  & WithPredObj<P> {
  const s = new Set(Object.keys(pred.predObj));
  return rewriteName(
    (x: unknown): x is T => {
      if (!pred(x)) return false;
      // deno-lint-ignore no-explicit-any
      const ks = Object.keys(x as any);
      return ks.length <= s.size && ks.every((k) => s.has(k));
    },
    "isStrictOf",
    pred,
  ) as Predicate<T> & WithPredObj<P>;
}

/**
 * Return `true` if the type of `x` is instance of `ctor`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
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
): Predicate<InstanceType<T>> {
  return rewriteName(
    (x: unknown): x is InstanceType<T> => x instanceof ctor,
    "isInstanceOf",
    ctor,
  );
}

/**
 * Return a type predicate function that returns `true` if the type of `x` is a literal type of `pred`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
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
): Predicate<T> {
  return rewriteName(
    (x: unknown): x is T => x === literal,
    "isLiteralOf",
    literal,
  );
}

/**
 * Return a type predicate function that returns `true` if the type of `x` is one of literal type in `preds`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
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
): Predicate<T[number]> {
  const s = new Set(literals);
  return rewriteName(
    (x: unknown): x is T[number] => s.has(x as T[number]),
    "isLiteralOneOf",
    literals,
  );
}

/**
 * Return a type predicate function that returns `true` if the type of `x` is `UnionOf<T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const isMyType = is.UnionOf([is.Number, is.String, is.Boolean]);
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
 * import { is } from "@core/unknownutil";
 *
 * const preds = [is.Number, is.String, is.Boolean] as const;
 * const isMyType = is.UnionOf(preds);
 * const a: unknown = 0;
 * if (isMyType(a)) {
 *   // a is narrowed to number | string | boolean
 *   const _: number | string | boolean = a;
 * }
 * ```
 */
export function isUnionOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
>(
  preds: T,
): Predicate<UnionOf<T>> & WithUnion<T> {
  return annotate(
    rewriteName(
      (x: unknown): x is UnionOf<T> => preds.some((pred) => pred(x)),
      "isUnionOf",
      preds,
    ),
    "union",
    preds,
  );
}

type UnionOf<T> = T extends readonly [Predicate<infer U>, ...infer R]
  ? U | UnionOf<R>
  : never;

type WithUnion<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
> = {
  union: T;
};

/**
 * Return a type predicate function that returns `true` if the type of `x` is `IntersectionOf<T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const isMyType = is.IntersectionOf([
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
 * import { is } from "@core/unknownutil";
 *
 * const preds = [
 *   is.ObjectOf({ a: is.Number }),
 *   is.ObjectOf({ b: is.String }),
 * ] as const
 * const isMyType = is.IntersectionOf(preds);
 * const a: unknown = { a: 0, b: "a" };
 * if (isMyType(a)) {
 *   // a is narrowed to { a: number } & { b: string }
 *   const _: { a: number } & { b: string } = a;
 * }
 * ```
 */
export function isIntersectionOf<
  T extends readonly [
    Predicate<unknown> & WithPredObj<Record<PropertyKey, Predicate<unknown>>>,
    ...(
      & Predicate<unknown>
      & WithPredObj<Record<PropertyKey, Predicate<unknown>>>
    )[],
  ],
>(
  preds: T,
):
  & Predicate<IntersectionOf<T>>
  & WithPredObj<Record<PropertyKey, Predicate<unknown>>>;
export function isIntersectionOf<
  T extends readonly [Predicate<unknown>],
>(
  preds: T,
): T[0];
export function isIntersectionOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
>(
  preds: T,
):
  & Predicate<IntersectionOf<T>>
  & WithPredObj<Record<PropertyKey, Predicate<unknown>>>;
export function isIntersectionOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
>(
  preds: T,
):
  | Predicate<unknown>
  | Predicate<IntersectionOf<T>>
    & WithPredObj<Record<PropertyKey, Predicate<unknown>>> {
  const predObj = {};
  const restPreds = preds.filter((pred) => {
    if (!hasAnnotation(pred, "predObj")) {
      return true;
    }
    Object.assign(predObj, pred.predObj);
  });
  if (restPreds.length < preds.length) {
    restPreds.push(isObjectOf(predObj));
  }
  if (restPreds.length === 1) {
    return restPreds[0];
  }
  return rewriteName(
    (x: unknown): x is IntersectionOf<T> => restPreds.every((pred) => pred(x)),
    "isIntersectionOf",
    preds,
  );
}

type IntersectionOf<T> = TupleToIntersection<TupleOf<T>>;

/**
 * Return a type predicate function that returns `true` if the type of `x` is `Required<ObjectOf<T>>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```typescript
 * import { as, is } from "@core/unknownutil";
 *
 * const isMyType = is.RequiredOf(is.ObjectOf({
 *   a: is.Number,
 *   b: is.UnionOf([is.String, is.Undefined]),
 *   c: as.Optional(is.Boolean),
 * }));
 * const a: unknown = { a: 0, b: "b", c: true, other: "other" };
 * if (isMyType(a)) {
 *   // 'a' is narrowed to { a: number; b: string | undefined; c: boolean }
 *   const _: { a: number; b: string | undefined; c: boolean } = a;
 * }
 * ```
 */
export function isRequiredOf<
  T extends Record<PropertyKey, unknown>,
  P extends Record<PropertyKey, Predicate<unknown>>,
>(
  pred: Predicate<T> & WithPredObj<P>,
):
  & Predicate<FlatType<Required<T>>>
  & WithPredObj<P> {
  const predObj = Object.fromEntries(
    Object.entries(pred.predObj).map(([k, v]) => [k, asUnoptional(v)]),
  );
  return isObjectOf(predObj) as
    & Predicate<FlatType<Required<T>>>
    & WithPredObj<P>;
}

/**
 * Return a type predicate function that returns `true` if the type of `x` is `Partial<ObjectOf<T>>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```typescript
 * import { as, is } from "@core/unknownutil";
 *
 * const isMyType = is.PartialOf(is.ObjectOf({
 *   a: is.Number,
 *   b: is.UnionOf([is.String, is.Undefined]),
 *   c: as.Optional(is.Boolean),
 * }));
 * const a: unknown = { a: undefined, other: "other" };
 * if (isMyType(a)) {
 *   // The "other" key in `a` is ignored.
 *   // 'a' is narrowed to { a?: number | undefined; b?: string | undefined; c?: boolean | undefined }
 *   const _: { a?: number | undefined; b?: string | undefined; c?: boolean | undefined } = a;
 * }
 * ```
 */
export function isPartialOf<
  T extends Record<PropertyKey, unknown>,
  P extends Record<PropertyKey, Predicate<unknown>>,
>(
  pred: Predicate<T> & WithPredObj<P>,
):
  & Predicate<FlatType<Partial<T>>>
  & WithPredObj<P> {
  const predObj = Object.fromEntries(
    Object.entries(pred.predObj).map(([k, v]) => [k, asOptional(v)]),
  ) as Record<PropertyKey, Predicate<unknown>>;
  return isObjectOf(predObj) as
    & Predicate<FlatType<Partial<T>>>
    & WithPredObj<P>;
}

/**
 * Return a type predicate function that returns `true` if the type of `x` is `Pick<ObjectOf<T>, K>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```typescript
 * import { as, is } from "@core/unknownutil";
 *
 * const isMyType = is.PickOf(is.ObjectOf({
 *   a: is.Number,
 *   b: is.String,
 *   c: as.Optional(is.Boolean),
 * }), ["a", "c"]);
 * const a: unknown = { a: 0, b: "a", other: "other" };
 * if (isMyType(a)) {
 *   // The "b" and "other" key in `a` is ignored.
 *   // 'a' is narrowed to { a: number; c?: boolean | undefined }
 *   const _: { a: number; c?: boolean | undefined } = a;
 * }
 * ```
 */
export function isPickOf<
  T extends Record<PropertyKey, unknown>,
  P extends Record<PropertyKey, Predicate<unknown>>,
  K extends keyof T,
>(
  pred: Predicate<T> & WithPredObj<P>,
  keys: K[],
):
  & Predicate<FlatType<Pick<T, K>>>
  & WithPredObj<P> {
  const s = new Set(keys);
  const predObj = Object.fromEntries(
    Object.entries(pred.predObj).filter(([k]) => s.has(k as K)),
  );
  return isObjectOf(predObj) as
    & Predicate<FlatType<Pick<T, K>>>
    & WithPredObj<P>;
}

/**
 * Return a type predicate function that returns `true` if the type of `x` is `Omit<ObjectOf<T>, K>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```typescript
 * import { as, is } from "@core/unknownutil";
 *
 * const isMyType = is.OmitOf(is.ObjectOf({
 *   a: is.Number,
 *   b: is.String,
 *   c: as.Optional(is.Boolean),
 * }), ["a", "c"]);
 * const a: unknown = { a: 0, b: "a", other: "other" };
 * if (isMyType(a)) {
 *   // The "a", "c", and "other" key in `a` is ignored.
 *   // 'a' is narrowed to { b: string }
 *   const _: { b: string } = a;
 * }
 * ```
 */
export function isOmitOf<
  T extends Record<PropertyKey, unknown>,
  P extends Record<PropertyKey, Predicate<unknown>>,
  K extends keyof T,
>(
  pred: Predicate<T> & WithPredObj<P>,
  keys: K[],
):
  & Predicate<FlatType<Omit<T, K>>>
  & WithPredObj<P> {
  const s = new Set(keys);
  const predObj = Object.fromEntries(
    Object.entries(pred.predObj).filter(([k]) => !s.has(k as K)),
  );
  return isObjectOf(predObj) as
    & Predicate<FlatType<Omit<T, K>>>
    & WithPredObj<P>;
}

export const is = {
  Any: isAny,
  Array: isArray,
  ArrayOf: isArrayOf,
  AsyncFunction: isAsyncFunction,
  BigInt: isBigInt,
  Boolean: isBoolean,
  Function: isFunction,
  InstanceOf: isInstanceOf,
  IntersectionOf: isIntersectionOf,
  LiteralOf: isLiteralOf,
  LiteralOneOf: isLiteralOneOf,
  Map: isMap,
  MapOf: isMapOf,
  Null: isNull,
  Nullish: isNullish,
  Number: isNumber,
  ObjectOf: isObjectOf,
  OmitOf: isOmitOf,
  ParametersOf: isParametersOf,
  PartialOf: isPartialOf,
  PickOf: isPickOf,
  Primitive: isPrimitive,
  Record: isRecord,
  RecordObject: isRecordObject,
  RecordObjectOf: isRecordObjectOf,
  RecordOf: isRecordOf,
  RequiredOf: isRequiredOf,
  Set: isSet,
  SetOf: isSetOf,
  StrictOf: isStrictOf,
  String: isString,
  Symbol: isSymbol,
  SyncFunction: isSyncFunction,
  TupleOf: isTupleOf,
  Undefined: isUndefined,
  UniformTupleOf: isUniformTupleOf,
  UnionOf: isUnionOf,
  Unknown: isUnknown,
};
