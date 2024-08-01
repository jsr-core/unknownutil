/**
 * Return `true` if the type of `x` is `symbol`.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const a: unknown = Symbol("symbol");
 * if (is.Symbol(a)) {
 *   // a is narrowed to symbol
 *   const _: symbol = a;
 * }
 * ```
 */
export function isSymbol(x: unknown): x is symbol {
  return typeof x === "symbol";
}
