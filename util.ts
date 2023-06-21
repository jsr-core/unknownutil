import type { Predicate } from "./is.ts";

/**
 * Represents an error that occurs when an assertion fails.
 */
export class AssertError extends Error {
  /**
   * Constructs a new `AssertError` instance.
   * @param message The error message.
   */
  constructor(message?: string) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AssertError);
    }

    this.name = this.constructor.name;
  }
}

/**
 * Asserts that the given value satisfies the provided predicate.
 *
 * ```ts
 * import { assert } from "./util.ts";
 * import { isString } from "./is.ts";
 *
 * const a: unknown = "hello";
 * assert(a, isString);
 * // a is now narrowed to string
 * ```
 *
 * @param x The value to be asserted.
 * @param pred The predicate function to test the value against.
 * @param options Optional configuration for the assertion.
 * @returns Nothing. The function has a return type of `asserts x is T` to help TypeScript narrow down the type of `x` after the assertion.
 * @throws {AssertError} If the value does not satisfy the predicate.
 */
export function assert<T>(
  x: unknown,
  pred: Predicate<T>,
  options: { message?: string } = {},
): asserts x is T {
  if (!pred(x)) {
    throw new AssertError(
      options.message ?? "The value is not the expected type",
    );
  }
}

/**
 * Ensures that the given value satisfies the provided predicate.
 *
 * ```ts
 * import { ensure } from "./util.ts";
 * import { isString } from "./is.ts";
 *
 * const a: unknown = "hello";
 * const _: string = ensure(a, isString);
 * ```
 *
 * @param x The value to be ensured.
 * @param pred The predicate function to test the value against.
 * @param options Optional configuration for the assertion.
 * @returns The input value `x`.
 * @throws {AssertError} If the value does not satisfy the predicate.
 */
export function ensure<T>(
  x: unknown,
  pred: Predicate<T>,
  options: { message?: string } = {},
): T {
  assert(x, pred, options);
  return x;
}

/**
 * Returns the input value if it satisfies the provided predicate, or `undefined` otherwise.
 *
 * ```ts
 * import { maybe } from "./util.ts";
 * import { isString } from "./is.ts";
 *
 * const a: unknown = "hello";
 * const _: string = maybe(a, isString) ?? "default value";
 * ```
 *
 * @param x The value to be tested.
 * @param pred The predicate function to test the value against.
 * @returns The input value `x` if it satisfies the predicate, or `undefined` otherwise.
 */
export function maybe<T>(
  x: unknown,
  pred: Predicate<T>,
): T | undefined {
  return pred(x) ? x : undefined;
}
