import type { FlatType } from "../_typeutil.ts";
import type { WithPredObj } from "../_annotation.ts";
import { asReadonly } from "../as/readonly.ts";
import type { Predicate } from "../type.ts";
import { isObjectOf } from "../is/object_of.ts";

/**
 * Return a type predicate function that returns `true` if the type of `x` is `Readonly<ObjectOf<T>>`.
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
  pred: Predicate<T> & WithPredObj<P>,
):
  & Predicate<FlatType<Readonly<T>>>
  & WithPredObj<P> {
  const predObj = Object.fromEntries(
    Object.entries(pred.predObj).map(([k, v]) => [k, asReadonly(v)]),
  ) as Record<PropertyKey, Predicate<unknown>>;
  return isObjectOf(predObj) as
    & Predicate<FlatType<Readonly<T>>>
    & WithPredObj<P>;
}
