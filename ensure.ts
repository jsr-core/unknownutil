import {
  isArray,
  isFunction,
  isLike,
  isNone,
  isNull,
  isNumber,
  isObject,
  isString,
  isUndefined,
  Predicate,
} from "./is.ts";

export class EnsureError extends Error {
  constructor(message?: string) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, EnsureError);
    }

    this.name = "EnsureError";
  }
}

/**
 * Ensure if `x` is expected type by raising an `EnsureError` when it's not.
 */
export function ensure<T>(
  x: unknown,
  pred: Predicate<T>,
  message = "The value is not expected type",
): asserts x is T {
  if (!pred(x)) {
    throw new EnsureError(message);
  }
}

/**
 * Ensure if `x` is string by raising an `EnsureError` when it's not.
 */
export function ensureString(x: unknown): asserts x is string {
  return ensure(x, isString, "The value must be string");
}

/**
 * Ensure if `x` is number by raising an `EnsureError` when it's not.
 */
export function ensureNumber(x: unknown): asserts x is number {
  return ensure(x, isNumber, "The value must be number");
}

/**
 * Ensure if `x` is array by raising an `EnsureError` when it's not.
 */
export function ensureArray<T extends unknown>(
  x: unknown,
  ipred?: Predicate<T>,
): asserts x is T[] {
  const pred = (x: unknown): x is T[] => isArray(x, ipred);
  return ensure(x, pred, "The value must be array");
}

/**
 * Ensure if `x` is object by raising an `EnsureError` when it's not.
 */
export function ensureObject<T>(
  x: unknown,
  ipred?: Predicate<T>,
): asserts x is Record<string, T> {
  const pred = (x: unknown): x is Record<string, T> => isObject(x, ipred);
  return ensure(x, pred, "The value must be object");
}

/**
 * Ensure if `x` is function by raising an `EnsureError` when it's not.
 */
export function ensureFunction(
  x: unknown,
): asserts x is (...args: unknown[]) => unknown {
  return ensure(x, isFunction, "The value must be function");
}

/**
 * Ensure if `x` is null by raising an `EnsureError` when it's not.
 */
export function ensureNull(x: unknown): asserts x is null {
  return ensure(x, isNull, "The value must be null");
}

/**
 * Ensure if `x` is undefined by raising an `EnsureError` when it's not.
 */
export function ensureUndefined(x: unknown): asserts x is undefined {
  return ensure(x, isUndefined, "The value must be undefined");
}

/**
 * Ensure if `x` is null or undefined by raising an `EnsureError` when it's not.
 */
export function ensureNone(x: unknown): asserts x is null | undefined {
  return ensure(x, isNone, "The value must be null or undefined");
}

/**
 * Ensure if `x` follows the reference by raising an `EnsureError` when it doesn't.
 */
export function ensureLike<R, T extends unknown>(
  ref: R,
  x: unknown,
  ipred?: Predicate<T>,
): asserts x is R {
  const pred = (x: unknown): x is T[] => isLike(ref, x, ipred);
  return ensure(x, pred, "The value must follow the reference");
}
