/**
 * Return `true` if the type of `x` is `null`.
 *
 * Use {@linkcode [is/undefined].isUndefined|isUndefined} to check if the type of `x` is `undefined`.
 * Use {@linkcode [is/nullish].isNullish|isNullish} to check if the type of `x` is `null` or `undefined`.
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
