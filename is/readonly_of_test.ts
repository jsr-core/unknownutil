import { assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { assertType } from "@std/testing/types";
import type { Equal } from "../_testutil.ts";
import { as } from "../as/mod.ts";
import { is } from "../is/mod.ts";
import { isReadonlyOf } from "./readonly_of.ts";

Deno.test("isReadonlyOf<T>", async (t) => {
  await t.step("with isRecord", async (t) => {
    const pred = is.Record;
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
            Readonly<Record<PropertyKey, unknown>>
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
        isReadonlyOf(pred)([]),
        false,
        "Object have a different type property",
      );
    });
  });
  await t.step("with isObjectOf", async (t) => {
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
  await t.step("with isTupleOf", async (t) => {
    const pred = is.TupleOf([is.Number, is.String, as.Readonly(is.Boolean)]);
    await t.step("returns properly named function", async (t) => {
      await assertSnapshot(t, isReadonlyOf(pred).name);
      // Nestable (no effect)
      await assertSnapshot(t, isReadonlyOf(isReadonlyOf(pred)).name);
    });
    await t.step("returns proper type predicate", () => {
      const a: unknown = [];
      if (isReadonlyOf(pred)(a)) {
        assertType<
          Equal<
            typeof a,
            Readonly<[number, string, boolean]>
          >
        >(true);
      }
    });
    await t.step("returns true on Readonly<T> object", () => {
      assertEquals(
        isReadonlyOf(pred)([0, "b", true] as const),
        true,
      );
      assertEquals(
        isReadonlyOf(pred)([0, "b", true]),
        true,
      );
    });
    await t.step("returns false on non Readonly<T> object", () => {
      assertEquals(isReadonlyOf(pred)("a"), false, "Value is not an object");
      assertEquals(
        isReadonlyOf(pred)([0, "a", ""]),
        false,
        "Object have a different type property",
      );
    });
  });
  await t.step("with isUniformTupleOf", async (t) => {
    const pred = is.UniformTupleOf(3, is.Number);
    await t.step("returns properly named function", async (t) => {
      await assertSnapshot(t, isReadonlyOf(pred).name);
      // Nestable (no effect)
      await assertSnapshot(t, isReadonlyOf(isReadonlyOf(pred)).name);
    });
    await t.step("returns proper type predicate", () => {
      const a: unknown = [];
      if (isReadonlyOf(pred)(a)) {
        assertType<
          Equal<
            typeof a,
            Readonly<[number, number, number]>
          >
        >(true);
      }
    });
    await t.step("returns true on Readonly<T> object", () => {
      assertEquals(
        isReadonlyOf(pred)([0, 1, 2] as const),
        true,
      );
      assertEquals(
        isReadonlyOf(pred)([0, 1, 2]),
        true,
      );
    });
    await t.step("returns false on non Readonly<T> object", () => {
      assertEquals(isReadonlyOf(pred)("a"), false, "Value is not an object");
      assertEquals(
        isReadonlyOf(pred)([0, "a", ""]),
        false,
        "Object have a different type property",
      );
    });
  });
});
