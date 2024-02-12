/**
 * A utility pack for handling `unknown` type.
 *
 * ## Usage
 *
 * It provides `is` module for type predicate functions and `assert`, `ensure`, and
 * `maybe` helper functions.
 *
 * ### is\*
 *
 * Type predicate function is a function which returns `true` if a given value is
 * expected type. For example, `isString` (or `is.String`) returns `true` if a
 * given value is `string`.
 *
 * ```typescript
 * import { is } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = "Hello";
 * if (is.String(a)) {
 *   // 'a' is 'string' in this block
 * }
 * ```
 *
 * Additionally, `is*Of` (or `is.*Of`) functions return type predicate functions to
 * predicate types of `x` more precisely like:
 *
 * ```typescript
 * import {
 *   is,
 *   PredicateType,
 * } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isArticle = is.ObjectOf({
 *   title: is.String,
 *   body: is.String,
 *   refs: is.ArrayOf(
 *     is.OneOf([
 *       is.String,
 *       is.ObjectOf({
 *         name: is.String,
 *         url: is.String,
 *       }),
 *     ]),
 *   ),
 * });
 *
 * type Article = PredicateType<typeof isArticle>;
 *
 * const a: unknown = {
 *   title: "Awesome article",
 *   body: "This is an awesome article",
 *   refs: [{ name: "Deno", url: "https://deno.land/" }, "https://github.com"],
 * };
 * if (isArticle(a)) {
 *   // a is narrowed to the type of `isArticle`
 *   console.log(a.title);
 *   console.log(a.body);
 *   for (const ref of a.refs) {
 *     if (is.String(ref)) {
 *       console.log(ref);
 *     } else {
 *       console.log(ref.name);
 *       console.log(ref.url);
 *     }
 *   }
 * }
 * ```
 *
 * ### assert
 *
 * The `assert` function does nothing if a given value is expected type. Otherwise,
 * it throws an `AssertError` exception like:
 *
 * ```typescript
 * import {
 *   assert,
 *   is,
 * } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = "Hello";
 *
 * // `assert` does nothing or throws an `AssertError`
 * assert(a, is.String);
 * // a is now narrowed to string
 *
 * // With custom message
 * assert(a, is.String, { message: "a must be a string" });
 * ```
 *
 * ### ensure
 *
 * The `ensure` function return the value as-is if a given value is expected type.
 * Otherwise, it throws an `AssertError` exception like:
 *
 * ```typescript
 * import {
 *   ensure,
 *   is,
 * } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = "Hello";
 *
 * // `ensure` returns `string` or throws an `AssertError`
 * const _: string = ensure(a, is.String);
 *
 * // With custom message
 * const __: string = ensure(a, is.String, { message: "a must be a string" });
 * ```
 *
 * ### maybe
 *
 * The `maybe` function return the value as-is if a given value is expected type.
 * Otherwise, it returns `undefined` that suites with
 * [nullish coalescing operator (`??`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
 * like:
 *
 * ```typescript
 * import {
 *   is,
 *   maybe,
 * } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const a: unknown = "Hello";
 *
 * // `maybe` returns `string | undefined` so it suites with `??`
 * const _: string = maybe(a, is.String) ?? "default value";
 * ```
 *
 * @module
 */

export * from "./is.ts";
export * from "./metadata.ts";
export * from "./util.ts";

import is from "./is.ts";
export { is };
