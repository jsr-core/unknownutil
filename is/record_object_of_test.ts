import { assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { assertType } from "@std/testing/types";
import type { Equal } from "../_testutil.ts";
import { is } from "./mod.ts";
import { isRecordObjectOf } from "./record_object_of.ts";

Deno.test("isRecordObjectOf<T>", async (t) => {
  await t.step("returns properly named predicate function", async (t) => {
    await assertSnapshot(t, isRecordObjectOf(is.Number).name);
    await assertSnapshot(t, isRecordObjectOf((_x): _x is string => false).name);
  });

  await t.step("returns true on T record", () => {
    assertEquals(isRecordObjectOf(is.Number)({ a: 0 }), true);
    assertEquals(isRecordObjectOf(is.String)({ a: "a" }), true);
    assertEquals(isRecordObjectOf(is.Boolean)({ a: true }), true);
  });

  await t.step("returns false on non T record", () => {
    assertEquals(isRecordObjectOf(is.String)({ a: 0 }), false);
    assertEquals(isRecordObjectOf(is.Number)({ a: "a" }), false);
    assertEquals(isRecordObjectOf(is.String)({ a: true }), false);
  });

  await t.step("predicated type is correct", () => {
    const a: unknown = { a: 0 };
    if (isRecordObjectOf(is.Number)(a)) {
      assertType<Equal<typeof a, Record<PropertyKey, number>>>(true);
    }
  });
});

Deno.test("isRecordObjectOf<T, K>", async (t) => {
  await t.step("returns properly named predicate function", async (t) => {
    await assertSnapshot(t, isRecordObjectOf(is.Number, is.String).name);
    await assertSnapshot(
      t,
      isRecordObjectOf((_x): _x is string => false, is.String).name,
    );
  });

  await t.step("returns true on T record", () => {
    assertEquals(isRecordObjectOf(is.Number, is.String)({ a: 0 }), true);
    assertEquals(isRecordObjectOf(is.String, is.String)({ a: "a" }), true);
    assertEquals(isRecordObjectOf(is.Boolean, is.String)({ a: true }), true);
  });

  await t.step("returns false on non T record", () => {
    assertEquals(isRecordObjectOf(is.String, is.String)({ a: 0 }), false);
    assertEquals(isRecordObjectOf(is.Number, is.String)({ a: "a" }), false);
    assertEquals(isRecordObjectOf(is.String, is.String)({ a: true }), false);
  });

  await t.step("returns false on non K record", () => {
    assertEquals(isRecordObjectOf(is.Number, is.Number)({ a: 0 }), false);
    assertEquals(isRecordObjectOf(is.String, is.Number)({ a: "a" }), false);
    assertEquals(isRecordObjectOf(is.Boolean, is.Number)({ a: true }), false);
  });

  await t.step("predicated type is correct", () => {
    const a: unknown = { a: 0 };
    if (isRecordObjectOf(is.Number, is.String)(a)) {
      assertType<Equal<typeof a, Record<string, number>>>(true);
    }
  });
});
