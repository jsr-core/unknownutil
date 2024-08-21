/**
 * Return `true` if the type of `x` is `unknown[]`.
 *
 * Use {@linkcode [is/arrayt-of].isArrayOf|isArrayOf} to check if the type of `x` is an array of `T`.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const a: unknown = [0, 1, 2];
 * if (is.Array(a)) {
 *   const _: unknown[] = a;
 * }
 * ```
 */
export function isArray(
  x: unknown,
): x is unknown[] {
  return Array.isArray(x);
}
