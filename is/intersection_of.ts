import { rewriteName } from "../_funcutil.ts";
import { hasAnnotation, type IsPredObj } from "../_annotation.ts";
import type { Predicate } from "../type.ts";
import { isObjectOf } from "./object_of.ts";

/**
 * Return a type predicate function that returns `true` if the type of `x` is `IntersectionOf<T>`.
 *
 * Use {@linkcode [is/union-of].isUnionOf|isUnionOf} to check if the type of `x` is a union of `T`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const isMyType = is.IntersectionOf([
 *   is.ObjectOf({ a: is.Number }),
 *   is.ObjectOf({ b: is.String }),
 * ]);
 * const a: unknown = { a: 0, b: "a" };
 * if (isMyType(a)) {
 *   const _: { a: number } & { b: string } = a;
 * }
 * ```
 *
 * Depending on the version of TypeScript and how values are provided, it may be necessary to add `as const` to the array
 * used as `preds`. If a type error occurs, try adding `as const` as follows:
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const preds = [
 *   is.ObjectOf({ a: is.Number }),
 *   is.ObjectOf({ b: is.String }),
 * ] as const
 * const isMyType = is.IntersectionOf(preds);
 * const a: unknown = { a: 0, b: "a" };
 * if (isMyType(a)) {
 *   const _: { a: number } & { b: string } = a;
 * }
 * ```
 */
export function isIntersectionOf<
  T extends readonly [
    Predicate<unknown> & IsPredObj,
    ...(Predicate<unknown> & IsPredObj)[],
  ],
>(
  preds: T,
):
  & Predicate<IntersectionOf<T>>
  & IsPredObj;
export function isIntersectionOf<
  T extends readonly [Predicate<unknown>],
>(
  preds: T,
): T[0];
export function isIntersectionOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
>(
  preds: T,
):
  & Predicate<IntersectionOf<T>>
  & IsPredObj;
export function isIntersectionOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
>(
  preds: T,
):
  | Predicate<unknown>
  | Predicate<IntersectionOf<T>>
    & IsPredObj {
  const predObj = {};
  const restPreds = preds.filter((pred) => {
    if (!hasAnnotation(pred, "predObj")) {
      return true;
    }
    Object.assign(predObj, pred.predObj);
  });
  if (restPreds.length < preds.length) {
    restPreds.push(isObjectOf(predObj));
  }
  if (restPreds.length === 1) {
    return restPreds[0];
  }
  return rewriteName(
    (x: unknown): x is IntersectionOf<T> => restPreds.every((pred) => pred(x)),
    "isIntersectionOf",
    preds,
  );
}

type TupleToIntersection<T> = T extends readonly [] ? never
  : T extends readonly [infer U] ? U
  : T extends readonly [infer U, ...infer R] ? U & TupleToIntersection<R>
  : never;

type IntersectionOf<T> = TupleToIntersection<
  {
    -readonly [P in keyof T]: T[P] extends Predicate<infer U> ? U : never;
  }
>;
