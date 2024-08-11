import { assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { assertType } from "@std/testing/types";
import type { Equal } from "../_testutil.ts";
import { is } from "./mod.ts";
import { isRecordOf } from "./record_of.ts";

Deno.test("isRecordOf<T>", async (t) => {
  await t.step("returns properly named predicate function", async (t) => {
    await assertSnapshot(t, isRecordOf(is.Number).name);
    await assertSnapshot(t, isRecordOf((_x): _x is string => false).name);
  });

  await t.step("returns true on T record", () => {
    assertEquals(isRecordOf(is.Number)({ a: 0 }), true);
    assertEquals(isRecordOf(is.String)({ a: "a" }), true);
    assertEquals(isRecordOf(is.Boolean)({ a: true }), true);
  });

  await t.step("returns false on non T record", () => {
    assertEquals(isRecordOf(is.String)({ a: 0 }), false);
    assertEquals(isRecordOf(is.Number)({ a: "a" }), false);
    assertEquals(isRecordOf(is.String)({ a: true }), false);
  });

  await t.step("predicated type is correct", () => {
    const a: unknown = { a: 0 };
    if (isRecordOf(is.Number)(a)) {
      assertType<Equal<typeof a, Record<PropertyKey, number>>>(true);
    }
  });

  await t.step("checks only object's own properties", async (t) => {
    await t.step("returns true on T record", () => {
      assertEquals(
        isRecordOf(is.Number)(
          Object.assign(Object.create({ p: "ignore" }), { a: 0 }),
        ),
        true,
      );
      assertEquals(
        isRecordOf(is.String)(
          Object.assign(Object.create({ p: 0 /* ignore */ }), { a: "a" }),
        ),
        true,
      );
      assertEquals(
        isRecordOf(is.Boolean)(
          Object.assign(Object.create({ p: "ignore" }), { a: true }),
        ),
        true,
      );
    });
  });

  await t.step("with symbol properties", async (t) => {
    const a = Symbol("a");
    await t.step("returns true on T record", () => {
      assertEquals(isRecordOf(is.Number)({ [a]: 0 }), true);
      assertEquals(isRecordOf(is.String)({ [a]: "a" }), true);
      assertEquals(isRecordOf(is.Boolean)({ [a]: true }), true);
    });

    await t.step("returns false on non T record", () => {
      assertEquals(isRecordOf(is.String)({ [a]: 0 }), false);
      assertEquals(isRecordOf(is.Number)({ [a]: "a" }), false);
      assertEquals(isRecordOf(is.String)({ [a]: true }), false);
    });
  });
});

Deno.test("isRecordOf<T, K>", async (t) => {
  await t.step("returns properly named predicate function", async (t) => {
    await assertSnapshot(t, isRecordOf(is.Number, is.String).name);
    await assertSnapshot(
      t,
      isRecordOf((_x): _x is string => false, is.String).name,
    );
  });

  await t.step("returns true on T record", () => {
    assertEquals(isRecordOf(is.Number, is.String)({ a: 0 }), true);
    assertEquals(isRecordOf(is.String, is.String)({ a: "a" }), true);
    assertEquals(isRecordOf(is.Boolean, is.String)({ a: true }), true);
  });

  await t.step("returns false on non T record", () => {
    assertEquals(isRecordOf(is.String, is.String)({ a: 0 }), false);
    assertEquals(isRecordOf(is.Number, is.String)({ a: "a" }), false);
    assertEquals(isRecordOf(is.String, is.String)({ a: true }), false);
  });

  await t.step("returns false on non K record", () => {
    assertEquals(isRecordOf(is.Number, is.Number)({ a: 0 }), false);
    assertEquals(isRecordOf(is.String, is.Number)({ a: "a" }), false);
    assertEquals(isRecordOf(is.Boolean, is.Number)({ a: true }), false);
  });

  await t.step("predicated type is correct", () => {
    const a: unknown = { a: 0 };
    if (isRecordOf(is.Number, is.String)(a)) {
      assertType<Equal<typeof a, Record<string, number>>>(true);
    }
  });

  await t.step("checks only object's own properties", async (t) => {
    const s = Symbol("s");
    await t.step("returns true on T record", () => {
      assertEquals(
        isRecordOf(is.Number, is.String)(
          Object.assign(Object.create({ p: "ignore" }), { a: 0 }),
        ),
        true,
      );
      assertEquals(
        isRecordOf(is.String, is.String)(
          Object.assign(Object.create({ p: 0 /* ignore */ }), { a: "a" }),
        ),
        true,
      );
      assertEquals(
        isRecordOf(is.Boolean, is.String)(
          Object.assign(Object.create({ p: "ignore" }), { a: true }),
        ),
        true,
      );
      assertEquals(
        isRecordOf(is.String, is.Number)(
          Object.assign(Object.create({ p: "ignore" }), {/* empty */}),
        ),
        true,
        "No own properties",
      );
      assertEquals(
        isRecordOf(is.String, is.String)(
          Object.assign(Object.create({ [s]: "ignore" }), {/* empty */}),
        ),
        true,
        "No own properties",
      );
    });
  });

  await t.step("with symbol properties", async (t) => {
    const a = Symbol("a");
    await t.step("returns properly named predicate function", async (t) => {
      await assertSnapshot(t, isRecordOf(is.Number, is.Symbol).name);
      await assertSnapshot(
        t,
        isRecordOf((_x): _x is string => false, is.Symbol).name,
      );
    });

    await t.step("returns true on T record", () => {
      assertEquals(isRecordOf(is.Number, is.Symbol)({ [a]: 0 }), true);
      assertEquals(isRecordOf(is.String, is.Symbol)({ [a]: "a" }), true);
      assertEquals(isRecordOf(is.Boolean, is.Symbol)({ [a]: true }), true);
    });

    await t.step("returns false on non T record", () => {
      assertEquals(isRecordOf(is.String, is.Symbol)({ [a]: 0 }), false);
      assertEquals(isRecordOf(is.Number, is.Symbol)({ [a]: "a" }), false);
      assertEquals(isRecordOf(is.String, is.Symbol)({ [a]: true }), false);
    });

    await t.step("returns false on non K record", () => {
      assertEquals(isRecordOf(is.Number, is.String)({ [a]: 0 }), false);
      assertEquals(isRecordOf(is.String, is.String)({ [a]: "a" }), false);
      assertEquals(isRecordOf(is.Boolean, is.String)({ [a]: true }), false);
    });

    await t.step("predicated type is correct", () => {
      const a: unknown = { a: 0 };
      if (isRecordOf(is.Number, is.Symbol)(a)) {
        assertType<Equal<typeof a, Record<symbol, number>>>(true);
      }
    });
  });
});
