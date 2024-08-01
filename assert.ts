import type { Predicate } from "./type.ts";

export type AssertMessageFactory = (
  x: unknown,
  pred: Predicate<unknown>,
  name?: string,
) => string;

export const defaultAssertMessageFactory: AssertMessageFactory = (
  x,
  pred,
  name,
) => {
  const p = pred.name || "anonymous predicate";
  const t = typeof x;
  const v = JSON.stringify(x, null, 2);
  return `Expected ${
    name ?? "a value"
  } that satisfies the predicate ${p}, got ${t}: ${v}`;
};

let assertMessageFactory = defaultAssertMessageFactory;

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
 * Sets the factory function used to generate assertion error messages.
 * @param factory The factory function.
 * @example
 * ```ts
 * import { is, setAssertMessageFactory } from "@core/unknownutil";
 *
 * setAssertMessageFactory((x, pred) => {
 *   if (pred === is.String) {
 *     return `Expected a string, got ${typeof x}`;
 *   } else if (pred === is.Number) {
 *     return `Expected a number, got ${typeof x}`;
 *   } else if (pred === is.Boolean) {
 *     return `Expected a boolean, got ${typeof x}`;
 *   } else {
 *     return `Expected a value that satisfies the predicate, got ${typeof x}`;
 *   }
 * });
 * ```
 */
export function setAssertMessageFactory(factory: AssertMessageFactory): void {
  assertMessageFactory = factory;
}

/**
 * Asserts that the given value satisfies the provided predicate.
 *
 * ```ts
 * import { assert, is } from "@core/unknownutil";
 *
 * const a: unknown = "hello";
 * assert(a, is.String);
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
  options: { message?: string; name?: string } = {},
): asserts x is T {
  if (!pred(x)) {
    throw new AssertError(
      options.message ?? assertMessageFactory(x, pred, options.name),
    );
  }
}
