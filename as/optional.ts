import { rewriteName } from "../_funcutil.ts";
import type { Predicate, PredicateType } from "../type.ts";
import {
  annotate,
  hasAnnotation,
  unannotate,
  type WithOptional,
} from "../_annotation.ts";

/**
 * Return an `Optional` annotated type predicate function that returns `true` if the type of `x` is `T` or `undefined`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { as, is } from "@core/unknownutil";
 *
 * const isMyType = is.ObjectOf({
 *   foo: as.Optional(is.String),
 * });
 * const a: unknown = {};
 * if (isMyType(a)) {
 *   const _: {foo?: string} = a;
 * }
 * ```
 */
export function asOptional<P extends Predicate<unknown>>(
  pred: P,
):
  & Extract<P, Predicate<PredicateType<P>>>
  & Predicate<PredicateType<P> | undefined>
  & WithOptional<PredicateType<P>> {
  if (hasAnnotation(pred, "optional")) {
    return pred as
      & Extract<P, Predicate<PredicateType<P>>>
      & Predicate<PredicateType<P> | undefined>
      & WithOptional<PredicateType<P>>;
  }
  return rewriteName(
    annotate(
      (x: unknown) => x === undefined || pred(x),
      "optional",
      pred,
    ),
    "asOptional",
    pred,
  ) as unknown as
    & Extract<P, Predicate<PredicateType<P>>>
    & Predicate<PredicateType<P> | undefined>
    & WithOptional<PredicateType<P>>;
}

/**
 * Return an `Optional` un-annotated type predicate function that returns `true` if the type of `x` is `T`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { as, is } from "@core/unknownutil";
 *
 * const isMyType = is.ObjectOf({
 *   foo: as.Unoptional(as.Optional(is.String)),
 * });
 * const a: unknown = {foo: "a"};
 * if (isMyType(a)) {
 *   const _: {foo: string} = a;
 * }
 * ```
 */
export function asUnoptional<
  P extends Predicate<unknown>,
  T extends P extends Predicate<infer T | undefined> ? T
    : P extends Predicate<infer T> ? T
    : never,
>(pred: P): Predicate<T> {
  if (!hasAnnotation(pred, "optional")) {
    return pred as Predicate<T>;
  }
  return unannotate(pred, "optional") as Predicate<T>;
}

/**
 * Check if the given type predicate has optional annotation.
 */
export function hasOptional<
  P extends Predicate<unknown>,
  T extends P extends Predicate<infer T | undefined> ? T
    : P extends Predicate<infer T> ? T
    : never,
>(
  pred: P,
): pred is P & WithOptional<T> {
  return hasAnnotation(pred, "optional");
}
