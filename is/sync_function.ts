const objectToString = Object.prototype.toString;

/**
 * Return `true` if the type of `x` is `function` (non async function).
 *
 * Use {@linkcode [is/function].isFunction|isFunction} to check if the type of `x` is a function.
 * Use {@linkcode [is/async-function].isAsyncFunction|isAsyncFunction} to check if the type of `x` is an asynchronous function.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const a: unknown = () => {};
 * if (is.SyncFunction(a)) {
 *   const _: ((...args: unknown[]) => unknown) = a;
 * }
 * ```
 */
export function isSyncFunction(
  x: unknown,
): x is (...args: unknown[]) => unknown {
  return objectToString.call(x) === "[object Function]";
}
