import type { Predicate } from "./type.ts";

/**
 * Returns the input value if it satisfies the provided predicate, or `undefined` otherwise.
 *
 * ```ts
 * import { is, maybe } from "@core/unknownutil";
 *
 * const a: unknown = "hello";
 * const _: string = maybe(a, is.String) ?? "default value";
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
