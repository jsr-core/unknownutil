import { rewriteName } from "../_funcutil.ts";
import type { Predicate } from "../type.ts";
import { isArray } from "./array.ts";

/**
 * Return a type predicate function that returns `true` if the type of `x` is `UniformTupleOf<T>`.
 *
 * Use {@linkcode [is/tuple-of].isTupleOf|isTupleOf} to check if the type of `x` is a tuple of `T`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const isMyType = is.UniformTupleOf(5);
 * const a: unknown = [0, 1, 2, 3, 4];
 * if (isMyType(a)) {
 *   const _: [unknown, unknown, unknown, unknown, unknown] = a;
 * }
 * ```
 *
 * With predicate function:
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const isMyType = is.UniformTupleOf(5, is.Number);
 * const a: unknown = [0, 1, 2, 3, 4];
 * if (isMyType(a)) {
 *   const _: [number, number, number, number, number] = a;
 * }
 * ```
 */
export function isUniformTupleOf<T, N extends number>(
  n: N,
  pred?: Predicate<T>,
): Predicate<UniformTupleOf<T, N>> {
  return rewriteName(
    (x: unknown): x is UniformTupleOf<T, N> => {
      if (!isArray(x) || x.length !== n) {
        return false;
      }
      return !pred || x.every((v) => pred(v));
    },
    "isUniformTupleOf",
    n,
    pred,
  );
}

// https://stackoverflow.com/a/71700658/1273406
type UniformTupleOf<
  T,
  N extends number,
  R extends readonly T[] = [],
> = R["length"] extends N ? R : UniformTupleOf<T, N, [T, ...R]>;
