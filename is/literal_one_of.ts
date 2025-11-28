import { rewriteName } from "../_funcutil.ts";
import type { Predicate, Primitive } from "../type.ts";

/**
 * Return a type predicate function that returns `true` if the type of `x` is one of literal type in `preds`.
 *
 * Use {@linkcode [is/literal].isLiteral|isLiteral} to check if the type of `x` is a literal type.
 * Use {@linkcode [is/literal-of].isLiteralOf|isLiteralOf} to check if the type of `x` is a literal type of {@linkcode [type].Primitive|Primitive}.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const isMyType = is.LiteralOneOf(["hello", "world"]);
 * const a: unknown = "hello";
 * if (isMyType(a)) {
 *   const _: "hello" | "world" = a;
 * }
 * ```
 */
export function isLiteralOneOf<const T extends readonly Primitive[]>(
  literals: T,
): Predicate<T[number]> {
  const s = new Set(literals);
  return rewriteName(
    (x: unknown): x is T[number] => s.has(x as T[number]),
    "isLiteralOneOf",
    literals,
  );
}
