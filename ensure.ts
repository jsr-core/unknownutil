import type { Predicate } from "./type.ts";
import { assert } from "./assert.ts";

/**
 * Ensures that the given value satisfies the provided predicate.
 *
 * It throws {@linkcode [assert].AssertError|AssertError} if the value does not satisfy the predicate.
 *
 * ```ts
 * import { ensure, is } from "@core/unknownutil";
 *
 * const a: unknown = "hello";
 * const _: string = ensure(a, is.String);
 * ```
 *
 * @param x The value to be ensured.
 * @param pred The predicate function to test the value against.
 * @param options Optional configuration for the assertion.
 * @returns The input value `x`.
 */
export function ensure<T>(
  x: unknown,
  pred: Predicate<T>,
  options: { message?: string; name?: string } = {},
): T {
  assert(x, pred, options);
  return x;
}
