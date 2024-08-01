import { assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { assertType } from "@std/testing/types";
import { type Equal, testWithExamples } from "../_testutil.ts";
import { isLiteralOf } from "./literal_of.ts";

Deno.test("isLiteralOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isLiteralOf("hello").name);
    await assertSnapshot(t, isLiteralOf(100).name);
    await assertSnapshot(t, isLiteralOf(100n).name);
    await assertSnapshot(t, isLiteralOf(true).name);
    await assertSnapshot(t, isLiteralOf(null).name);
    await assertSnapshot(t, isLiteralOf(undefined).name);
    await assertSnapshot(t, isLiteralOf(Symbol("asdf")).name);
  });
  await t.step("returns proper type predicate", () => {
    const pred = "hello";
    const a: unknown = "hello";
    if (isLiteralOf(pred)(a)) {
      assertType<Equal<typeof a, "hello">>(true);
    }
  });
  await t.step("returns true on literal T", () => {
    const pred = "hello";
    assertEquals(isLiteralOf(pred)("hello"), true);
  });
  await t.step("returns false on non literal T", async (t) => {
    const pred = "hello";
    await testWithExamples(t, isLiteralOf(pred));
  });
});
