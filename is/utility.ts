import type { FlatType, UnionToIntersection } from "../_typeutil.ts";
import type { Predicate } from "./type.ts";
import { isUndefined } from "./core.ts";
import {
  isObjectOf,
  type IsObjectOfMetadata,
  type Optional,
} from "./factory.ts";
import {
  getPredicateMetadata,
  setPredicateMetadata,
  type WithMetadata,
} from "../metadata.ts";

/**
 * Return a type predicate function that returns `true` if the type of `x` is `OneOf<T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.OneOf([is.Number, is.String, is.Boolean]);
 * const a: unknown = 0;
 * if (isMyType(a)) {
 *   // a is narrowed to number | string | boolean
 *   const _: number | string | boolean = a;
 * }
 * ```
 *
 * Depending on the version of TypeScript and how values are provided, it may be necessary to add `as const` to the array
 * used as `preds`. If a type error occurs, try adding `as const` as follows:
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const preds = [is.Number, is.String, is.Boolean] as const;
 * const isMyType = is.OneOf(preds);
 * const a: unknown = 0;
 * if (isMyType(a)) {
 *   // a is narrowed to number | string | boolean
 *   const _: number | string | boolean = a;
 * }
 * ```
 */
export function isOneOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
>(
  preds: T,
): Predicate<OneOf<T>> & WithMetadata<IsOneOfMetadata> {
  return setPredicateMetadata(
    (x: unknown): x is OneOf<T> => preds.some((pred) => pred(x)),
    { name: "isOneOf", args: [preds] },
  );
}

type OneOf<T> = T extends readonly [Predicate<infer U>, ...infer R]
  ? U | OneOf<R>
  : never;

type IsOneOfMetadata = {
  name: "isOneOf";
  args: Parameters<typeof isOneOf>;
};

/**
 * Return a type predicate function that returns `true` if the type of `x` is `AllOf<T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.AllOf([
 *   is.ObjectOf({ a: is.Number }),
 *   is.ObjectOf({ b: is.String }),
 * ]);
 * const a: unknown = { a: 0, b: "a" };
 * if (isMyType(a)) {
 *   // a is narrowed to { a: number } & { b: string }
 *   const _: { a: number } & { b: string } = a;
 * }
 * ```
 *
 * Depending on the version of TypeScript and how values are provided, it may be necessary to add `as const` to the array
 * used as `preds`. If a type error occurs, try adding `as const` as follows:
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const preds = [
 *   is.ObjectOf({ a: is.Number }),
 *   is.ObjectOf({ b: is.String }),
 * ] as const
 * const isMyType = is.AllOf(preds);
 * const a: unknown = { a: 0, b: "a" };
 * if (isMyType(a)) {
 *   // a is narrowed to { a: number } & { b: string }
 *   const _: { a: number } & { b: string } = a;
 * }
 * ```
 */
export function isAllOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
>(
  preds: T,
): Predicate<AllOf<T>> & WithMetadata<IsAllOfMetadata> {
  return setPredicateMetadata(
    (x: unknown): x is AllOf<T> => preds.every((pred) => pred(x)),
    { name: "isAllOf", args: [preds] },
  );
}

type AllOf<T> = UnionToIntersection<OneOf<T>>;

type IsAllOfMetadata = {
  name: "isAllOf";
  args: Parameters<typeof isAllOf>;
};

/**
 * Return a type predicate function that returns `true` if the type of `x` is `T` or `undefined`.
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
): Predicate<T | undefined> & Optional & WithMetadata<IsOptionalOfMetadata> {
  if ((pred as Partial<Optional>).optional) {
    return pred as
      & Predicate<T | undefined>
      & Optional
      & WithMetadata<IsOptionalOfMetadata>;
  }
  return Object.defineProperties(
    setPredicateMetadata(
      (x: unknown): x is Predicate<T | undefined> => isUndefined(x) || pred(x),
      { name: "isOptionalOf", args: [pred] },
    ),
    { optional: { value: true as const } },
  ) as Predicate<T | undefined> & Optional & WithMetadata<IsOptionalOfMetadata>;
}

type IsOptionalOfMetadata = {
  name: "isOptionalOf";
  args: Parameters<typeof isOptionalOf>;
};

/**
 * Return a type predicate function that returns `true` if the type of `x` is strictly follow the `ObjectOf<T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * If `is.OptionalOf()` is specified in the predicate function, the property becomes optional.
 *
 * The number of keys of `x` must be equal to the number of non optional keys of `predObj`. This is equivalent to
 * the deprecated `options.strict` in `isObjectOf()`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.StrictOf(is.ObjectOf({
 *   a: is.Number,
 *   b: is.String,
 *   c: is.OptionalOf(is.Boolean),
 * }));
 * const a: unknown = { a: 0, b: "a", other: "other" };
 * if (isMyType(a)) {
 *   // This block will not be executed because of "other" key in `a`.
 * }
 * ```
 */
export function isStrictOf<T extends Record<PropertyKey, unknown>>(
  pred:
    & Predicate<T>
    & WithMetadata<IsObjectOfMetadata>,
):
  & Predicate<T>
  & WithMetadata<IsStrictOfMetadata> {
  const { args } = getPredicateMetadata(pred);
  const s = new Set(Object.keys(args[0]));
  return setPredicateMetadata(
    (x: unknown): x is T => {
      if (!pred(x)) return false;
      // deno-lint-ignore no-explicit-any
      const ks = Object.keys(x as any);
      return ks.length <= s.size && ks.every((k) => s.has(k));
    },
    { name: "isStrictOf", args: [pred] },
  );
}

type IsStrictOfMetadata = {
  name: "isStrictOf";
  args: Parameters<typeof isStrictOf>;
};

/**
 * Return a type predicate function that returns `true` if the type of `x` is `Partial<ObjectOf<T>>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```typescript
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.PartialOf(is.ObjectOf({
 *   a: is.Number,
 *   b: is.String,
 *   c: is.OptionalOf(is.Boolean),
 * }));
 * const a: unknown = { a: undefined, other: "other" };
 * if (isMyType(a)) {
 *   // The "other" key in `a` is ignored.
 *   // 'a' is narrowed to { a?: number | undefined; b?: string | undefined; c?: boolean | undefined }
 *   const _: { a?: number | undefined; b?: string | undefined; c?: boolean | undefined } = a;
 * }
 * ```
 */
export function isPartialOf<
  T extends Record<PropertyKey, unknown>,
>(
  pred: Predicate<T> & WithMetadata<IsObjectOfMetadata>,
):
  & Predicate<FlatType<Partial<T>>>
  & WithMetadata<IsObjectOfMetadata> {
  const { args } = getPredicateMetadata(pred);
  const predObj = Object.fromEntries(
    Object.entries(args[0]).map(([k, v]) => [k, isOptionalOf(v)]),
  );
  return isObjectOf(predObj) as
    & Predicate<FlatType<Partial<T>>>
    & WithMetadata<IsObjectOfMetadata>;
}

export default {
  AllOf: isAllOf,
  OneOf: isOneOf,
  OptionalOf: isOptionalOf,
  PartialOf: isPartialOf,
  StrictOf: isStrictOf,
};
