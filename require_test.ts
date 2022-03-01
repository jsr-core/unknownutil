import { assertEquals, assertThrows } from "./deps_test.ts";
import {
  require,
  requireArray,
  requireBoolean,
  requireFunction,
  requireLike,
  requireNone,
  requireNull,
  requireNumber,
  requireObject,
  requireString,
  requireUndefined,
} from "./require.ts";
import { isBoolean, isNumber, isString } from "./is.ts";

Deno.test("require returns the value when pred return true", () => {
  assertEquals(require("a", isString), "a");
  assertEquals(require(0, isNumber), 0);
});
Deno.test("require throws error when pred return false", () => {
  assertThrows(() => require("a", isNumber));
  assertThrows(() => require(0, isString));
});

Deno.test("requireString returns the value when the value is string", () => {
  assertEquals(requireString("Hello"), "Hello");
});
Deno.test("requireString throws error on non string", () => {
  assertThrows(() => requireString(0));
  assertThrows(() => requireString(true));
  assertThrows(() => requireString(false));
  assertThrows(() => requireString([]));
  assertThrows(() => requireString({}));
  assertThrows(() => requireString(function () {}));
  assertThrows(() => requireString(undefined));
  assertThrows(() => requireString(null));
});

Deno.test("requireNumber returns the value when the value is number", () => {
  assertEquals(requireNumber(0), 0);
  assertEquals(requireNumber(1), 1);
  assertEquals(requireNumber(0.1), 0.1);
});
Deno.test("requireNumber throws error on non number", () => {
  assertThrows(() => requireNumber("a"));
  assertThrows(() => requireNumber(true));
  assertThrows(() => requireNumber(false));
  assertThrows(() => requireNumber([]));
  assertThrows(() => requireNumber({}));
  assertThrows(() => requireNumber(function () {}));
  assertThrows(() => requireNumber(undefined));
  assertThrows(() => requireNumber(null));
});

Deno.test("requireBoolean returns the value when the value is boolean", () => {
  assertEquals(requireBoolean(true), true);
  assertEquals(requireBoolean(false), false);
});
Deno.test("requireBoolean throws error on non boolean", () => {
  assertThrows(() => requireBoolean(0));
  assertThrows(() => requireBoolean("a"));
  assertThrows(() => requireBoolean([]));
  assertThrows(() => requireBoolean({}));
  assertThrows(() => requireBoolean(function () {}));
  assertThrows(() => requireBoolean(undefined));
  assertThrows(() => requireBoolean(null));
});

Deno.test("requireArray returns the value when the value is array", () => {
  assertEquals(requireArray([]), []);
  assertEquals(requireArray([0, 1, 2]), [0, 1, 2]);
  assertEquals(requireArray(["a", "b", "c"]), ["a", "b", "c"]);
});
Deno.test("requireArray throws error on non array", () => {
  assertThrows(() => requireArray("a"));
  assertThrows(() => requireArray(0));
  assertThrows(() => requireArray(true));
  assertThrows(() => requireArray(false));
  assertThrows(() => requireArray({}));
  assertThrows(() => requireArray(function () {}));
  assertThrows(() => requireArray(undefined));
  assertThrows(() => requireArray(null));
});
Deno.test("requireArray<T> returns the value when the value is T array", () => {
  assertEquals(requireArray([0, 1, 2], isNumber), [0, 1, 2]);
  assertEquals(requireArray(["a", "b", "c"], isString), ["a", "b", "c"]);
  assertEquals(requireArray([true, false, true], isBoolean), [
    true,
    false,
    true,
  ]);
});
Deno.test("requireArray<T> throws error on non T array", () => {
  assertThrows(() => requireArray([0, 1, 2], isString));
  assertThrows(() => requireArray(["a", "b", "c"], isNumber));
  assertThrows(() => requireArray([true, false, true], isString));
});

Deno.test("requireObject return the value when the value is object", () => {
  assertEquals(requireObject({}), {});
  assertEquals(requireObject({ a: 0 }), { a: 0 });
  assertEquals(requireObject({ a: "a" }), { a: "a" });
});
Deno.test("requireObject throws error on non object", () => {
  assertThrows(() => requireObject("a"));
  assertThrows(() => requireObject(0));
  assertThrows(() => requireObject(true));
  assertThrows(() => requireObject(false));
  assertThrows(() => requireObject([]));
  assertThrows(() => requireObject(function () {}));
  assertThrows(() => requireObject(undefined));
  assertThrows(() => requireObject(null));
});
Deno.test("requireObject<T> returns the value when the value is T object", () => {
  assertEquals(requireObject({ a: 0 }, isNumber), { a: 0 });
  assertEquals(requireObject({ a: "a" }, isString), { a: "a" });
  assertEquals(requireObject({ a: true }, isBoolean), { a: true });
});
Deno.test("requireObject<T> throws error on non T object", () => {
  assertThrows(() => requireObject({ a: 0 }, isString));
  assertThrows(() => requireObject({ a: "a" }, isNumber));
  assertThrows(() => requireObject({ a: true }, isString));
});

Deno.test("requireFunction returns the value when the value is function", () => {
  assertEquals(requireFunction(requireFunction), requireFunction);
  const a = function () {};
  assertEquals(requireFunction(a), a);
  const b = () => {};
  assertEquals(requireFunction(b), b);
  assertEquals(requireFunction(setTimeout), setTimeout);
});
Deno.test("requireFunction throws error on non function", () => {
  assertThrows(() => requireFunction("a"));
  assertThrows(() => requireFunction(0));
  assertThrows(() => requireFunction(true));
  assertThrows(() => requireFunction(false));
  assertThrows(() => requireFunction([]));
  assertThrows(() => requireFunction({}));
  assertThrows(() => requireFunction(undefined));
  assertThrows(() => requireFunction(null));
});

Deno.test("requireNull returns the value when the value is null", () => {
  assertEquals(requireNull(null), null);
});
Deno.test("requireNull throws error on non null", () => {
  assertThrows(() => requireNull("a"));
  assertThrows(() => requireNull(0));
  assertThrows(() => requireNull(true));
  assertThrows(() => requireNull(false));
  assertThrows(() => requireNull([]));
  assertThrows(() => requireNull({}));
  assertThrows(() => requireNull(function () {}));
  assertThrows(() => requireNull(undefined));
});

Deno.test("requireUndefined returns the value when the value is undefined", () => {
  assertEquals(requireUndefined(undefined), undefined);
});
Deno.test("requireUndefined throws error on non undefined", () => {
  assertThrows(() => requireUndefined("a"));
  assertThrows(() => requireUndefined(0));
  assertThrows(() => requireUndefined(true));
  assertThrows(() => requireUndefined(false));
  assertThrows(() => requireUndefined([]));
  assertThrows(() => requireUndefined({}));
  assertThrows(() => requireUndefined(function () {}));
  assertThrows(() => requireUndefined(null));
});

Deno.test("requireNone returns the value when the value is null or undefined", () => {
  assertEquals(requireNone(null), null);
  assertEquals(requireNone(undefined), undefined);
});
Deno.test("requireNone throws error on non null nor undefined", () => {
  assertThrows(() => requireNone("a"));
  assertThrows(() => requireNone(0));
  assertThrows(() => requireNone(true));
  assertThrows(() => requireNone(false));
  assertThrows(() => requireNone([]));
  assertThrows(() => requireNone({}));
  assertThrows(() => requireNone(function () {}));
});

Deno.test("requireLike does it's job on string", () => {
  const ref = "";
  assertEquals(requireLike(ref, "Hello"), "Hello");

  assertThrows(() => requireLike(ref, 0));
  assertThrows(() => requireLike(ref, true));
  assertThrows(() => requireLike(ref, false));
  assertThrows(() => requireLike(ref, []));
  assertThrows(() => requireLike(ref, {}));
  assertThrows(() => requireLike(ref, function () {}));
  assertThrows(() => requireLike(ref, undefined));
  assertThrows(() => requireLike(ref, null));
});
Deno.test("requireLike does it's job on number", () => {
  const ref = 0;
  assertEquals(requireLike(ref, 0), 0);
  assertEquals(requireLike(ref, 1), 1);
  assertEquals(requireLike(ref, 0.1), 0.1);

  assertThrows(() => requireLike(ref, "a"));
  assertThrows(() => requireLike(ref, true));
  assertThrows(() => requireLike(ref, false));
  assertThrows(() => requireLike(ref, []));
  assertThrows(() => requireLike(ref, {}));
  assertThrows(() => requireLike(ref, function () {}));
  assertThrows(() => requireLike(ref, undefined));
  assertThrows(() => requireLike(ref, null));
});
Deno.test("requireLike does it's job on array", () => {
  const ref: unknown[] = [];
  assertEquals(requireLike(ref, []), []);
  assertEquals(requireLike(ref, [0, 1, 2]), [0, 1, 2]);
  assertEquals(requireLike(ref, ["a", "b", "c"]), ["a", "b", "c"]);

  assertThrows(() => requireLike(ref, "a"));
  assertThrows(() => requireLike(ref, 0));
  assertThrows(() => requireLike(ref, {}));
  assertThrows(() => requireLike(ref, function () {}));
  assertThrows(() => requireLike(ref, undefined));
  assertThrows(() => requireLike(ref, null));
});
Deno.test("requireLike does it's job on T array", () => {
  const ref: unknown[] = [];
  assertEquals(requireLike(ref, [0, 1, 2], isNumber), [0, 1, 2]);
  assertEquals(requireLike(ref, ["a", "b", "c"], isString), ["a", "b", "c"]);
  assertEquals(requireLike(ref, [true, false, true], isBoolean), [
    true,
    false,
    true,
  ]);

  assertThrows(() => requireLike(ref, [0, 1, 2], isString));
  assertThrows(() => requireLike(ref, ["a", "b", "c"], isNumber));
  assertThrows(() => requireLike(ref, [true, false, true], isString));
});
Deno.test("requireLike does it's job on tuple", () => {
  const ref = ["", 0, ""];
  assertEquals(requireLike(ref, ["", 0, ""]), ["", 0, ""]);
  assertEquals(requireLike(ref, ["Hello", 100, "World"]), [
    "Hello",
    100,
    "World",
  ]);

  assertThrows(() => requireLike(ref, ["Hello", 100, "World", "foo"]));
  assertThrows(() => requireLike(ref, [0, 0, 0]));
  assertThrows(() => requireLike(ref, ["", "", ""]));
  assertThrows(() => requireLike(ref, [0, "", 0]));
});
Deno.test("requireLike does it's job on object", () => {
  const ref = {};
  assertEquals(requireLike(ref, {}), {});
  assertEquals(requireLike(ref, { a: 0 }), { a: 0 });
  assertEquals(requireLike(ref, { a: "a" }), { a: "a" });

  assertThrows(() => requireLike(ref, "a"));
  assertThrows(() => requireLike(ref, 0));
  assertThrows(() => requireLike(ref, true));
  assertThrows(() => requireLike(ref, false));
  assertThrows(() => requireLike(ref, []));
  assertThrows(() => requireLike(ref, function () {}));
  assertThrows(() => requireLike(ref, undefined));
  assertThrows(() => requireLike(ref, null));
});
Deno.test("requireLike does it's job on T object", () => {
  const ref = {};
  assertEquals(requireLike(ref, { a: 0 }, isNumber), { a: 0 });
  assertEquals(requireLike(ref, { a: "a" }, isString), { a: "a" });
  assertEquals(requireLike(ref, { a: true }, isBoolean), { a: true });

  assertThrows(() => requireLike(ref, { a: 0 }, isString));
  assertThrows(() => requireLike(ref, { a: "a" }, isNumber));
  assertThrows(() => requireLike(ref, { a: true }, isString));
});
Deno.test("requireLike does it's job on struct", () => {
  const ref = { foo: "", bar: 0 };
  assertEquals(requireLike(ref, { foo: "", bar: 0 }), { foo: "", bar: 0 });
  assertEquals(requireLike(ref, { foo: "", bar: 0, hoge: "" }), {
    foo: "",
    bar: 0,
    hoge: "",
  });

  assertThrows(() => requireLike(ref, {}));
  assertThrows(() => requireLike(ref, { foo: "" }));
  assertThrows(() => requireLike(ref, { bar: 0 }));
});
Deno.test("requireLike does it's job on function", () => {
  const ref = () => {};
  assertEquals(requireLike(ref, requireFunction), requireFunction);
  const a = function () {};
  assertEquals(requireLike(ref, a), a);
  const b = () => {};
  assertEquals(requireLike(ref, b), b);
  assertEquals(requireLike(ref, setTimeout), setTimeout);

  assertThrows(() => requireLike(ref, "a"));
  assertThrows(() => requireLike(ref, 0));
  assertThrows(() => requireLike(ref, true));
  assertThrows(() => requireLike(ref, false));
  assertThrows(() => requireLike(ref, []));
  assertThrows(() => requireLike(ref, {}));
  assertThrows(() => requireLike(ref, undefined));
  assertThrows(() => requireLike(ref, null));
});
Deno.test("requireLike does it's job on null", () => {
  const ref = null;
  assertEquals(requireLike(ref, null), null);

  assertThrows(() => requireLike(ref, "a"));
  assertThrows(() => requireLike(ref, 0));
  assertThrows(() => requireLike(ref, true));
  assertThrows(() => requireLike(ref, false));
  assertThrows(() => requireLike(ref, []));
  assertThrows(() => requireLike(ref, {}));
  assertThrows(() => requireLike(ref, function () {}));
  assertThrows(() => requireLike(ref, undefined));
});
Deno.test("requireLike does it's job on undefined", () => {
  const ref = undefined;
  assertEquals(requireLike(ref, undefined), undefined);

  assertThrows(() => requireLike(ref, "a"));
  assertThrows(() => requireLike(ref, 0));
  assertThrows(() => requireLike(ref, true));
  assertThrows(() => requireLike(ref, false));
  assertThrows(() => requireLike(ref, []));
  assertThrows(() => requireLike(ref, {}));
  assertThrows(() => requireLike(ref, function () {}));
  assertThrows(() => requireLike(ref, null));
});
