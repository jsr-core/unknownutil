import { assertStrictEquals } from "@std/assert";
import { maybe } from "./maybe.ts";

const x: unknown = Symbol("x");

function truePredicate(_x: unknown): _x is string {
  return true;
}

function falsePredicate(_x: unknown): _x is string {
  return false;
}

Deno.test("maybe", async (t) => {
  await t.step("returns `x` as-is on true predicate", () => {
    assertStrictEquals(maybe(x, truePredicate), x);
  });

  await t.step("returns `undefined` on false predicate", () => {
    assertStrictEquals(maybe(x, falsePredicate), undefined);
  });
});
