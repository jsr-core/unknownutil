import { Predicate } from "./is.ts";
import {
  ensure,
  ensureArray,
  ensureBoolean,
  ensureFunction,
  ensureLike,
  ensureNone,
  ensureNull,
  ensureNumber,
  ensureObject,
  ensureString,
  ensureUndefined,
} from "./ensure.ts";

/**
 * Return `x` as-is if `x` is expected type or raise an `EnsureError` when it's not.
 */
export function require<T>(
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
export function requireString(x: unknown): string {
  ensureString(x);
  return x;
}

/**
 * Return `x` as-is if `x` is number or raise an `EnsureError` when it's not.
 */
export function requireNumber(x: unknown): number {
  ensureNumber(x);
  return x;
}

/**
 * Return `x` as-is if `x` is boolean or raise an `EnsureError` when it's not.
 */
export function requireBoolean(x: unknown): boolean {
  ensureBoolean(x);
  return x;
}

/**
 * Return `x` as-is if `x` is array or raise an `EnsureError` when it's not.
 */
export function requireArray<T extends unknown>(
  x: unknown,
  ipred?: Predicate<T>,
): T[] {
  ensureArray(x, ipred);
  return x;
}

/**
 * Return `x` as-is if `x` is object or raise an `EnsureError` when it's not.
 */
export function requireObject<T>(
  x: unknown,
  ipred?: Predicate<T>,
): Record<string, T> {
  ensureObject(x, ipred);
  return x;
}

/**
 * Return `x` as-is if `x` is function or raise an `EnsureError` when it's not.
 */
export function requireFunction(
  x: unknown,
): (...args: unknown[]) => unknown {
  ensureFunction(x);
  return x;
}

/**
 * Return `x` as-is if `x` is null or raise an `EnsureError` when it's not.
 */
export function requireNull(x: unknown): null {
  ensureNull(x);
  return x;
}

/**
 * Return `x` as-is if `x` is undefined or raise an `EnsureError` when it's not.
 */
export function requireUndefined(x: unknown): undefined {
  ensureUndefined(x);
  return x;
}

/**
 * Return `x` as-is if `x` is null or undefined or raise an `EnsureError` when it's not.
 */
export function requireNone(x: unknown): null | undefined {
  ensureNone(x);
  return x;
}

/**
 * Return `x` as-is if `x` follows the reference or raise an `EnsureError` when it doesn't.
 */
export function requireLike<R, T extends unknown>(
  ref: R,
  x: unknown,
  ipred?: Predicate<T>,
): R {
  ensureLike(ref, x, ipred);
  return x;
}
