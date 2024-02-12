import type { Predicate } from "./is/type.ts";
import { inspect } from "./inspect.ts";

const metadataKey = "__unknownutil_metadata";

export type WithMetadata<T> = {
  [metadataKey]: T;
};

export type PredicateMetadata = {
  name: string;
  args: unknown[];
};

export function setPredicateMetadata<
  P extends Predicate<unknown>,
  M extends PredicateMetadata,
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

export function getPredicateMetadata<M extends PredicateMetadata>(
  object: WithMetadata<M>,
): M {
  return object[metadataKey];
}
