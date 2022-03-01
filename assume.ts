import { Predicate } from "./is.ts";
import {
  ensure,
  ensureArray,
  ensureBoolean,
  ensureFunction,
  ensureLike,
  ensureNullish,
  ensureNull,
  ensureNumber,
  ensureObject,
  ensureString,
  ensureUndefined,
} from "./ensure.ts";

/**
 * Return `x` as-is if `x` is expected type or raise an `EnsureError` when it's not.
 */
export function assume<T>(
  x: unknown,
  pred: Predicate<T>,
  message = "The value is not expected type",
): T {
  ensure(x, pred, message);
  return x;
}

/**
 * Return `x` as-is if `x` is string or raise an `EnsureError` when it's not.
 */
export function assumeString(x: unknown): string {
  ensureString(x);
  return x;
}

/**
 * Return `x` as-is if `x` is number or raise an `EnsureError` when it's not.
 */
export function assumeNumber(x: unknown): number {
  ensureNumber(x);
  return x;
}

/**
 * Return `x` as-is if `x` is boolean or raise an `EnsureError` when it's not.
 */
export function assumeBoolean(x: unknown): boolean {
  ensureBoolean(x);
  return x;
}

/**
 * Return `x` as-is if `x` is array or raise an `EnsureError` when it's not.
 */
export function assumeArray<T extends unknown>(
  x: unknown,
  ipred?: Predicate<T>,
): T[] {
  ensureArray(x, ipred);
  return x;
}

/**
 * Return `x` as-is if `x` is object or raise an `EnsureError` when it's not.
 */
export function assumeObject<T>(
  x: unknown,
  ipred?: Predicate<T>,
): Record<string, T> {
  ensureObject(x, ipred);
  return x;
}

/**
 * Return `x` as-is if `x` is function or raise an `EnsureError` when it's not.
 */
export function assumeFunction(x: unknown): (...args: unknown[]) => unknown {
  ensureFunction(x);
  return x;
}

/**
 * Return `x` as-is if `x` is null or raise an `EnsureError` when it's not.
 */
export function assumeNull(x: unknown): null {
  ensureNull(x);
  return x;
}

/**
 * Return `x` as-is if `x` is undefined or raise an `EnsureError` when it's not.
 */
export function assumeUndefined(x: unknown): undefined {
  ensureUndefined(x);
  return x;
}

/**
 * Return `x` as-is if `x` is null or undefined or raise an `EnsureError` when it's not.
 */
export function assumeNullish(x: unknown): null | undefined {
  ensureNullish(x);
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
  ensureLike(ref, x, ipred);
  return x;
}
