import { assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { assertType } from "@std/testing/types";
import type { Equal } from "../_testutil.ts";
import { as } from "../as/mod.ts";
import { is } from "../is/mod.ts";
import { isReadonlyOf } from "./readonly_of.ts";

Deno.test("isReadonlyOf<T>", async (t) => {
  const pred = is.ObjectOf({
    a: is.Number,
    b: is.UnionOf([is.String, is.Undefined]),
    c: as.Readonly(is.Boolean),
  });
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isReadonlyOf(pred).name);
    // Nestable (no effect)
    await assertSnapshot(t, isReadonlyOf(isReadonlyOf(pred)).name);
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = { a: 0, b: "a", c: true };
    if (isReadonlyOf(pred)(a)) {
      assertType<
        Equal<
          typeof a,
          Readonly<{ a: number; b: string | undefined; c: boolean }>
        >
      >(true);
    }
  });
  await t.step("returns true on Readonly<T> object", () => {
    assertEquals(
      isReadonlyOf(pred)({ a: 0, b: "b", c: true } as const),
      true,
    );
    assertEquals(
      isReadonlyOf(pred)({ a: 0, b: "b", c: true }),
      true,
    );
  });
  await t.step("returns false on non Readonly<T> object", () => {
    assertEquals(isReadonlyOf(pred)("a"), false, "Value is not an object");
    assertEquals(
      isReadonlyOf(pred)({ a: 0, b: "a", c: "" }),
      false,
      "Object have a different type property",
    );
  });
});
