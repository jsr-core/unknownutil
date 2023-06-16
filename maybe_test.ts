import { assertEquals } from "https://deno.land/std@0.192.0/testing/asserts.ts";
import { assertUndefined } from "./assert.ts";
import {
  maybeArray,
  maybeBoolean,
  maybeFunction,
  maybeLike,
  maybeNumber,
  maybeObject,
  maybeString,
} from "./maybe.ts";
import { isBoolean, isNumber, isString } from "./is.ts";

Deno.test("maybeString returns the value when the value is string", () => {
  assertEquals(maybeString("Hello"), "Hello");
});
Deno.test("maybeString returns undefined on non string", () => {
  assertUndefined(maybeString(0));
  assertUndefined(maybeString(true));
  assertUndefined(maybeString(false));
  assertUndefined(maybeString([]));
  assertUndefined(maybeString({}));
  assertUndefined(maybeString(function () {}));
  assertUndefined(maybeString(undefined));
  assertUndefined(maybeString(null));
});

Deno.test("maybeNumber returns the value when the value is number", () => {
  assertEquals(maybeNumber(0), 0);
  assertEquals(maybeNumber(1), 1);
  assertEquals(maybeNumber(0.1), 0.1);
});
Deno.test("maybeNumber returns undefined on non number", () => {
  assertUndefined(maybeNumber("a"));
  assertUndefined(maybeNumber(true));
  assertUndefined(maybeNumber(false));
  assertUndefined(maybeNumber([]));
  assertUndefined(maybeNumber({}));
  assertUndefined(maybeNumber(function () {}));
  assertUndefined(maybeNumber(undefined));
  assertUndefined(maybeNumber(null));
});

Deno.test("maybeBoolean returns the value when the value is boolean", () => {
  assertEquals(maybeBoolean(true), true);
  assertEquals(maybeBoolean(false), false);
});
Deno.test("maybeBoolean returns undefined on non boolean", () => {
  assertUndefined(maybeBoolean(0));
  assertUndefined(maybeBoolean("a"));
  assertUndefined(maybeBoolean([]));
  assertUndefined(maybeBoolean({}));
  assertUndefined(maybeBoolean(function () {}));
  assertUndefined(maybeBoolean(undefined));
  assertUndefined(maybeBoolean(null));
});

Deno.test("maybeArray returns the value when the value is array", () => {
  assertEquals(maybeArray([]), []);
  assertEquals(maybeArray([0, 1, 2]), [0, 1, 2]);
  assertEquals(maybeArray(["a", "b", "c"]), ["a", "b", "c"]);
});
Deno.test("maybeArray returns undefined on non array", () => {
  assertUndefined(maybeArray("a"));
  assertUndefined(maybeArray(0));
  assertUndefined(maybeArray(true));
  assertUndefined(maybeArray(false));
  assertUndefined(maybeArray({}));
  assertUndefined(maybeArray(function () {}));
  assertUndefined(maybeArray(undefined));
  assertUndefined(maybeArray(null));
});
Deno.test("maybeArray<T> returns the value when the value is T array", () => {
  assertEquals(maybeArray([0, 1, 2], isNumber), [0, 1, 2]);
  assertEquals(maybeArray(["a", "b", "c"], isString), ["a", "b", "c"]);
  assertEquals(maybeArray([true, false, true], isBoolean), [
    true,
    false,
    true,
  ]);
});
Deno.test("maybeArray<T> returns undefined on non T array", () => {
  assertUndefined(maybeArray([0, 1, 2], isString));
  assertUndefined(maybeArray(["a", "b", "c"], isNumber));
  assertUndefined(maybeArray([true, false, true], isString));
});

Deno.test("maybeObject return the value when the value is object", () => {
  assertEquals(maybeObject({}), {});
  assertEquals(maybeObject({ a: 0 }), { a: 0 });
  assertEquals(maybeObject({ a: "a" }), { a: "a" });
});
Deno.test("maybeObject returns undefined on non object", () => {
  assertUndefined(maybeObject("a"));
  assertUndefined(maybeObject(0));
  assertUndefined(maybeObject(true));
  assertUndefined(maybeObject(false));
  assertUndefined(maybeObject([]));
  assertUndefined(maybeObject(function () {}));
  assertUndefined(maybeObject(undefined));
  assertUndefined(maybeObject(null));
});
Deno.test(
  "maybeObject<T> returns the value when the value is T object",
  () => {
    assertEquals(maybeObject({ a: 0 }, isNumber), { a: 0 });
    assertEquals(maybeObject({ a: "a" }, isString), { a: "a" });
    assertEquals(maybeObject({ a: true }, isBoolean), { a: true });
  },
);
Deno.test("maybeObject<T> returns undefined on non T object", () => {
  assertUndefined(maybeObject({ a: 0 }, isString));
  assertUndefined(maybeObject({ a: "a" }, isNumber));
  assertUndefined(maybeObject({ a: true }, isString));
});

Deno.test("maybeFunction returns the value when the value is function", () => {
  assertEquals(maybeFunction(maybeFunction), maybeFunction);
  const a = function () {};
  assertEquals(maybeFunction(a), a);
  const b = () => {};
  assertEquals(maybeFunction(b), b);
  assertEquals(maybeFunction(setTimeout), setTimeout as unknown);
});
Deno.test("maybeFunction returns undefined on non function", () => {
  assertUndefined(maybeFunction("a"));
  assertUndefined(maybeFunction(0));
  assertUndefined(maybeFunction(true));
  assertUndefined(maybeFunction(false));
  assertUndefined(maybeFunction([]));
  assertUndefined(maybeFunction({}));
  assertUndefined(maybeFunction(undefined));
  assertUndefined(maybeFunction(null));
});

Deno.test("maybeLike does it's job on string", () => {
  const ref = "";
  assertEquals(maybeLike(ref, "Hello"), "Hello");

  assertUndefined(maybeLike(ref, 0));
  assertUndefined(maybeLike(ref, true));
  assertUndefined(maybeLike(ref, false));
  assertUndefined(maybeLike(ref, []));
  assertUndefined(maybeLike(ref, {}));
  assertUndefined(maybeLike(ref, function () {}));
  assertUndefined(maybeLike(ref, undefined));
  assertUndefined(maybeLike(ref, null));
});
Deno.test("maybeLike does it's job on number", () => {
  const ref = 0;
  assertEquals(maybeLike(ref, 0), 0);
  assertEquals(maybeLike(ref, 1), 1);
  assertEquals(maybeLike(ref, 0.1), 0.1);

  assertUndefined(maybeLike(ref, "a"));
  assertUndefined(maybeLike(ref, true));
  assertUndefined(maybeLike(ref, false));
  assertUndefined(maybeLike(ref, []));
  assertUndefined(maybeLike(ref, {}));
  assertUndefined(maybeLike(ref, function () {}));
  assertUndefined(maybeLike(ref, undefined));
  assertUndefined(maybeLike(ref, null));
});
Deno.test("maybeLike does it's job on array", () => {
  const ref: unknown[] = [];
  assertEquals(maybeLike(ref, []), []);
  assertEquals(maybeLike(ref, [0, 1, 2]), [0, 1, 2]);
  assertEquals(maybeLike(ref, ["a", "b", "c"]), ["a", "b", "c"]);

  assertUndefined(maybeLike(ref, "a"));
  assertUndefined(maybeLike(ref, 0));
  assertUndefined(maybeLike(ref, {}));
  assertUndefined(maybeLike(ref, function () {}));
  assertUndefined(maybeLike(ref, undefined));
  assertUndefined(maybeLike(ref, null));
});
Deno.test("maybeLike does it's job on T array", () => {
  const ref: unknown[] = [];
  assertEquals(maybeLike(ref, [0, 1, 2], isNumber), [0, 1, 2]);
  assertEquals(maybeLike(ref, ["a", "b", "c"], isString), ["a", "b", "c"]);
  assertEquals(maybeLike(ref, [true, false, true], isBoolean), [
    true,
    false,
    true,
  ]);

  assertUndefined(maybeLike(ref, [0, 1, 2], isString));
  assertUndefined(maybeLike(ref, ["a", "b", "c"], isNumber));
  assertUndefined(maybeLike(ref, [true, false, true], isString));
});
Deno.test("maybeLike does it's job on tuple", () => {
  const ref = ["", 0, ""];
  assertEquals(maybeLike(ref, ["", 0, ""]), ["", 0, ""]);
  assertEquals(maybeLike(ref, ["Hello", 100, "World"]), [
    "Hello",
    100,
    "World",
  ]);

  assertUndefined(maybeLike(ref, ["Hello", 100, "World", "foo"]));
  assertUndefined(maybeLike(ref, [0, 0, 0]));
  assertUndefined(maybeLike(ref, ["", "", ""]));
  assertUndefined(maybeLike(ref, [0, "", 0]));
});
Deno.test("maybeLike does it's job on object", () => {
  const ref = {};
  assertEquals(maybeLike(ref, {}), {});
  assertEquals(maybeLike(ref, { a: 0 }), { a: 0 });
  assertEquals(maybeLike(ref, { a: "a" }), { a: "a" });

  assertUndefined(maybeLike(ref, "a"));
  assertUndefined(maybeLike(ref, 0));
  assertUndefined(maybeLike(ref, true));
  assertUndefined(maybeLike(ref, false));
  assertUndefined(maybeLike(ref, []));
  assertUndefined(maybeLike(ref, function () {}));
  assertUndefined(maybeLike(ref, undefined));
  assertUndefined(maybeLike(ref, null));
});
Deno.test("maybeLike does it's job on T object", () => {
  const ref = {};
  assertEquals(maybeLike(ref, { a: 0 }, isNumber), { a: 0 });
  assertEquals(maybeLike(ref, { a: "a" }, isString), { a: "a" });
  assertEquals(maybeLike(ref, { a: true }, isBoolean), { a: true });

  assertUndefined(maybeLike(ref, { a: 0 }, isString));
  assertUndefined(maybeLike(ref, { a: "a" }, isNumber));
  assertUndefined(maybeLike(ref, { a: true }, isString));
});
Deno.test("maybeLike does it's job on struct", () => {
  const ref = { foo: "", bar: 0 };
  assertEquals(maybeLike(ref, { foo: "", bar: 0 }), { foo: "", bar: 0 });
  assertEquals(maybeLike(ref, { foo: "", bar: 0, hoge: "" }), {
    foo: "",
    bar: 0,
    hoge: "",
  } as unknown);

  assertUndefined(maybeLike(ref, {}));
  assertUndefined(maybeLike(ref, { foo: "" }));
  assertUndefined(maybeLike(ref, { bar: 0 }));
});
Deno.test("maybeLike does it's job on function", () => {
  const ref = () => {};
  assertEquals(maybeLike(ref, maybeFunction), maybeFunction as unknown);
  const a = function () {};
  assertEquals(maybeLike(ref, a), a);
  const b = () => {};
  assertEquals(maybeLike(ref, b), b);
  assertEquals(maybeLike(ref, setTimeout), setTimeout as unknown);

  assertUndefined(maybeLike(ref, "a"));
  assertUndefined(maybeLike(ref, 0));
  assertUndefined(maybeLike(ref, true));
  assertUndefined(maybeLike(ref, false));
  assertUndefined(maybeLike(ref, []));
  assertUndefined(maybeLike(ref, {}));
  assertUndefined(maybeLike(ref, undefined));
  assertUndefined(maybeLike(ref, null));
});
Deno.test("maybeLike does it's job on null", () => {
  const ref = null;
  assertEquals(maybeLike(ref, null), null);

  assertUndefined(maybeLike(ref, "a"));
  assertUndefined(maybeLike(ref, 0));
  assertUndefined(maybeLike(ref, true));
  assertUndefined(maybeLike(ref, false));
  assertUndefined(maybeLike(ref, []));
  assertUndefined(maybeLike(ref, {}));
  assertUndefined(maybeLike(ref, function () {}));
  assertUndefined(maybeLike(ref, undefined));
});
Deno.test("maybeLike does it's job on undefined", () => {
  const ref = undefined;
  assertEquals(maybeLike(ref, undefined), undefined);

  assertUndefined(maybeLike(ref, "a"));
  assertUndefined(maybeLike(ref, 0));
  assertUndefined(maybeLike(ref, true));
  assertUndefined(maybeLike(ref, false));
  assertUndefined(maybeLike(ref, []));
  assertUndefined(maybeLike(ref, {}));
  assertUndefined(maybeLike(ref, function () {}));
  assertUndefined(maybeLike(ref, null));
});
