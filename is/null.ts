/**
 * Return `true` if the type of `x` is `null`.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const a: unknown = null;
 * if (is.Null(a)) {
 *   const _: null = a;
 * }
 * ```
 */
export function isNull(x: unknown): x is null {
  return x === null;
}
