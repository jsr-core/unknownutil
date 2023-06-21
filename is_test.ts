import {
  assertEquals,
  assertStrictEquals,
} from "https://deno.land/std@0.186.0/testing/asserts.ts";
import is, {
  isArray,
  isArrayOf,
  isBoolean,
  isFunction,
  isNull,
  isNullish,
  isNumber,
  isRecord,
  isRecordOf,
  isString,
  isUndefined,
} from "./is.ts";

Deno.test("is defines aliases of functions", () => {
  assertStrictEquals(is.String, isString);
  assertStrictEquals(is.Number, isNumber);
  assertStrictEquals(is.Boolean, isBoolean);
  assertStrictEquals(is.Array, isArray);
  assertStrictEquals(is.ArrayOf, isArrayOf);
  assertStrictEquals(is.Record, isRecord);
  assertStrictEquals(is.RecordOf, isRecordOf);
  assertStrictEquals(is.Function, isFunction);
  assertStrictEquals(is.Null, isNull);
  assertStrictEquals(is.Undefined, isUndefined);
  assertStrictEquals(is.Nullish, isNullish);
});

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

Deno.test("isArrayOf<T> returns true on T array", () => {
  assertEquals(isArrayOf(isNumber)([0, 1, 2]), true);
  assertEquals(isArrayOf(isString)(["a", "b", "c"]), true);
  assertEquals(isArrayOf(isBoolean)([true, false, true]), true);
});
Deno.test("isArrayOf<T> returns false on non T array", () => {
  assertEquals(isArrayOf(isString)([0, 1, 2]), false);
  assertEquals(isArrayOf(isNumber)(["a", "b", "c"]), false);
  assertEquals(isArrayOf(isString)([true, false, true]), false);
});

Deno.test("isRecord returns true on record", () => {
  assertEquals(isRecord({}), true);
  assertEquals(isRecord({ a: 0 }), true);
  assertEquals(isRecord({ a: "a" }), true);
});
Deno.test("isRecord returns false on non record", () => {
  assertEquals(isRecord(""), false);
  assertEquals(isRecord(0), false);
  assertEquals(isRecord(true), false);
  assertEquals(isRecord(false), false);
  assertEquals(isRecord([]), false);
  assertEquals(isRecord(function () {}), false);
  assertEquals(isRecord(null), false);
  assertEquals(isRecord(undefined), false);
});

Deno.test("isRecordOf<T> returns true on T record", () => {
  assertEquals(isRecordOf(isNumber)({ a: 0 }), true);
  assertEquals(isRecordOf(isString)({ a: "a" }), true);
  assertEquals(isRecordOf(isBoolean)({ a: true }), true);
});
Deno.test("isRecordOf<T> returns false on non T record", () => {
  assertEquals(isRecordOf(isString)({ a: 0 }), false);
  assertEquals(isRecordOf(isNumber)({ a: "a" }), false);
  assertEquals(isRecordOf(isString)({ a: true }), false);
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
