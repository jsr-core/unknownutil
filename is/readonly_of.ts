import { rewriteName } from "../_funcutil.ts";
import type { IsPredObj } from "../_annotation.ts";
import type { Predicate } from "../type.ts";

/**
 * Return a type predicate function that returns `true` if the type of `x` is `Readonly<ObjectOf<T>>`.
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
 * const isMyType = is.ReadonlyOf(is.ObjectOf({
 *   a: is.Number,
 *   b: is.UnionOf([is.String, is.Undefined]),
 *   c: as.Readonly(is.Boolean),
 * }));
 * const a: unknown = { a: 0, b: "b", c: true };
 * if (isMyType(a)) {
 *   const _: { readonly a: number; readonly b: string | undefined; readonly c: boolean } = a;
 * }
 * ```
 */
export function isReadonlyOf<
  T extends Record<PropertyKey, unknown>,
  P extends Record<PropertyKey, Predicate<unknown>>,
>(
  pred: Predicate<T> & IsPredObj<P>,
):
  & Predicate<Readonly<T>>
  & IsPredObj<P>;
export function isReadonlyOf<
  T extends Record<PropertyKey, unknown>,
>(
  pred: Predicate<T>,
): Predicate<Readonly<T>>;
export function isReadonlyOf<
  T extends readonly [unknown, ...unknown[]],
>(
  pred: Predicate<T>,
): Predicate<Readonly<T>>;
export function isReadonlyOf<T>(
  pred: Predicate<T>,
): Predicate<Readonly<T>> {
  if (pred.name.startsWith("isReadonlyOf(")) return pred;
  return rewriteName((x) => pred(x), "isReadonlyOf", pred);
}
