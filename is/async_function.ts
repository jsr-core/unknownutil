const objectToString = Object.prototype.toString;

/**
 * Return `true` if the type of `x` is `function` (async function).
 *
 * Use {@linkcode isFunction} to check if the type of `x` is a function.
 * Use {@linkcode isSyncFunction} to check if the type of `x` is a synchronous function.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const a: unknown = async () => {};
 * if (is.AsyncFunction(a)) {
 *   const _: ((...args: unknown[]) => Promise<unknown>) = a;
 * }
 * ```
 */
export function isAsyncFunction(
  x: unknown,
): x is (...args: unknown[]) => Promise<unknown> {
  return objectToString.call(x) === "[object AsyncFunction]";
}
