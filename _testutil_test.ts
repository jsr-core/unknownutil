// deno-lint-ignore-file no-explicit-any
import { assertType, type IsExact } from "@std/testing/types";

import type { Equal, TypeChallengesEqual } from "./_testutil.ts";

declare class Foo<T> {
  declare private _: T;
}

Deno.test("IsExact gives false positive", () => {
  // all of the following should be false
  assertType<IsExact<() => void, (x?: number) => void>>(true);
  assertType<IsExact<Foo<{ x: 1; a?: 1 }>, Foo<{ x: 1; b?: 1 }>>>(true);
  assertType<IsExact<() => any, () => number>>(true);
  assertType<IsExact<Foo<any>, Foo<number>>>(true);
  assertType<IsExact<{ a: 1 }, { readonly a: 1 }>>(true);
});

Deno.test("TypeChallengesEqual gives false positive", () => {
  // all of the following should be false
  assertType<TypeChallengesEqual<[...any[]], [...any[], any]>>(true);
  assertType<TypeChallengesEqual<[any, ...any[]], [any, ...any[], any]>>(true);
});

Deno.test("Equal", async (t) => {
  await t.step(
    "should be correct in cases where IsExact gives false positive",
    () => {
      assertType<Equal<() => void, (x?: number) => void>>(false);
      assertType<Equal<Foo<{ x: 1; a?: 1 }>, Foo<{ x: 1; b?: 1 }>>>(false);
      assertType<Equal<() => any, () => number>>(false);
      assertType<Equal<Foo<any>, Foo<number>>>(false);
      assertType<Equal<{ a: 1 }, { readonly a: 1 }>>(false);
    },
  );
  await t.step(
    "should be correct in cases where TypeChallengesEqual gives false positive",
    () => {
      assertType<Equal<[...any[]], [...any[], any]>>(false);
      assertType<Equal<[any, ...any[]], [any, ...any[], any]>>(false);
    },
  );
});
