/**
 * A type predicate function
 */
export type Predicate<T> = (x: unknown) => x is T;

/**
 * A type predicated by Predicate<T>
 */
export type PredicateType<P> = P extends Predicate<infer T> ? T : never;

/**
 * Always return `true` regardless of the type of `x`.
 */
// deno-lint-ignore no-explicit-any
export function isAny(_x: unknown): _x is any {
  return true;
}

/**
 * Return `true` if the type of `x` is `string`.
 */
export function isString(x: unknown): x is string {
  return typeof x === "string";
}

/**
 * Return `true` if the type of `x` is `number`.
 */
export function isNumber(x: unknown): x is number {
  return typeof x === "number";
}

/**
 * Return `true` if the type of `x` is `bigint`.
 */
export function isBigInt(x: unknown): x is bigint {
  return typeof x === "bigint";
}

/**
 * Return `true` if the type of `x` is `boolean`.
 */
export function isBoolean(x: unknown): x is boolean {
  return typeof x === "boolean";
}

/**
 * Return `true` if the type of `x` is `unknown[]`.
 */
export function isArray(
  x: unknown,
): x is unknown[] {
  return Array.isArray(x);
}

/**
 * Return a type predicate function that returns `true` if the type of `x` is `T[]`.
 */
export function isArrayOf<T>(
  pred: Predicate<T>,
): Predicate<T[]> {
  return (x: unknown): x is T[] => isArray(x) && x.every(pred);
}

export type TupleOf<T extends readonly Predicate<unknown>[]> = {
  [P in keyof T]: T[P] extends Predicate<infer U> ? U : never;
};

/**
 * Return a type predicate function that returns `true` if the type of `x` is `TupleOf<T>`.
 *
 * ```ts
 * import is from "./is.ts";
 *
 * const predTup = [is.Number, is.String, is.Boolean] as const;
 * const a: unknown = [0, "a", true];
 * if (is.TupleOf(predTup)(a)) {
 *  // a is narrowed to [number, string, boolean]
 *  const _: readonly [number, string, boolean] = a;
 * }
 * ```
 *
 * Note that `predTup` must be `readonly` (`as const`) to infer the type of `a` correctly.
 * TypeScript won't argues if `predTup` is not `readonly` because of its design limitation.
 * https://github.com/microsoft/TypeScript/issues/34274#issuecomment-541691353
 */
export function isTupleOf<T extends readonly Predicate<unknown>[]>(
  predTup: T,
): Predicate<TupleOf<T>> {
  return (x: unknown): x is TupleOf<T> => {
    if (!isArray(x) || x.length !== predTup.length) {
      return false;
    }
    return predTup.every((pred, i) => pred(x[i]));
  };
}

// https://stackoverflow.com/a/71700658/1273406
export type UniformTupleOf<
  T,
  N extends number,
  R extends readonly T[] = [],
> = R["length"] extends N ? R : UniformTupleOf<T, N, readonly [T, ...R]>;

/**
 * Return a type predicate function that returns `true` if the type of `x` is `UniformTupleOf<T>`.
 *
 * ```ts
 * import is from "./is.ts";
 *
 * const a: unknown = [0, 1, 2, 3, 4];
 * if (is.UniformTupleOf(5)(a)) {
 *  // a is narrowed to [unknown, unknown, unknown, unknown, unknown]
 *  const _: readonly [unknown, unknown, unknown, unknown, unknown] = a;
 * }
 *
 * if (is.UniformTupleOf(5, is.Number)(a)) {
 *  // a is narrowed to [number, number, number, number, number]
 *  const _: readonly [number, number, number, number, number] = a;
 * }
 * ```
 */
export function isUniformTupleOf<T, N extends number>(
  n: N,
  pred: Predicate<T> = (_x: unknown): _x is T => true,
): Predicate<UniformTupleOf<T, N>> {
  const predTup = Array(n).fill(pred);
  return isTupleOf(predTup) as Predicate<UniformTupleOf<T, N>>;
}

/**
 * Synonym of `Record<string | number | symbol, T>`
 */
export type RecordOf<T> = Record<string | number | symbol, T>;

/**
 * Return `true` if the type of `x` is `RecordOf<unknown>`.
 */
export function isRecord(
  x: unknown,
): x is RecordOf<unknown> {
  if (isNullish(x) || isArray(x)) {
    return false;
  }
  return typeof x === "object";
}

/**
 * Return a type predicate function that returns `true` if the type of `x` is `RecordOf<T>`.
 */
export function isRecordOf<T>(
  pred: Predicate<T>,
): Predicate<RecordOf<T>> {
  return (x: unknown): x is RecordOf<T> => {
    if (!isRecord(x)) return false;
    for (const k in x) {
      if (!pred(x[k])) return false;
    }
    return true;
  };
}

type FlatType<T> = T extends RecordOf<unknown>
  ? { [K in keyof T]: FlatType<T[K]> }
  : T;

type OptionalPredicateKeys<T extends RecordOf<unknown>> = {
  [K in keyof T]: T[K] extends OptionalPredicate<unknown> ? K : never;
}[keyof T];

export type ObjectOf<T extends RecordOf<Predicate<unknown>>> = FlatType<
  & {
    [K in Exclude<keyof T, OptionalPredicateKeys<T>>]: T[K] extends
      Predicate<infer U> ? U : never;
  }
  & {
    [K in OptionalPredicateKeys<T>]?: T[K] extends Predicate<infer U> ? U
      : never;
  }
>;

/**
 * Return a type predicate function that returns `true` if the type of `x` is `ObjectOf<T>`.
 * If `is.OptionalOf()` is specified in the predicate function, the property becomes optional.
 * When `options.strict` is `true`, the number of keys of `x` must be equal to the number of keys of `predObj`.
 * Otherwise, the number of keys of `x` must be greater than or equal to the number of keys of `predObj`.
 *
 * ```ts
 * import is from "./is.ts";
 *
 * const predObj = {
 *  a: is.Number,
 *  b: is.String,
 *  c: is.OptionalOf(is.Boolean),
 * };
 * const a: unknown = { a: 0, b: "a" };
 * if (is.ObjectOf(predObj)(a)) {
 *  // a is narrowed to { a: number; b: string; c?: boolean }
 *  const _: { a: number; b: string; c?: boolean } = a;
 * }
 * ```
 */
export function isObjectOf<
  T extends RecordOf<Predicate<unknown>>,
>(
  predObj: T,
  options: { strict?: boolean } = {},
): Predicate<ObjectOf<T>> {
  return options.strict ? isObjectOfStrict(predObj) : isObjectOfLoose(predObj);
}

function isObjectOfLoose<
  T extends RecordOf<Predicate<unknown>>,
>(
  predObj: T,
): Predicate<ObjectOf<T>> {
  return (x: unknown): x is ObjectOf<T> => {
    if (!isRecord(x)) return false;
    for (const k in predObj) {
      if (!predObj[k](x[k])) return false;
    }
    return true;
  };
}

function isObjectOfStrict<
  T extends RecordOf<Predicate<unknown>>,
>(
  predObj: T,
): Predicate<ObjectOf<T>> {
  const keys = new Set(Object.keys(predObj));
  const pred = isObjectOfLoose(predObj);
  return (x: unknown): x is ObjectOf<T> => {
    if (!pred(x)) return false;
    const ks = Object.keys(x);
    return ks.length <= keys.size && ks.every((k) => keys.has(k));
  };
}

/**
 * Return `true` if the type of `x` is `function`.
 */
export function isFunction(x: unknown): x is (...args: unknown[]) => unknown {
  return Object.prototype.toString.call(x) === "[object Function]";
}

/**
 * Return `true` if the type of `x` is instance of `ctor`.
 *
 * ```ts
 * import is from "./is.ts";
 *
 * const a: unknown = new Date();
 * if (is.InstanceOf(Date)(a)) {
 *   // a is narrowed to Date
 *   const _: Date = a;
 * }
 * ```
 */
// deno-lint-ignore no-explicit-any
export function isInstanceOf<T extends new (...args: any) => unknown>(
  ctor: T,
): Predicate<InstanceType<T>> {
  return (x: unknown): x is InstanceType<T> => x instanceof ctor;
}

/**
 * Return `true` if the type of `x` is `null`.
 */
export function isNull(x: unknown): x is null {
  return x === null;
}

/**
 * Return `true` if the type of `x` is `undefined`.
 */
export function isUndefined(x: unknown): x is undefined {
  return typeof x === "undefined";
}

/**
 * Return `true` if the type of `x` is `null` or `undefined`.
 */
export function isNullish(x: unknown): x is null | undefined {
  return x == null;
}

/**
 * Return `true` if the type of `x` is `symbol`.
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
 * Return `true` if the type of `x` is Primitive.
 */
export function isPrimitive(x: unknown): x is Primitive {
  return x == null ||
    ["string", "number", "bigint", "boolean", "symbol"].includes(typeof x);
}

/**
 * Return a type predicate function that returns `true` if the type of `x` is a literal type of `pred`.
 */
export function isLiteralOf<T extends Primitive>(pred: T): Predicate<T> {
  return (x: unknown): x is T => x === pred;
}

/**
 * Return a type predicate function that returns `true` if the type of `x` is one of literal type in `preds`.
 *
 * ```ts
 * import is from "./is.ts";
 * const a: unknown = "hello";
 * if (is.LiteralOneOf(["hello", "world"] as const)(a)) {
 *  // a is narrowed to "hello" | "world"
 *  const _: "hello" | "world" = a;
 * }
 * ```
 */
export function isLiteralOneOf<T extends readonly Primitive[]>(
  preds: T,
): Predicate<T[number]> {
  return (x: unknown): x is T[number] =>
    preds.includes(x as unknown as T[number]);
}

export type OneOf<T> = T extends Predicate<infer U>[] ? U : never;

/**
 * Return a type predicate function that returns `true` if the type of `x` is `OneOf<T>`.
 *
 * ```ts
 * import is from "./is.ts";
 *
 * const preds = [is.Number, is.String, is.Boolean];
 * const a: unknown = 0;
 * if (is.OneOf(preds)(a)) {
 *  // a is narrowed to number | string | boolean
 *  const _: number | string | boolean = a;
 * }
 * ```
 */
export function isOneOf<T extends readonly Predicate<unknown>[]>(
  preds: T,
): Predicate<OneOf<T>> {
  return (x: unknown): x is OneOf<T> => preds.some((pred) => pred(x));
}

type UnionToIntersection<U> =
  (U extends unknown ? (k: U) => void : never) extends ((k: infer I) => void)
    ? I
    : never;
export type AllOf<T> = UnionToIntersection<OneOf<T>>;

/**
 * Return a type predicate function that returns `true` if the type of `x` is `AllOf<T>`.
 *
 * ```ts
 * import is from "./is.ts";
 *
 * const preds = [is.ObjectOf({ a: is.Number }), is.ObjectOf({ b: is.String })];
 * const a: unknown = { a: 0, b: "a" };
 * if (is.AllOf(preds)(a)) {
 *  // a is narrowed to { a: number; b: string }
 *  const _: { a: number; b: string } = a;
 * }
 * ```
 */
export function isAllOf<T extends readonly Predicate<unknown>[]>(
  preds: T,
): Predicate<AllOf<T>> {
  return (x: unknown): x is AllOf<T> => preds.every((pred) => pred(x));
}

export type OptionalPredicate<T> = Predicate<T | undefined> & {
  optional: true;
};

/**
 * Return a type predicate function that returns `true` if the type of `x` is `T` or `undefined`.
 *
 * ```ts
 * import is from "./is.ts";
 *
 * const a: unknown = "a";
 * if (is.OptionalOf(is.String)(a)) {
 *  // a is narrowed to string | undefined
 *  const _: string | undefined = a;
 * }
 * ```
 */
export function isOptionalOf<T>(
  pred: Predicate<T>,
): OptionalPredicate<T> {
  return Object.assign(
    (x: unknown): x is Predicate<T | undefined> => isUndefined(x) || pred(x),
    {
      optional: true as const,
    },
  ) as OptionalPredicate<T>;
}

export default {
  Any: isAny,
  String: isString,
  Number: isNumber,
  BigInt: isBigInt,
  Boolean: isBoolean,
  Array: isArray,
  ArrayOf: isArrayOf,
  TupleOf: isTupleOf,
  UniformTupleOf: isUniformTupleOf,
  Record: isRecord,
  RecordOf: isRecordOf,
  ObjectOf: isObjectOf,
  Function: isFunction,
  InstanceOf: isInstanceOf,
  Null: isNull,
  Undefined: isUndefined,
  Nullish: isNullish,
  Symbol: isSymbol,
  Primitive: isPrimitive,
  LiteralOf: isLiteralOf,
  LiteralOneOf: isLiteralOneOf,
  OneOf: isOneOf,
  AllOf: isAllOf,
  OptionalOf: isOptionalOf,
};
