import { rewriteName } from "../_funcutil.ts";
import { annotate } from "../_annotation.ts";
import type { Predicate } from "../type.ts";

/**
 * Return a type predicate function that returns `true` if the type of `x` is `UnionOf<T>`.
 *
 * Use {@linkcode isIntersectionOf} to check if the type of `x` is an intersection of `T`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const isMyType = is.UnionOf([is.Number, is.String, is.Boolean]);
 * const a: unknown = 0;
 * if (isMyType(a)) {
 *   const _: number | string | boolean = a;
 * }
 * ```
 *
 * Depending on the version of TypeScript and how values are provided, it may be necessary to add `as const` to the array
 * used as `preds`. If a type error occurs, try adding `as const` as follows:
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const preds = [is.Number, is.String, is.Boolean] as const;
 * const isMyType = is.UnionOf(preds);
 * const a: unknown = 0;
 * if (isMyType(a)) {
 *   const _: number | string | boolean = a;
 * }
 * ```
 */
export function isUnionOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
>(
  preds: T,
): Predicate<UnionOf<T>> {
  return annotate(
    rewriteName(
      (x: unknown): x is UnionOf<T> => preds.some((pred) => pred(x)),
      "isUnionOf",
      preds,
    ),
    "union",
    preds,
  );
}

type UnionOf<T> = T extends readonly [Predicate<infer U>, ...infer R]
  ? U | UnionOf<R>
  : never;
