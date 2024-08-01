import { rewriteName } from "../_funcutil.ts";
import type { Predicate, Primitive } from "../type.ts";

/**
 * Return a type predicate function that returns `true` if the type of `x` is a literal type of `pred`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const isMyType = is.LiteralOf("hello");
 * const a: unknown = "hello";
 * if (isMyType(a)) {
 *   // a is narrowed to "hello"
 *   const _: "hello" = a;
 * }
 * ```
 */
export function isLiteralOf<T extends Primitive>(
  literal: T,
): Predicate<T> {
  return rewriteName(
    (x: unknown): x is T => x === literal,
    "isLiteralOf",
    literal,
  );
}
