import { assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { assertType } from "@std/testing/types";
import type { Equal } from "../_testutil.ts";
import { is } from "./mod.ts";
import { isSetOf } from "./set_of.ts";

Deno.test("isSetOf<T>", async (t) => {
  await t.step("returns properly named predicate function", async (t) => {
    await assertSnapshot(t, isSetOf(is.Number).name);
    await assertSnapshot(t, isSetOf((_x): _x is string => false).name);
  });

  await t.step("returns true on T set", () => {
    assertEquals(isSetOf(is.Number)(new Set([0, 1, 2])), true);
    assertEquals(isSetOf(is.String)(new Set(["a", "b", "c"])), true);
    assertEquals(isSetOf(is.Boolean)(new Set([true, false, true])), true);
  });

  await t.step("returns false on non T set", () => {
    assertEquals(isSetOf(is.String)("a"), false, "Not a Set");
    assertEquals(isSetOf(is.String)(new Set([0, 1, 2])), false);
    assertEquals(isSetOf(is.Number)(new Set(["a", "b", "c"])), false);
    assertEquals(isSetOf(is.String)(new Set([true, false, true])), false);
  });

  await t.step("predicated type is correct", () => {
    const a: unknown = new Set([0, 1, 2]);
    if (isSetOf(is.Number)(a)) {
      assertType<Equal<typeof a, Set<number>>>(true);
    }
  });
});
