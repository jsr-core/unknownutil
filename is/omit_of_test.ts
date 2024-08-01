import { assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { assertType } from "@std/testing/types";
import type { Equal } from "../_testutil.ts";
import { is } from "./mod.ts";
import { isOmitOf } from "./omit_of.ts";

Deno.test("isOmitOf<T, K>", async (t) => {
  const pred = is.ObjectOf({
    a: is.Number,
    b: is.String,
    c: is.Boolean,
  });
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isOmitOf(pred, ["b"]).name);
    // Nestable
    await assertSnapshot(t, isOmitOf(isOmitOf(pred, ["b"]), ["c"]).name);
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = { a: 0, b: "a", c: true };
    if (isOmitOf(pred, ["b"])(a)) {
      assertType<
        Equal<typeof a, { a: number; c: boolean }>
      >(true);
    }
    if (isOmitOf(isOmitOf(pred, ["b"]), ["c"])(a)) {
      assertType<
        Equal<typeof a, { a: number }>
      >(true);
    }
  });
  await t.step("returns true on Omit<T, K> object", () => {
    assertEquals(
      isOmitOf(pred, ["b"])({ a: 0, b: undefined, c: true }),
      true,
    );
    assertEquals(isOmitOf(pred, ["b", "c"])({ a: 0 }), true);
  });
  await t.step("returns false on non Omit<T, K> object", () => {
    assertEquals(
      isOmitOf(pred, ["b"])("a"),
      false,
      "Value is not an object",
    );
    assertEquals(
      isOmitOf(pred, ["b"])({ a: 0, b: "a", c: "" }),
      false,
      "Object have a different type property",
    );
  });
});
