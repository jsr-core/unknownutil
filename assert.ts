import {
  isArray,
  isBoolean,
  isFunction,
  isNull,
  isNullish,
  isNumber,
  isObject,
  isString,
  isUndefined,
  Predicate,
} from "./is.ts";

/**
 * An error raised by type assertion functions
 */
export class AssertError extends Error {
  constructor(message?: string) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AssertError);
    }

    this.name = "AssertError";
  }
}

function assert<T>(
  x: unknown,
  pred: Predicate<T>,
  message = "The value is not expected type",
): asserts x is T {
  if (!pred(x)) {
    throw new AssertError(message);
  }
}

/**
 * Ensure that `x` is string, and raise `AssertError` if it is not.
 */
export function assertString(x: unknown): asserts x is string {
  return assert(x, isString, "The value must be string");
}

/**
 * Ensure that `x` is number, and raise `AssertError` if it is not.
 */
export function assertNumber(x: unknown): asserts x is number {
  return assert(x, isNumber, "The value must be number");
}

/**
 * Ensure that `x` is boolean, and raise `AssertError` if it is not.
 */
export function assertBoolean(x: unknown): asserts x is boolean {
  return assert(x, isBoolean, "The value must be boolean");
}

/**
 * Ensure that `x` is array, and raise `AssertError` if it is not.
 *
 * Use `ipred` to predicate the type of items.
 */
export function assertArray<T extends unknown>(
  x: unknown,
  ipred?: Predicate<T>,
): asserts x is T[] {
  const pred = (x: unknown): x is T[] => isArray(x, ipred);
  return assert(x, pred, "The value must be array");
}

/**
 * Ensure that `x` is object, and raise `AssertError` if it is not.
 *
 * Use `ipred` to predicate the type of values.
 */
export function assertObject<T>(
  x: unknown,
  ipred?: Predicate<T>,
): asserts x is Record<string, T> {
  const pred = (x: unknown): x is Record<string, T> => isObject(x, ipred);
  return assert(x, pred, "The value must be object");
}

/**
 * Ensure that `x` is function, and raise `AssertError` if it is not.
 */
export function assertFunction(
  x: unknown,
): asserts x is (...args: unknown[]) => unknown {
  return assert(x, isFunction, "The value must be function");
}

/**
 * Ensure that `x` is null, and raise `AssertError` if it is not.
 */
export function assertNull(x: unknown): asserts x is null {
  return assert(x, isNull, "The value must be null");
}

/**
 * Ensure that `x` is undefined, and raise `AssertError` if it is not.
 */
export function assertUndefined(x: unknown): asserts x is undefined {
  return assert(x, isUndefined, "The value must be undefined");
}

/**
 * Ensure that `x` is null or undefined, and raise `AssertError` if it is not.
 */
export function assertNullish(x: unknown): asserts x is null | undefined {
  return assert(x, isNullish, "The value must be null or undefined");
}
