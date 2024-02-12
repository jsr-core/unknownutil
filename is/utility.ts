import type { FlatType, UnionToIntersection } from "../_typeutil.ts";
import type { Predicate } from "./type.ts";
import { isOptionalOf } from "./annotation.ts";
import { isObjectOf } from "./factory.ts";
import {
  type GetMetadata,
  getPredicateFactoryMetadata,
  setPredicateFactoryMetadata,
  type WithMetadata,
} from "../metadata.ts";

type IsObjectOfMetadata = GetMetadata<ReturnType<typeof isObjectOf>>;

/**
 * Return a type predicate function that returns `true` if the type of `x` is `UnionOf<T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.UnionOf([is.Number, is.String, is.Boolean]);
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
 * const isMyType = is.UnionOf(preds);
 * const a: unknown = 0;
 * if (isMyType(a)) {
 *   // a is narrowed to number | string | boolean
 *   const _: number | string | boolean = a;
 * }
 * ```
 */
export function isUnionOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
>(
  preds: T,
): Predicate<UnionOf<T>> & WithMetadata<IsUnionOfMetadata> {
  return setPredicateFactoryMetadata(
    (x: unknown): x is UnionOf<T> => preds.some((pred) => pred(x)),
    { name: "isUnionOf", args: [preds] },
  );
}

type UnionOf<T> = T extends readonly [Predicate<infer U>, ...infer R]
  ? U | UnionOf<R>
  : never;

type IsUnionOfMetadata = {
  name: "isUnionOf";
  args: Parameters<typeof isUnionOf>;
};

/**
 * Return a type predicate function that returns `true` if the type of `x` is `UnionOf<T>`.
 *
 * @deprecated Use `isUnionOf` instead.
 */
export function isOneOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
>(
  preds: T,
): Predicate<UnionOf<T>> & WithMetadata<IsUnionOfMetadata> {
  return isUnionOf(preds);
}

/**
 * Return a type predicate function that returns `true` if the type of `x` is `IntersectionOf<T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.IntersectionOf([
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
 * const isMyType = is.IntersectionOf(preds);
 * const a: unknown = { a: 0, b: "a" };
 * if (isMyType(a)) {
 *   // a is narrowed to { a: number } & { b: string }
 *   const _: { a: number } & { b: string } = a;
 * }
 * ```
 */
export function isIntersectionOf<
  T extends readonly [
    Predicate<unknown> & WithMetadata<IsObjectOfMetadata>,
    ...(Predicate<unknown> & WithMetadata<IsObjectOfMetadata>)[],
  ],
>(
  preds: T,
): Predicate<IntersectionOf<T>> & WithMetadata<IsObjectOfMetadata> {
  const predObj = {};
  preds.forEach((pred) => {
    Object.assign(predObj, getPredicateFactoryMetadata(pred).args[0]);
  });
  return isObjectOf(predObj) as
    & Predicate<IntersectionOf<T>>
    & WithMetadata<IsObjectOfMetadata>;
}

type IntersectionOf<T> = UnionToIntersection<UnionOf<T>>;

/**
 * Return a type predicate function that returns `true` if the type of `x` is `IntersectionOf<T>`.
 *
 * @deprecated Use `isIntersectionOf` instead.
 */
export function isAllOf<
  T extends readonly [
    Predicate<unknown> & WithMetadata<IsObjectOfMetadata>,
    ...(Predicate<unknown> & WithMetadata<IsObjectOfMetadata>)[],
  ],
>(
  preds: T,
): Predicate<IntersectionOf<T>> & WithMetadata<IsObjectOfMetadata> {
  return isIntersectionOf(preds);
}

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
  const { args } = getPredicateFactoryMetadata(pred);
  const predObj = Object.fromEntries(
    Object.entries(args[0]).map(([k, v]) => [k, isOptionalOf(v)]),
  );
  return isObjectOf(predObj) as
    & Predicate<FlatType<Partial<T>>>
    & WithMetadata<IsObjectOfMetadata>;
}

/**
 * Return a type predicate function that returns `true` if the type of `x` is `Pick<ObjectOf<T>, K>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```typescript
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.PickOf(is.ObjectOf({
 *   a: is.Number,
 *   b: is.String,
 *   c: is.OptionalOf(is.Boolean),
 * }), ["a", "c"]);
 * const a: unknown = { a: 0, b: "a", other: "other" };
 * if (isMyType(a)) {
 *   // The "b" and "other" key in `a` is ignored.
 *   // 'a' is narrowed to { a: number; c?: boolean | undefined }
 *   const _: { a: number; c?: boolean | undefined } = a;
 * }
 * ```
 */
export function isPickOf<
  T extends Record<PropertyKey, unknown>,
  K extends keyof T,
>(
  pred: Predicate<T> & WithMetadata<IsObjectOfMetadata>,
  keys: K[],
):
  & Predicate<FlatType<Pick<T, K>>>
  & WithMetadata<IsObjectOfMetadata> {
  const s = new Set(keys);
  const { args } = getPredicateFactoryMetadata(pred);
  const predObj = Object.fromEntries(
    Object.entries(args[0]).filter(([k]) => s.has(k as K)),
  );
  return isObjectOf(predObj) as
    & Predicate<FlatType<Pick<T, K>>>
    & WithMetadata<IsObjectOfMetadata>;
}

/**
 * Return a type predicate function that returns `true` if the type of `x` is `Omit<ObjectOf<T>, K>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```typescript
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isMyType = is.OmitOf(is.ObjectOf({
 *   a: is.Number,
 *   b: is.String,
 *   c: is.OptionalOf(is.Boolean),
 * }), ["a", "c"]);
 * const a: unknown = { a: 0, b: "a", other: "other" };
 * if (isMyType(a)) {
 *   // The "a", "c", and "other" key in `a` is ignored.
 *   // 'a' is narrowed to { b: string }
 *   const _: { b: string } = a;
 * }
 * ```
 */
export function isOmitOf<
  T extends Record<PropertyKey, unknown>,
  K extends keyof T,
>(
  pred: Predicate<T> & WithMetadata<IsObjectOfMetadata>,
  keys: K[],
):
  & Predicate<FlatType<Omit<T, K>>>
  & WithMetadata<IsObjectOfMetadata> {
  const s = new Set(keys);
  const { args } = getPredicateFactoryMetadata(pred);
  const predObj = Object.fromEntries(
    Object.entries(args[0]).filter(([k]) => !s.has(k as K)),
  );
  return isObjectOf(predObj) as
    & Predicate<FlatType<Omit<T, K>>>
    & WithMetadata<IsObjectOfMetadata>;
}

export default {
  AllOf: isAllOf,
  IntersectionOf: isIntersectionOf,
  OmitOf: isOmitOf,
  OneOf: isOneOf,
  PartialOf: isPartialOf,
  PickOf: isPickOf,
  UnionOf: isUnionOf,
};