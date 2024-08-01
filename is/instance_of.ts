import { rewriteName } from "../_funcutil.ts";
import type { Predicate } from "../type.ts";

/**
 * Return `true` if the type of `x` is instance of `ctor`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { is } from "@core/unknownutil";
 *
 * const isMyType = is.InstanceOf(Date);
 * const a: unknown = new Date();
 * if (isMyType(a)) {
 *   const _: Date = a;
 * }
 * ```
 */
// deno-lint-ignore no-explicit-any
export function isInstanceOf<T extends new (...args: any) => unknown>(
  ctor: T,
): Predicate<InstanceType<T>> {
  return rewriteName(
    (x: unknown): x is InstanceType<T> => x instanceof ctor,
    "isInstanceOf",
    ctor,
  );
}
