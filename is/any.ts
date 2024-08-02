/**
 * Assume `x is `any` and always return `true` regardless of the type of `x`.
 *
 * Use {@linkcode isUnknown} to assume that a value is `unknown`.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const a = "a";
 * if (is.Any(a)) {
 *   const _: any = a;
 * }
 * ```
 */
// deno-lint-ignore no-explicit-any
export function isAny(_x: unknown): _x is any {
  return true;
}
