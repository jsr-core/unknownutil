import { rewriteName } from "../_funcutil.ts";
import type { AsOptional } from "../_annotation.ts";
import { hasOptional } from "../as/optional.ts";
import type { Predicate, PredicateType } from "../type.ts";
import { isArray } from "./array.ts";

/**
 * Return a type predicate function that returns `true` if the type of `x` is `ParametersOf<T>` or `ParametersOf<T, E>`.
 *
 * This is similar to {@linkcode isTupleOf}, but if {@linkcode asOptional} is specified at the trailing, the trailing elements becomes optional and makes variable-length tuple.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { as, is } from "@core/unknownutil";
 *
 * const isMyType = is.ParametersOf([
 *   is.Number,
 *   as.Optional(is.String),
 *   is.Boolean,
 *   as.Optional(is.Number),
 *   as.Optional(is.String),
 *   as.Optional(is.Boolean),
 * ] as const);
 * const a: unknown = [0, undefined, "a"];
 * if (isMyType(a)) {
 *   const _: [number, string | undefined, boolean, number?, string?, boolean?] = a;
 * }
 * ```
 *
 * With `predElse`:
 *
 * ```ts
 * import { as, is } from "@core/unknownutil";
 *
 * const isMyType = is.ParametersOf(
 *   [
 *     is.Number,
 *     as.Optional(is.String),
 *     as.Optional(is.Boolean),
 *   ] as const,
 *   is.ArrayOf(is.Number),
 * );
 * const a: unknown = [0, "a", true, 0, 1, 2];
 * if (isMyType(a)) {
 *   const _: [number, string?, boolean?, ...number[]] = a;
 * }
 * ```
 *
 * Depending on the version of TypeScript and how values are provided, it may be necessary to add `as const` to the array
 * used as `predTup`. If a type error occurs, try adding `as const` as follows:
 *
 * ```ts
 * import { as, is } from "@core/unknownutil";
 *
 * const predTup = [is.Number, is.String, as.Optional(is.Boolean)] as const;
 * const isMyType = is.ParametersOf(predTup);
 * const a: unknown = [0, "a"];
 * if (isMyType(a)) {
 *   const _: [number, string, boolean?] = a;
 * }
 * ```
 */
export function isParametersOf<
  T extends readonly [...Predicate<unknown>[]],
>(
  predTup: T,
): Predicate<ParametersOf<T>>;
export function isParametersOf<
  T extends readonly [...Predicate<unknown>[]],
  E extends Predicate<unknown[]>,
>(
  predTup: T,
  predElse: E,
): Predicate<[...ParametersOf<T>, ...PredicateType<E>]>;
export function isParametersOf<
  T extends readonly [...Predicate<unknown>[]],
  E extends Predicate<unknown[]>,
>(
  predTup: T,
  predElse?: E,
): Predicate<ParametersOf<T> | [...ParametersOf<T>, ...PredicateType<E>]> {
  const requiresLength = 1 +
    predTup.findLastIndex((pred) => !hasOptional(pred));
  if (!predElse) {
    return rewriteName(
      (x: unknown): x is ParametersOf<T> => {
        if (
          !isArray(x) || x.length < requiresLength || x.length > predTup.length
        ) {
          return false;
        }
        return predTup.every((pred, i) => pred(x[i]));
      },
      "isParametersOf",
      predTup,
    );
  } else {
    return rewriteName(
      (x: unknown): x is [...ParametersOf<T>, ...PredicateType<E>] => {
        if (!isArray(x) || x.length < requiresLength) {
          return false;
        }
        const head = x.slice(0, predTup.length);
        const tail = x.slice(predTup.length);
        return predTup.every((pred, i) => pred(head[i])) && predElse(tail);
      },
      "isParametersOf",
      predTup,
      predElse,
    );
  }
}

type ParametersOf<T> = T extends readonly [] ? []
  : T extends readonly [...infer P, infer R]
  // Tuple of predicates
    ? P extends Predicate<unknown>[]
      ? R extends Predicate<unknown> & AsOptional<unknown>
        // Last parameter is optional
        ? [...ParametersOf<P>, PredicateType<R>?]
        // Last parameter is NOT optional
      : [...ParametersOf<P>, PredicateType<R>]
    : never
  // Array of predicates
  : {
    -readonly [P in keyof T]: T[P] extends Predicate<infer U> ? U : never;
  };
