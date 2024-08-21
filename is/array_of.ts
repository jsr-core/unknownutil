import { rewriteName } from "../_funcutil.ts";
import type { Predicate } from "../type.ts";
import { isArray } from "./array.ts";

/**
 * Return a type predicate function that returns `true` if the type of `x` is `T[]`.
 *
 * Use {@linkcode [is/array].isArray|isArray} to check if the type of `x` is an array of `unknown`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const isMyType = is.ArrayOf(is.String);
 * const a: unknown = ["a", "b", "c"];
 * if (isMyType(a)) {
 *   const _: string[] = a;
 * }
 * ```
 */
export function isArrayOf<T>(
  pred: Predicate<T>,
): Predicate<T[]> {
  return rewriteName(
    (x: unknown): x is T[] => isArray(x) && x.every((v) => pred(v)),
    "isArrayOf",
    pred,
  );
}
