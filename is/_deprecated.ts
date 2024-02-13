import type { UnionToIntersection } from "../_typeutil.ts";
import type { Predicate } from "./type.ts";
import { type isObjectOf } from "./factory.ts";
import { type GetMetadata, type WithMetadata } from "../metadata.ts";
import { isIntersectionOf, isUnionOf } from "./utility.ts";

type IsObjectOfMetadata = GetMetadata<ReturnType<typeof isObjectOf>>;

/**
 * Return a type predicate function that returns `true` if the type of `x` is `UnionOf<T>`.
 *
 * @deprecated Use `isUnionOf` instead.
 */
export function isOneOf<
  T extends readonly [Predicate<unknown>, ...Predicate<unknown>[]],
>(
  preds: T,
): Predicate<OneOf<T>> {
  return isUnionOf(preds);
}

type OneOf<T> = T extends readonly [Predicate<infer U>, ...infer R]
  ? U | OneOf<R>
  : never;

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
): Predicate<AllOf<T>> {
  return isIntersectionOf(preds);
}

type AllOf<T> = UnionToIntersection<OneOf<T>>;

export default {
  AllOf: isAllOf,
  OneOf: isOneOf,
};
