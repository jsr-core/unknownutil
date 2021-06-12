export type Predicate<T> = (x: unknown) => x is T;

/**
 * Return true if the value is string
 */
export function isString(x: unknown): x is string {
  return typeof x === "string";
}

/**
 * Return true if the value is number
 */
export function isNumber(x: unknown): x is number {
  return typeof x === "number";
}

/**
 * Return true if the value is array
 */
export function isArray<T extends unknown>(
  x: unknown,
  pred?: Predicate<T>,
): x is T[] {
  return Array.isArray(x) && (!pred || x.every(pred));
}

/**
 * Return true if the value is object
 */
export function isObject<T extends unknown>(
  x: unknown,
  pred?: Predicate<T>,
): x is Record<string, T> {
  if (isNone(x) || isArray(x)) {
    return false;
  }
  return typeof x === "object" &&
    // deno-lint-ignore no-explicit-any
    (!pred || Object.values(x as any).every(pred));
}

/**
 * Return true if the value is function
 */
export function isFunction(x: unknown): x is (...args: unknown[]) => unknown {
  return Object.prototype.toString.call(x) === "[object Function]";
}

/**
 * Return true if the value is null
 */
export function isNull(x: unknown): x is null {
  return x === null;
}

/**
 * Return true if the value is undefined
 */
export function isUndefined(x: unknown): x is undefined {
  return typeof x === "undefined";
}

/**
 * Return true if the value is null or undefined
 */
export function isNone(x: unknown): x is null | undefined {
  return x == null;
}
