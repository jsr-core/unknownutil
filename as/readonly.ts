import { rewriteName } from "../_funcutil.ts";
import type { Predicate } from "../type.ts";
import {
  annotate,
  type AsReadonly,
  hasAnnotation,
  unannotate,
} from "../_annotation.ts";

/**
 * Annotate the given predicate function as readonly.
 *
 * Use this function to annotate a predicate function of `predObj` in {@linkcode https://jsr.io/@core/unknownutil/doc/is/object-of/~/isObjectOf|isObjectOf}.
 *
 * Use {@linkcode asUnreadonly} to remove the annotation.
 * Use {@linkcode hasReadonly} to check if a predicate function has annotated with this function.
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
 *   const _: {readonly foo: string} = a;
 * }
 * ```
 */
export function asReadonly<P extends Predicate<unknown>>(
  pred: P,
): P & AsReadonly {
  if (hasAnnotation(pred, "readonly")) {
    return pred as P & AsReadonly;
  }
  return rewriteName(
    annotate((x) => pred(x), "readonly", pred),
    "asReadonly",
    pred,
  ) as unknown as P & AsReadonly;
}

/**
 * Unannotate the annotated predicate function with {@linkcode asReadonly}.
 *
 * Use this function to unannotate a predicate function of `predObj` in {@linkcode [jsr:@core/unknownutil/is/object-of].isObjectOf}.
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
): pred is P & AsReadonly {
  return hasAnnotation(pred, "readonly");
}
