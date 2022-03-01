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
export function isArray<T extends unknown>(
  x: unknown,
  pred?: Predicate<T>,
): x is T[] {
  return Array.isArray(x) && (!pred || x.every(pred));
}

/**
 * Return `true` if the type of `x` is `object`.
 *
 * Use `pred` to predicate the type of values.
 */
export function isObject<T extends unknown>(
  x: unknown,
  pred?: Predicate<T>,
): x is Record<string, T> {
  if (isNullish(x) || isArray(x)) {
    return false;
  }
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

/**
 * Return `true` if the type of `x` follows the type of `ref`.
 */
export function isLike<R, T extends unknown>(
  ref: R,
  x: unknown,
  pred?: Predicate<T>,
): x is R {
  if (isString(ref) && isString(x)) {
    return true;
  }
  if (isNumber(ref) && isNumber(x)) {
    return true;
  }
  if (isBoolean(ref) && isBoolean(x)) {
    return true;
  }
  if (isArray(ref, pred) && isArray(x, pred)) {
    return ref.length === 0 || (
      ref.length === x.length &&
      ref.every((r, i) => isLike(r, x[i]))
    );
  }
  if (isObject(ref, pred) && isObject(x, pred)) {
    const es = Object.entries(ref);
    return es.length === 0 || es.every(([k, v]) => isLike(v, x[k]));
  }
  if (isFunction(ref) && isFunction(x)) {
    return true;
  }
  if (isNull(ref) && isNull(x)) {
    return true;
  }
  if (isUndefined(ref) && isUndefined(x)) {
    return true;
  }
  return false;
}
