import { assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { assertType } from "@std/testing/types";
import type { Equal } from "../_testutil.ts";
import { as } from "../as/mod.ts";
import { is } from "./mod.ts";
import { isPartialOf } from "./partial_of.ts";

Deno.test("isPartialOf<T>", async (t) => {
  const pred = is.ObjectOf({
    a: is.Number,
    b: is.UnionOf([is.String, is.Undefined]),
    c: as.Optional(is.Boolean),
    d: as.Readonly(is.String),
  });
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isPartialOf(pred).name);
    // Nestable (no effect)
    await assertSnapshot(t, isPartialOf(isPartialOf(pred)).name);
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = { a: 0, b: "a", c: true };
    if (isPartialOf(pred)(a)) {
      assertType<
        Equal<
          typeof a,
          Partial<{ a: number; b: string; c: boolean; readonly d: string }>
        >
      >(true);
    }
  });
  await t.step("returns true on Partial<T> object", () => {
    assertEquals(
      isPartialOf(pred)({ a: undefined, b: undefined, c: undefined }),
      true,
    );
    assertEquals(isPartialOf(pred)({}), true);
  });
  await t.step("returns false on non Partial<T> object", () => {
    assertEquals(isPartialOf(pred)("a"), false, "Value is not an object");
    assertEquals(
      isPartialOf(pred)({ a: 0, b: "a", c: "" }),
      false,
      "Object have a different type property",
    );
  });
});
