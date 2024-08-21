/**
 * Return `true` if the type of `x` is `Map<unknown, unknown>`.
 *
 * Use {@linkcode [is/map-of].isMapOf|isMapOf} to check if the type of `x` is a map of `T`.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const a: unknown = new Map([["a", 0], ["b", 1]]);
 * if (is.Map(a)) {
 *   const _: Map<unknown, unknown> = a;
 * }
 * ```
 */
export function isMap(x: unknown): x is Map<unknown, unknown> {
  return x instanceof Map;
}
