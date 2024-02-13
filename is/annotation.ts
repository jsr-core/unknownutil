import type { Predicate } from "./type.ts";
import type { Writable } from "../_typeutil.ts";
import {
  getMetadata,
  getPredicateFactoryMetadata,
  type PredicateFactoryMetadata,
  setPredicateFactoryMetadata,
  type WithMetadata,
} from "../metadata.ts";

/**
 * Return `true` if the type of predicate function `x` is annotated as `Optional`
 */
export function isOptional<P extends Predicate<unknown>>(
  x: P,
): x is P & WithMetadata<IsOptionalOfMetadata> {
  const m = getMetadata(x);
  if (m == null) return false;
  return (m as PredicateFactoryMetadata).name === "isOptionalOf";
}

/**
 * Return an `Optional` annotated type predicate function that returns `true` if the type of `x` is `T` or `undefined`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.OptionalOf(is.String);
 * const a: unknown = "a";
 * if (isMyType(a)) {
 *   // a is narrowed to string | undefined
 *   const _: string | undefined = a;
 * }
 * ```
 */
export function isOptionalOf<T>(
  pred: Predicate<T>,
):
  & Predicate<T | undefined>
  & WithMetadata<IsOptionalOfMetadata> {
  if (isOptional(pred)) {
    return pred as
      & Predicate<T | undefined>
      & WithMetadata<IsOptionalOfMetadata>;
  }
  return Object.defineProperties(
    setPredicateFactoryMetadata(
      (x: unknown): x is Predicate<T | undefined> => x === undefined || pred(x),
      { name: "isOptionalOf", args: [pred] },
    ),
    { optional: { value: true as const } },
  ) as
    & Predicate<T | undefined>
    & WithMetadata<IsOptionalOfMetadata>;
}

type IsOptionalOfMetadata = {
  name: "isOptionalOf";
  args: Parameters<typeof isOptionalOf>;
};

/**
 * Return an `Optional` un-annotated type predicate function that returns `true` if the type of `x` is `T`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.UnwrapOptionalOf(is.OptionalOf(is.String));
 * const a: unknown = "a";
 * if (isMyType(a)) {
 *   // a is narrowed to string
 *   const _: string = a;
 * }
 * ```
 */
export function isUnwrapOptionalOf<P extends Predicate<unknown>>(
  pred: P,
): UnwrapOptionalOf<P> {
  if (!isOptional(pred)) return pred as UnwrapOptionalOf<P>;
  const { args } = getPredicateFactoryMetadata(pred);
  return args[0] as UnwrapOptionalOf<P>;
}

type UnwrapOptionalOf<T> = T extends
  Predicate<undefined | infer U> & WithMetadata<IsOptionalOfMetadata>
  ? Predicate<U>
  : T extends Predicate<unknown> ? T
  : never;

/**
 * Return `true` if the type of predicate function `x` is annotated as `Readonly`
 *
 * **This is unstable and may be removed in the future.**
 */
export function isReadonly<P extends Predicate<unknown>>(
  x: P,
): x is P & WithMetadata<IsReadonlyOfMetadata> {
  const m = getMetadata(x);
  if (m == null) return false;
  return (m as PredicateFactoryMetadata).name === "isReadonlyOf";
}

/**
 * Return an `Readonly` annotated type predicate function that returns `true` if the type of `x` is `T`.
 *
 * **This is unstable and may be removed in the future.**
 *
 * Note that this function does nothing but annotate the predicate function as `Readonly`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.ReadonlyOf(is.TupleOf([is.String, is.Number]));
 * const a: unknown = ["a", 1];
 * if (isMyType(a)) {
 *   // a is narrowed to readonly [string, number]
 *   const _: readonly [string, number] = a;
 * }
 * ```
 */
export function isReadonlyOf<T>(
  pred: Predicate<T>,
):
  & Predicate<Readonly<T>>
  & WithMetadata<IsReadonlyOfMetadata> {
  return setPredicateFactoryMetadata(
    (x: unknown): x is Readonly<T> => pred(x),
    { name: "isReadonlyOf", args: [pred] },
  ) as
    & Predicate<Readonly<T>>
    & WithMetadata<IsReadonlyOfMetadata>;
}

type IsReadonlyOfMetadata = {
  name: "isReadonlyOf";
  args: Parameters<typeof isReadonlyOf>;
};

/**
 * Return an `Readonly` un-annotated type predicate function that returns `true` if the type of `x` is `T`.
 *
 * **This is unstable and may be removed in the future.**
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.UnwrapReadonlyOf(is.ReadonlyOf(is.TupleOf([is.String, is.Number])));
 * const a: unknown = ["a", 1];
 * if (isMyType(a)) {
 *   // a is narrowed to [string, number]
 *   const _: [string, number] = a;
 * }
 * ```
 */
export function isUnwrapReadonlyOf<P extends Predicate<unknown>>(
  pred: P,
): UnwrapReadonlyOf<P> {
  if (!isReadonly(pred)) return pred as UnwrapReadonlyOf<P>;
  const { args } = getPredicateFactoryMetadata(pred);
  return args[0] as UnwrapReadonlyOf<P>;
}

type UnwrapReadonlyOf<T> = T extends
  Predicate<infer U> & WithMetadata<IsReadonlyOfMetadata>
  ? Predicate<Writable<U>>
  : T extends Predicate<unknown> ? T
  : never;

export default {
  Optional: isOptional,
  OptionalOf: isOptionalOf,
  Readonly: isReadonly,
  ReadonlyOf: isReadonlyOf,
  UnwrapOptionalOf: isUnwrapOptionalOf,
  UnwrapReadonlyOf: isUnwrapReadonlyOf,
};
