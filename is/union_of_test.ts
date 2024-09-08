import { assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { assertType, type IsExact } from "@std/testing/types";
import { testWithExamples } from "../_testutil.ts";
import type { PredicateType } from "../type.ts";
import { is } from "./mod.ts";
import { isUnionOf } from "./union_of.ts";

Deno.test("isUnionOf<T>", async (t) => {
  await t.step("returns properly named predicate function", async (t) => {
    await assertSnapshot(t, isUnionOf([is.Number, is.String, is.Boolean]).name);
  });

  await t.step("returns true on one of T", () => {
    const preds = [is.Number, is.String, is.Boolean] as const;
    assertEquals(isUnionOf(preds)(0), true);
    assertEquals(isUnionOf(preds)("a"), true);
    assertEquals(isUnionOf(preds)(true), true);
  });

  await t.step("returns false on non of T", async (t) => {
    const preds = [is.Number, is.String, is.Boolean] as const;
    await testWithExamples(t, isUnionOf(preds), {
      excludeExamples: ["number", "string", "boolean"],
    });
  });

  await t.step("predicated type is correct", () => {
    const preds = [is.Number, is.String, is.Boolean] as const;
    const a: unknown = [0, "a", true];
    if (isUnionOf(preds)(a)) {
      assertType<IsExact<typeof a, number | string | boolean>>(true);
    }
  });

  await t.step("predicated type is correct (#49)", () => {
    const isFoo = is.ObjectOf({ foo: is.String });
    const isBar = is.ObjectOf({ foo: is.String, bar: is.Number });
    type Foo = PredicateType<typeof isFoo>;
    type Bar = PredicateType<typeof isBar>;
    const preds = [isFoo, isBar] as const;
    const a: unknown = [0, "a", true];
    if (isUnionOf(preds)(a)) {
      assertType<IsExact<typeof a, Foo | Bar>>(true);
    }
  });
});
