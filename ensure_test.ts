import { assertStrictEquals, assertThrows } from "@std/assert";
import { AssertError } from "./assert.ts";
import { ensure } from "./ensure.ts";

const x: unknown = Symbol("x");

function truePredicate(_x: unknown): _x is string {
  return true;
}

function falsePredicate(_x: unknown): _x is string {
  return false;
}

Deno.test("ensure", async (t) => {
  await t.step("returns `x` as-is on true predicate", () => {
    assertStrictEquals(ensure(x, truePredicate), x);
  });

  await t.step("throws an `AssertError` on false predicate", () => {
    assertThrows(
      () => ensure(x, falsePredicate),
      AssertError,
      `Expected a value that satisfies the predicate falsePredicate, got symbol: undefined`,
    );
  });
});
