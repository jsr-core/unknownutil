import {
  assertStrictEquals,
  assertThrows,
} from "https://deno.land/std@0.200.0/testing/asserts.ts";
import {
  assert,
  AssertError,
  defaultAssertMessageFactory,
  ensure,
  maybe,
  setAssertMessageFactory,
} from "./util.ts";

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

  await t.step("throws an `AssertError` on false predicate", () => {
    assertThrows(
      () => assert(x, falsePredicate),
      AssertError,
      `Expected a value that satisfies the predicate falsePredicate, got symbol: undefined`,
    );
  });

  await t.step(
    "throws an `AssertError` with a custom message on false predicate",
    () => {
      assertThrows(
        () => assert(x, falsePredicate, { message: "Hello" }),
        AssertError,
        "Hello",
      );
    },
  );
});

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

Deno.test("maybe", async (t) => {
  await t.step("returns `x` as-is on true predicate", () => {
    assertStrictEquals(maybe(x, truePredicate), x);
  });

  await t.step("returns `undefined` on false predicate", () => {
    assertStrictEquals(maybe(x, falsePredicate), undefined);
  });
});

Deno.test("setAssertMessageFactory", async (t) => {
  setAssertMessageFactory((x, pred) => `Hello ${typeof x} ${pred.name}`);

  await t.step("change `AssertError` message on `assert` failure", () => {
    assertThrows(
      () => assert(x, falsePredicate),
      AssertError,
      "Hello symbol falsePredicate",
    );
  });

  await t.step("change `AssertError` message on `ensure` failure", () => {
    assertThrows(
      () => ensure(x, falsePredicate),
      AssertError,
      "Hello symbol falsePredicate",
    );
  });

  setAssertMessageFactory(defaultAssertMessageFactory);
});
