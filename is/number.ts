/**
 * Return `true` if the type of `x` is `number`.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const a: unknown = 0;
 * if (is.Number(a)) {
 *   const _: number = a;
 * }
 * ```
 */
export function isNumber(x: unknown): x is number {
  return typeof x === "number";
}
