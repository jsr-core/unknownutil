import { assertEquals } from "@std/assert";
import { assertType, type IsExact } from "@std/testing/types";
import { isLiteralOneOf } from "./literal_one_of.ts";

Deno.test("isLiteralOneOf<T>", async (t) => {
  const literals = ["hello", "world"] as const;
  await t.step("returns properly named predicate function", () => {
    assertEquals(typeof isLiteralOneOf(literals), "function");
    assertEquals(
      isLiteralOneOf(literals).name,
      `isLiteralOneOf(["hello", "world"])`,
    );
  });

  await t.step("returns true on literal T", () => {
    assertEquals(isLiteralOneOf(literals)("hello"), true);
    assertEquals(isLiteralOneOf(literals)("world"), true);
  });

  await t.step("returns false on non literal T", () => {
    assertEquals(isLiteralOneOf(literals)(""), false);
    assertEquals(isLiteralOneOf(literals)(100), false);
  });

  await t.step("returns proper type predicate", () => {
    const a: unknown = "hello";
    if (isLiteralOneOf(literals)(a)) {
      assertType<IsExact<typeof a, "hello" | "world">>(true);
    }
  });
});
