import type { Predicate } from "./type.ts";
import {
  getMetadata,
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

export default {
  Optional: isOptional,
  OptionalOf: isOptionalOf,
};
