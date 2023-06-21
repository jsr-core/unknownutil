import {
  assertStrictEquals,
  assertThrows,
} from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { assert, AssertError, ensure, maybe } from "./util.ts";

const x: unknown = Symbol("x");

Deno.test("assert", async (t) => {
  await t.step("does nothing on true predicate", () => {
    assert(x, (_x): _x is string => true);
  });

  await t.step("throws an `AssertError` on false predicate", () => {
    assertThrows(() => assert(x, (_x): _x is string => false), AssertError);
  });

  await t.step(
    "throws an `AssertError` with a custom message on false predicate",
    () => {
      assertThrows(
        () => assert(x, (_x): _x is string => false, { message: "Hello" }),
        AssertError,
        "Hello",
      );
    },
  );
});

Deno.test("ensure", async (t) => {
  await t.step("returns `x` as-is on true predicate", () => {
    assertStrictEquals(ensure(x, (_x): _x is string => true), x);
  });

  await t.step("throws an `AssertError` on false predicate", () => {
    assertThrows(() => ensure(x, (_x): _x is string => false), AssertError);
  });

  await t.step(
    "throws an `AssertError` with a custom message on false predicate",
    () => {
      assertThrows(
        () => ensure(x, (_x): _x is string => false, { message: "Hello" }),
        AssertError,
        "Hello",
      );
    },
  );
});

Deno.test("maybe", async (t) => {
  await t.step("returns `x` as-is on true predicate", () => {
    assertStrictEquals(maybe(x, (_x): _x is string => true), x);
  });

  await t.step("returns `undefined` on false predicate", () => {
    assertStrictEquals(maybe(x, (_x): _x is string => false), undefined);
  });
});
