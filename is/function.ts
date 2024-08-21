/**
 * Return `true` if the type of `x` is `function`.
 *
 * Use {@linkcode [is/sync-function].isSyncFunction|isSyncFunction} to check if the type of `x` is a synchronous function.
 * Use {@linkcode [is/async-function].isAsyncFunction|isAsyncFunction} to check if the type of `x` is an asynchronous function.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const a: unknown = () => {};
 * if (is.Function(a)) {
 *   const _: ((...args: unknown[]) => unknown) = a;
 * }
 * ```
 */
export function isFunction(x: unknown): x is (...args: unknown[]) => unknown {
  return x instanceof Function;
}
