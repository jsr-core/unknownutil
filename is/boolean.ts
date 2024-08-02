/**
 * Return `true` if the type of `x` is `boolean`.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const a: unknown = true;
 * if (is.Boolean(a)) {
 *   const _: boolean = a;
 * }
 * ```
 */
export function isBoolean(x: unknown): x is boolean {
  return typeof x === "boolean";
}
