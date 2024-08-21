import { rewriteName } from "../_funcutil.ts";
import type { Predicate, PredicateType } from "../type.ts";
import {
  annotate,
  type AsOptional,
  hasAnnotation,
  unannotate,
} from "../_annotation.ts";

/**
 * Annotate the given predicate function as optional.
 *
 * Use this function to annotate a predicate function of `predObj` in {@linkcode https://jsr.io/@core/unknownutil/doc/is/object-of/~/isObjectOf|isObjectOf}.
 *
 * Note that the annotated predicate function will return `true` if the type of `x` is `T` or `undefined`, indicating that
 * this function is not just for annotation but it also changes the behavior of the predicate function.
 *
 * Use {@linkcode asUnoptional} to remove the annotation.
 * Use {@linkcode hasOptional} to check if a predicate function has annotated with this function.
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
  & AsOptional<PredicateType<P>> {
  if (hasAnnotation(pred, "optional")) {
    return pred as
      & Extract<P, Predicate<PredicateType<P>>>
      & Predicate<PredicateType<P> | undefined>
      & AsOptional<PredicateType<P>>;
  }
  return rewriteName(
    annotate(
      (x) => x === undefined || pred(x),
      "optional",
      pred,
    ),
    "asOptional",
    pred,
  ) as unknown as
    & Extract<P, Predicate<PredicateType<P>>>
    & Predicate<PredicateType<P> | undefined>
    & AsOptional<PredicateType<P>>;
}

/**
 * Unannotate the annotated predicate function with {@linkcode asOptional}.
 *
 * Use this function to unannotate a predicate function of `predObj` in {@linkcode isObjectOf}.
 *
 * Note that the annotated predicate function will return `true` if the type of `x` is `T`, indicating that
 * this function is not just for annotation but it also changes the behavior of the predicate function.
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
): pred is P & AsOptional<T> {
  return hasAnnotation(pred, "optional");
}
