import { Predicate } from "./is.ts";
import {
  assertArray,
  assertBoolean,
  assertFunction,
  assertLike,
  assertNullish,
  assertNull,
  assertNumber,
  assertObject,
  assertString,
  assertUndefined,
} from "./assert.ts";

/**
 * Return `x` as-is if `x` is string or raise an `EnsureError` when it's not.
 */
export function assumeString(x: unknown): string {
  assertString(x);
  return x;
}

/**
 * Return `x` as-is if `x` is number or raise an `EnsureError` when it's not.
 */
export function assumeNumber(x: unknown): number {
  assertNumber(x);
  return x;
}

/**
 * Return `x` as-is if `x` is boolean or raise an `EnsureError` when it's not.
 */
export function assumeBoolean(x: unknown): boolean {
  assertBoolean(x);
  return x;
}

/**
 * Return `x` as-is if `x` is array or raise an `EnsureError` when it's not.
 */
export function assumeArray<T extends unknown>(
  x: unknown,
  ipred?: Predicate<T>,
): T[] {
  assertArray(x, ipred);
  return x;
}

/**
 * Return `x` as-is if `x` is object or raise an `EnsureError` when it's not.
 */
export function assumeObject<T>(
  x: unknown,
  ipred?: Predicate<T>,
): Record<string, T> {
  assertObject(x, ipred);
  return x;
}

/**
 * Return `x` as-is if `x` is function or raise an `EnsureError` when it's not.
 */
export function assumeFunction(x: unknown): (...args: unknown[]) => unknown {
  assertFunction(x);
  return x;
}

/**
 * Return `x` as-is if `x` is null or raise an `EnsureError` when it's not.
 */
export function assumeNull(x: unknown): null {
  assertNull(x);
  return x;
}

/**
 * Return `x` as-is if `x` is undefined or raise an `EnsureError` when it's not.
 */
export function assumeUndefined(x: unknown): undefined {
  assertUndefined(x);
  return x;
}

/**
 * Return `x` as-is if `x` is null or undefined or raise an `EnsureError` when it's not.
 */
export function assumeNullish(x: unknown): null | undefined {
  assertNullish(x);
  return x;
}

/**
 * Return `x` as-is if `x` follows the reference or raise an `EnsureError` when it doesn't.
 */
export function assumeLike<R, T extends unknown>(
  ref: R,
  x: unknown,
  ipred?: Predicate<T>,
): R {
  assertLike(ref, x, ipred);
  return x;
}
