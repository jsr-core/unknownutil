import { rewriteName } from "../_funcutil.ts";
import type { Predicate } from "../type.ts";
import { isMap } from "./map.ts";

/**
 * Return a type predicate function that returns `true` if the type of `x` is `Map<K, T>`.
 *
 * Use {@linkcode [is/map].isMap|isMap} to check if the type of `x` is a map of `unknown`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const isMyType = is.MapOf(is.Number);
 * const a: unknown = new Map([["a", 0], ["b", 1]]);
 * if (isMyType(a)) {
 *   const _: Map<unknown, number> = a;
 * }
 * ```
 *
 * With predicate function for keys:
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const isMyType = is.MapOf(is.Number, is.String);
 * const a: unknown = new Map([["a", 0], ["b", 1]]);
 * if (isMyType(a)) {
 *   const _: Map<string, number> = a;
 * }
 * ```
 */
export function isMapOf<T, K>(
  pred: Predicate<T>,
  predKey?: Predicate<K>,
): Predicate<Map<K, T>> {
  return rewriteName(
    (x: unknown): x is Map<K, T> => {
      if (!isMap(x)) return false;
      for (const [k, v] of x.entries()) {
        if (!pred(v)) return false;
        if (predKey && !predKey(k)) return false;
      }
      return true;
    },
    "isMapOf",
    pred,
    predKey,
  );
}
