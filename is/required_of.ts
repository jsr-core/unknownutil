import type { FlatType } from "../_typeutil.ts";
import type { IsPredObj } from "../_annotation.ts";
import { asUnoptional } from "../as/optional.ts";
import type { Predicate } from "../type.ts";
import { isObjectOf } from "./object_of.ts";

/**
 * Return a type predicate function that returns `true` if the type of `x` is `Required<ObjectOf<T>>`.
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
 * const isMyType = is.RequiredOf(is.ObjectOf({
 *   a: is.Number,
 *   b: is.UnionOf([is.String, is.Undefined]),
 *   c: as.Optional(is.Boolean),
 * }));
 * const a: unknown = { a: 0, b: "b", c: true, other: "other" };
 * if (isMyType(a)) {
 *   const _: { a: number; b: string | undefined; c: boolean } = a;
 * }
 * ```
 */
export function isRequiredOf<
  T extends Record<PropertyKey, unknown>,
  P extends Record<PropertyKey, Predicate<unknown>>,
>(
  pred: Predicate<T> & IsPredObj<P>,
):
  & Predicate<FlatType<Required<T>>>
  & IsPredObj<P> {
  const predObj = Object.fromEntries(
    Object.entries(pred.predObj).map(([k, v]) => [k, asUnoptional(v)]),
  );
  return isObjectOf(predObj) as
    & Predicate<FlatType<Required<T>>>
    & IsPredObj<P>;
}
