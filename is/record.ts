/**
 * Return `true` if the type of `x` satisfies `Record<PropertyKey, unknown>`.
 *
 * Note that this function returns `true` for ambiguous instances like `Set`, `Map`, `Date`, `Promise`, etc.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const a: unknown = {"a": 0, "b": 1};
 * if (is.Record(a)) {
 *   // a is narrowed to Record<PropertyKey, unknown>
 *   const _: Record<PropertyKey, unknown> = a;
 * }
 *
 * const b: unknown = new Set();
 * if (is.Record(b)) {
 *   // b is narrowed to Record<PropertyKey, unknown>
 *   const _: Record<PropertyKey, unknown> = b;
 * }
 * ```
 */
export function isRecord(
  x: unknown,
): x is Record<PropertyKey, unknown> {
  return x != null && !Array.isArray(x) && typeof x === "object";
}
