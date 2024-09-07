import { assertEquals } from "@std/assert";
import { assertType, type IsExact } from "@std/testing/types";
import { isLiteralOf } from "./literal_of.ts";

Deno.test("isLiteralOf<T>", async (t) => {
  await t.step("returns properly named predicate function", () => {
    assertEquals(typeof isLiteralOf("hello"), "function");
    assertEquals(isLiteralOf("hello").name, `isLiteralOf("hello")`);
    assertEquals(isLiteralOf(100).name, `isLiteralOf(100)`);
    assertEquals(isLiteralOf(100n).name, `isLiteralOf(100n)`);
    assertEquals(isLiteralOf(true).name, `isLiteralOf(true)`);
    assertEquals(isLiteralOf(false).name, `isLiteralOf(false)`);
    assertEquals(isLiteralOf(null).name, `isLiteralOf(null)`);
    assertEquals(isLiteralOf(undefined).name, `isLiteralOf(undefined)`);
    assertEquals(isLiteralOf(Symbol("asdf")).name, `isLiteralOf(Symbol(asdf))`);
  });

  await t.step("returns true on literal T", () => {
    const s = Symbol("asdf");
    assertEquals(isLiteralOf("hello")("hello"), true);
    assertEquals(isLiteralOf(100)(100), true);
    assertEquals(isLiteralOf(100n)(100n), true);
    assertEquals(isLiteralOf(true)(true), true);
    assertEquals(isLiteralOf(false)(false), true);
    assertEquals(isLiteralOf(null)(null), true);
    assertEquals(isLiteralOf(undefined)(undefined), true);
    assertEquals(isLiteralOf(s)(s), true);
  });

  await t.step("returns false on non literal T", () => {
    const s = Symbol("asdf");
    assertEquals(isLiteralOf(100)("hello"), false);
    assertEquals(isLiteralOf(100n)(100), false);
    assertEquals(isLiteralOf(true)(100n), false);
    assertEquals(isLiteralOf(false)(true), false);
    assertEquals(isLiteralOf(null)(false), false);
    assertEquals(isLiteralOf(undefined)(null), false);
    assertEquals(isLiteralOf(s)(undefined), false);
    assertEquals(isLiteralOf("hello")(s), false);
  });

  await t.step("predicated type is correct", () => {
    const s = Symbol("asdf");
    const a: unknown = undefined;

    if (isLiteralOf("hello")(a)) {
      assertType<IsExact<typeof a, "hello">>(true);
    }

    if (isLiteralOf(100)(a)) {
      assertType<IsExact<typeof a, 100>>(true);
    }

    if (isLiteralOf(100n)(a)) {
      assertType<IsExact<typeof a, 100n>>(true);
    }

    if (isLiteralOf(true)(a)) {
      assertType<IsExact<typeof a, true>>(true);
    }

    if (isLiteralOf(false)(a)) {
      assertType<IsExact<typeof a, false>>(true);
    }

    if (isLiteralOf(null)(a)) {
      assertType<IsExact<typeof a, null>>(true);
    }

    if (isLiteralOf(undefined)(a)) {
      assertType<IsExact<typeof a, undefined>>(true);
    }

    if (isLiteralOf(s)(a)) {
      assertType<IsExact<typeof a, typeof s>>(true);
    }
  });
});
