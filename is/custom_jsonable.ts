/**
 * Represents an object that has a custom `toJSON` method.
 *
 * Note that `string`, `number`, `boolean`, and `symbol` are not `CustomJsonable` even
 * if it's class prototype defines `toJSON` method.
 *
 * See {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#tojson_behavior|toJSON() behavior} of `JSON.stringify()` for more information.
 */
export type CustomJsonable = {
  toJSON(key: string | number): unknown;
};

/**
 * Returns true if `x` is {@linkcode CustomJsonable}, false otherwise.
 *
 * Use {@linkcode [is/jsonable].isJsonable|isJsonable} to check if the type of `x` is a JSON-serializable.
 *
 * ```ts
 * import { is, CustomJsonable } from "@core/unknownutil";
 *
 * const a: unknown = Object.assign(42n, {
 *   toJSON() {
 *     return `${this}n`;
 *   }
 * });
 * if (is.CustomJsonable(a)) {
 *   const _: CustomJsonable = a;
 * }
 * ```
 */
export function isCustomJsonable(x: unknown): x is CustomJsonable {
  if (x == null) return false;
  switch (typeof x) {
    case "bigint":
    case "object":
    case "function":
      return typeof (x as CustomJsonable).toJSON === "function";
  }
  return false;
}
