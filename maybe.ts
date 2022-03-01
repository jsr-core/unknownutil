import {
  isArray,
  isBoolean,
  isFunction,
  isLike,
  isNumber,
  isObject,
  isString,
  Predicate,
} from "./is.ts";

function maybe<T>(
  x: unknown,
  pred: Predicate<T>,
): T | undefined {
  if (!pred(x)) {
    return;
  }
  return x;
}

/**
 * Return `x` as-is if the type of the value is string or `undefined` if not.
 */
export function maybeString(x: unknown): string | undefined {
  return maybe(x, isString);
}

/**
 * Return `x` as-is if the type of the value is number or `undefined` if not.
 */
export function maybeNumber(x: unknown): number | undefined {
  return maybe(x, isNumber);
}

/**
 * Return `x` as-is if the type of the value is boolean or `undefined` if not.
 */
export function maybeBoolean(x: unknown): boolean | undefined {
  return maybe(x, isBoolean);
}

/**
 * Return `x` as-is if the type of the value is array or `undefined` if not.
 */
export function maybeArray<T extends unknown>(
  x: unknown,
  ipred?: Predicate<T>,
): T[] | undefined {
  const pred = (x: unknown): x is T[] => isArray(x, ipred);
  return maybe(x, pred);
}

/**
 * Return `x` as-is if the type of the value is object or `undefined` if not.
 */
export function maybeObject<T>(
  x: unknown,
  ipred?: Predicate<T>,
): Record<string, T> | undefined {
  const pred = (x: unknown): x is Record<string, T> => isObject(x, ipred);
  return maybe(x, pred);
}

/**
 * Return `x` as-is if the type of the value is function or `undefined` if not.
 */
export function maybeFunction(
  x: unknown,
): ((...args: unknown[]) => unknown) | undefined {
  return maybe(x, isFunction);
}

/**
 * Return `x` as-is if the type of the value follow the reference or `undefined` if not.
 */
export function maybeLike<R, T extends unknown>(
  ref: R,
  x: unknown,
  ipred?: Predicate<T>,
): R | undefined {
  const pred = (x: unknown): x is R => isLike(ref, x, ipred);
  return maybe(x, pred);
}
