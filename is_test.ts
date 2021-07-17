import { assertEquals } from "./deps_test.ts";
import {
  isArray,
  isFunction,
  isNone,
  isNull,
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
  assertEquals(isNumber([]), false);
  assertEquals(isNumber({}), false);
  assertEquals(isNumber(function () {}), false);
  assertEquals(isNumber(null), false);
  assertEquals(isNumber(undefined), false);
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
  assertEquals(isArray({}), false);
  assertEquals(isArray(function () {}), false);
  assertEquals(isArray(null), false);
  assertEquals(isArray(undefined), false);
});
Deno.test("isArray<T> returns true on T array", () => {
  assertEquals(isArray([0, 1, 2], isNumber), true);
  assertEquals(isArray(["a", "b", "c"], isString), true);
});
Deno.test("isArray<T> returns false on non T array", () => {
  assertEquals(isArray([0, 1, 2], isString), false);
  assertEquals(isArray(["a", "b", "c"], isNumber), false);
});

Deno.test("isObject returns true on object", () => {
  assertEquals(isObject({}), true);
  assertEquals(isObject({ a: 0 }), true);
  assertEquals(isObject({ a: "a" }), true);
});
Deno.test("isObject returns false on non object", () => {
  assertEquals(isObject(""), false);
  assertEquals(isObject(0), false);
  assertEquals(isObject([]), false);
  assertEquals(isObject(function () {}), false);
  assertEquals(isObject(null), false);
  assertEquals(isObject(undefined), false);
});
Deno.test("isObject<T> returns true on T object", () => {
  assertEquals(isObject({ a: 0 }, isNumber), true);
  assertEquals(isObject({ a: "a" }, isString), true);
});
Deno.test("isObject<T> returns false on non T object", () => {
  assertEquals(isObject({ a: 0 }, isString), false);
  assertEquals(isObject({ a: "a" }, isNumber), false);
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
  assertEquals(isUndefined([]), false);
  assertEquals(isUndefined({}), false);
  assertEquals(isUndefined(function () {}), false);
  assertEquals(isUndefined(null), false);
});

Deno.test("isNone returns true on null/undefined", () => {
  assertEquals(isNone(null), true);
  assertEquals(isNone(undefined), true);
});
Deno.test("isNone returns false on non null/undefined", () => {
  assertEquals(isNone(""), false);
  assertEquals(isNone(0), false);
  assertEquals(isNone([]), false);
  assertEquals(isNone({}), false);
  assertEquals(isNone(function () {}), false);
});
