import type { FlatType } from "../_typeutil.ts";
import { rewriteName } from "../_funcutil.ts";
import {
  annotate,
  type AsOptional,
  type AsReadonly,
  type IsPredObj,
} from "../_annotation.ts";
import type { Predicate } from "../type.ts";

/**
 * Return a type predicate function that returns `true` if the type of `x` is `ObjectOf<T>`.
 *
 * Use {@linkcode isRecordOf} if you want to check if the type of `x` is a record of `T`.
 *
 * If {@linkcode asOptional} is specified in the predicate function in `predObj`, the property becomes optional.
 * If {@linkcode asReadonly} is specified in the predicate function in `predObj`, the property becomes readonly.
 *
 * The number of keys of `x` must be greater than or equal to the number of keys of `predObj`.
 * Use {@linkcode isStrictOf} if you want to check the exact number of keys.
 *
 * To enhance performance, users are advised to cache the return value of this function and mitigate the creation cost.
 *
 * ```ts
 * import { as, is } from "@core/unknownutil";
 *
 * const isMyType = is.ObjectOf({
 *   a: is.Number,
 *   b: is.String,
 *   c: as.Optional(is.Boolean),
 *   d: as.Readonly(is.String),
 * });
 * const a: unknown = { a: 0, b: "a", d: "d" };
 * if (isMyType(a)) {
 *   const _: { a: number; b: string; c?: boolean | undefined, readonly d: string } = a;
 * }
 * ```
 */
export function isObjectOf<
  T extends Record<PropertyKey, Predicate<unknown>>,
>(predObj: T): Predicate<ObjectOf<T>> & IsPredObj<T> {
  return annotate(
    rewriteName(
      (x: unknown): x is ObjectOf<T> => {
        if (
          x == null ||
          typeof x !== "object" && typeof x !== "function" ||
          Array.isArray(x)
        ) return false;
        // Check each values
        return [
          ...Object.keys(predObj),
          ...Object.getOwnPropertySymbols(predObj),
        ].every((k) => predObj[k]((x as T)[k]));
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
      K in keyof T as T[K] extends AsReadonly
        ? T[K] extends AsOptional ? K : never
        : never
    ]?: T[K] extends Predicate<infer U> ? U : never;
  }
  // Readonly/Non optional
  & {
    readonly [
      K in keyof T as T[K] extends AsReadonly
        ? T[K] extends AsOptional ? never : K
        : never
    ]: T[K] extends Predicate<infer U> ? U : never;
  }
  // Non readonly/Optional
  & {
    [
      K in keyof T as T[K] extends AsReadonly ? never
        : T[K] extends AsOptional ? K
        : never
    ]?: T[K] extends Predicate<infer U> ? U : never;
  }
  // Non readonly/Non optional
  & {
    [
      K in keyof T as T[K] extends AsReadonly ? never
        : T[K] extends AsOptional ? never
        : K
    ]: T[K] extends Predicate<infer U> ? U : never;
  }
>;
