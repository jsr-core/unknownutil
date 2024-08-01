import { assertEquals } from "@std/assert";
import { assertSnapshot } from "@std/testing/snapshot";
import { assertType } from "@std/testing/types";
import { type Equal, testWithExamples } from "../_testutil.ts";
import { is } from "./mod.ts";
import { isMapOf } from "./map_of.ts";

Deno.test("isMapOf<T>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isMapOf(is.Number).name);
    await assertSnapshot(t, isMapOf((_x): _x is string => false).name);
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = new Map([["a", 0]]);
    if (isMapOf(is.Number)(a)) {
      assertType<Equal<typeof a, Map<unknown, number>>>(true);
    }
  });
  await t.step("returns true on T map", () => {
    assertEquals(isMapOf(is.Number)(new Map([["a", 0]])), true);
    assertEquals(isMapOf(is.String)(new Map([["a", "a"]])), true);
    assertEquals(isMapOf(is.Boolean)(new Map([["a", true]])), true);
  });
  await t.step("returns false on non T map", () => {
    assertEquals(isMapOf(is.String)(new Map([["a", 0]])), false);
    assertEquals(isMapOf(is.Number)(new Map([["a", "a"]])), false);
    assertEquals(isMapOf(is.String)(new Map([["a", true]])), false);
  });
  await testWithExamples(t, isMapOf((_: unknown): _ is unknown => true), {
    excludeExamples: ["map"],
  });
});

Deno.test("isMapOf<T, K>", async (t) => {
  await t.step("returns properly named function", async (t) => {
    await assertSnapshot(t, isMapOf(is.Number, is.String).name);
    await assertSnapshot(
      t,
      isMapOf((_x): _x is string => false, is.String).name,
    );
  });
  await t.step("returns proper type predicate", () => {
    const a: unknown = new Map([["a", 0]]);
    if (isMapOf(is.Number, is.String)(a)) {
      assertType<Equal<typeof a, Map<string, number>>>(true);
    }
  });
  await t.step("returns true on T map", () => {
    assertEquals(isMapOf(is.Number, is.String)(new Map([["a", 0]])), true);
    assertEquals(isMapOf(is.String, is.String)(new Map([["a", "a"]])), true);
    assertEquals(isMapOf(is.Boolean, is.String)(new Map([["a", true]])), true);
  });
  await t.step("returns false on non T map", () => {
    assertEquals(isMapOf(is.String, is.String)(new Map([["a", 0]])), false);
    assertEquals(isMapOf(is.Number, is.String)(new Map([["a", "a"]])), false);
    assertEquals(isMapOf(is.String, is.String)(new Map([["a", true]])), false);
  });
  await t.step("returns false on non K map", () => {
    assertEquals(isMapOf(is.Number, is.Number)(new Map([["a", 0]])), false);
    assertEquals(isMapOf(is.String, is.Number)(new Map([["a", "a"]])), false);
    assertEquals(isMapOf(is.Boolean, is.Number)(new Map([["a", true]])), false);
  });
  await testWithExamples(t, isMapOf((_: unknown): _ is unknown => true), {
    excludeExamples: ["map"],
  });
});
