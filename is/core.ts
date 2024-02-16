const objectToString = Object.prototype.toString;

/**
 * Assume `x is `any` and always return `true` regardless of the type of `x`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a = "a";
 * if (is.Any(a)) {
 *   // a is narrowed to any
 *   const _: any = a;
 * }
 * ```
 */
// deno-lint-ignore no-explicit-any
export function isAny(_x: unknown): _x is any {
  return true;
}

/**
 * Assume `x` is `unknown` and always return `true` regardless of the type of `x`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a = "a";
 * if (is.Unknown(a)) {
 *   // a is narrowed to unknown
 *   const _: unknown = a;
 * }
 * ```
 */
export function isUnknown(_x: unknown): _x is unknown {
  return true;
}

/**
 * Return `true` if the type of `x` is `string`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = "a";
 * if (is.String(a)) {
 *   // a is narrowed to string
 *   const _: string = a;
 * }
 * ```
 */
export function isString(x: unknown): x is string {
  return typeof x === "string";
}

/**
 * Return `true` if the type of `x` is `number`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = 0;
 * if (is.Number(a)) {
 *   // a is narrowed to number
 *   const _: number = a;
 * }
 * ```
 */
export function isNumber(x: unknown): x is number {
  return typeof x === "number";
}

/**
 * Return `true` if the type of `x` is `bigint`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = 0n;
 * if (is.BigInt(a)) {
 *   // a is narrowed to bigint
 *   const _: bigint = a;
 * }
 * ```
 */
export function isBigInt(x: unknown): x is bigint {
  return typeof x === "bigint";
}

/**
 * Return `true` if the type of `x` is `boolean`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = true;
 * if (is.Boolean(a)) {
 *   // a is narrowed to boolean
 *   const _: boolean = a;
 * }
 * ```
 */
export function isBoolean(x: unknown): x is boolean {
  return typeof x === "boolean";
}

/**
 * Return `true` if the type of `x` is `unknown[]`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = [0, 1, 2];
 * if (is.Array(a)) {
 *   // a is narrowed to unknown[]
 *   const _: unknown[] = a;
 * }
 * ```
 */
export function isArray(
  x: unknown,
): x is unknown[] {
  return Array.isArray(x);
}

/**
 * Return `true` if the type of `x` is `Set<unknown>`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = new Set([0, 1, 2]);
 * if (is.Set(a)) {
 *   // a is narrowed to Set<unknown>
 *   const _: Set<unknown> = a;
 * }
 * ```
 */
export function isSet(x: unknown): x is Set<unknown> {
  return x instanceof Set;
}

/**
 * Return `true` if the type of `x` is `Record<PropertyKey, unknown>`.
 *
 * Note that this function check if the `x` is an instance of `Object`.
 * Use `isRecordLike` instead if you want to check if the `x` satisfies the `Record<PropertyKey, unknown>` type.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = {"a": 0, "b": 1};
 * if (is.Record(a)) {
 *   // a is narrowed to Record<PropertyKey, unknown>
 *   const _: Record<PropertyKey, unknown> = a;
 * }
 * ```
 */
export function isRecord(
  x: unknown,
): x is Record<PropertyKey, unknown> {
  return x != null && typeof x === "object" && x.constructor === Object;
}

/**
 * Return `true` if the type of `x` is like `Record<PropertyKey, unknown>`.
 *
 * Note that this function returns `true` for ambiguous instances like `Set`, `Map`, `Date`, `Promise`, etc.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = {"a": 0, "b": 1};
 * if (is.RecordLike(a)) {
 *   // a is narrowed to Record<PropertyKey, unknown>
 *   const _: Record<PropertyKey, unknown> = a;
 * }
 *
 * const b: unknown = new Date();
 * if (is.RecordLike(b)) {
 *   // a is narrowed to Record<PropertyKey, unknown>
 *   const _: Record<PropertyKey, unknown> = b;
 * }
 * ```
 */
export function isRecordLike(
  x: unknown,
): x is Record<PropertyKey, unknown> {
  return x != null && !Array.isArray(x) && typeof x === "object";
}

/**
 * Return `true` if the type of `x` is `Map<unknown, unknown>`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = new Map([["a", 0], ["b", 1]]);
 * if (is.Map(a)) {
 *   // a is narrowed to Map<unknown, unknown>
 *   const _: Map<unknown, unknown> = a;
 * }
 * ```
 */
export function isMap(x: unknown): x is Map<unknown, unknown> {
  return x instanceof Map;
}

/**
 * Return `true` if the type of `x` is `function`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = () => {};
 * if (is.Function(a)) {
 *   // a is narrowed to (...args: unknown[]) => unknown
 *   const _: ((...args: unknown[]) => unknown) = a;
 * }
 * ```
 */
export function isFunction(x: unknown): x is (...args: unknown[]) => unknown {
  return x instanceof Function;
}

/**
 * Return `true` if the type of `x` is `function` (non async function).
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = () => {};
 * if (is.Function(a)) {
 *   // a is narrowed to (...args: unknown[]) => unknown
 *   const _: ((...args: unknown[]) => unknown) = a;
 * }
 * ```
 */
export function isSyncFunction(
  x: unknown,
): x is (...args: unknown[]) => unknown {
  return objectToString.call(x) === "[object Function]";
}

/**
 * Return `true` if the type of `x` is `function` (async function).
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = async () => {};
 * if (is.Function(a)) {
 *   // a is narrowed to (...args: unknown[]) => Promise<unknown>
 *   const _: ((...args: unknown[]) => unknown) = a;
 * }
 * ```
 */
export function isAsyncFunction(
  x: unknown,
): x is (...args: unknown[]) => Promise<unknown> {
  return objectToString.call(x) === "[object AsyncFunction]";
}

/**
 * Return `true` if the type of `x` is `null`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = null;
 * if (is.Null(a)) {
 *   // a is narrowed to null
 *   const _: null = a;
 * }
 * ```
 */
export function isNull(x: unknown): x is null {
  return x === null;
}

/**
 * Return `true` if the type of `x` is `undefined`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = undefined;
 * if (is.Undefined(a)) {
 *   // a is narrowed to undefined
 *   const _: undefined = a;
 * }
 * ```
 */
export function isUndefined(x: unknown): x is undefined {
  return typeof x === "undefined";
}

/**
 * Return `true` if the type of `x` is `null` or `undefined`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = null;
 * if (is.Nullish(a)) {
 *   // a is narrowed to null | undefined
 *   const _: (null | undefined) = a;
 * }
 * ```
 */
export function isNullish(x: unknown): x is null | undefined {
  return x == null;
}

/**
 * Return `true` if the type of `x` is `symbol`.
 *
 * ```ts
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = Symbol("symbol");
 * if (is.Symbol(a)) {
 *   // a is narrowed to symbol
 *   const _: symbol = a;
 * }
 * ```
 */
export function isSymbol(x: unknown): x is symbol {
  return typeof x === "symbol";
}

export type Primitive =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | symbol;

/**
 * Return `true` if the type of `x` is `Primitive`.
 *
 * ```ts
 * import { is, Primitive } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = 0;
 * if (is.Primitive(a)) {
 *   // a is narrowed to Primitive
 *   const _: Primitive = a;
 * }
 * ```
 */
export function isPrimitive(x: unknown): x is Primitive {
  return x == null || primitiveSet.has(typeof x);
}

const primitiveSet = new Set([
  "string",
  "number",
  "bigint",
  "boolean",
  "symbol",
]);

export default {
  Any: isAny,
  Array: isArray,
  AsyncFunction: isAsyncFunction,
  BigInt: isBigInt,
  Boolean: isBoolean,
  Function: isFunction,
  Map: isMap,
  Null: isNull,
  Nullish: isNullish,
  Number: isNumber,
  Primitive: isPrimitive,
  Record: isRecord,
  RecordLike: isRecordLike,
  Set: isSet,
  String: isString,
  Symbol: isSymbol,
  SyncFunction: isSyncFunction,
  Undefined: isUndefined,
  Unknown: isUnknown,
};
