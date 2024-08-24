import { type CustomJsonable, isCustomJsonable } from "./custom_jsonable.ts";

/**
 * Represents a JSON-serializable value.
 *
 * See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#description|Description} of `JSON.stringify()` for more information.
 */
export type Jsonable =
  | string
  | number
  | boolean
  | null
  | unknown[]
  | { [key: string]: unknown }
  | CustomJsonable;

/**
 * Returns true if `x` is a JSON-serializable value, false otherwise.
 *
 * It does not check array or object properties recursively.
 *
 * Use {@linkcode [is/custom_jsonable].isCustomJsonable|isCustomJsonable} to check if the type of `x` has a custom `toJSON` method.
 *
 * ```ts
 * import { is, Jsonable } from "@core/unknownutil";
 *
 * const a: unknown = "Hello, world!";
 * if (is.Jsonable(a)) {
 *   const _: Jsonable = a;
 * }
 * ```
 */
export function isJsonable(x: unknown): x is Jsonable {
  switch (typeof x) {
    case "undefined":
      return false;
    case "string":
    case "number":
    case "boolean":
      return true;
    case "bigint":
    case "symbol":
    case "function":
      return isCustomJsonable(x);
    case "object": {
      if (x === null || Array.isArray(x)) return true;
      const p = Object.getPrototypeOf(x);
      if (p === BigInt.prototype || p === Function.prototype) {
        return isCustomJsonable(x);
      }
      return true;
    }
  }
}
