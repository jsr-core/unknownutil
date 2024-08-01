import type { FlatType } from "../_typeutil.ts";
import { rewriteName } from "../_funcutil.ts";
import {
  annotate,
  type WithOptional,
  type WithPredObj,
  type WithReadonly,
} from "../_annotation.ts";
import type { Predicate } from "../type.ts";

/**
 * Return a type predicate function that returns `true` if the type of `x` is `ObjectOf<T>`.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * If `as.Optional` is specified in the predicate function, the property becomes optional.
 *
 * The number of keys of `x` must be greater than or equal to the number of keys of `predObj`.
 *
 * ```ts
 * import { as, is } from "@core/unknownutil";
 *
 * const isMyType = is.ObjectOf({
 *   a: is.Number,
 *   b: is.String,
 *   c: as.Optional(is.Boolean),
 * });
 * const a: unknown = { a: 0, b: "a", other: "other" };
 * if (isMyType(a)) {
 *   // "other" key in `a` is ignored because of `options.strict` is `false`.
 *   // a is narrowed to { a: number; b: string; c?: boolean | undefined }
 *   const _: { a: number; b: string; c?: boolean | undefined } = a;
 * }
 * ```
 */
export function isObjectOf<
  T extends Record<PropertyKey, Predicate<unknown>>,
>(predObj: T): Predicate<ObjectOf<T>> & WithPredObj<T> {
  return annotate(
    rewriteName(
      (x: unknown): x is ObjectOf<T> => {
        if (
          x == null ||
          typeof x !== "object" && typeof x !== "function" ||
          Array.isArray(x)
        ) return false;
        // Check each values
        for (const k in predObj) {
          if (!predObj[k]((x as T)[k])) return false;
        }
        return true;
      },
      "isObjectOf",
      predObj,
    ),
    "predObj",
    predObj,
  );
}

type ObjectOf<T extends Record<PropertyKey, Predicate<unknown>>> = FlatType<
  // Readonly/Optional
  & {
    readonly [
      K in keyof T as T[K] extends WithReadonly
        ? T[K] extends WithOptional ? K : never
        : never
    ]?: T[K] extends Predicate<infer U> ? U : never;
  }
  // Readonly/Non optional
  & {
    readonly [
      K in keyof T as T[K] extends WithReadonly
        ? T[K] extends WithOptional ? never : K
        : never
    ]: T[K] extends Predicate<infer U> ? U : never;
  }
  // Non readonly/Optional
  & {
    [
      K in keyof T as T[K] extends WithReadonly ? never
        : T[K] extends WithOptional ? K
        : never
    ]?: T[K] extends Predicate<infer U> ? U : never;
  }
  // Non readonly/Non optional
  & {
    [
      K in keyof T as T[K] extends WithReadonly ? never
        : T[K] extends WithOptional ? never
        : K
    ]: T[K] extends Predicate<infer U> ? U : never;
  }
>;
