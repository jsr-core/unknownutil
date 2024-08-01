import { assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { assertType } from "@std/testing/types";
import type { Equal } from "../_testutil.ts";
import { is } from "./mod.ts";
import { isPickOf } from "./pick_of.ts";

Deno.test("isPickOf<T, K>", async (t) => {
  const pred = is.ObjectOf({
    a: is.Number,
    b: is.String,
    c: is.Boolean,
  });
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isPickOf(pred, ["a", "c"]).name);
    // Nestable
    await assertSnapshot(t, isPickOf(isPickOf(pred, ["a", "c"]), ["a"]).name);
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = { a: 0, b: "a", c: true };
    if (isPickOf(pred, ["a", "c"])(a)) {
      assertType<
        Equal<typeof a, { a: number; c: boolean }>
      >(true);
    }
    if (isPickOf(isPickOf(pred, ["a", "c"]), ["a"])(a)) {
      assertType<
        Equal<typeof a, { a: number }>
      >(true);
    }
  });
  await t.step("returns true on Pick<T, K> object", () => {
    assertEquals(
      isPickOf(pred, ["a", "c"])({ a: 0, b: undefined, c: true }),
      true,
    );
    assertEquals(isPickOf(pred, ["a"])({ a: 0 }), true);
  });
  await t.step("returns false on non Pick<T, K> object", () => {
    assertEquals(
      isPickOf(pred, ["a", "c"])("a"),
      false,
      "Value is not an object",
    );
    assertEquals(
      isPickOf(pred, ["a", "c"])({ a: 0, b: "a", c: "" }),
      false,
      "Object have a different type property",
    );
  });
});
