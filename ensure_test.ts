import { assertStrictEquals, assertThrows } from "@std/assert";
import {
  AssertError,
  defaultAssertMessageFactory,
  setAssertMessageFactory,
} from "./assert.ts";
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

  await t.step(
    "throws an `AssertError` on false predicate with a custom name",
    () => {
      assertThrows(
        () => ensure(x, falsePredicate, { name: "hello world" }),
        AssertError,
        `Expected hello world that satisfies the predicate falsePredicate, got symbol: undefined`,
      );
    },
  );

  await t.step(
    "throws an `AssertError` with a custom message on false predicate",
    () => {
      assertThrows(
        () => ensure(x, falsePredicate, { message: "Hello" }),
        AssertError,
        "Hello",
      );
    },
  );
});

Deno.test("setAssertMessageFactory", async (t) => {
  setAssertMessageFactory((x, pred) => `Hello ${typeof x} ${pred.name}`);

  await t.step("change `AssertError` message on `ensure` failure", () => {
    assertThrows(
      () => ensure(x, falsePredicate),
      AssertError,
      "Hello symbol falsePredicate",
    );
  });

  setAssertMessageFactory(defaultAssertMessageFactory);
});
