import { assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { assertType, type IsExact } from "@std/testing/types";
import { is } from "./mod.ts";
import { isOmitOf } from "./omit_of.ts";

Deno.test("isOmitOf<T, K>", async (t) => {
  const pred = is.ObjectOf({
    a: is.Number,
    b: is.String,
    c: is.Boolean,
  });

  await t.step("returns properly named predicate function", async (t) => {
    assertEquals(typeof isOmitOf(pred, ["b"]), "function");
    await assertSnapshot(t, isOmitOf(pred, ["b"]).name);
    await assertSnapshot(t, isOmitOf(isOmitOf(pred, ["b"]), ["c"]).name);
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

  await t.step("predicated type is correct", () => {
    const a: unknown = { a: 0, b: "a", c: true };

    if (isOmitOf(pred, ["b"])(a)) {
      assertType<
        IsExact<typeof a, { a: number; c: boolean }>
      >(true);
    }

    if (isOmitOf(isOmitOf(pred, ["b"]), ["c"])(a)) {
      assertType<
        IsExact<typeof a, { a: number }>
      >(true);
    }
  });

  await t.step("with symbol properties", async (t) => {
    const b = Symbol("b");
    const c = Symbol("c");
    const pred = is.ObjectOf({
      a: is.Number,
      [b]: is.String,
      [c]: is.Boolean,
    });

    await t.step("returns properly named predicate function", async (t) => {
      assertEquals(typeof isOmitOf(pred, [b]), "function");
      await assertSnapshot(t, isOmitOf(pred, [b]).name);
      await assertSnapshot(t, isOmitOf(isOmitOf(pred, [b]), [c]).name);
    });

    await t.step("returns true on Omit<T, K> object", () => {
      assertEquals(
        isOmitOf(pred, [b])({ a: 0, [b]: undefined, [c]: true }),
        true,
      );
      assertEquals(isOmitOf(pred, [b, c])({ a: 0 }), true);
    });

    await t.step("returns false on non Omit<T, K> object", () => {
      assertEquals(
        isOmitOf(pred, [b])("a"),
        false,
        "Value is not an object",
      );
      assertEquals(
        isOmitOf(pred, [b])({ a: 0, [b]: "a", [c]: "" }),
        false,
        "Object have a different type property",
      );
    });

    await t.step("predicated type is correct", () => {
      const x: unknown = { a: 0, [b]: "a", [c]: true };

      if (isOmitOf(pred, [b])(x)) {
        assertType<
          IsExact<typeof x, { a: number; [c]: boolean }>
        >(true);
      }

      if (isOmitOf(isOmitOf(pred, [b]), [c])(x)) {
        assertType<
          IsExact<typeof x, { a: number }>
        >(true);
      }
    });
  });
});
