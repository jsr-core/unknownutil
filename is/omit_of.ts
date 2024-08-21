import type { FlatType } from "../_typeutil.ts";
import type { IsPredObj } from "../_annotation.ts";
import type { Predicate } from "../type.ts";
import { isObjectOf } from "./object_of.ts";

/**
 * Return a type predicate function that returns `true` if the type of `x` is `Omit<ObjectOf<T>, K>`.
 *
 * It only supports modifing a predicate function annotated with `IsPredObj`, usually returned by the followings
 *
 * - {@linkcode [is/intersection-of].isIntersectionOf|isIntersectionOf}
 * - {@linkcode [is/object-of].isObjectOf|isObjectOf}
 * - {@linkcode [is/omit-of].isOmitOf|isOmitOf}
 * - {@linkcode [is/partial-of].isPartialOf|isPartialOf}
 * - {@linkcode [is/pick-of].isPickOf|isPickOf}
 * - {@linkcode [is/readonly-of].isReadonlyOf|isReadonlyOf}
 * - {@linkcode [is/required-of].isRequiredOf|isRequiredOf}
 * - {@linkcode [is/strict-of].isStrictOf|isStrictOf}
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```typescript
 * import { as, is } from "@core/unknownutil";
 *
 * const isMyType = is.OmitOf(is.ObjectOf({
 *   a: is.Number,
 *   b: is.String,
 *   c: as.Optional(is.Boolean),
 * }), ["a", "c"]);
 * const a: unknown = { a: 0, b: "a" };
 * if (isMyType(a)) {
 *   const _: { b: string } = a;
 * }
 * ```
 */
export function isOmitOf<
  T extends Record<PropertyKey, unknown>,
  P extends Record<PropertyKey, Predicate<unknown>>,
  K extends keyof T,
>(
  pred: Predicate<T> & IsPredObj<P>,
  keys: K[],
):
  & Predicate<FlatType<Omit<T, K>>>
  & IsPredObj<P> {
  const predObj = { ...pred.predObj };
  for (const key of keys) {
    delete predObj[key];
  }
  return isObjectOf(predObj as Record<PropertyKey, Predicate<unknown>>) as
    & Predicate<FlatType<Omit<T, K>>>
    & IsPredObj<P>;
}
