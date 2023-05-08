import { assertEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import {
  isArray,
  isBoolean,
  isFunction,
  isLike,
  isNull,
  isNullish,
  isNumber,
  isObject,
  isString,
  isUndefined,
} from "./is.ts";

Deno.test("isString returns true on array", () => {
  assertEquals(isString(""), true);
  assertEquals(isString("Hello World"), true);
});
Deno.test("isString returns false on non array", () => {
  assertEquals(isString(0), false);
  assertEquals(isString(true), false);
  assertEquals(isString(false), false);
  assertEquals(isString([]), false);
  assertEquals(isString({}), false);
  assertEquals(isString(function () {}), false);
  assertEquals(isString(null), false);
  assertEquals(isString(undefined), false);
});

Deno.test("isNumber returns true on array", () => {
  assertEquals(isNumber(0), true);
  assertEquals(isNumber(1234567890), true);
});
Deno.test("isNumber returns false on non array", () => {
  assertEquals(isNumber(""), false);
  assertEquals(isNumber(true), false);
  assertEquals(isNumber(false), false);
  assertEquals(isNumber([]), false);
  assertEquals(isNumber({}), false);
  assertEquals(isNumber(function () {}), false);
  assertEquals(isNumber(null), false);
  assertEquals(isNumber(undefined), false);
});

Deno.test("isBoolean returns true on boolean", () => {
  assertEquals(isBoolean(true), true);
  assertEquals(isBoolean(false), true);
});
Deno.test("isBoolean returns false on non boolean", () => {
  assertEquals(isBoolean(0), false);
  assertEquals(isBoolean(""), false);
  assertEquals(isBoolean([]), false);
  assertEquals(isBoolean({}), false);
  assertEquals(isBoolean(function () {}), false);
  assertEquals(isBoolean(null), false);
  assertEquals(isBoolean(undefined), false);
});

Deno.test("isArray returns true on array", () => {
  assertEquals(isArray([]), true);
  assertEquals(isArray([0, 1, 2]), true);
  assertEquals(isArray(["a", "b", "c"]), true);
  assertEquals(isArray([0, "a", 1]), true);
});
Deno.test("isArray returns false on non array", () => {
  assertEquals(isArray(""), false);
  assertEquals(isArray(0), false);
  assertEquals(isArray(true), false);
  assertEquals(isArray(false), false);
  assertEquals(isArray({}), false);
  assertEquals(isArray(function () {}), false);
  assertEquals(isArray(null), false);
  assertEquals(isArray(undefined), false);
});
Deno.test("isArray<T> returns true on T array", () => {
  assertEquals(isArray([0, 1, 2], isNumber), true);
  assertEquals(isArray(["a", "b", "c"], isString), true);
  assertEquals(isArray([true, false, true], isBoolean), true);
});
Deno.test("isArray<T> returns false on non T array", () => {
  assertEquals(isArray([0, 1, 2], isString), false);
  assertEquals(isArray(["a", "b", "c"], isNumber), false);
  assertEquals(isArray([true, false, true], isString), false);
});

Deno.test("isObject returns true on object", () => {
  assertEquals(isObject({}), true);
  assertEquals(isObject({ a: 0 }), true);
  assertEquals(isObject({ a: "a" }), true);
});
Deno.test("isObject returns false on non object", () => {
  assertEquals(isObject(""), false);
  assertEquals(isObject(0), false);
  assertEquals(isObject(true), false);
  assertEquals(isObject(false), false);
  assertEquals(isObject([]), false);
  assertEquals(isObject(function () {}), false);
  assertEquals(isObject(null), false);
  assertEquals(isObject(undefined), false);
});
Deno.test("isObject<T> returns true on T object", () => {
  assertEquals(isObject({ a: 0 }, isNumber), true);
  assertEquals(isObject({ a: "a" }, isString), true);
  assertEquals(isObject({ a: true }, isBoolean), true);
});
Deno.test("isObject<T> returns false on non T object", () => {
  assertEquals(isObject({ a: 0 }, isString), false);
  assertEquals(isObject({ a: "a" }, isNumber), false);
  assertEquals(isObject({ a: true }, isString), false);
});

Deno.test("isFunction returns true on function", () => {
  assertEquals(isFunction(isFunction), true);
  assertEquals(isFunction(function () {}), true);
  assertEquals(isFunction(() => {}), true);
  assertEquals(isFunction(setTimeout), true);
});
Deno.test("isFunction returns false on non function", () => {
  assertEquals(isFunction(""), false);
  assertEquals(isFunction(0), false);
  assertEquals(isFunction(true), false);
  assertEquals(isFunction(false), false);
  assertEquals(isFunction([]), false);
  assertEquals(isFunction({}), false);
  assertEquals(isFunction(null), false);
  assertEquals(isFunction(undefined), false);
});

Deno.test("isNull returns true on null", () => {
  assertEquals(isNull(null), true);
});
Deno.test("isNull returns false on non null", () => {
  assertEquals(isNull(""), false);
  assertEquals(isNull(0), false);
  assertEquals(isNull(true), false);
  assertEquals(isNull(false), false);
  assertEquals(isNull([]), false);
  assertEquals(isNull({}), false);
  assertEquals(isNull(function () {}), false);
  assertEquals(isNull(undefined), false);
});

Deno.test("isUndefined returns true on null", () => {
  assertEquals(isUndefined(undefined), true);
});
Deno.test("isUndefined returns false on non null", () => {
  assertEquals(isUndefined(""), false);
  assertEquals(isUndefined(0), false);
  assertEquals(isUndefined(true), false);
  assertEquals(isUndefined(false), false);
  assertEquals(isUndefined([]), false);
  assertEquals(isUndefined({}), false);
  assertEquals(isUndefined(function () {}), false);
  assertEquals(isUndefined(null), false);
});

Deno.test("isNullish returns true on null/undefined", () => {
  assertEquals(isNullish(null), true);
  assertEquals(isNullish(undefined), true);
});
Deno.test("isNullish returns false on non null/undefined", () => {
  assertEquals(isNullish(""), false);
  assertEquals(isNullish(0), false);
  assertEquals(isNullish(true), false);
  assertEquals(isNullish(false), false);
  assertEquals(isNullish([]), false);
  assertEquals(isNullish({}), false);
  assertEquals(isNullish(function () {}), false);
});

Deno.test("isLike returns true/false on string", () => {
  const ref = "";
  assertEquals(isLike(ref, ""), true);
  assertEquals(isLike(ref, "Hello World"), true);

  assertEquals(isLike(ref, 0), false);
  assertEquals(isLike(ref, true), false);
  assertEquals(isLike(ref, false), false);
  assertEquals(isLike(ref, []), false);
  assertEquals(isLike(ref, {}), false);
  assertEquals(isLike(ref, function () {}), false);
  assertEquals(isLike(ref, null), false);
  assertEquals(isLike(ref, undefined), false);
});
Deno.test("isLike returns true/false on number", () => {
  const ref = 0;
  assertEquals(isLike(ref, 0), true);
  assertEquals(isLike(ref, 1234567890), true);

  assertEquals(isLike(ref, ""), false);
  assertEquals(isLike(ref, true), false);
  assertEquals(isLike(ref, false), false);
  assertEquals(isLike(ref, []), false);
  assertEquals(isLike(ref, {}), false);
  assertEquals(isLike(ref, function () {}), false);
  assertEquals(isLike(ref, null), false);
  assertEquals(isLike(ref, undefined), false);
});
Deno.test("isLike returns true/false on boolean", () => {
  const ref = true;
  assertEquals(isLike(ref, true), true);
  assertEquals(isLike(ref, false), true);

  assertEquals(isLike(ref, 0), false);
  assertEquals(isLike(ref, ""), false);
  assertEquals(isLike(ref, []), false);
  assertEquals(isLike(ref, {}), false);
  assertEquals(isLike(ref, function () {}), false);
  assertEquals(isLike(ref, null), false);
  assertEquals(isLike(ref, undefined), false);
});
Deno.test("isLike returns true/false on array", () => {
  const ref: unknown[] = [];
  assertEquals(isLike(ref, []), true);
  assertEquals(isLike(ref, [0, 1, 2]), true);
  assertEquals(isLike(ref, ["a", "b", "c"]), true);
  assertEquals(isLike(ref, [0, "a", 1]), true);

  assertEquals(isLike(ref, ""), false);
  assertEquals(isLike(ref, 0), false);
  assertEquals(isLike(ref, true), false);
  assertEquals(isLike(ref, false), false);
  assertEquals(isLike(ref, {}), false);
  assertEquals(isLike(ref, function () {}), false);
  assertEquals(isLike(ref, null), false);
  assertEquals(isLike(ref, undefined), false);
});
Deno.test("isLike returns true/false on T array", () => {
  const ref: unknown[] = [];
  assertEquals(isLike(ref, [0, 1, 2], isNumber), true);
  assertEquals(isLike(ref, ["a", "b", "c"], isString), true);
  assertEquals(isLike(ref, [true, false, true], isBoolean), true);

  assertEquals(isLike(ref, [0, 1, 2], isString), false);
  assertEquals(isLike(ref, ["a", "b", "c"], isNumber), false);
  assertEquals(isLike(ref, [true, false, true], isString), false);
});
Deno.test("isLike returns true/false on tuple", () => {
  const ref = ["", 0, ""];
  assertEquals(isLike(ref, ["", 0, ""]), true);
  assertEquals(isLike(ref, ["Hello", 100, "World"]), true);

  assertEquals(isLike(ref, ["Hello", 100, "World", "foo"]), false);
  assertEquals(isLike(ref, [0, 0, 0]), false);
  assertEquals(isLike(ref, ["", "", ""]), false);
  assertEquals(isLike(ref, [0, "", 0]), false);
});
Deno.test("isLike returns true/false on object", () => {
  const ref = {};
  assertEquals(isLike(ref, {}), true);
  assertEquals(isLike(ref, { a: 0 }), true);
  assertEquals(isLike(ref, { a: "a" }), true);
  assertEquals(isLike(ref, { a: true }), true);

  assertEquals(isLike(ref, ""), false);
  assertEquals(isLike(ref, 0), false);
  assertEquals(isLike(ref, true), false);
  assertEquals(isLike(ref, false), false);
  assertEquals(isLike(ref, []), false);
  assertEquals(isLike(ref, function () {}), false);
  assertEquals(isLike(ref, null), false);
  assertEquals(isLike(ref, undefined), false);
});
Deno.test("isLike returns true/false on T object", () => {
  const ref = {};
  assertEquals(isLike(ref, { a: 0 }, isNumber), true);
  assertEquals(isLike(ref, { a: "a" }, isString), true);
  assertEquals(isLike(ref, { a: true }, isBoolean), true);

  assertEquals(isLike(ref, { a: 0 }, isString), false);
  assertEquals(isLike(ref, { a: "a" }, isNumber), false);
  assertEquals(isLike(ref, { a: true }, isString), false);
});
Deno.test("isLike returns true/false on struct", () => {
  const ref = { foo: "", bar: 0 };
  assertEquals(isLike(ref, { foo: "", bar: 0 }), true);
  assertEquals(isLike(ref, { foo: "Hello", bar: 100 }), true);
  assertEquals(
    isLike(ref, { foo: "", bar: 0, hoge: "" }),
    true,
  );

  assertEquals(isLike(ref, {}), false);
  assertEquals(isLike(ref, { foo: "" }), false);
  assertEquals(isLike(ref, { bar: 0 }), false);
});
Deno.test("isLike returns true/false on function", () => {
  const ref = () => {};
  assertEquals(isLike(ref, isFunction), true);
  assertEquals(isLike(ref, function () {}), true);
  assertEquals(isLike(ref, () => {}), true);
  assertEquals(isLike(ref, setTimeout), true);

  assertEquals(isLike(ref, ""), false);
  assertEquals(isLike(ref, 0), false);
  assertEquals(isLike(ref, true), false);
  assertEquals(isLike(ref, false), false);
  assertEquals(isLike(ref, []), false);
  assertEquals(isLike(ref, {}), false);
  assertEquals(isLike(ref, null), false);
  assertEquals(isLike(ref, undefined), false);
});
Deno.test("isLike returns true/false on null", () => {
  const ref = null;
  assertEquals(isLike(ref, null), true);

  assertEquals(isLike(ref, ""), false);
  assertEquals(isLike(ref, 0), false);
  assertEquals(isLike(ref, true), false);
  assertEquals(isLike(ref, false), false);
  assertEquals(isLike(ref, []), false);
  assertEquals(isLike(ref, {}), false);
  assertEquals(isLike(ref, function () {}), false);
  assertEquals(isLike(ref, undefined), false);
});
Deno.test("isLike returns true/false on undefined", () => {
  const ref = undefined;
  assertEquals(isLike(ref, undefined), true);

  assertEquals(isLike(ref, ""), false);
  assertEquals(isLike(ref, 0), false);
  assertEquals(isLike(ref, true), false);
  assertEquals(isLike(ref, false), false);
  assertEquals(isLike(ref, []), false);
  assertEquals(isLike(ref, {}), false);
  assertEquals(isLike(ref, function () {}), false);
  assertEquals(isLike(ref, null), false);
});
