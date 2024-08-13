import { assertThrows } from "@std/assert";
import {
  assert,
  AssertError,
  defaultAssertMessageFactory,
  setAssertMessageFactory,
} from "./assert.ts";
import { is } from "./is/mod.ts";

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

  await t.step(
    "throws an `AssertError` on false predicate with a custom name",
    () => {
      assertThrows(
        () => assert(x, falsePredicate, { name: "hello world" }),
        AssertError,
        `Expected hello world that satisfies the predicate falsePredicate, got symbol: undefined`,
      );
    },
  );

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

  await t.step("throws an `AssertError` on isObjectOf", () => {
    const pred = is.ObjectOf({
      a: is.ObjectOf({
        b: is.ObjectOf({
          c: is.String,
        }),
      }),
    });
    assertThrows(
      () => assert({ a: { b: { c: 0 } } }, pred),
      AssertError,
      `Expected a value that satisfies the predicate falsePredicate, got symbol: undefined`,
    );
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

  setAssertMessageFactory(defaultAssertMessageFactory);
});
