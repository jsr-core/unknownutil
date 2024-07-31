import type { Predicate } from "../is.ts";
import { rewriteName } from "../_funcutil.ts";
import { annotate, hasAnnotation, unannotate } from "../_annotation.ts";

/**
 * Annotation for optional.
 */
export type WithOptional<T> = {
  optional: Predicate<T>;
};

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
 *   // a is narrowed to {foo?: string}
 *   const _: {foo?: string} = a;
 * }
 * ```
 */
export function asOptional<T>(
  pred: Predicate<T>,
): Predicate<T | undefined> & WithOptional<T> {
  if (hasAnnotation(pred, "optional")) {
    return pred as Predicate<T | undefined> & WithOptional<T>;
  }
  return rewriteName(
    annotate(
      (x: unknown): x is T | undefined => x === undefined || pred(x),
      "optional",
      pred,
    ),
    "asOptional",
    pred,
  ) as Predicate<T | undefined> & WithOptional<T>;
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
 *   // a is narrowed to {foo: string}
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
