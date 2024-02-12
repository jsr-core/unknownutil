import type { Predicate } from "./is/type.ts";
import { inspect } from "./inspect.ts";

const metadataKey = "__unknownutil_metadata";

/**
 * A type that has metadata.
 */
export type WithMetadata<T> = {
  [metadataKey]: T;
};

/**
 * Metadata of a predicate factory function.
 */
export type PredicateFactoryMetadata = {
  name: string;
  args: unknown[];
};

/**
 * Set metadata to a predicate factory function.
 */
export function setPredicateFactoryMetadata<
  P extends Predicate<unknown>,
  M extends PredicateFactoryMetadata,
>(
  pred: P,
  metadata: M,
): P & WithMetadata<M> {
  let cachedName: string | undefined;
  return Object.defineProperties(pred, {
    [metadataKey]: {
      value: metadata,
      configurable: true,
    },
    name: {
      get: () => {
        if (cachedName) return cachedName;
        const { name, args } = metadata;
        cachedName = `${name}(${args.map((v) => inspect(v)).join(", ")})`;
        return cachedName;
      },
    },
  }) as P & WithMetadata<M>;
}

/**
 * Get metadata from a predicate factory function.
 */
export function getPredicateFactoryMetadata<M extends PredicateFactoryMetadata>(
  object: WithMetadata<M>,
): M {
  return object[metadataKey];
}

/**
 * Get metadata type function
 */
export type GetMetadata<T> = T extends WithMetadata<infer M> ? M : never;
