import type { Predicate } from "./type.ts";

export type Fn = (...args: unknown[]) => unknown;

export function annotate<F extends Fn, N extends string, V>(
  fn: F,
  name: N,
  value: V,
): F & { [K in N]: V } {
  return Object.defineProperties(fn, {
    [name]: {
      value,
    },
  }) as F & { [K in N]: V };
}

export function unannotate<F extends Fn, N extends string, V>(
  fn: F & { [K in N]: V },
  name: N,
): V {
  return fn[name];
}

export function hasAnnotation<F extends Fn, N extends string>(
  fn: F,
  name: N,
): fn is F & { [K in N]: unknown } {
  // deno-lint-ignore no-explicit-any
  return !!(fn as any)[name];
}

/**
 * Annotation for optional.
 */
export type AsOptional<T = unknown> = {
  optional: Predicate<T>;
};

/**
 * Annotation for readonly.
 */
export type AsReadonly<T = unknown> = {
  readonly: Predicate<T>;
};

/**
 * Annotation for predObj.
 */
export type IsPredObj<
  T extends Record<PropertyKey, Predicate<unknown>> = Record<
    PropertyKey,
    Predicate<unknown>
  >,
> = {
  predObj: T;
};
