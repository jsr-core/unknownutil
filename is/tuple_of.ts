import { rewriteName } from "../_funcutil.ts";
import type { Predicate, PredicateType } from "../type.ts";
import { isArray } from "./array.ts";

/**
 * Return a type predicate function that returns `true` if the type of `x` is `TupleOf<T>`.
 *
 * Use {@linkcode isUniformTupleOf} to check if the type of `x` is a tuple of uniform types.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const isMyType = is.TupleOf([is.Number, is.String, is.Boolean]);
 * const a: unknown = [0, "a", true];
 * if (isMyType(a)) {
 *   const _: [number, string, boolean] = a;
 * }
 * ```
 *
 * With `predRest` to represent rest elements or leading rest elements:
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const isMyType = is.TupleOf(
 *   [is.Number, is.String, is.Boolean],
 *   is.ArrayOf(is.Number),
 * );
 * const a: unknown = [0, "a", true, 0, 1, 2];
 * if (isMyType(a)) {
 *   const _: [number, string, boolean, ...number[]] = a;
 * }
 *
 * const isMyTypeLeadingRest = is.TupleOf(
 *   is.ArrayOf(is.Number),
 *   [is.Number, is.String, is.Boolean],
 * );
 * if (isMyTypeLeadingRest(a)) {
 *   const _: [...number[], number, string, boolean] = a;
 * }
 * ```
 *
 * With `predRest` and `predTrail` to represent middle rest elements:
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const isMyType = is.TupleOf(
 *   [is.Number, is.String, is.Boolean],
 *   is.ArrayOf(is.Number),
 *   [is.Number, is.String, is.Boolean],
 * );
 * const a: unknown = [0, "a", true, 0, 1, 2, 0, "a", true];
 * if (isMyType(a)) {
 *   const _: [number, string, boolean, ...number[], number, string, boolean] = a;
 * }
 * ```
 *
 * Depending on the version of TypeScript and how values are provided, it may be necessary to add `as const` to the array
 * used as `predTup`. If a type error occurs, try adding `as const` as follows:
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const predTup = [is.Number, is.String, is.Boolean] as const;
 * const isMyType = is.TupleOf(predTup);
 * const a: unknown = [0, "a", true];
 * if (isMyType(a)) {
 *   const _: [number, string, boolean] = a;
 * }
 * ```
 */
export function isTupleOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
>(
  predTup: T,
): Predicate<TupleOf<T>>;

export function isTupleOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
  R extends Predicate<unknown[]>,
>(
  predTup: T,
  predRest: R,
): Predicate<[...TupleOf<T>, ...PredicateType<R>]>;

export function isTupleOf<
  R extends Predicate<unknown[]>,
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
>(
  predRest: R,
  predTup: T,
): Predicate<[...PredicateType<R>, ...TupleOf<T>]>;

export function isTupleOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
  R extends Predicate<unknown[]>,
  L extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
>(
  predTup: T,
  predRest: R,
  predTrail: L,
): Predicate<[...TupleOf<T>, ...PredicateType<R>, ...TupleOf<T>]>;

export function isTupleOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
  R extends Predicate<unknown[]>,
  L extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
>(
  predTupOrRest: T | R,
  predRestOrTup?: R | T,
  predTrail?: L,
): Predicate<
  | TupleOf<T>
  | [...TupleOf<T>, ...PredicateType<R>]
  | [...PredicateType<R>, ...TupleOf<T>]
  | [...TupleOf<T>, ...PredicateType<R>, ...TupleOf<T>]
> {
  if (typeof predTupOrRest === "function") {
    const predRest = predTupOrRest as R;
    const predTup = predRestOrTup as T;
    return rewriteName(
      (x: unknown): x is [...PredicateType<R>, ...TupleOf<T>] => {
        if (!isArray(x) || x.length < predTup.length) {
          return false;
        }
        const rest = x.slice(0, -predTup.length);
        const trail = x.slice(-predTup.length);
        return predTup.every((pred, i) => pred(trail[i])) && predRest(rest);
      },
      "isTupleOf",
      predRest,
      predTup,
    );
  }
  const predTup = predTupOrRest as T;
  const predRest = predRestOrTup as R;
  if (!predRest) {
    return rewriteName(
      (x: unknown): x is TupleOf<T> => {
        if (!isArray(x) || x.length !== predTup.length) {
          return false;
        }
        return predTup.every((pred, i) => pred(x[i]));
      },
      "isTupleOf",
      predTup,
    );
  } else if (!predTrail) {
    return rewriteName(
      (x: unknown): x is [...TupleOf<T>, ...PredicateType<R>] => {
        if (!isArray(x) || x.length < predTup.length) {
          return false;
        }
        const rest = x.slice(predTup.length);
        return predTup.every((pred, i) => pred(x[i])) && predRest(rest);
      },
      "isTupleOf",
      predTup,
      predRest,
    );
  } else {
    return rewriteName(
      (x: unknown): x is [...TupleOf<T>, ...PredicateType<R>] => {
        if (!isArray(x) || x.length < (predTup.length + predTrail.length)) {
          return false;
        }
        const rest = x.slice(predTup.length, -predTrail.length);
        const trail = x.slice(-predTrail.length);
        return predTup.every((pred, i) => pred(x[i])) &&
          predTrail.every((pred, i) => pred(trail[i])) &&
          predRest(rest);
      },
      "isTupleOf",
      predTup,
      predRest,
      predTrail,
    );
  }
}

type TupleOf<T> = {
  -readonly [P in keyof T]: T[P] extends Predicate<infer U> ? U : never;
};
