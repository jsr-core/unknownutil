import { assertEquals } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import {
  isArray,
  isBoolean,
  isFunction,
  isNull,
  isNullish,
  isNumber,
  isObject,
  isOneOf,
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
  assertEquals(isArray([0, 1, 2], { pred: isNumber }), true);
  assertEquals(isArray(["a", "b", "c"], { pred: isString }), true);
  assertEquals(isArray([true, false, true], { pred: isBoolean }), true);
});
Deno.test("isArray<T> returns false on non T array", () => {
  assertEquals(isArray([0, 1, 2], { pred: isString }), false);
  assertEquals(isArray(["a", "b", "c"], { pred: isNumber }), false);
  assertEquals(isArray([true, false, true], { pred: isString }), false);
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
  assertEquals(isObject({ a: 0 }, { pred: isNumber }), true);
  assertEquals(isObject({ a: "a" }, { pred: isString }), true);
  assertEquals(isObject({ a: true }, { pred: isBoolean }), true);
});
Deno.test("isObject<T> returns false on non T object", () => {
  assertEquals(isObject({ a: 0 }, { pred: isString }), false);
  assertEquals(isObject({ a: "a" }, { pred: isNumber }), false);
  assertEquals(isObject({ a: true }, { pred: isString }), false);
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

Deno.test("isOneOf returns true when one of preds returns true", () => {
  assertEquals(isOneOf("", [isString, isNumber]), true);
  assertEquals(isOneOf(0, [isString, isNumber]), true);
});
Deno.test("isOneOf returns false when none of preds returns true", () => {
  assertEquals(isOneOf(true, [isString, isNumber]), false);
  assertEquals(isOneOf(false, [isString, isNumber]), false);
  assertEquals(isOneOf([], [isString, isNumber]), false);
  assertEquals(isOneOf({}, [isString, isNumber]), false);
  assertEquals(isOneOf(function () {}, [isString, isNumber]), false);
  assertEquals(isOneOf(null, [isString, isNumber]), false);
  assertEquals(isOneOf(undefined, [isString, isNumber]), false);
});
