/**
 * A type decision function
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
 * Return a predicate function that returns `true` if the type of `x` is `T[]`.
 */
export function isArrayOf<T>(
  pred: Predicate<T>,
): Predicate<T[]> {
  return (x: unknown): x is T[] => isArray(x) && x.every(pred);
}

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
 * Return a predicate function that returns `true` if the type of `x` is `RecordOf<T>`.
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
  Record: isRecord,
  RecordOf: isRecordOf,
  Function: isFunction,
  Null: isNull,
  Undefined: isUndefined,
  Nullish: isNullish,
};
