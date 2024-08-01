/**
 * Return `true` if the type of `x` is `bigint`.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const a: unknown = 0n;
 * if (is.Bigint(a)) {
 *   // a is narrowed to bigint
 *   const _: bigint = a;
 * }
 * ```
 */
export function isBigint(x: unknown): x is bigint {
  return typeof x === "bigint";
}
