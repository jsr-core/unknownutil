import { rewriteName } from "../_funcutil.ts";
import type { Predicate } from "../type.ts";
import {
  annotate,
  hasAnnotation,
  unannotate,
  type WithReadonly,
} from "../_annotation.ts";

/**
 * Return an `Readonly` annotated type predicate function that returns `true` if the type of `x` is `T`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { as, is } from "@core/unknownutil";
 *
 * const isMyType = is.ObjectOf({
 *   foo: as.Readonly(is.String),
 * });
 * const a: unknown = {};
 * if (isMyType(a)) {
 *   // a is narrowed to {readonly foo: string}
 *   const _: {readonly foo: string} = a;
 * }
 * ```
 */
export function asReadonly<T>(
  pred: Predicate<T>,
): Predicate<T> & WithReadonly {
  if (hasAnnotation(pred, "readonly")) {
    return pred as Predicate<T> & WithReadonly;
  }
  return rewriteName(
    annotate(
      (x: unknown): x is T => pred(x),
      "readonly",
      pred,
    ),
    "asReadonly",
    pred,
  ) as Predicate<T> & WithReadonly;
}

/**
 * Return an `Readonly` un-annotated type predicate function that returns `true` if the type of `x` is `T`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { as, is } from "@core/unknownutil";
 *
 * const isMyType = is.ObjectOf({
 *   foo: as.Unreadonly(as.Readonly(is.String)),
 * });
 * const a: unknown = {foo: "a"};
 * if (isMyType(a)) {
 *   // a is narrowed to {foo: string}
 *   const _: {foo: string} = a;
 * }
 * ```
 */
export function asUnreadonly<
  P extends Predicate<unknown>,
  T extends P extends Predicate<infer T> ? T : never,
>(pred: P): Predicate<T> {
  if (!hasAnnotation(pred, "readonly")) {
    return pred as Predicate<T>;
  }
  return unannotate(pred, "readonly") as Predicate<T>;
}

/**
 * Check if the given type predicate has readonly annotation.
 */
export function hasReadonly<
  P extends Predicate<unknown>,
>(
  pred: P,
): pred is P & WithReadonly {
  return hasAnnotation(pred, "readonly");
}
