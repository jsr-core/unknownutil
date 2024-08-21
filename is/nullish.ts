/**
 * Return `true` if the type of `x` is `null` or `undefined`.
 *
 * Use {@linkcode [is/null].isNull|isNull} to check if the type of `x` is `null`.
 * Use {@linkcode [is/undefined].isUndefined|isUndefined} to check if the type of `x` is `undefined`.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const a: unknown = null;
 * if (is.Nullish(a)) {
 *   const _: (null | undefined) = a;
 * }
 * ```
 */
export function isNullish(x: unknown): x is null | undefined {
  return x == null;
}
