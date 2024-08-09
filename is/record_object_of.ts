import { rewriteName } from "../_funcutil.ts";
import type { Predicate } from "../type.ts";
import { isRecordObject } from "./record_object.ts";

/**
 * Return a type predicate function that returns `true` if the type of `x` is an Object instance that satisfies `Record<K, T>`.
 *
 * Note that this function check if the `x` is an instance of `Object`.
 * Use {@linkcode isRecordOf} instead if you want to check if the `x` satisfies the `Record<K, T>` type.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const isMyType = is.RecordObjectOf(is.Number);
 * const a: unknown = {"a": 0, "b": 1};
 * if (isMyType(a)) {
 *   const _: Record<PropertyKey, number> = a;
 * }
 * ```
 *
 * With predicate function for keys:
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const isMyType = is.RecordObjectOf(is.Number, is.String);
 * const a: unknown = {"a": 0, "b": 1};
 * if (isMyType(a)) {
 *   const _: Record<string, number> = a;
 * }
 * ```
 */
export function isRecordObjectOf<T, K extends PropertyKey = PropertyKey>(
  pred: Predicate<T>,
  predKey?: Predicate<K>,
): Predicate<Record<K, T>> {
  return rewriteName(
    (x: unknown): x is Record<K, T> => {
      if (!isRecordObject(x)) return false;
      const keys = Object.keys(x);
      for (const k of keys) {
        if (!pred(x[k])) return false;
        if (predKey && !predKey(k)) return false;
      }
      return true;
    },
    "isRecordObjectOf",
    pred,
    predKey,
  );
}
