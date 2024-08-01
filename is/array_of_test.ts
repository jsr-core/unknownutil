import { assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { assertType } from "@std/testing/types";
import { type Equal, testWithExamples } from "../_testutil.ts";
import { is } from "./mod.ts";
import { isArrayOf } from "./array_of.ts";

Deno.test("isArrayOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isArrayOf(is.Number).name);
    await assertSnapshot(t, isArrayOf((_x): _x is string => false).name);
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = [0, 1, 2];
    if (isArrayOf(is.Number)(a)) {
      assertType<Equal<typeof a, number[]>>(true);
    }
  });
  await t.step("returns true on T array", () => {
    assertEquals(isArrayOf(is.Number)([0, 1, 2]), true);
    assertEquals(isArrayOf(is.String)(["a", "b", "c"]), true);
    assertEquals(isArrayOf(is.Boolean)([true, false, true]), true);
  });
  await t.step("returns false on non T array", () => {
    assertEquals(isArrayOf(is.String)([0, 1, 2]), false);
    assertEquals(isArrayOf(is.Number)(["a", "b", "c"]), false);
    assertEquals(isArrayOf(is.String)([true, false, true]), false);
  });
  await testWithExamples(t, isArrayOf((_: unknown): _ is unknown => true), {
    excludeExamples: ["array"],
  });
});
