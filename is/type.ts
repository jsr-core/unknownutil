/**
 * A type predicate function.
 */
export type Predicate<T> = (x: unknown) => x is T;

/**
 * A type predicated by Predicate<T>.
 *
 * ```ts
 * import { is, type PredicateType } from "https://deno.land/x/unknownutil@$MODULE_VERSION/mod.ts";
 *
 * const isPerson = is.ObjectOf({
 *   name: is.String,
 *   age: is.Number,
 *   address: is.OptionalOf(is.String),
 * });
 *
 * type Person = PredicateType<typeof isPerson>;
 * // Above is equivalent to the following type
 * // type Person = {
 * //   name: string;
 * //   age: number;
 * //   address: string | undefined;
 * // };
 */
export type PredicateType<P> = P extends Predicate<infer T> ? T : never;
