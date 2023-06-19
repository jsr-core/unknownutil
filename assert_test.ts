import { assertThrows } from "https://deno.land/std@0.186.0/testing/asserts.ts";
import {
  assertArray,
  assertBoolean,
  AssertError,
  assertFunction,
  assertNull,
  assertNullish,
  assertNumber,
  assertObject,
  assertString,
  assertUndefined,
} from "./assert.ts";
import { isBoolean, isNumber, isString } from "./is.ts";

Deno.test("assertString does nothing on string", () => {
  assertString("Hello");
});
Deno.test("assertString throws AssertError on non string", () => {
  assertThrows(() => assertString(0), AssertError);
  assertThrows(() => assertString(true), AssertError);
  assertThrows(() => assertString(false), AssertError);
  assertThrows(() => assertString([]), AssertError);
  assertThrows(() => assertString({}), AssertError);
  assertThrows(() => assertString(function () {}), AssertError);
  assertThrows(() => assertString(undefined), AssertError);
  assertThrows(() => assertString(null), AssertError);
});

Deno.test("assertNumber does nothing on number", () => {
  assertNumber(0);
  assertNumber(1);
  assertNumber(0.1);
});
Deno.test("assertNumber throws AssertError on non number", () => {
  assertThrows(() => assertNumber("a"), AssertError);
  assertThrows(() => assertNumber(true), AssertError);
  assertThrows(() => assertNumber(false), AssertError);
  assertThrows(() => assertNumber([]), AssertError);
  assertThrows(() => assertNumber({}), AssertError);
  assertThrows(() => assertNumber(function () {}), AssertError);
  assertThrows(() => assertNumber(undefined), AssertError);
  assertThrows(() => assertNumber(null), AssertError);
});

Deno.test("assertBoolean does nothing on boolean", () => {
  assertBoolean(true);
  assertBoolean(false);
});
Deno.test("assertBoolean throws AssertError on non boolean", () => {
  assertThrows(() => assertBoolean(0), AssertError);
  assertThrows(() => assertBoolean("a"), AssertError);
  assertThrows(() => assertBoolean([]), AssertError);
  assertThrows(() => assertBoolean({}), AssertError);
  assertThrows(() => assertBoolean(function () {}), AssertError);
  assertThrows(() => assertBoolean(undefined), AssertError);
  assertThrows(() => assertBoolean(null), AssertError);
});

Deno.test("assertArray does nothing on array", () => {
  assertArray([]);
  assertArray([0, 1, 2]);
  assertArray(["a", "b", "c"]);
});
Deno.test("assertArray throws AssertError on non array", () => {
  assertThrows(() => assertArray("a"), AssertError);
  assertThrows(() => assertArray(0), AssertError);
  assertThrows(() => assertArray(true), AssertError);
  assertThrows(() => assertArray(false), AssertError);
  assertThrows(() => assertArray({}), AssertError);
  assertThrows(() => assertArray(function () {}), AssertError);
  assertThrows(() => assertArray(undefined), AssertError);
  assertThrows(() => assertArray(null), AssertError);
});
Deno.test("assertArray<T> does nothing on T array", () => {
  assertArray([0, 1, 2], { pred: isNumber });
  assertArray(["a", "b", "c"], { pred: isString });
  assertArray([true, false, true], { pred: isBoolean });
});
Deno.test("assertArray<T> throws AssertError on non T array", () => {
  assertThrows(() => assertArray([0, 1, 2], { pred: isString }), AssertError);
  assertThrows(
    () => assertArray(["a", "b", "c"], { pred: isNumber }),
    AssertError,
  );
  assertThrows(
    () => assertArray([true, false, true], { pred: isString }),
    AssertError,
  );
});

Deno.test("assertObject does nothing on object", () => {
  assertObject({});
  assertObject({ a: 0 });
  assertObject({ a: "a" });
});
Deno.test("assertObject throws AssertError on non object", () => {
  assertThrows(() => assertObject("a"), AssertError);
  assertThrows(() => assertObject(0), AssertError);
  assertThrows(() => assertObject(true), AssertError);
  assertThrows(() => assertObject(false), AssertError);
  assertThrows(() => assertObject([]), AssertError);
  assertThrows(() => assertObject(function () {}), AssertError);
  assertThrows(() => assertObject(undefined), AssertError);
  assertThrows(() => assertObject(null), AssertError);
});
Deno.test("assertObject<T> does nothing on T object", () => {
  assertObject({ a: 0 }, { pred: isNumber });
  assertObject({ a: "a" }, { pred: isString });
  assertObject({ a: true }, { pred: isBoolean });
});
Deno.test("assertObject<T> throws AssertError on non T object", () => {
  assertThrows(() => assertObject({ a: 0 }, { pred: isString }), AssertError);
  assertThrows(() => assertObject({ a: "a" }, { pred: isNumber }), AssertError);
  assertThrows(
    () => assertObject({ a: true }, { pred: isString }),
    AssertError,
  );
});

Deno.test("assertFunction does nothing on function", () => {
  assertFunction(assertFunction);
  assertFunction(function () {});
  assertFunction(() => {});
  assertFunction(setTimeout);
});
Deno.test("assertFunction throws AssertError on non function", () => {
  assertThrows(() => assertFunction("a"), AssertError);
  assertThrows(() => assertFunction(0), AssertError);
  assertThrows(() => assertFunction(true), AssertError);
  assertThrows(() => assertFunction(false), AssertError);
  assertThrows(() => assertFunction([]), AssertError);
  assertThrows(() => assertFunction({}), AssertError);
  assertThrows(() => assertFunction(undefined), AssertError);
  assertThrows(() => assertFunction(null), AssertError);
});

Deno.test("assertNull does nothing on null", () => {
  assertNull(null);
});
Deno.test("assertNull throws AssertError on non null", () => {
  assertThrows(() => assertNull("a"), AssertError);
  assertThrows(() => assertNull(0), AssertError);
  assertThrows(() => assertNull(true), AssertError);
  assertThrows(() => assertNull(false), AssertError);
  assertThrows(() => assertNull([]), AssertError);
  assertThrows(() => assertNull({}), AssertError);
  assertThrows(() => assertNull(function () {}), AssertError);
  assertThrows(() => assertNull(undefined), AssertError);
});

Deno.test("assertUndefined does nothing on undefined", () => {
  assertUndefined(undefined);
});
Deno.test("assertUndefined throws AssertError on non undefined", () => {
  assertThrows(() => assertUndefined("a"), AssertError);
  assertThrows(() => assertUndefined(0), AssertError);
  assertThrows(() => assertUndefined(true), AssertError);
  assertThrows(() => assertUndefined(false), AssertError);
  assertThrows(() => assertUndefined([]), AssertError);
  assertThrows(() => assertUndefined({}), AssertError);
  assertThrows(() => assertUndefined(function () {}), AssertError);
  assertThrows(() => assertUndefined(null), AssertError);
});

Deno.test("assertNullish does nothing on null or undefined", () => {
  assertNullish(null);
  assertNullish(undefined);
});
Deno.test("assertNullish throws AssertError on non null nor undefined", () => {
  assertThrows(() => assertNullish("a"), AssertError);
  assertThrows(() => assertNullish(0), AssertError);
  assertThrows(() => assertNullish(true), AssertError);
  assertThrows(() => assertNullish(false), AssertError);
  assertThrows(() => assertNullish([]), AssertError);
  assertThrows(() => assertNullish({}), AssertError);
  assertThrows(() => assertNullish(function () {}), AssertError);
});
