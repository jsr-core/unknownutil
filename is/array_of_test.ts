import { assertEquals } from "@std/assert";
import { assertType, type IsExact } from "@std/testing/types";
import { is } from "./mod.ts";
import { isArrayOf } from "./array_of.ts";

Deno.test("isArrayOf<T>", async (t) => {
  await t.step("returns properly named predicate function", () => {
    assertEquals(typeof isArrayOf(is.Number), "function");
    assertEquals(isArrayOf(is.Number).name, "isArrayOf(isNumber)");
    assertEquals(
      isArrayOf((_x): _x is unknown => true).name,
      "isArrayOf((anonymous))",
    );
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

  await t.step("predicated type is correct", () => {
    const a: unknown = undefined;

    if (isArrayOf(is.Number)(a)) {
      assertType<IsExact<typeof a, number[]>>(true);
    }
  });
});
