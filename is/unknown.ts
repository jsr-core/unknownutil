/**
 * Assume `x` is `unknown` and always return `true` regardless of the type of `x`.
 *
 * Use {@linkcode [is/any].isAny|isAny} to assume that the type of `x` is `any`.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const a = "a";
 * if (is.Unknown(a)) {
 *   const _: unknown = a;
 * }
 * ```
 */
export function isUnknown(_x: unknown): _x is unknown {
  return true;
}
