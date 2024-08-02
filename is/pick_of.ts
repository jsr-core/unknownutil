import type { FlatType } from "../_typeutil.ts";
import type { IsPredObj } from "../_annotation.ts";
import type { Predicate } from "../type.ts";
import { isObjectOf } from "./object_of.ts";

/**
 * Return a type predicate function that returns `true` if the type of `x` is `Pick<ObjectOf<T>, K>`.
 *
 * It only supports modifing a predicate function annotated with `IsPredObj`, usually returned by the followings
 *
 * - {@linkcode isIntersectionOf}
 * - {@linkcode isObjectOf}
 * - {@linkcode isOmitOf}
 * - {@linkcode isPartialOf}
 * - {@linkcode isPickOf}
 * - {@linkcode isReadonlyOf}
 * - {@linkcode isRequiredOf}
 * - {@linkcode isStrictOf}
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```typescript
 * import { as, is } from "@core/unknownutil";
 *
 * const isMyType = is.PickOf(is.ObjectOf({
 *   a: is.Number,
 *   b: is.String,
 *   c: as.Optional(is.Boolean),
 * }), ["a", "c"]);
 * const a: unknown = { a: 0, b: "a" };
 * if (isMyType(a)) {
 *   const _: { a: number; c?: boolean | undefined } = a;
 * }
 * ```
 */
export function isPickOf<
  T extends Record<PropertyKey, unknown>,
  P extends Record<PropertyKey, Predicate<unknown>>,
  K extends keyof T,
>(
  pred: Predicate<T> & IsPredObj<P>,
  keys: K[],
):
  & Predicate<FlatType<Pick<T, K>>>
  & IsPredObj<P> {
  const s = new Set(keys);
  const predObj = Object.fromEntries(
    Object.entries(pred.predObj).filter(([k]) => s.has(k as K)),
  );
  return isObjectOf(predObj) as
    & Predicate<FlatType<Pick<T, K>>>
    & IsPredObj<P>;
}
