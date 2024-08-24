import type { Predicate } from "./type.ts";
import { assert } from "./assert.ts";

/**
 * Ensures that the given value satisfies the provided predicate.
 *
 * It throws {@linkcode [assert].AssertError|AssertError} if the value does not satisfy the predicate.
 *
 * @param x The value to be ensured.
 * @param pred The predicate function to test the value against.
 * @returns The input value `x`.
 *
 * ```ts
 * import { ensure, is } from "@core/unknownutil";
 *
 * const a: unknown = "hello";
 * const _: string = ensure(a, is.String);
 * ```
 *
 * Use {@linkcode https://jsr.io/@core/errorutil/doc/alter/~/alter|@core/errorutil/alter.alter} to alter error.
 *
 * ```ts
 * import { alter } from "@core/errorutil/alter";
 * import { ensure, is } from "@core/unknownutil";
 *
 * const a: unknown = 42;
 * const _: string = alter(() => ensure(a, is.String), new Error("a is not a string"));
 * // Error: a is not a string
 * ```
 */
export function ensure<T>(
  x: unknown,
  pred: Predicate<T>,
): T {
  assert(x, pred);
  return x;
}
