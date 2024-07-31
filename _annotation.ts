import type { Predicate } from "./is.ts";

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
 * Annotation for readonly.
 */
export type WithReadonly<P extends Predicate<unknown>> = {
  readonly: P;
};

export type PredObj = Record<PropertyKey, Predicate<unknown>>;

/**
 * Annotation for predObj.
 */
export type WithPredObj<T extends PredObj> = {
  predObj: T;
};
