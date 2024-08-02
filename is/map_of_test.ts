import { assertEquals } from "@std/assert";
import { assertType } from "@std/testing/types";
import type { Equal } from "../_testutil.ts";
import { is } from "./mod.ts";
import { isMapOf } from "./map_of.ts";

Deno.test("isMapOf<T>", async (t) => {
  await t.step("returns properly named predicate function", () => {
    assertEquals(typeof isMapOf(is.Number), "function");
    assertEquals(isMapOf(is.Number).name, "isMapOf(isNumber, undefined)");
    assertEquals(
      isMapOf((_x): _x is unknown => true).name,
      "isMapOf((anonymous), undefined)",
    );
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

  await t.step("returns proper type predicate", () => {
    const a: unknown = undefined;
    if (isMapOf(is.Number)(a)) {
      assertType<Equal<typeof a, Map<unknown, number>>>(true);
    }
  });
});

Deno.test("isMapOf<T, K>", async (t) => {
  await t.step("returns properly named predicate function", () => {
    assertEquals(typeof isMapOf(is.Number, is.String), "function");
    assertEquals(
      isMapOf(is.Number, is.String).name,
      "isMapOf(isNumber, isString)",
    );
    assertEquals(
      isMapOf((_x): _x is unknown => true, is.String).name,
      "isMapOf((anonymous), isString)",
    );
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

  await t.step("predicated type is correct", () => {
    const a: unknown = new Map([["a", 0]]);
    if (isMapOf(is.Number, is.String)(a)) {
      assertType<Equal<typeof a, Map<string, number>>>(true);
    }
  });
});
