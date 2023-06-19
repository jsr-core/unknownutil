/**
 * A type decision function
 */
export type Predicate<T> = (x: unknown) => x is T;

/**
 * Return `true` if the type of `x` is `string`.
 */
export function isString(x: unknown): x is string {
  return typeof x === "string";
}

/**
 * Return `true` if the type of `x` is `number`.
 */
export function isNumber(x: unknown): x is number {
  return typeof x === "number";
}

/**
 * Return `true` if the type of `x` is `boolean`.
 */
export function isBoolean(x: unknown): x is boolean {
  return typeof x === "boolean";
}

/**
 * Return `true` if the type of `x` is `array`.
 *
 * Use `pred` to predicate the type of items.
 */
export function isArray<T>(
  x: unknown,
  options: { pred?: Predicate<T> } = {},
): x is T[] {
  const pred = options.pred;
  return Array.isArray(x) && (!pred || x.every(pred));
}

/**
 * Return `true` if the type of `x` is `object`.
 *
 * Use `pred` to predicate the type of values.
 */
export function isObject<T>(
  x: unknown,
  options: { pred?: Predicate<T> } = {},
): x is Record<string, T> {
  if (isNullish(x) || isArray(x)) {
    return false;
  }
  const pred = options.pred;
  return typeof x === "object" &&
    // deno-lint-ignore no-explicit-any
    (!pred || Object.values(x as any).every(pred));
}

/**
 * Return `true` if the type of `x` is `function`.
 */
export function isFunction(x: unknown): x is (...args: unknown[]) => unknown {
  return Object.prototype.toString.call(x) === "[object Function]";
}

/**
 * Return `true` if the type of `x` is `null`.
 */
export function isNull(x: unknown): x is null {
  return x === null;
}

/**
 * Return `true` if the type of `x` is `undefined`.
 */
export function isUndefined(x: unknown): x is undefined {
  return typeof x === "undefined";
}

/**
 * Return `true` if the type of `x` is `null` or `undefined`.
 */
export function isNullish(x: unknown): x is null | undefined {
  return x == null;
}
