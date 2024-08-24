import type { Predicate } from "./type.ts";

const assertMessageFactory = (x: unknown, pred: Predicate<unknown>) => {
  const p = pred.name || "anonymous predicate";
  const t = typeof x;
  const v = JSON.stringify(x, null, 2);
  return `Expected a value that satisfies the predicate ${p}, got ${t}: ${v}`;
};

/**
 * Represents an error that occurs when an assertion fails.
 */
export class AssertError extends Error {
  /**
   * The value that failed the assertion.
   */
  readonly x: unknown;

  /**
   * The predicate that the value failed to satisfy.
   */
  readonly pred: Predicate<unknown>;

  /**
   * Constructs a new instance.
   *
   * @param x The value that failed the assertion.
   * @param pred The predicate that the value failed to satisfy.
   */
  constructor(x: unknown, pred: Predicate<unknown>) {
    super(assertMessageFactory(x, pred));
    this.name = this.constructor.name;
    this.x = x;
    this.pred = pred;
  }
}

/**
 * Asserts that the given value satisfies the provided predicate.
 *
 * It throws {@linkcode AssertError} if the value does not satisfy the predicate.
 *
 * @param x The value to be asserted.
 * @param pred The predicate function to test the value against.
 * @returns The function has a return type of `asserts x is T` to help TypeScript narrow down the type of `x` after the assertion.
 *
 * ```ts
 * import { assert, is } from "@core/unknownutil";
 *
 * const a: unknown = "hello";
 * assert(a, is.String);
 * // a is now narrowed to string
 * ```
 *
 * Use {@linkcode https://jsr.io/@core/errorutil/doc/alter/~/alter|@core/errorutil/alter.alter} to alter error.
 *
 * ```ts
 * import { alter } from "@core/errorutil/alter";
 * import { assert, is } from "@core/unknownutil";
 *
 * const a: unknown = 42;
 * alter(() => assert(a, is.String), new Error("a is not a string"));
 * // Error: a is not a string
 * ```
 */
export function assert<T>(
  x: unknown,
  pred: Predicate<T>,
): asserts x is T {
  if (!pred(x)) {
    throw new AssertError(x, pred);
  }
}
