import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.186.0/testing/asserts.ts";
import {
  ensureArray,
  ensureBoolean,
  ensureFunction,
  ensureNull,
  ensureNullish,
  ensureNumber,
  ensureObject,
  ensureString,
  ensureUndefined,
} from "./ensure.ts";
import { isBoolean, isNumber, isString } from "./is.ts";

Deno.test("ensureString returns the value when the value is string", () => {
  assertEquals(ensureString("Hello"), "Hello");
});
Deno.test("ensureString throws error on non string", () => {
  assertThrows(() => ensureString(0));
  assertThrows(() => ensureString(true));
  assertThrows(() => ensureString(false));
  assertThrows(() => ensureString([]));
  assertThrows(() => ensureString({}));
  assertThrows(() => ensureString(function () {}));
  assertThrows(() => ensureString(undefined));
  assertThrows(() => ensureString(null));
});

Deno.test("ensureNumber returns the value when the value is number", () => {
  assertEquals(ensureNumber(0), 0);
  assertEquals(ensureNumber(1), 1);
  assertEquals(ensureNumber(0.1), 0.1);
});
Deno.test("ensureNumber throws error on non number", () => {
  assertThrows(() => ensureNumber("a"));
  assertThrows(() => ensureNumber(true));
  assertThrows(() => ensureNumber(false));
  assertThrows(() => ensureNumber([]));
  assertThrows(() => ensureNumber({}));
  assertThrows(() => ensureNumber(function () {}));
  assertThrows(() => ensureNumber(undefined));
  assertThrows(() => ensureNumber(null));
});

Deno.test("ensureBoolean returns the value when the value is boolean", () => {
  assertEquals(ensureBoolean(true), true);
  assertEquals(ensureBoolean(false), false);
});
Deno.test("ensureBoolean throws error on non boolean", () => {
  assertThrows(() => ensureBoolean(0));
  assertThrows(() => ensureBoolean("a"));
  assertThrows(() => ensureBoolean([]));
  assertThrows(() => ensureBoolean({}));
  assertThrows(() => ensureBoolean(function () {}));
  assertThrows(() => ensureBoolean(undefined));
  assertThrows(() => ensureBoolean(null));
});

Deno.test("ensureArray returns the value when the value is array", () => {
  assertEquals(ensureArray([]), []);
  assertEquals(ensureArray([0, 1, 2]), [0, 1, 2]);
  assertEquals(ensureArray(["a", "b", "c"]), ["a", "b", "c"]);
});
Deno.test("ensureArray throws error on non array", () => {
  assertThrows(() => ensureArray("a"));
  assertThrows(() => ensureArray(0));
  assertThrows(() => ensureArray(true));
  assertThrows(() => ensureArray(false));
  assertThrows(() => ensureArray({}));
  assertThrows(() => ensureArray(function () {}));
  assertThrows(() => ensureArray(undefined));
  assertThrows(() => ensureArray(null));
});
Deno.test("ensureArray<T> returns the value when the value is T array", () => {
  assertEquals(ensureArray([0, 1, 2], { pred: isNumber }), [0, 1, 2]);
  assertEquals(ensureArray(["a", "b", "c"], { pred: isString }), [
    "a",
    "b",
    "c",
  ]);
  assertEquals(ensureArray([true, false, true], { pred: isBoolean }), [
    true,
    false,
    true,
  ]);
});
Deno.test("ensureArray<T> throws error on non T array", () => {
  assertThrows(() => ensureArray([0, 1, 2], { pred: isString }));
  assertThrows(() => ensureArray(["a", "b", "c"], { pred: isNumber }));
  assertThrows(() => ensureArray([true, false, true], { pred: isString }));
});

Deno.test("ensureObject return the value when the value is object", () => {
  assertEquals(ensureObject({}), {});
  assertEquals(ensureObject({ a: 0 }), { a: 0 });
  assertEquals(ensureObject({ a: "a" }), { a: "a" });
});
Deno.test("ensureObject throws error on non object", () => {
  assertThrows(() => ensureObject("a"));
  assertThrows(() => ensureObject(0));
  assertThrows(() => ensureObject(true));
  assertThrows(() => ensureObject(false));
  assertThrows(() => ensureObject([]));
  assertThrows(() => ensureObject(function () {}));
  assertThrows(() => ensureObject(undefined));
  assertThrows(() => ensureObject(null));
});
Deno.test(
  "ensureObject<T> returns the value when the value is T object",
  () => {
    assertEquals(ensureObject({ a: 0 }, { pred: isNumber }), { a: 0 });
    assertEquals(ensureObject({ a: "a" }, { pred: isString }), { a: "a" });
    assertEquals(ensureObject({ a: true }, { pred: isBoolean }), { a: true });
  },
);
Deno.test("ensureObject<T> throws error on non T object", () => {
  assertThrows(() => ensureObject({ a: 0 }, { pred: isString }));
  assertThrows(() => ensureObject({ a: "a" }, { pred: isNumber }));
  assertThrows(() => ensureObject({ a: true }, { pred: isString }));
});

Deno.test("ensureFunction returns the value when the value is function", () => {
  assertEquals(ensureFunction(ensureFunction), ensureFunction);
  const a = function () {};
  assertEquals(ensureFunction(a), a);
  const b = () => {};
  assertEquals(ensureFunction(b), b);
  assertEquals(
    ensureFunction(setTimeout),
    setTimeout as unknown,
  );
});
Deno.test("ensureFunction throws error on non function", () => {
  assertThrows(() => ensureFunction("a"));
  assertThrows(() => ensureFunction(0));
  assertThrows(() => ensureFunction(true));
  assertThrows(() => ensureFunction(false));
  assertThrows(() => ensureFunction([]));
  assertThrows(() => ensureFunction({}));
  assertThrows(() => ensureFunction(undefined));
  assertThrows(() => ensureFunction(null));
});

Deno.test("ensureNull returns the value when the value is null", () => {
  assertEquals(ensureNull(null), null);
});
Deno.test("ensureNull throws error on non null", () => {
  assertThrows(() => ensureNull("a"));
  assertThrows(() => ensureNull(0));
  assertThrows(() => ensureNull(true));
  assertThrows(() => ensureNull(false));
  assertThrows(() => ensureNull([]));
  assertThrows(() => ensureNull({}));
  assertThrows(() => ensureNull(function () {}));
  assertThrows(() => ensureNull(undefined));
});

Deno.test(
  "ensureUndefined returns the value when the value is undefined",
  () => {
    assertEquals(ensureUndefined(undefined), undefined);
  },
);
Deno.test("ensureUndefined throws error on non undefined", () => {
  assertThrows(() => ensureUndefined("a"));
  assertThrows(() => ensureUndefined(0));
  assertThrows(() => ensureUndefined(true));
  assertThrows(() => ensureUndefined(false));
  assertThrows(() => ensureUndefined([]));
  assertThrows(() => ensureUndefined({}));
  assertThrows(() => ensureUndefined(function () {}));
  assertThrows(() => ensureUndefined(null));
});

Deno.test(
  "ensureNullish returns the value when the value is null or undefined",
  () => {
    assertEquals(ensureNullish(null), null);
    assertEquals(ensureNullish(undefined), undefined);
  },
);
Deno.test("ensureNullish throws error on non null nor undefined", () => {
  assertThrows(() => ensureNullish("a"));
  assertThrows(() => ensureNullish(0));
  assertThrows(() => ensureNullish(true));
  assertThrows(() => ensureNullish(false));
  assertThrows(() => ensureNullish([]));
  assertThrows(() => ensureNullish({}));
  assertThrows(() => ensureNullish(function () {}));
});
