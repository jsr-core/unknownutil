import type { Primitive } from "../type.ts";

const primitiveSet: Set<Primitive> = new Set([
  "string",
  "number",
  "bigint",
  "boolean",
  "symbol",
]);

/**
 * Return `true` if the type of `x` is `Primitive`.
 *
 * ```ts
 * import { is, type Primitive } from "@core/unknownutil";
 *
 * const a: unknown = 0;
 * if (is.Primitive(a)) {
 *   // a is narrowed to Primitive
 *   const _: Primitive = a;
 * }
 * ```
 */
export function isPrimitive(x: unknown): x is Primitive {
  return x == null || primitiveSet.has(typeof x);
}
