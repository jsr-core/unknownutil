/**
 * Return `true` if the type of `x` is `Set<unknown>`.
 *
 * Use {@linkcode isSetOf} to check if the type of `x` is a set of `T`.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const a: unknown = new Set([0, 1, 2]);
 * if (is.Set(a)) {
 *   const _: Set<unknown> = a;
 * }
 * ```
 */
export function isSet(x: unknown): x is Set<unknown> {
  return x instanceof Set;
}
