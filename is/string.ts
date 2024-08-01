/**
 * Return `true` if the type of `x` is `string`.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const a: unknown = "a";
 * if (is.String(a)) {
 *   // a is narrowed to string
 *   const _: string = a;
 * }
 * ```
 */
export function isString(x: unknown): x is string {
  return typeof x === "string";
}
