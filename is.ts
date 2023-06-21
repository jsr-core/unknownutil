/**
 * A type predicate function
 */
export type Predicate<T> = (x: unknown) => x is T;

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
  -readonly [P in keyof T]: T[P] extends Predicate<infer U> ? U : never;
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
 *  const _: [number, string, boolean] = a;
 * }
 * ```
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
  return (x: unknown): x is RecordOf<T> =>
    isRecord(x) && Object.values(x).every(pred);
}

/**
 * Return `true` if the type of `x` is `function`.
 */
export function isFunction(x: unknown): x is (...args: unknown[]) => unknown {
  return Object.prototype.toString.call(x) === "[object Function]";
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

export default {
  String: isString,
  Number: isNumber,
  Boolean: isBoolean,
  Array: isArray,
  ArrayOf: isArrayOf,
  TupleOf: isTupleOf,
  Record: isRecord,
  RecordOf: isRecordOf,
  Function: isFunction,
  Null: isNull,
  Undefined: isUndefined,
  Nullish: isNullish,
};
