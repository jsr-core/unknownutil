/**
 * Return `true` if the type of `x` is an object instance that satisfies `Record<PropertyKey, unknown>`.
 *
 * Note that this function check if the `x` is an instance of `Object`.
 * Use `isRecord` instead if you want to check if the `x` satisfies the `Record<PropertyKey, unknown>` type.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const a: unknown = {"a": 0, "b": 1};
 * if (is.RecordObject(a)) {
 *   // a is narrowed to Record<PropertyKey, unknown>
 *   const _: Record<PropertyKey, unknown> = a;
 * }
 *
 * const b: unknown = new Set();
 * if (is.RecordObject(b)) {
 *   // b is not a raw object, so it is not narrowed
 * }
 * ```
 */
export function isRecordObject(
  x: unknown,
): x is Record<PropertyKey, unknown> {
  return x != null && typeof x === "object" && x.constructor === Object;
}
