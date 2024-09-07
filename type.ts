/**
 * A type predicate function.
 *
 * ```ts
 * import { as, is, type Predicate } from "@core/unknownutil";
 *
 * type Person = {
 *   name: string;
 *   age: number;
 *   address?: string | undefined;
 * };
 * const isPerson = is.ObjectOf({
 *   name: is.String,
 *   age: is.Number,
 *   address: as.Optional(is.String),
 * }) satisfies Predicate<Person>;
 * ```
 */
export type Predicate<T> = (x: unknown) => x is T;

/**
 * A type predicated by {@linkcode Predicate<T>}.
 *
 * ```ts
 * import { as, is, type PredicateType } from "@core/unknownutil";
 *
 * const isPerson = is.ObjectOf({
 *   name: is.String,
 *   age: is.Number,
 *   address: as.Optional(is.String),
 * });
 *
 * type Person = PredicateType<typeof isPerson>;
 * // type Person = {
 * //   name: string;
 * //   age: number;
 * //   address?: string | undefined;
 * // };
 * ```
 */
export type PredicateType<P> = P extends Predicate<infer T> ? T : never;

/**
 * JavaScript primitive types.
 */
export type Primitive =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | symbol;
