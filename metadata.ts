import type { Predicate } from "./is.ts";
import { inspect } from "./inspect.ts";

const metadataKey = "__unknownutil_metadata";

export type WithMetadata<M> = {
  [metadataKey]: M;
};

export type PredicateMetadata = {
  name: string;
  args: unknown[];
};

/**
 * Set metadata for a predicate function.
 */
export function setPredicateMetadata<
  P extends Predicate<unknown>,
  M extends PredicateMetadata,
>(
  pred: P,
  metadata: M,
): P & WithMetadata<M> {
  let cachedName: string | undefined;
  return Object.defineProperties(pred, {
    [metadataKey]: { value: metadata },
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
 * Get metadata of a predicate function.
 */
export function getPredicateMetadata<M extends PredicateMetadata>(
  pred: WithMetadata<M>,
): M {
  return pred[metadataKey];
}
