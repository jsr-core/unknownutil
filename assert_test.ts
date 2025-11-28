import { assertThrows } from "@std/assert";
import { assert, AssertError } from "./assert.ts";

const x: unknown = Symbol("x");

function truePredicate(_x: unknown): _x is string {
  return true;
}

function falsePredicate(_x: unknown): _x is string {
  return false;
}

Deno.test("assert", async (t) => {
  await t.step("does nothing on true predicate", () => {
    assert(x, truePredicate);
  });

  await t.step("throws an `AssertError` on false predicate", () => {
    assertThrows(
      () => assert(x, falsePredicate),
      AssertError,
      `Expected a value that satisfies the predicate falsePredicate, got symbol: undefined`,
    );
  });

  await t.step(
    "throws an `AssertError` on false predicate with an anonymous predicate",
    () => {
      assertThrows(
        () => assert(x, (_x: unknown): _x is string => false),
        AssertError,
        `Expected a value that satisfies the predicate anonymous predicate, got symbol: undefined`,
      );
    },
  );
});
